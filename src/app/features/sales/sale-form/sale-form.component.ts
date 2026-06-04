import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonButton, IonIcon, IonList, IonListHeader, IonItemSliding, IonItemOptions, IonItemOption, IonCard, IonCardHeader, IonCardTitle, IonCardContent, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, trash, checkmarkCircle } from 'ionicons/icons';
import { ClientService } from '../../../services/client.service';
import { ProductService } from '../../../services/product.service';
import { SaleService } from '../../../services/sale.service';
import { Client } from '../../../models/client.model';
import { Product } from '../../../models/product.model';
import { Sale } from '../../../models/sale.model';
import { SaleItem } from '../../../models/sale-item.model';

interface UIDetailItem extends SaleItem {
  productName: string;
}

@Component({
  selector: 'app-sale-form',
  templateUrl: './sale-form.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonButton, IonIcon, IonList, IonListHeader, IonItemSliding, IonItemOptions, IonItemOption, IonCard, IonCardHeader, IonCardTitle, IonCardContent]
})
export class SaleFormComponent implements OnInit {
  saleForm: FormGroup;
  clients: Client[] = [];
  products: Product[] = [];
  
  // UI temporária para adição de produtos
  tempProductId = '';
  tempQuantity = 1;
  selectedProduct: Product | null = null;
  
  selectedItems: UIDetailItem[] = [];
  totalAmount = 0;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private productService: ProductService,
    private saleService: SaleService,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    addIcons({ add, trash, checkmarkCircle });
    this.saleForm = this.fb.group({
      clientId: ['', Validators.required]
    });
  }

  async ngOnInit() {
    this.clients = await this.clientService.getAll();
    const allProds = await this.productService.getAll();
    this.products = allProds.filter(p => p.stockQuantity > 0); // Só mostra se tem estoque
  }

  onProductSelected() {
    this.selectedProduct = this.products.find(p => p.id === this.tempProductId) || null;
    this.tempQuantity = 1;
  }

  addProduct() {
    if (!this.selectedProduct) return;
    if (this.tempQuantity <= 0 || this.tempQuantity > this.selectedProduct.stockQuantity) {
      this.showToast('Quantidade inválida ou superior ao estoque.', 'warning');
      return;
    }

    // Verifica se já existe na cesta para somar
    const existing = this.selectedItems.find(i => i.productId === this.tempProductId);
    if (existing) {
      const newQtd = existing.quantity + this.tempQuantity;
      if (newQtd > this.selectedProduct.stockQuantity) {
        this.showToast('Você ultrapassou o estoque máximo combinando os itens na cesta.', 'warning');
        return;
      }
      existing.quantity = newQtd;
      existing.itemSubTotal = existing.quantity * existing.unitPrice;
    } else {
      this.selectedItems.push({
        id: '', // Definido pelo DB
        saleId: '', // Definido pelo Service
        productId: this.selectedProduct.id,
        productName: this.selectedProduct.name,
        quantity: this.tempQuantity,
        unitPrice: this.selectedProduct.price,
        itemSubTotal: this.tempQuantity * this.selectedProduct.price
      });
    }

    this.recalculateTotal();
    // Limpar temp
    this.tempProductId = '';
    this.selectedProduct = null;
    this.tempQuantity = 1;
  }

  removeItem(index: number) {
    this.selectedItems.splice(index, 1);
    this.recalculateTotal();
  }

  recalculateTotal() {
    this.totalAmount = this.selectedItems.reduce((acc, item) => acc + item.itemSubTotal, 0);
  }

  async finishSale() {
    if (this.saleForm.invalid || this.selectedItems.length === 0) {
      await this.showToast('Selecione o cliente e adicione produtos.', 'danger');
      return;
    }

    const sale: Sale = {
      id: '',
      clientId: this.saleForm.value.clientId,
      date: new Date().toISOString(),
      subTotal: this.totalAmount, // Para este cenário subtotal = total
      total: this.totalAmount,
      status: 'PENDENTE'
    };

    // Converter UI items para domínio items limpos
    const domainItems: SaleItem[] = this.selectedItems.map(ui => ({
      id: ui.id,
      saleId: ui.saleId,
      productId: ui.productId,
      quantity: ui.quantity,
      unitPrice: ui.unitPrice,
      itemSubTotal: ui.itemSubTotal
    }));

    try {
      await this.saleService.create(sale, domainItems);
      await this.showToast('Venda finalizada! Estoque atualizado automaticamente.', 'success');
      this.router.navigate(['/sales'], { replaceUrl: true });
    } catch (error: any) {
      await this.showToast(error.message, 'danger');
    }
  }

  async showToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3500,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}
