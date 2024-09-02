import { IsNotEmpty, Length, MinLength } from 'class-validator';

export class CreateTutorialDto {
  @IsNotEmpty()
  @Length(5, 100)
  title: string;

  @IsNotEmpty()
  @MinLength(5)
  content: string;
}
