import { Test, TestingModule } from "@nestjs/testing";
import { beforeEach, describe, expect, it } from "vitest";
import { PrismaService } from "./prisma.service";

describe("PrismaService", () => {
	let service: PrismaService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PrismaService],
		}).compile();

		service = module.get<PrismaService>(PrismaService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	it("should extend PrismaClient", () => {
		expect(service).toHaveProperty("user");
		expect(service).toHaveProperty("$connect");
		expect(service).toHaveProperty("$disconnect");
	});
});
