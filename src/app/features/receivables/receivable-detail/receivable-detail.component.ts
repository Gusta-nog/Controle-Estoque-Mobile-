import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonBadge, IonIcon, IonButton, AlertController, ToastController, IonListHeader } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { person, calendar, cash, checkmarkCircle } from 'ionicons/icons';
import { ReceivableService } from '../../../services/receivable.service';
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
  selector: 'app-receivable-detail',
  templateUrl: './receivable-detail.component.html',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonBadge, IonIcon, IonButton, IonListHeader],
  providers: [DatePipe, CurrencyPipe]
})
export class ReceivableDetailComponent implements OnInit {
  sale: Sale | null = null;
  client: Client | null = null;
  itemsUI: SaleItemUI[] = [];

  constructor(
    private route: ActivatedRoute,
    private receivableService: ReceivableService,
    private clientService: ClientService,
    private productService: ProductService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    addIcons({ person, calendar, cash, checkmarkCircle });
  }

  async ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      await this.loadDetail(id);
    }
  }

  async ngOnInit() {}

  async loadDetail(id: string) {
    this.sale = await this.receivableService.getById(id);
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

  async confirmPayment() {
    if (!this.sale || this.sale.status === 'PAID') return;

    const alert = await this.alertCtrl.create({
      header: 'Confirmar Recebimento',
      message: `Tem certeza que deseja marcar a venda <strong>#${this.sale.id.substring(0,8)}</strong> no valor de <strong>R$ ${this.sale.total.toFixed(2)}</strong> como PAGA?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { 
          text: 'Confirmar', 
          handler: () => this.markAsPaid()
        }
      ]
    });
    await alert.present();
  }

  async markAsPaid() {
    try {
      if (this.sale) {
        await this.receivableService.markAsPaid(this.sale.id);
        await this.loadDetail(this.sale.id);
        await this.showToast('Recebimento confirmado com sucesso!', 'success');
      }
    } catch (error: any) {
      await this.showToast(error.message, 'danger');
    }
  }

  async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}
