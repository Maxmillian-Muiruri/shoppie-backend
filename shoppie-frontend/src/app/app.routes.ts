import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list';
import { CartComponent } from './components/cart/cart';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { AdminDashboardComponent } from './components/admin/admin-dashboard';
import { ProfileComponent } from './components/profile/profile';
import { ProductDetailComponent } from './components/product-detail/product-detail';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    { path: '', component: ProductListComponent },
    { path: 'cart', component: CartComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
    { path: 'profile', component: ProfileComponent },
    { path: 'products/:id', component: ProductDetailComponent },
    { path: '**', redirectTo: '' }
];
