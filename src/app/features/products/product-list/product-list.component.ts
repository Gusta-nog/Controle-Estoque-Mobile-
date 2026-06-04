import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton, IonList, IonItem, IonLabel, IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonFab, IonFabButton, IonSearchbar, IonSelect, IonSelectOption, AlertController, ToastController, IonBadge } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, create, trash, cube, warning } from 'ionicons/icons';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton, IonList, IonItem, IonLabel, IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonFab, IonFabButton, IonSearchbar, IonSelect, IonSelectOption, IonBadge]
})
export class ProductListComponent {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  
  searchTerm = '';
  selectedCategory = '';

  constructor(
    private productService: ProductService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    addIcons({ add, create, trash, cube, warning });
  }

  async ionViewWillEnter() {
    await this.loadProducts();
  }

  async loadProducts() {
    this.products = await this.productService.getAll();
    this.extractCategories();
    this.filterProducts();
  }

  extractCategories() {
    const cats = new Set(this.products.map(p => p.category).filter(c => !!c));
    this.categories = Array.from(cats).sort();
  }

  filterProducts() {
    let temp = [...this.products];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      temp = temp.filter(p => 
        p.name.toLowerCase().includes(term) || p.code.toLowerCase().includes(term)
      );
    }

    if (this.selectedCategory) {
      temp = temp.filter(p => p.category === this.selectedCategory);
    }

    this.filteredProducts = temp;
  }

  async confirmDelete(product: Product) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Exclusão',
      message: `Deseja excluir o produto <strong>${product.name}</strong>?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { 
          text: 'Excluir', 
          role: 'destructive',
          handler: () => this.deleteProduct(product.id)
        }
      ]
    });
    await alert.present();
  }

  async deleteProduct(id: string) {
    await this.productService.delete(id);
    await this.loadProducts();
    await this.showToast('Produto excluído com sucesso.', 'success');
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
