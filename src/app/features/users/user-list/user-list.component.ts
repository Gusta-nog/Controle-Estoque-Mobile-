import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton, IonList, IonItem, IonLabel, IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonFab, IonFabButton, IonSearchbar, AlertController, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, create, trash, shieldCheckmark, person } from 'ionicons/icons';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton, IonList, IonItem, IonLabel, IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonFab, IonFabButton, IonSearchbar]
})
export class UserListComponent {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = '';

  constructor(
    private userService: UserService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    addIcons({ add, create, trash, shieldCheckmark, person });
  }

  async ionViewWillEnter() {
    await this.loadUsers();
  }

  async loadUsers() {
    this.users = await this.userService.getAll();
    this.filterUsers();
  }

  filterUsers() {
    if (!this.searchTerm) {
      this.filteredUsers = [...this.users];
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(u => 
      u.name.toLowerCase().includes(term) || u.username.toLowerCase().includes(term)
    );
  }

  async confirmDelete(user: User) {
    if (user.username === 'admin') {
      await this.showToast('O usuário admin padrão não pode ser excluído.', 'warning');
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir o usuário <strong>${user.name}</strong>?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { 
          text: 'Excluir', 
          role: 'destructive',
          handler: () => this.deleteUser(user.id)
        }
      ]
    });
    await alert.present();
  }

  async deleteUser(id: string) {
    await this.userService.delete(id);
    await this.loadUsers();
    await this.showToast('Usuário excluído com sucesso.', 'success');
  }

  async showToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}
