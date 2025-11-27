import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateJobDto,
  PatientStatus,
  QualityRating,
} from './dto/create-job.dto';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateJobDto) {
    // 1. ส่งข้อมูลใหม่ไปคำนวณ (เพิ่ม startTime และ quality)
    const totalScore = this.calculateScore(
      data.distance,
      data.patientStatus,
      data.startTime,
      data.quality,
    );

    return this.prisma.job.create({
      data: {
        distance: data.distance,
        patientStatus: data.patientStatus,
        startTime: data.startTime, // บันทึกเวลา
        quality: data.quality, // บันทึกเกรด
        points: totalScore,
      },
    });
  }

  private calculateScore(
    distance: number,
    status: PatientStatus,
    startTime: string,
    quality: QualityRating,
  ): number {
    // --- 1. Base Score ---
    let baseScore = 20;

    // --- 2. Distance Points ---
    let distancePoints = 0;
    if (distance >= 5 && distance <= 15) {
      distancePoints = 2;
    } else if (distance > 15) {
      distancePoints = 4;
    }

    // --- 3. Difficulty Points ---
    let difficultyPoints = 0;
    if (status === PatientStatus.WHEELCHAIR) difficultyPoints = 3;
    if (status === PatientStatus.BEDRIDDEN) difficultyPoints = 5;

    // --- 4. Time Points (Logic ใหม่ตามรูป) ---
    let timePoints = 0;

    // แปลง string เป็น object Date เพื่อดึง "ชั่วโมง"
    const date = new Date(startTime);
    const hour = date.getHours(); // จะได้ค่า 0 - 23

    // ถ้าอยู่ในช่วง 04:00 - 07:00 (รวม 07:59 ไหม? ปกติคิดแค่ชั่วโมงเริ่ม)
    // สมมติ: 4, 5, 6, 7 นับเป็นช่วงเช้า/ดึก
    if (hour >= 4 && hour <= 7) {
      timePoints = 2;
    }
    // ช่วง 08:00 - 16:00 ได้ +0 (ไม่ต้องเขียน code ก็ได้เพราะค่าเริ่มต้นคือ 0)

    // รวมคะแนนฐาน (Base Sum)
    const sumPoints =
      baseScore + distancePoints + difficultyPoints + timePoints;

    // --- 5. Quality Multiplier (Logic ใหม่ตามรูป) ---
    let multiplier = 1.0;

    if (quality === QualityRating.EXCELLENT) {
      multiplier = 1.2; // ดีมาก
    } else if (quality === QualityRating.BAD) {
      multiplier = 0.9; // แย่ (ลด 10%)
    }
    // ถ้า GOOD คือ 1.0 (ไม่ต้องแก้)

    // คำนวณผลลัพธ์สุดท้าย
    return sumPoints * multiplier;
  }

  async findAll() {
    return this.prisma.job.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
