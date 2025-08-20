import { Mock, vi } from "vitest";

export type UsersRepositoryMock = {
	create: Mock;
	findAll: Mock;
	findById: Mock;
	findByEmail: Mock;
	update: Mock;
	delete: Mock;
};

export const createMockUsersRepository = (): UsersRepositoryMock => ({
	create: vi.fn(),
	findAll: vi.fn(),
	findById: vi.fn(),
	findByEmail: vi.fn(),
	update: vi.fn(),
	delete: vi.fn(),
});