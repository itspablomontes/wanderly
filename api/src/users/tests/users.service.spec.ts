import { ConflictException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { UsersService } from "../services/users.service";
import { UsersRepository } from "../repositories/users.repository";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { PaginationDto } from "../dto/pagination.dto";

vi.mock("bcryptjs", () => ({
	hash: vi.fn().mockResolvedValue("hashedpassword"),
}));

import * as bcrypt from "bcryptjs";
import { UsersRepositoryMock } from "src/test/mocks/users-repository.mock";

describe("UsersService", () => {
	let service: UsersService;
	let usersRepository: UsersRepositoryMock;

	const mockUser = {
		id: "1",
		name: "John Doe",
		email: "johndoe@mail.com",
		password: "hashedpassword",
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	beforeEach(async () => {
		vi.clearAllMocks();
		
		const usersRepositoryMock = {
			create: vi.fn(),
			findAll: vi.fn(),
			findById: vi.fn(),
			findByEmail: vi.fn(),
			update: vi.fn(),
			delete: vi.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				{ provide: UsersRepository, useValue: usersRepositoryMock },
			],
		}).compile();

		service = module.get<UsersService>(UsersService);
		usersRepository = module.get(UsersRepository);
	});

	it("should create a user", async () => {
		const userData: CreateUserDto = {
			name: "John Doe",
			email: "johndoe@mail.com",
			password: "12345678",
		};

		usersRepository.findByEmail.mockResolvedValue(null);
		usersRepository.create.mockResolvedValue({
			...mockUser,
			...userData,
			password: "hashedpassword",
		});

		const result = await service.create(userData);

		expect(usersRepository.findByEmail).toHaveBeenCalledWith(userData.email);
		expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
		expect(usersRepository.create).toHaveBeenCalledWith({
			...userData,
			password: "hashedpassword",
		});
		expect(result.name).toBe("John Doe");
		expect(result.email).toBe("johndoe@mail.com");
		expect(result.password).toBeUndefined();
		expect(result.createdAt).toBeDefined();
		expect(result.updatedAt).toBeDefined();
	});

	it("should throw an error if user email already exists", async () => {
		const userData: CreateUserDto = {
			name: "John Doe",
			email: "johndoe@mail.com",
			password: "12345678",
		};

		usersRepository.findByEmail.mockResolvedValue(mockUser);

		await expect(service.create(userData)).rejects.toThrow(ConflictException);
		expect(usersRepository.findByEmail).toHaveBeenCalledWith(userData.email);
		expect(usersRepository.create).not.toHaveBeenCalled();
	});

	it("should find all users with pagination", async () => {
		const paginationDto: PaginationDto = { page: 1, limit: 10 };
		const usersData = [
			{ ...mockUser, id: "1", name: "John Doe", email: "johndoe@mail.com" },
			{ ...mockUser, id: "2", name: "Jane Doe", email: "janedoe@mail.com" },
		];

		usersRepository.findAll.mockResolvedValue({
			users: usersData,
			total: 2,
		});

		const result = await service.findAll(paginationDto);

		expect(usersRepository.findAll).toHaveBeenCalledWith(paginationDto);
		expect(result.data).toHaveLength(2);
		expect(result.data[0].name).toBe("John Doe");
		expect(result.data[0].password).toBeUndefined();
		expect(result.data[1].name).toBe("Jane Doe");
		expect(result.data[1].password).toBeUndefined();
		expect(result.total).toBe(2);
		expect(result.page).toBe(1);
		expect(result.limit).toBe(10);
		expect(result.totalPages).toBe(1);
		expect(result.hasPreviousPage).toBe(false);
		expect(result.hasNextPage).toBe(false);
	});

	it("should find a user by id", async () => {
		usersRepository.findById.mockResolvedValue(mockUser);

		const result = await service.findOne("1");

		expect(usersRepository.findById).toHaveBeenCalledWith("1");
		expect(result.name).toBe("John Doe");
		expect(result.email).toBe("johndoe@mail.com");
		expect(result.password).toBeUndefined();
		expect(result.id).toBe("1");
		expect(result.createdAt).toBeDefined();
		expect(result.updatedAt).toBeDefined();
	});

	it("should throw an error if the user is not found", async () => {
		usersRepository.findById.mockResolvedValue(null);

		await expect(service.findOne("999")).rejects.toThrow(NotFoundException);
		expect(usersRepository.findById).toHaveBeenCalledWith("999");
	});

	it("should update a user", async () => {
		const updateData: UpdateUserDto = {
			name: "John Doe Updated",
		};

		const updatedUser = {
			...mockUser,
			...updateData,
			updatedAt: new Date(),
		};

		usersRepository.findById.mockResolvedValue(mockUser);
		usersRepository.update.mockResolvedValue(updatedUser);

		const result = await service.update("1", updateData);

		expect(usersRepository.findById).toHaveBeenCalledWith("1");
		expect(usersRepository.update).toHaveBeenCalledWith("1", updateData);
		expect(result.name).toBe("John Doe Updated");
		expect(result.email).toBe(mockUser.email);
		expect(result.password).toBeUndefined();
		expect(result.id).toBe("1");
	});

	it("should throw an error when updating non-existent user", async () => {
		const updateData: UpdateUserDto = { name: "John Doe Updated" };

		usersRepository.findById.mockResolvedValue(null);

		await expect(service.update("999", updateData)).rejects.toThrow(
			NotFoundException,
		);
		expect(usersRepository.findById).toHaveBeenCalledWith("999");
		expect(usersRepository.update).not.toHaveBeenCalled();
	});

	it("should throw an error when deleting non-existent user", async () => {
		usersRepository.findById.mockResolvedValue(null);

		await expect(service.delete("999")).rejects.toThrow(NotFoundException);
		expect(usersRepository.findById).toHaveBeenCalledWith("999");
		expect(usersRepository.delete).not.toHaveBeenCalled();
	});

	it("should delete a user successfully", async () => {
		usersRepository.findById.mockResolvedValue(mockUser);
		usersRepository.delete.mockResolvedValue(null);

		const result = await service.delete("1");

		expect(usersRepository.findById).toHaveBeenCalledWith("1");
		expect(usersRepository.delete).toHaveBeenCalledWith("1");
		expect(result).toBeUndefined();
	});

	it("should hash password when updating user with new password", async () => {
		const updateData: UpdateUserDto = {
			name: "John Updated",
			password: "newpassword123",
		};

		const updatedUser = {
			...mockUser,
			...updateData,
			password: "hashedpassword",
		};

		usersRepository.findById.mockResolvedValue(mockUser);
		usersRepository.update.mockResolvedValue(updatedUser);

		const result = await service.update("1", updateData);

		expect(bcrypt.hash).toHaveBeenCalledWith("newpassword123", 10);
		expect(usersRepository.update).toHaveBeenCalledWith("1", {
			...updateData,
			password: "hashedpassword",
		});
		expect(result.password).toBeUndefined();
	});

	it("should not hash password when updating user without password", async () => {
		const updateData: UpdateUserDto = {
			name: "John Updated",
		};

		const updatedUser = {
			...mockUser,
			...updateData,
		};

		usersRepository.findById.mockResolvedValue(mockUser);
		usersRepository.update.mockResolvedValue(updatedUser);

		await service.update("1", updateData);

		expect(bcrypt.hash).toHaveBeenCalledTimes(0);
		expect(usersRepository.update).toHaveBeenCalledWith("1", updateData);
	});

	it("should throw ConflictException when updating to existing email", async () => {
		const updateData: UpdateUserDto = {
			email: "existing@mail.com",
		};

		const existingUser = {
			...mockUser,
			id: "2",
			email: "existing@mail.com",
		};

		usersRepository.findById.mockResolvedValue(mockUser);
		usersRepository.findByEmail.mockResolvedValue(existingUser);

		await expect(service.update("1", updateData)).rejects.toThrow(ConflictException);
		expect(usersRepository.findByEmail).toHaveBeenCalledWith("existing@mail.com");
		expect(usersRepository.update).not.toHaveBeenCalled();
	});

	it("should allow updating to same email", async () => {
		const updateData: UpdateUserDto = {
			name: "John Updated",
			email: mockUser.email,
		};

		const updatedUser = {
			...mockUser,
			...updateData,
		};

		usersRepository.findById.mockResolvedValue(mockUser);
		usersRepository.update.mockResolvedValue(updatedUser);

		const result = await service.update("1", updateData);

		expect(usersRepository.findByEmail).not.toHaveBeenCalled();
		expect(usersRepository.update).toHaveBeenCalledWith("1", updateData);
		expect(result.name).toBe("John Updated");
	});

	it("should handle pagination with multiple pages", async () => {
		const paginationDto: PaginationDto = { page: 2, limit: 5 };
		const usersData = [
			{ ...mockUser, id: "6", name: "User 6" },
			{ ...mockUser, id: "7", name: "User 7" },
		];

		usersRepository.findAll.mockResolvedValue({
			users: usersData,
			total: 12,
		});

		const result = await service.findAll(paginationDto);

		expect(result.page).toBe(2);
		expect(result.limit).toBe(5);
		expect(result.total).toBe(12);
		expect(result.totalPages).toBe(3);
		expect(result.hasPreviousPage).toBe(true);
		expect(result.hasNextPage).toBe(true);
		expect(result.data).toHaveLength(2);
	});
});
