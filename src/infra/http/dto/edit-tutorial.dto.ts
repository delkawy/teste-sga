import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Length, MinLength } from 'class-validator';

export class EditTutorialDto {
  @ApiProperty({
    description:
      'Title of the tutorial. Must be between 5 and 100 characters long.',
    example: 'A new custom title',
    required: false,
  })
  @IsOptional()
  @Length(5, 100)
  title?: string;

  @ApiProperty({
    description: 'Content of the tutorial. Must be at least 5 characters long.',
    example: 'Updated content',
    required: false,
  })
  @IsOptional()
  @MinLength(5)
  content?: string;
}
