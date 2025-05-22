import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard, adminGuard } from './helpers/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'user-home', 
    loadComponent: () => import('./components/user-home/user-home.component').then(m => m.UserHomeComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'order/:id', 
    loadComponent: () => import('./components/order-detail/order-detail.component').then(m => m.OrderDetailComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'products', 
    loadComponent: () => import('./components/products/products.component').then(m => m.ProductsComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'product/:id', 
    loadComponent: () => import('./components/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'cart', 
    loadComponent: () => import('./components/cart/cart.component').then(m => m.CartComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'watchlist', 
    loadComponent: () => import('./components/watchlist/watchlist.component').then(m => m.WatchlistComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'admin-home', 
    loadComponent: () => import('./components/admin-home/admin-home.component').then(m => m.AdminHomeComponent),
    canActivate: [adminGuard]
  },
  { 
    path: 'admin-products', 
    loadComponent: () => import('./components/admin-product-management/admin-product-management.component').then(m => m.AdminProductManagementComponent),
    canActivate: [adminGuard]
  },
  { 
    path: 'admin-orders', 
    loadComponent: () => import('./components/admin-order-management/admin-order-management.component').then(m => m.AdminOrderManagementComponent),
    canActivate: [adminGuard]
  },
  { path: '**', redirectTo: '/login' }
];
