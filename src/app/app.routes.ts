import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  
  // Rotas de Usuários
  {
    path: 'users',
    canActivate: [authGuard],
    loadComponent: () => import('./features/users/user-list/user-list.component').then(m => m.UserListComponent)
  },
  {
    path: 'users/new',
    canActivate: [authGuard],
    loadComponent: () => import('./features/users/user-form/user-form.component').then(m => m.UserFormComponent)
  },
  {
    path: 'users/edit/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/users/user-form/user-form.component').then(m => m.UserFormComponent)
  },

  // Rotas de Clientes
  {
    path: 'clients',
    canActivate: [authGuard],
    loadComponent: () => import('./features/clients/client-list/client-list.component').then(m => m.ClientListComponent)
  },
  {
    path: 'clients/new',
    canActivate: [authGuard],
    loadComponent: () => import('./features/clients/client-form/client-form.component').then(m => m.ClientFormComponent)
  },
  {
    path: 'clients/edit/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/clients/client-form/client-form.component').then(m => m.ClientFormComponent)
  },

  // Rotas de Produtos
  {
    path: 'products',
    canActivate: [authGuard],
    loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent)
  },
  {
    path: 'products/new',
    canActivate: [authGuard],
    loadComponent: () => import('./features/products/product-form/product-form.component').then(m => m.ProductFormComponent)
  },
  {
    path: 'products/edit/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/products/product-form/product-form.component').then(m => m.ProductFormComponent)
  },

  // Rotas de Vendas
  {
    path: 'sales',
    canActivate: [authGuard],
    loadComponent: () => import('./features/sales/sale-list/sale-list.component').then(m => m.SaleListComponent)
  },
  {
    path: 'sales/new',
    canActivate: [authGuard],
    loadComponent: () => import('./features/sales/sale-form/sale-form.component').then(m => m.SaleFormComponent)
  },
  {
    path: 'sales/detail/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/sales/sale-detail/sale-detail.component').then(m => m.SaleDetailComponent)
  },

  // Rotas de Recebimentos
  {
    path: 'receivables',
    canActivate: [authGuard],
    loadComponent: () => import('./features/receivables/receivable-list/receivable-list.component').then(m => m.ReceivableListComponent)
  },
  {
    path: 'receivables/detail/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/receivables/receivable-detail/receivable-detail.component').then(m => m.ReceivableDetailComponent)
  },

  // Relatórios
  {
    path: 'reports',
    canActivate: [authGuard],
    loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent)
  }
];
