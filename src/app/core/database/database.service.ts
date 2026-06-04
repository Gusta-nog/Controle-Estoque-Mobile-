import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private _storage: Storage | null = null;
  private isReady = false;

  constructor(private storage: Storage) {
    this.init();
  }

  /**
   * Inicializa a conexão assíncrona com o banco.
   * Quando migrarmos para SQLite no Capacitor, é só incluir o driver aqui.
   */
  async init() {
    if (!this.isReady) {
      const storage = await this.storage.create();
      this._storage = storage;
      this.isReady = true;
    }
  }

  /**
   * Garante que o storage esteja criado antes de fazer requisições.
   */
  private async ensureStorage(): Promise<void> {
    if (!this.isReady) {
      await this.init();
    }
  }

  /**
   * Busca todos os registros de uma coleção/tabela.
   */
  async getAll<T>(collectionName: string): Promise<T[]> {
    await this.ensureStorage();
    const data = await this._storage?.get(collectionName);
    return data || [];
  }

  /**
   * Busca um registro específico pelo seu ID.
   */
  async getById<T extends { id: string }>(collectionName: string, id: string): Promise<T | null> {
    const items = await this.getAll<T>(collectionName);
    const item = items.find(i => i.id === id);
    return item || null;
  }

  /**
   * Cria um novo registro e adiciona na coleção.
   */
  async create<T extends { id: string }>(collectionName: string, item: T): Promise<T> {
    await this.ensureStorage();
    const items = await this.getAll<T>(collectionName);
    items.push(item);
    await this._storage?.set(collectionName, items);
    return item;
  }

  /**
   * Atualiza um registro existente.
   */
  async update<T extends { id: string }>(collectionName: string, item: T): Promise<T> {
    await this.ensureStorage();
    const items = await this.getAll<T>(collectionName);
    const index = items.findIndex(i => i.id === item.id);
    
    if (index !== -1) {
      items[index] = item;
      await this._storage?.set(collectionName, items);
      return item;
    } else {
      throw new Error(`Item com ID ${item.id} não encontrado na coleção ${collectionName}.`);
    }
  }

  /**
   * Exclui um registro da coleção pelo ID.
   */
  async delete<T extends { id: string }>(collectionName: string, id: string): Promise<boolean> {
    await this.ensureStorage();
    const items = await this.getAll<T>(collectionName);
    const filteredItems = items.filter(i => i.id !== id);
    
    if (items.length !== filteredItems.length) {
      await this._storage?.set(collectionName, filteredItems);
      return true;
    }
    
    return false;
  }
}
