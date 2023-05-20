import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/models';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOneById(id: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
  }

  async create(name: string, email: string, password: string): Promise<User> {
    const newUser = this.userRepository.create({ name, email, password });
    return await this.userRepository.save(newUser);
  }

  async verifyUser(id: string): Promise<void> {
    await this.userRepository.update(id, { isEmailVerified: true });
  }
}
