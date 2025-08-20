import { ConflictException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { createMockService, ServiceMock } from "src/test/mocks/service.mock";
import { beforeEach, describe, expect, it } from "vitest";
import { UsersController } from "../controllers/users.controller";
import { CreateUserDto } from "../dto/create-user.dto";
import { UsersService } from "../services/users.service";

describe("UsersController", () => {
	let controller: UsersController;
	let service: ServiceMock;

	const userResponseMock = {
		id: "1",
		name: "John Doe",
		email: "johndoe@mail.com",
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	beforeEach(async () => {
		const serviceMock = createMockService();

		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [
				{
					provide: UsersService,
					useValue: serviceMock,
				},
			],
		}).compile();

		controller = module.get<UsersController>(UsersController);
		service = module.get<ServiceMock>(UsersService);
	});

	it("should be create a user", async () => {
		const createUserDto: CreateUserDto = {
			name: "John Doe",
			email: "johndoe@mail.com",
			password: "12345678",
		};

		service.create.mockResolvedValue(userResponseMock);

		const result = await controller.create(createUserDto);

		expect(result).toEqual(userResponseMock);
		expect(service.create).toHaveBeenCalledWith(createUserDto);
		expect(service.create).toHaveBeenCalledTimes(1);
	});

	it("should find all users with pagination", async () => {
		const paginationDto = { page: 1, limit: 10 };
		const paginatedResponse = {
			data: [
				userResponseMock,
				{
					...userResponseMock,
					id: "2",
					name: "Jane Doe",
					email: "janedoe@mail.com",
				},
			],
			total: 2,
			page: 1,
			limit: 10,
			totalPages: 1,
			hasPreviousPage: false,
			hasNextPage: false,
		};

		service.findAll.mockResolvedValue(paginatedResponse);

		const result = await controller.getAll(paginationDto);

		expect(result).toEqual(paginatedResponse);
		expect(service.findAll).toHaveBeenCalledWith(paginationDto);
		expect(service.findAll).toHaveBeenCalledTimes(1);
	});

	it("should find a user by id", async () => {
		const user = { ...userResponseMock, id: "1" };

		service.findOne.mockResolvedValue(user);

		const result = await controller.getOne(user.id);

		expect(result).toEqual(user);
		expect(service.findOne).toHaveBeenCalledTimes(1);
	});

	it("should update a user", async () => {
		const user = { ...userResponseMock, id: "1" };

		service.update.mockResolvedValue(user);

		const result = await controller.update(user.id, user);

		expect(result).toEqual(user);
		expect(service.update).toHaveBeenCalledTimes(1);
	});

	it("should delete a user", async () => {
		const userId = "1";

		service.delete.mockResolvedValue(undefined);

		const result = await controller.delete(userId);

		expect(result).toBeUndefined();
		expect(service.delete).toHaveBeenCalledWith(userId);
		expect(service.delete).toHaveBeenCalledTimes(1);
	});

	it("should throw NotFoundException when deleting non-existent user", async () => {
		const userId = "999";

		service.delete.mockRejectedValue(new NotFoundException("User not found"));

		await expect(controller.delete(userId)).rejects.toThrow(NotFoundException);
		expect(service.delete).toHaveBeenCalledWith(userId);
	});

	it("should throw NotFoundException when getting non-existent user", async () => {
		const userId = "999";

		service.findOne.mockRejectedValue(new NotFoundException("User not found"));

		await expect(controller.getOne(userId)).rejects.toThrow(NotFoundException);
		expect(service.findOne).toHaveBeenCalledWith(userId);
	});

	it("should throw NotFoundException when updating non-existent user", async () => {
		const userId = "999";
		const updateData = { name: "Updated Name" };

		service.update.mockRejectedValue(new NotFoundException("User not found"));

		await expect(controller.update(userId, updateData)).rejects.toThrow(NotFoundException);
		expect(service.update).toHaveBeenCalledWith(userId, updateData);
	});

	it("should handle ConflictException when creating user with existing email", async () => {
		const createUserDto: CreateUserDto = {
			name: "John Doe",
			email: "existing@mail.com",
			password: "12345678",
		};

		service.create.mockRejectedValue(new ConflictException("User already exists"));

		await expect(controller.create(createUserDto)).rejects.toThrow(ConflictException);
		expect(service.create).toHaveBeenCalledWith(createUserDto);
	});

	it("should handle ConflictException when updating user with existing email", async () => {
		const userId = "1";
		const updateData = { email: "existing@mail.com" };

		service.update.mockRejectedValue(new ConflictException("Email already in use"));

		await expect(controller.update(userId, updateData)).rejects.toThrow(ConflictException);
		expect(service.update).toHaveBeenCalledWith(userId, updateData);
	});

	it("should handle pagination parameters correctly", async () => {
		const paginationDto = { page: 2, limit: 5 };
		const paginatedResponse = {
			data: [userResponseMock],
			total: 10,
			page: 2,
			limit: 5,
			totalPages: 2,
			hasPreviousPage: true,
			hasNextPage: false,
		};

		service.findAll.mockResolvedValue(paginatedResponse);

		const result = await controller.getAll(paginationDto);

		expect(result).toEqual(paginatedResponse);
		expect(service.findAll).toHaveBeenCalledWith(paginationDto);
	});
});
