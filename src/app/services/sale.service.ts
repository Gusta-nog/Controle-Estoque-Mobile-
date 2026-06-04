import { Injectable } from '@angular/core';
import { DatabaseService } from '../core/database/database.service';
import { ProductService } from './product.service';
import { Sale } from '../models/sale.model';
import { SaleItem } from '../models/sale-item.model';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private readonly collection = 'sales';
  private readonly itemsCollection = 'sale_items';

  constructor(
    private db: DatabaseService,
    private productService: ProductService
  ) {}

  async getAll(): Promise<Sale[]> {
    return this.db.getAll<Sale>(this.collection);
  }

  async getById(id: string): Promise<Sale | null> {
    const sale = await this.db.getById<Sale>(this.collection, id);
    if (sale) {
      const allItems = await this.db.getAll<SaleItem>(this.itemsCollection);
      sale.items = allItems.filter(item => item.saleId === sale.id);
    }
    return sale || null;
  }

  async getByClientId(clientId: string): Promise<Sale[]> {
    const all = await this.getAll();
    return all.filter(s => s.clientId === clientId);
  }

  async create(sale: Sale, items: SaleItem[]): Promise<Sale> {
    if (!sale.clientId) throw new Error('A venda deve estar vinculada a um cliente.');
    if (!items || items.length === 0) throw new Error('A venda deve conter pelo menos um produto.');

    // Validar estoque e preparar atualizações
    const productUpdates = [];
    for (const item of items) {
      if (item.quantity <= 0) throw new Error('A quantidade deve ser maior que zero.');
      const product = await this.productService.getById(item.productId);
      if (!product) throw new Error(`Produto não encontrado (ID: ${item.productId}).`);
      
      if (product.stockQuantity < item.quantity) {
        throw new Error(`Estoque insuficiente para o produto ${product.name}. Disponível: ${product.stockQuantity}. Solicitado: ${item.quantity}.`);
      }
      
      // Deduz o estoque
      product.stockQuantity -= item.quantity;
      productUpdates.push(product);
    }

    // Gerar ID e Status Padrão
    sale.id = crypto.randomUUID ? crypto.randomUUID() : new Date().getTime().toString();
    sale.status = 'PENDENTE';
    
    // 1. Atualizar o estoque físico
    for (const p of productUpdates) {
      await this.productService.update(p);
    }

    // 2. Salvar os itens com o id da venda e os preços daquele momento exato
    const savedItems: SaleItem[] = [];
    for (const item of items) {
      item.id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString();
      item.saleId = sale.id;
      const savedItem = await this.db.create<SaleItem>(this.itemsCollection, item);
      savedItems.push(savedItem);
    }

    // 3. Salvar o cabeçalho da venda
    sale.items = savedItems;
    return this.db.create<Sale>(this.collection, sale);
  }

  async updateStatus(id: string, status: 'PENDENTE' | 'PAID'): Promise<Sale> {
    const sale = await this.db.getById<Sale>(this.collection, id);
    if (!sale) throw new Error('Venda não encontrada.');
    sale.status = status;
    return this.db.update<Sale>(this.collection, sale);
  }
}
