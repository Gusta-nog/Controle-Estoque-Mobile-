import { Injectable } from '@angular/core';
import { DatabaseService } from '../core/database/database.service';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly collection = 'clients';

  constructor(private db: DatabaseService) {}

  async getAll(): Promise<Client[]> {
    return this.db.getAll<Client>(this.collection);
  }

  async getById(id: string): Promise<Client | null> {
    return this.db.getById<Client>(this.collection, id);
  }

  async create(client: Client): Promise<Client> {
    const clients = await this.getAll();
    if (clients.some(c => c.cpf === client.cpf)) {
      throw new Error('Já existe um cliente cadastrado com este CPF.');
    }
    client.id = crypto.randomUUID ? crypto.randomUUID() : new Date().getTime().toString();
    return this.db.create<Client>(this.collection, client);
  }

  async update(client: Client): Promise<Client> {
    const clients = await this.getAll();
    if (clients.some(c => c.cpf === client.cpf && c.id !== client.id)) {
      throw new Error('Já existe outro cliente cadastrado com este CPF.');
    }
    return this.db.update<Client>(this.collection, client);
  }

  async delete(id: string): Promise<boolean> {
    return this.db.delete<Client>(this.collection, id);
  }
}
