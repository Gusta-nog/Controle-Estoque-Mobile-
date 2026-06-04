import { Injectable } from '@angular/core';
import { SaleService } from './sale.service';
import { Sale } from '../models/sale.model';

@Injectable({
  providedIn: 'root'
})
export class ReceivableService {
  constructor(private saleService: SaleService) {}

  async getAll(): Promise<Sale[]> {
    return this.saleService.getAll();
  }

  async getById(id: string): Promise<Sale | null> {
    return this.saleService.getById(id);
  }

  async markAsPaid(id: string): Promise<Sale> {
    const sale = await this.getById(id);
    if (!sale) throw new Error('Venda não encontrada.');
    if (sale.status === 'PAID') throw new Error('Venda já está paga.');
    
    // A baixa de estoque já aconteceu na venda, apenas alteramos o status
    return this.saleService.updateStatus(id, 'PAID');
  }
}
