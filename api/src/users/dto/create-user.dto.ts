import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	@Transform(({ value }) => value.trim())
	readonly name: string;

	@IsEmail()
	@IsNotEmpty()
	@Transform(({ value }) => value.toLowerCase().trim())
	readonly email: string;

	@IsString()
	@MinLength(8)
	readonly password: string;
}
