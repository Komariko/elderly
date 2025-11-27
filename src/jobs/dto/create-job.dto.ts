import { IsEnum, IsNumber, Min, IsDateString } from 'class-validator';

export enum PatientStatus {
  NORMAL = 'NORMAL',
  WHEELCHAIR = 'WHEELCHAIR',
  BEDRIDDEN = 'BEDRIDDEN',
}

// เพิ่ม Enum เกรดรีวิว
export enum QualityRating {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  BAD = 'BAD',
}

export class CreateJobDto {
  @IsNumber()
  @Min(0)
  distance: number;

  @IsEnum(PatientStatus)
  patientStatus: PatientStatus;

  // --- เพิ่ม 2 ตัวนี้ครับ ---
  @IsDateString()
  startTime: string; // รับเป็นวันที่และเวลา (ISO 8601) เช่น "2023-11-27T05:00:00Z"

  @IsEnum(QualityRating)
  quality: QualityRating;
  // ----------------------
}
