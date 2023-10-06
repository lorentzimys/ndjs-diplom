import * as bcrypt from 'bcrypt';
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { UserDTO } from 'src/common/dto/user.dto';
import { CreateUserDTO } from 'src/common/dto/create-user.dto';
import { UserService } from 'src/base/user/user.service';
import { LoginResponseDTO } from 'src/common/dto/login-response.dto';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { LoginGuard } from './guards/login.auth.guard';
import { USER_ROLE } from 'src/common/enums';

@Controller()
export class AuthController {
  constructor(private readonly userService: UserService) {}

  private async getUsers(
    searchParams: SearchUserParams,
  ): Promise<Omit<UserDTO, 'role'>[]> {
    const users = await this.userService.findAll();

    return users.map((user) => ({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      contactPhone: user.contactPhone,
    }));
  }

  private async createUser(
    body: CreateUserDTO,
    role: UserRole,
  ): Promise<UserDTO> {
    const saltOrRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltOrRounds);

    const user = await this.userService.create({
      email: body.email,
      name: body.name,
      passwordHash,
      role,
      contactPhone: body.contactPhone,
    });

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      contactPhone: user.contactPhone,
    };
  }

  @UseGuards(LoginGuard)
  @Post('auth/login')
  async login(@Request() req): Promise<LoginResponseDTO> {
    const { user } = req;

    return {
      email: user.email,
      name: user.name,
      contactPhone: user.contactPhone,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post('auth/logout')
  async logout(@Request() req): Promise<void> {
    req.session.destroy();
  }

  @UseGuards(AuthenticatedGuard)
  @Get('admin/users')
  async getUsersForAdmin(
    searchParams: SearchUserParams,
  ): Promise<Omit<UserDTO, 'role'>[]> {
    return this.getUsers(searchParams);
  }

  @Get('manager/users')
  async getUsersForManager(
    searchParams: SearchUserParams,
  ): Promise<Omit<UserDTO, 'role'>[]> {
    return this.getUsers(searchParams);
  }

  @Post('admin/users')
  async createAdminUser(@Body() body: CreateUserDTO): Promise<UserDTO> {
    const createdUser = await this.createUser(body, USER_ROLE.ADMIN);

    return createdUser;
  }

  @Post('client/register')
  async createClientUser(@Body() body: CreateUserDTO): Promise<UserDTO> {
    const createdUser = await this.createUser(body, USER_ROLE.CLIENT);

    return createdUser;
  }
}
