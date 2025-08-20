import { Module } from "@nestjs/common";
import { UsersController } from "../controllers/users.controller";
import { UsersRepository } from "../repositories/users.repository";
import { UsersService } from "../services/users.service";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
	imports: [PrismaModule],
	controllers: [UsersController],
	providers: [UsersService, UsersRepository],
	exports: [UsersService],
})
export class UsersModule {}
