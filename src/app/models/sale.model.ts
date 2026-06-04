import { SaleItem } from './sale-item.model';

export interface Sale {
  id: string;
  clientId: string;
  date: string;
  subTotal: number;
  total: number;
  status: 'PENDENTE' | 'PAID';
  items?: SaleItem[]; // Para agregar os itens em consultas relacionais
}
