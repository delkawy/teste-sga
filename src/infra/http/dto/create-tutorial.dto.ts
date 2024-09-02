import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length, MinLength } from 'class-validator';

export class CreateTutorialDto {
  @ApiProperty({
    description:
      'The title of the tutorial. It should be between 5 and 100 characters long.',
    example: 'Introduction to NestJS',
    required: true,
  })
  @IsNotEmpty()
  @Length(5, 100)
  title: string;

  @ApiProperty({
    description:
      'The content of the tutorial. It should be at least 5 characters long.',
    example:
      'This tutorial covers the basics of creating a NestJS application.',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(5)
  content: string;
}
