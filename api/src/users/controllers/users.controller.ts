import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	Query,
} from "@nestjs/common";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UsersService } from "../services/users.service";
import { UserResponseDto } from "../dto/user-response.dto";
import { PaginationDto } from "../dto/pagination.dto";
import { PaginatedResponseDto } from "../dto/paginated-response.dto";

@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	@HttpCode(201)
	create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
		return this.usersService.create(createUserDto);
	}

	@Get()
	@HttpCode(200)
	getAll(
		@Query() paginationDto: PaginationDto,
	): Promise<PaginatedResponseDto<UserResponseDto>> {
		return this.usersService.findAll(paginationDto);
	}

	@Get(":id")
	@HttpCode(200)
	getOne(@Param("id") id: string): Promise<UserResponseDto> {
		return this.usersService.findOne(id);
	}

	@Patch(":id")
	@HttpCode(200)
	update(
		@Param("id") id: string,
		@Body() updateUserDto: UpdateUserDto,
	): Promise<UserResponseDto> {
		return this.usersService.update(id, updateUserDto);
	}

	@Delete(":id")
	@HttpCode(204)
	delete(@Param("id") id: string): Promise<void> {
		return this.usersService.delete(id);
	}
}
