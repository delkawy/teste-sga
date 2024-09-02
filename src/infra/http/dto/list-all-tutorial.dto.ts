import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsString,
  Length,
  Validate,
  ValidationArguments,
  ValidatorConstraintInterface,
  ValidatorConstraint,
  IsNumberString,
} from 'class-validator';
import { isBefore, parseISO } from 'date-fns';

@ValidatorConstraint({ async: false })
class IsFromBeforeToConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const object = args.object as any;
    const to = object[args.constraints[0]];

    if (!to) return true;

    return isBefore(parseISO(value), parseISO(to));
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be earlier than ${args.constraints[0]}`;
  }
}

export class ListAllTutorialDto {
  @ApiPropertyOptional({
    description: 'Filter tutorials by title',
    example: 'Introduction to NestJS',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Filter tutorials by creation date (from)',
    example: '2024-01-01',
    type: String,
  })
  @IsOptional()
  @Length(10, 10)
  @IsDateString()
  @Validate(IsFromBeforeToConstraint, ['created_at_to'])
  created_at_from?: Date;

  @ApiPropertyOptional({
    description: 'Filter tutorials by creation date (to)',
    example: '2024-12-31',
    type: String,
  })
  @IsOptional()
  @Length(10, 10)
  @IsDateString()
  created_at_to?: Date;

  @ApiPropertyOptional({
    description: 'Filter tutorials by last updated date (from)',
    example: '2024-01-01',
    type: String,
  })
  @IsOptional()
  @Length(10, 10)
  @IsDateString()
  @Validate(IsFromBeforeToConstraint, ['updated_at_to'])
  updated_at_from?: Date;

  @ApiPropertyOptional({
    description: 'Filter tutorials by last updated date (to)',
    example: '2024-12-31',
    type: String,
  })
  @IsOptional()
  @Length(10, 10)
  @IsDateString()
  updated_at_to?: Date;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    type: Number,
  })
  @IsOptional()
  @IsNumberString()
  page_number: number;

  @ApiPropertyOptional({
    description: 'Number of items per page for pagination',
    example: 10,
    type: Number,
  })
  @IsOptional()
  @IsNumberString()
  page_size: number;
}
