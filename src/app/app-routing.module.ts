import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JobSchedulerComponent } from './features/job-scheduler/job-scheduler.component';
import { ConfigurationComponent } from './features/configuration/configuration.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LocaleSetupComponent } from './features/locale-setup/locale-setup.component';
import { ProductsComponent } from './features/products/products.component';
import { RouteErrorComponent } from './features/route-error/route-error.component';
import { CategoriesComponent } from './features/categories/categories.component';
import { NotificationsComponent } from './features/notifications/notifications.component';
import { OrdersComponent } from './features/orders/orders.component';
import { UserConfigurationComponent } from './features/user-configuration/user-configuration.component';
import { LoginComponent } from './features/login/login.component';
import { AuthGuardService as AuthGuard } from './services/auth/auth-guard.service';
import { RoleGuardService as RoleGuard } from './services/auth/role-guard.service';
import { LogoutComponent } from './features/logout/logout.component';


const routes: Routes = [
  {
    path: 'dashboard', component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'job-scheduler', component: JobSchedulerComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      expectedRole: 'scheduler'
    }
  },
  {
    path: 'locale-setup', component: LocaleSetupComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      expectedRole: 'locale'
    }
  },
  {
    path: 'products', component: ProductsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      expectedRole: 'products'
    }
  },
  {
    path: 'categories', component: CategoriesComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      expectedRole: 'category'
    }
  },
  {
    path: 'configuration', component: ConfigurationComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      expectedRole: 'admin'
    }
  },
  {
    path: 'user-configuration', component: UserConfigurationComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      expectedRole: 'configuration'
    }
  },
  {
    path: 'notifications', component: NotificationsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      expectedRole: 'notifications'
    }
  },
  {
    path: 'orders', component: OrdersComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      expectedRole: 'orders'
    }
  },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // redirect to `first-component`
  { path: '**', component: RouteErrorComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
