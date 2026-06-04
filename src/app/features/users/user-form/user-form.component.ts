import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonButton, IonIcon, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { save } from 'ionicons/icons';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonButton, IonIcon]
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  userId: string | null = null;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    addIcons({ save });
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['standard', Validators.required]
    });
  }

  async ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.isEditMode = true;
      await this.loadUser();
    }
  }

  async loadUser() {
    const user = await this.userService.getById(this.userId!);
    if (user) {
      this.userForm.patchValue({
        name: user.name,
        username: user.username,
        password: user.password,
        role: user.role
      });
    }
  }

  async save() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const userData: User = {
      id: this.userId || '',
      ...this.userForm.value
    };

    try {
      if (this.isEditMode) {
        await this.userService.update(userData);
        await this.showToast('Usuário atualizado com sucesso!', 'success');
      } else {
        await this.userService.create(userData);
        await this.showToast('Usuário cadastrado com sucesso!', 'success');
      }
      this.router.navigate(['/users'], { replaceUrl: true });
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
