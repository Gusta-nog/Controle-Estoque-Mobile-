import { Injectable } from '@angular/core';
import { DatabaseService } from '../database/database.service';
import { User } from '../../models/user.model';
import { Storage } from '@ionic/storage-angular';

const SESSION_KEY = 'current_user_session';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;
  private storage: Storage | null = null;

  constructor(
    private db: DatabaseService,
    private ionicStorage: Storage
  ) {}

  /**
   * Inicializa a sessão e garante que o usuário admin exista.
   * Usado pelo AuthGuard para ter certeza do estado antes de navegar.
   */
  async loadSession(): Promise<boolean> {
    if (!this.storage) {
       this.storage = await this.ionicStorage.create();
    }
    await this.ensureAdminExists();
    
    const sessionUser = await this.storage.get(SESSION_KEY);
    if (sessionUser) {
      this.currentUser = sessionUser;
      return true;
    }
    return false;
  }

  private async ensureAdminExists() {
    const users = await this.db.getAll<User>('users');
    const adminExists = users.some(u => u.username === 'admin');
    
    if (!adminExists) {
      await this.db.create<User>('users', {
        id: crypto.randomUUID ? crypto.randomUUID() : new Date().getTime().toString(),
        name: 'Administrador',
        username: 'admin',
        password: '123',
        role: 'admin'
      });
    }
  }

  async login(username: string, password: string): Promise<boolean> {
    const users = await this.db.getAll<User>('users');
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      this.currentUser = user;
      await this.storage?.set(SESSION_KEY, user);
      return true;
    }
    return false;
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    await this.storage?.remove(SESSION_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}
