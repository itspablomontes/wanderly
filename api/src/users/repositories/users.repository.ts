import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { User } from "@prisma/client";
import { PaginationDto } from "../dto/pagination.dto";

@Injectable()
export class UsersRepository {
	constructor(private prisma: PrismaService) {}

	async create(createUserDto: CreateUserDto): Promise<User> {
		const user = await this.prisma.user.create({
			data: createUserDto,
		});

		return user;
	}

	async findAll(paginationDto: PaginationDto): Promise<{
		users: User[];
		total: number;
	}> {
		const { page = 1, limit = 10 } = paginationDto;
		const skip = (page - 1) * limit;

		const usersPromise = this.prisma.user.findMany({
			skip,
			take: limit,
			orderBy: {
				createdAt: "desc",
			},
		});

		const totalPromise = this.prisma.user.count();

		const [users, total] = await Promise.allSettled([
			usersPromise,
			totalPromise,
		]);

		if (users.status === "rejected") {
			throw new InternalServerErrorException("Failed to fetch users");
		}

		if (total.status === "rejected") {
			throw new InternalServerErrorException("Failed to fetch total");
		}

		return { users: users.value, total: total.value };
	}

	async findById(id: string): Promise<User | null> {
		const user = await this.prisma.user.findUnique({
			where: { id },
		});

		return user;
	}

	async findByEmail(email: string): Promise<User | null> {
		const user = await this.prisma.user.findUnique({
			where: { email },
		});

		return user;
	}

	async update(
		id: string,
		updateUserDto: UpdateUserDto,
	): Promise<User> {
		const user = await this.prisma.user.update({
			where: { id },
			data: updateUserDto,
		});

		return user;
	}

	async delete(id: string): Promise<void> {
		await this.prisma.user.delete({
			where: { id },
		});
	}
}
