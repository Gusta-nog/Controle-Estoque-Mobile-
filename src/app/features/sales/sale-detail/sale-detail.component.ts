import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonBadge, IonIcon, IonListHeader } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { person, calendar, cash } from 'ionicons/icons';
import { SaleService } from '../../../services/sale.service';
import { ClientService } from '../../../services/client.service';
import { ProductService } from '../../../services/product.service';
import { Sale } from '../../../models/sale.model';
import { Client } from '../../../models/client.model';

interface SaleItemUI {
  productName: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
}

@Component({
  selector: 'app-sale-detail',
  templateUrl: './sale-detail.component.html',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonBadge, IonIcon, IonListHeader],
  providers: [DatePipe, CurrencyPipe]
})
export class SaleDetailComponent implements OnInit {
  sale: Sale | null = null;
  client: Client | null = null;
  itemsUI: SaleItemUI[] = [];

  constructor(
    private route: ActivatedRoute,
    private saleService: SaleService,
    private clientService: ClientService,
    private productService: ProductService
  ) {
    addIcons({ person, calendar, cash });
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      await this.loadDetail(id);
    }
  }

  async loadDetail(id: string) {
    this.sale = await this.saleService.getById(id);
    if (!this.sale) return;

    this.client = await this.clientService.getById(this.sale.clientId);

    if (this.sale.items) {
      const allProducts = await this.productService.getAll();
      this.itemsUI = this.sale.items.map(item => {
        const prod = allProducts.find(p => p.id === item.productId);
        return {
          productName: prod ? prod.name : 'Produto Removido',
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subTotal: item.itemSubTotal
        };
      });
    }
  }
}
