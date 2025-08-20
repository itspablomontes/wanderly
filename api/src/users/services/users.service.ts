import {
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { plainToInstance } from "class-transformer";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UserResponseDto } from "../dto/user-response.dto";
import { UsersRepository } from "../repositories/users.repository";
import { PaginationDto } from "../dto/pagination.dto";
import { PaginatedResponseDto } from "../dto/paginated-response.dto";

@Injectable()
export class UsersService {
	constructor(private usersRepository: UsersRepository) {}

	async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
		const existingUser = await this.usersRepository.findByEmail(
			createUserDto.email,
		);

		if (existingUser) {
			throw new ConflictException("User already exists.");
		}

		const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
		const user = await this.usersRepository.create({
			...createUserDto,
			password: hashedPassword,
		});

		return plainToInstance(UserResponseDto, user, {
			excludeExtraneousValues: true,
		});
	}

	async findAll(paginationDto: PaginationDto): Promise<PaginatedResponseDto<UserResponseDto>> {
		const {page = 1, limit = 10} = paginationDto;
		const {users, total} = await this.usersRepository.findAll(paginationDto);

		const totalPages = Math.ceil(total / limit);
		const hasPreviousPage = page > 1;
		const hasNextPage = page < totalPages;

		const transformedUsers = users.map((user) =>
			plainToInstance(UserResponseDto, user, {
				excludeExtraneousValues: true,
			}),
		);

		return {
			data: transformedUsers,
			total,
			page,
			limit,
			totalPages,
			hasPreviousPage,
			hasNextPage,
		};
	}

	async findOne(id: string): Promise<UserResponseDto> {
		const user = await this.usersRepository.findById(id);

		if (!user) {
			throw new NotFoundException("User not found.");
		}

		return plainToInstance(UserResponseDto, user, {
			excludeExtraneousValues: true,
		});
	}

	async update(
		id: string,
		updateUserDto: UpdateUserDto,
	): Promise<UserResponseDto> {
		const user = await this.usersRepository.findById(id);

		if (!user) {
			throw new NotFoundException("User not found.");
		}

		if (updateUserDto.email && updateUserDto.email !== user.email) {
			const existingUser = await this.usersRepository.findByEmail(
				updateUserDto.email,
			);

			if (existingUser) {
				throw new ConflictException("Email already in use.");
			}
		}

		const updateUserData = updateUserDto.password
			? {
					...updateUserDto,
					password: await bcrypt.hash(updateUserDto.password, 10),
				}
			: { ...updateUserDto };

		const updatedUser = await this.usersRepository.update(id, updateUserData);

		return plainToInstance(UserResponseDto, updatedUser, {
			excludeExtraneousValues: true,
		});
	}

	async delete(id: string): Promise<void> {
		const user = await this.usersRepository.findById(id);

		if (!user) {
			throw new NotFoundException("User not found.");
		}

		await this.usersRepository.delete(id);
	}
}
