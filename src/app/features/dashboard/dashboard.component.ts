import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cube, apps, cash, checkmarkCircle, time } from 'ionicons/icons';
import { ProductService } from '../../../services/product.service';
import { SaleService } from '../../../services/sale.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon]
})
export class DashboardComponent implements OnInit {
  totalProducts = 0;
  totalStock = 0;
  
  pendingSalesCount = 0;
  pendingSalesValue = 0;
  
  paidSalesCount = 0;
  paidSalesValue = 0;

  constructor(
    private productService: ProductService,
    private saleService: SaleService
  ) {
    addIcons({ cube, apps, cash, checkmarkCircle, time });
  }

  async ionViewWillEnter() {
    await this.loadMetrics();
  }
  
  ngOnInit() {}

  async loadMetrics() {
    const products = await this.productService.getAll();
    this.totalProducts = products.length;
    this.totalStock = products.reduce((acc, p) => acc + (p.stockQuantity || 0), 0);

    const sales = await this.saleService.getAll();
    const pendingSales = sales.filter(s => s.status === 'PENDENTE');
    const paidSales = sales.filter(s => s.status === 'PAID');

    this.pendingSalesCount = pendingSales.length;
    this.pendingSalesValue = pendingSales.reduce((acc, s) => acc + (s.total || 0), 0);

    this.paidSalesCount = paidSales.length;
    this.paidSalesValue = paidSales.reduce((acc, s) => acc + (s.total || 0), 0);
  }
}
