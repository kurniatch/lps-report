import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { verify, hash, argon2id } from 'argon2';

@Injectable()
export class UserService {
  constructor(private prismaClient: PrismaService) {}

  async create(user: Prisma.UserCreateInput) {
    if (user.password) {
      user.password = await hash(user.password, {
        type: argon2id,
        hashLength: 64,
      });
    }

    const userData = await this.prismaClient.user.create({
      data: user,
    });
    console.log(userData);
    delete userData.password;
    return userData;
  }

  async findOne(user: { id?: string; email?: string }) {
    const userData = await this.prismaClient.user.findUnique({
      where: user,
    });

    if (!userData) {
      return null;
    }

    return userData;
  }

  async findAdmin(user: { id?: string; email?: string }) {
    const userData = await this.prismaClient.user.findUnique({
      where: user,
    });

    if (!userData || userData.admin !== 'yes') {
      return false;
    }

    return true;
  }

  async validateUser(email: string, password: string) {
    const user = await this.findOne({ email });
    const admin = await this.findAdmin({ email });

    if (!user) {
      throw new UserNotFoundException();
    }

    const isMatch = await verify(user.password, password);

    if (!isMatch) {
      throw new AuthenticationFailedExecption();
    }

    delete user.password;

    if (admin) {
      user.password = 'admin';
    }
    delete user.admin;
    console.log(user);
    return user;
  }

  async findAllUsers() {
    return this.prismaClient.user.findMany({
      select: {
        id: true,
        fullname: true,
        email: true,
        admin: true,
        createdAt: true,
      },
    });
  }
  async remove(id: string) {
    return this.prismaClient.user.delete({
      where: {
        id: id,
      },
    });
  }
}

class UserNotFoundException extends Error {
  name = 'UserNotFoundException';
  message = 'User not found';
}

class AuthenticationFailedExecption extends Error {
  name = 'AuthenticationFailedExecption';
  message = 'Password is wrong';
}
