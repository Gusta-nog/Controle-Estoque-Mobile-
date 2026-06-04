import { Injectable } from '@angular/core';
import { DatabaseService } from '../core/database/database.service';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly collection = 'products';

  constructor(private db: DatabaseService) {}

  async getAll(): Promise<Product[]> {
    return this.db.getAll<Product>(this.collection);
  }

  async getById(id: string): Promise<Product | null> {
    return this.db.getById<Product>(this.collection, id);
  }

  private async validateRules(product: Product, isUpdate = false) {
    if (product.price < 0) throw new Error('O preço não pode ser negativo.');
    if (product.stockQuantity < 0) throw new Error('O estoque não pode ser negativo.');
    if (!product.category) throw new Error('A categoria é obrigatória.');

    const products = await this.getAll();
    const isDuplicate = products.some(p => 
      p.code === product.code && (!isUpdate || p.id !== product.id)
    );
    if (isDuplicate) {
      throw new Error('Já existe um produto cadastrado com este Código.');
    }
  }

  async create(product: Product): Promise<Product> {
    await this.validateRules(product);
    product.id = crypto.randomUUID ? crypto.randomUUID() : new Date().getTime().toString();
    return this.db.create<Product>(this.collection, product);
  }

  async update(product: Product): Promise<Product> {
    await this.validateRules(product, true);
    return this.db.update<Product>(this.collection, product);
  }

  async delete(id: string): Promise<boolean> {
    return this.db.delete<Product>(this.collection, id);
  }
}
