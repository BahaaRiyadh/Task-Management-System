import { IsNotEmpty, IsNumber } from 'class-validator';

export class AssignDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
