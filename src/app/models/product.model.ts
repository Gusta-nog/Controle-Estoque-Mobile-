export interface Product {
  id: string;
  code: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  stockQuantity: number;
}
