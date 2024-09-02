import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description:
      'Full name of the user. Should be between 3 and 100 characters long.',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @Length(3, 100)
  name: string;

  @ApiProperty({
    description: 'Valid email address of the user.',
    example: 'example@mail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'Password for the user account. Should be between 4 and 20 characters long.',
    example: 'secret123',
  })
  @IsNotEmpty()
  @Length(4, 20)
  password: string;
}
