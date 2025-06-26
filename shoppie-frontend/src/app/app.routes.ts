import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list';
import { CartComponent } from './components/cart/cart';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { AdminDashboardComponent } from './components/admin/admin-dashboard';
import { ProfileComponent } from './components/profile/profile';
import { ProductDetailComponent } from './components/product-detail/product-detail';
import { CheckoutComponent } from './components/checkout/checkout';
import { OrdersComponent } from './components/orders/orders';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';
import { RequestPasswordResetComponent } from './components/request-password-reset/request-password-reset';
import { ResetPasswordComponent } from './components/reset-password/reset-password';

export const routes: Routes = [
    { path: '', component: ProductListComponent },
    { path: 'cart', component: CartComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
    { path: 'profile', component: ProfileComponent },
    { path: 'products/:id', component: ProductDetailComponent },
    { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
    { path: 'orders', component: OrdersComponent, canActivate: [authGuard] },
    { path: 'forgot-password', component: RequestPasswordResetComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: '**', redirectTo: '' }
];
