import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton, IonList, IonItem, IonLabel, IonIcon, IonBadge, IonSearchbar, IonSegment, IonSegmentButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cash, checkmarkCircle, time } from 'ionicons/icons';
import { ReceivableService } from '../../../services/receivable.service';
import { ClientService } from '../../../services/client.service';
import { Sale } from '../../../models/sale.model';

interface SaleUI extends Sale {
  clientName?: string;
}

@Component({
  selector: 'app-receivable-list',
  templateUrl: './receivable-list.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton, IonList, IonItem, IonLabel, IonIcon, IonBadge, IonSearchbar, IonSegment, IonSegmentButton],
  providers: [DatePipe, CurrencyPipe]
})
export class ReceivableListComponent {
  sales: SaleUI[] = [];
  filteredSales: SaleUI[] = [];
  searchTerm = '';
  filterStatus = 'all';

  constructor(
    private receivableService: ReceivableService,
    private clientService: ClientService
  ) {
    addIcons({ cash, checkmarkCircle, time });
  }

  async ionViewWillEnter() {
    await this.loadReceivables();
  }

  async loadReceivables() {
    const rawSales = await this.receivableService.getAll();
    const clients = await this.clientService.getAll();
    
    this.sales = rawSales.map(s => {
      const client = clients.find(c => c.id === s.clientId);
      return {
        ...s,
        clientName: client ? client.name : 'Cliente Removido'
      };
    });

    this.sales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    this.applyFilters();
  }

  applyFilters() {
    let temp = [...this.sales];

    if (this.filterStatus === 'pending') {
      temp = temp.filter(s => s.status === 'PENDENTE');
    } else if (this.filterStatus === 'paid') {
      temp = temp.filter(s => s.status === 'PAID');
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      temp = temp.filter(s => 
        (s.clientName && s.clientName.toLowerCase().includes(term)) ||
        s.id.toLowerCase().includes(term)
      );
    }

    this.filteredSales = temp;
  }
}
