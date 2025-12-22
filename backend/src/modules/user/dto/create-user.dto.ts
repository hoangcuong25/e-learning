import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({ message: 'Fullname cannot be empty' })
    fullname: string;

    @IsNotEmpty({ message: 'Email cannot be empty' })
    @IsEmail({}, { message: 'Invalid email' })
    email: string;

    @IsNotEmpty({ message: 'Password cannot be empty' })
    password1: string;

    @IsNotEmpty({ message: 'Password cannot be empty' })
    password2: string;
}