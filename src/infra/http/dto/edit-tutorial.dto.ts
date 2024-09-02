import { IsOptional, Length, MinLength } from 'class-validator';

export class EditTutorialDto {
  @IsOptional()
  @Length(5, 100)
  title: string;

  @IsOptional()
  @MinLength(5)
  content: string;
}
