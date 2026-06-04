import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton, IonList, IonItem, IonLabel, IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonFab, IonFabButton, IonSearchbar, AlertController, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, create, trash, briefcase } from 'ionicons/icons';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../models/client.model';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton, IonList, IonItem, IonLabel, IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonFab, IonFabButton, IonSearchbar]
})
export class ClientListComponent {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTerm = '';

  constructor(
    private clientService: ClientService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    addIcons({ add, create, trash, briefcase });
  }

  async ionViewWillEnter() {
    await this.loadClients();
  }

  async loadClients() {
    this.clients = await this.clientService.getAll();
    this.filterClients();
  }

  filterClients() {
    if (!this.searchTerm) {
      this.filteredClients = [...this.clients];
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredClients = this.clients.filter(c => 
      c.name.toLowerCase().includes(term) || c.cpf.includes(term)
    );
  }

  async confirmDelete(client: Client) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir o cliente <strong>${client.name}</strong>?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { 
          text: 'Excluir', 
          role: 'destructive',
          handler: () => this.deleteClient(client.id)
        }
      ]
    });
    await alert.present();
  }

  async deleteClient(id: string) {
    await this.clientService.delete(id);
    await this.loadClients();
    await this.showToast('Cliente excluído com sucesso.', 'success');
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
