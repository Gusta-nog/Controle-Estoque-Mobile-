import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonText, IonToast, MenuController } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { addIcons } from 'ionicons';
import { lockClosedOutline, personOutline, cube } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonText, IonToast, FormsModule]
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  
  isToastOpen = false;
  toastMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private menuCtrl: MenuController
  ) {
    addIcons({ lockClosedOutline, personOutline, cube });
  }

  async ngOnInit() {
    // Esconder o menu lateral enquanto estiver na tela de login
    await this.menuCtrl.enable(false);
    
    // Verifica se já está logado
    const isLoggedIn = await this.authService.loadSession();
    if (isLoggedIn) {
      await this.menuCtrl.enable(true);
      this.router.navigate(['/dashboard'], { replaceUrl: true });
    }
  }

  async login() {
    if (!this.username || !this.password) {
      this.showToast('Preencha os campos de usuário e senha.');
      return;
    }

    const success = await this.authService.login(this.username, this.password);
    if (success) {
      await this.menuCtrl.enable(true);
      this.router.navigate(['/dashboard'], { replaceUrl: true });
    } else {
      this.showToast('Usuário ou senha inválidos.');
    }
  }

  showToast(message: string) {
    this.toastMessage = message;
    this.isToastOpen = true;
  }
}
