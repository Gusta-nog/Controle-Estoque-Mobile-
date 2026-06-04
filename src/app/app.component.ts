import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, MenuController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOut, grid, person, people, cube, cart, cash, pieChart, documentText } from 'ionicons/icons';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet],
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private menuCtrl: MenuController
  ) {
    addIcons({ logOut, grid, person, people, cube, cart, cash, pieChart, documentText });
  }

  async logout() {
    await this.authService.logout();
    await this.menuCtrl.enable(false);
  }
}
