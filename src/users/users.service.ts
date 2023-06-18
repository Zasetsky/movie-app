import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, IUserDocument } from './schemas/user.schema/user.schema';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto/register.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<IUserDocument>) {}

  async findOne(username: string): Promise<IUserDocument | undefined> {
    return this.userModel.findOne({ username });
  }

  async create(dto: RegisterDto): Promise<IUserDocument> { 
    const existingUser = await this.findOne(dto.username);
    if (existingUser) {
      throw new HttpException('Username already exists', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = new this.userModel({ username: dto.username, password: hashedPassword });
    return user.save();
  }
}