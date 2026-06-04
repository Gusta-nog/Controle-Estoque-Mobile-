import { Injectable } from '@angular/core';
import { DatabaseService } from '../core/database/database.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly collection = 'users';

  constructor(private db: DatabaseService) {}

  async getAll(): Promise<User[]> {
    return this.db.getAll<User>(this.collection);
  }

  async getById(id: string): Promise<User | null> {
    return this.db.getById<User>(this.collection, id);
  }

  async create(user: User): Promise<User> {
    const users = await this.getAll();
    if (users.some(u => u.username === user.username)) {
      throw new Error('Já existe um usuário com este Login (Username).');
    }
    user.id = crypto.randomUUID ? crypto.randomUUID() : new Date().getTime().toString();
    return this.db.create<User>(this.collection, user);
  }

  async update(user: User): Promise<User> {
    const users = await this.getAll();
    if (users.some(u => u.username === user.username && u.id !== user.id)) {
      throw new Error('Já existe outro usuário com este Login (Username).');
    }
    return this.db.update<User>(this.collection, user);
  }

  async delete(id: string): Promise<boolean> {
    return this.db.delete<User>(this.collection, id);
  }
}
