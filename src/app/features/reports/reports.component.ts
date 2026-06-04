import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton, IonSegment, IonSegmentButton, IonLabel, IonList, IonItem, IonBadge, IonIcon, IonSearchbar, IonSelect, IonSelectOption, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { warning, checkmarkCircle, time } from 'ionicons/icons';
import { ClientService } from '../../services/client.service';
import { ProductService } from '../../services/product.service';
import { SaleService } from '../../services/sale.service';
import { ReceivableService } from '../../services/receivable.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton, IonSegment, IonSegmentButton, IonLabel, IonList, IonItem, IonBadge, IonIcon, IonSearchbar, IonSelect, IonSelectOption, IonCard, IonCardContent],
  providers: [DatePipe, CurrencyPipe]
})
export class ReportsComponent implements OnInit {
  currentTab = 'clients';

  // Clients
  clients: any[] = [];
  filteredClients: any[] = [];
  searchClient = '';

  // Products
  products: any[] = [];
  filteredProducts: any[] = [];
  searchProduct = '';
  categoryFilter = '';
  categories: string[] = [];

  // Stock
  lowStockCount = 0;
  totalStockValue = 0;

  // Sales
  sales: any[] = [];
  filteredSales: any[] = [];
  saleFilter = 'all'; // all, pending, paid
  totalSalesCount = 0;
  totalSalesValue = 0;

  // Receivables
  receivablesFilter = 'pending'; // pending, paid
  filteredReceivables: any[] = [];
  totalReceived = 0;
  totalPending = 0;

  constructor(
    private clientService: ClientService,
    private productService: ProductService,
    private saleService: SaleService,
    private receivableService: ReceivableService
  ) {
    addIcons({ warning, checkmarkCircle, time });
  }

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    const rawClients = await this.clientService.getAll();
    this.clients = rawClients.sort((a,b) => a.name.localeCompare(b.name));
    this.filteredClients = [...this.clients];

    const rawProducts = await this.productService.getAll();
    this.products = rawProducts.sort((a,b) => a.name.localeCompare(b.name));
    this.filteredProducts = [...this.products];
    this.extractCategories();
    this.calculateStockMetrics();

    const rawSales = await this.saleService.getAll();
    this.sales = rawSales.map(s => {
      const c = this.clients.find(cli => cli.id === s.clientId);
      return { ...s, clientName: c ? c.name : 'Desconhecido' };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    this.filterSales();
    this.filterReceivables();
  }

  segmentChanged(event: any) {
    this.currentTab = event.detail.value;
  }

  // Clientes
  filterClients() {
    if (!this.searchClient) {
      this.filteredClients = [...this.clients];
      return;
    }
    const term = this.searchClient.toLowerCase();
    this.filteredClients = this.clients.filter(c => 
      c.name.toLowerCase().includes(term) || c.cpf.includes(term)
    );
  }

  // Produtos
  extractCategories() {
    const cats = new Set(this.products.map(p => p.category).filter(c => !!c));
    this.categories = Array.from(cats).sort();
  }

  filterProducts() {
    let temp = [...this.products];
    if (this.searchProduct) {
      const term = this.searchProduct.toLowerCase();
      temp = temp.filter(p => p.name.toLowerCase().includes(term));
    }
    if (this.categoryFilter) {
      temp = temp.filter(p => p.category === this.categoryFilter);
    }
    this.filteredProducts = temp;
  }

  // Estoque
  calculateStockMetrics() {
    this.lowStockCount = this.products.filter(p => p.stockQuantity <= 5).length;
    this.totalStockValue = this.products.reduce((acc, p) => acc + (p.stockQuantity || 0), 0);
  }

  // Vendas
  filterSales() {
    let temp = [...this.sales];
    if (this.saleFilter !== 'all') {
      temp = temp.filter(s => s.status === (this.saleFilter === 'paid' ? 'PAID' : 'PENDENTE'));
    }
    this.filteredSales = temp;
    this.totalSalesCount = this.filteredSales.length;
    this.totalSalesValue = this.filteredSales.reduce((acc, s) => acc + (s.total || 0), 0);
  }

  // Recebimentos
  filterReceivables() {
    let temp = [...this.sales];
    if (this.receivablesFilter === 'pending') {
      temp = temp.filter(s => s.status === 'PENDENTE');
    } else {
      temp = temp.filter(s => s.status === 'PAID');
    }
    this.filteredReceivables = temp;
    
    const pendings = this.sales.filter(s => s.status === 'PENDENTE');
    const paids = this.sales.filter(s => s.status === 'PAID');
    
    this.totalPending = pendings.reduce((acc, s) => acc + (s.total || 0), 0);
    this.totalReceived = paids.reduce((acc, s) => acc + (s.total || 0), 0);
  }
}
