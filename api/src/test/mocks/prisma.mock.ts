import { Mock, vi } from "vitest";

export type PrismaServiceMock = {
	user: {
		create: Mock;
		findMany: Mock;
		findUnique: Mock;
		update: Mock;
		delete: Mock;
	};

	$connect: Mock;
	$disconnect: Mock;
};

export const createMockPrismaService = (): PrismaServiceMock => ({
	user: {
		create: vi.fn(),
		findMany: vi.fn(),
		findUnique: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
	},

	$connect: vi.fn(),
	$disconnect: vi.fn(),
});
