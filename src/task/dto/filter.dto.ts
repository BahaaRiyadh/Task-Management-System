import { IsOptional, IsString } from 'class-validator';

export class FilterDto {
  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  commission?: number;
}
