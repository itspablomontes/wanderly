import { Mock, vi } from "vitest";

export type ServiceMock = {
	create: Mock;
	findAll: Mock;
	findOne: Mock;
	update: Mock;
	delete: Mock;
};

export const createMockService = (): ServiceMock => ({
	create: vi.fn(),
	findAll: vi.fn(),
	findOne: vi.fn(),
	update: vi.fn(),
	delete: vi.fn(),
});
