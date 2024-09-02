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
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @Length(10, 10)
  @IsDateString()
  @Validate(IsFromBeforeToConstraint, ['created_at_to'])
  created_at_from?: Date;

  @IsOptional()
  @Length(10, 10)
  @IsDateString()
  created_at_to?: Date;

  @IsOptional()
  @Length(10, 10)
  @IsDateString()
  @Validate(IsFromBeforeToConstraint, ['updated_at_to'])
  updated_at_from?: Date;

  @IsOptional()
  @Length(10, 10)
  @IsDateString()
  updated_at_to?: Date;

  @IsOptional()
  @IsNumberString()
  page_number: number;

  @IsOptional()
  @IsNumberString()
  page_size: number;
}
