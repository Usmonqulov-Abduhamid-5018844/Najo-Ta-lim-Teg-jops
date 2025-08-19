import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

async allUsers(page = 1, pageSize = 100, search = '') {
  const pageNum = Number(page) || 1;  
  const size = Number(pageSize) || 100;
  const skip = (pageNum - 1) * size;

  const where: any = search
    ? {
        OR: [
          { fullName: { contains: search, mode: 'insensitive' } },
          { username: { contains: search, mode: 'insensitive' } },
          { addres_doyimiy: { contains: search, mode: 'insensitive' } },
          { addres_hozir: { contains: search, mode: 'insensitive' } },
          { universitet: { contains: search, mode: 'insensitive' } },
          { yonalish: { contains: search, mode: 'insensitive' } },
          { ish_holati: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};

  const total = await this.prisma.users.count({ where });

  if (total === 0) {
    return {
      total: 0,
      page: pageNum,
      pageSize: size,
      users: [],
    };
  }

  const users = await this.prisma.users.findMany({
    where,
    skip,
    take: size,
    orderBy: { fullName: 'asc' },
  });

  return {
    total,
    page: pageNum,
    pageSize: size,
    users,
  };
}


  async findOne(id: number) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { id },
      });
      if (!user) {
       return {user: null, statusCode: 404, message: `User with ID ${id} not found`};
      }
      return {
        statusCode: 200,
        data: user,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching user with ID ${id}: ${error.message}`,
      );
    }
  }

  async remove(id: number) {
    try {
      const userExists = await this.prisma.users.findUnique({
        where: { id },
      });
      if (!userExists) {
         return {user: null, statusCode: 404, message: `User with ID ${id} not found`};
      }

      await this.prisma.users.delete({
        where: { id },
      });

      return {
        statusCode: 200,
        message: `User with ID ${id} has been removed successfully`,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error removing user with ID ${id}: ${error.message}`,
      );
    }
  }
}
