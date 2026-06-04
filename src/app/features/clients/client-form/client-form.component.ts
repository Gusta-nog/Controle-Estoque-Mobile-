import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonItem, IonLabel, IonInput, IonButton, IonIcon, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { save } from 'ionicons/icons';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../models/client.model';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonItem, IonLabel, IonInput, IonButton, IonIcon]
})
export class ClientFormComponent implements OnInit {
  clientForm: FormGroup;
  clientId: string | null = null;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    addIcons({ save });
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.minLength(11)]],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required]
    });
  }

  async ngOnInit() {
    this.clientId = this.route.snapshot.paramMap.get('id');
    if (this.clientId) {
      this.isEditMode = true;
      await this.loadClient();
    }
  }

  async loadClient() {
    const client = await this.clientService.getById(this.clientId!);
    if (client) {
      this.clientForm.patchValue(client);
    }
  }

  async save() {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    const clientData: Client = {
      id: this.clientId || '',
      ...this.clientForm.value
    };

    try {
      if (this.isEditMode) {
        await this.clientService.update(clientData);
        await this.showToast('Cliente atualizado com sucesso!', 'success');
      } else {
        await this.clientService.create(clientData);
        await this.showToast('Cliente cadastrado com sucesso!', 'success');
      }
      this.router.navigate(['/clients'], { replaceUrl: true });
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
