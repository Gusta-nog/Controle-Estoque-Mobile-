import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonItem, IonLabel, IonInput, IonButton, IonIcon, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { save } from 'ionicons/icons';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonItem, IonLabel, IonInput, IonButton, IonIcon]
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  productId: string | null = null;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    addIcons({ save });
    this.productForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      category: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]]
    });
  }

  async ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.isEditMode = true;
      await this.loadProduct();
    }
  }

  async loadProduct() {
    const product = await this.productService.getById(this.productId!);
    if (product) {
      this.productForm.patchValue(product);
    }
  }

  async save() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const productData: Product = {
      id: this.productId || '',
      ...this.productForm.value
    };

    try {
      if (this.isEditMode) {
        await this.productService.update(productData);
        await this.showToast('Produto atualizado com sucesso!', 'success');
      } else {
        await this.productService.create(productData);
        await this.showToast('Produto cadastrado com sucesso!', 'success');
      }
      this.router.navigate(['/products'], { replaceUrl: true });
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
