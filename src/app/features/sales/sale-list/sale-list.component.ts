import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton, IonList, IonItem, IonLabel, IonIcon, IonFab, IonFabButton, IonBadge, IonSearchbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, cart, documentText, cash } from 'ionicons/icons';
import { SaleService } from '../../../services/sale.service';
import { ClientService } from '../../../services/client.service';
import { Sale } from '../../../models/sale.model';

interface SaleUI extends Sale {
  clientName?: string;
  itemCount?: number;
}

@Component({
  selector: 'app-sale-list',
  templateUrl: './sale-list.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton, IonList, IonItem, IonLabel, IonIcon, IonFab, IonFabButton, IonBadge, IonSearchbar],
  providers: [DatePipe, CurrencyPipe]
})
export class SaleListComponent {
  sales: SaleUI[] = [];
  filteredSales: SaleUI[] = [];
  searchTerm = '';

  constructor(
    private saleService: SaleService,
    private clientService: ClientService
  ) {
    addIcons({ add, cart, documentText, cash });
  }

  async ionViewWillEnter() {
    await this.loadSales();
  }

  async loadSales() {
    const rawSales = await this.saleService.getAll();
    const clients = await this.clientService.getAll();
    
    // Cruzamento manual (join)
    this.sales = [];
    for (const s of rawSales) {
      const client = clients.find(c => c.id === s.clientId);
      // Forçar busca dos itens para saber a quantidade
      const fullSale = await this.saleService.getById(s.id);
      
      this.sales.push({
        ...s,
        clientName: client ? client.name : 'Cliente Removido',
        itemCount: fullSale?.items?.length || 0
      });
    }

    // Ordenar das mais novas para as mais antigas
    this.sales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    this.filterSales();
  }

  filterSales() {
    if (!this.searchTerm) {
      this.filteredSales = [...this.sales];
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredSales = this.sales.filter(s => 
      (s.clientName && s.clientName.toLowerCase().includes(term)) ||
      s.id.toLowerCase().includes(term)
    );
  }
}
