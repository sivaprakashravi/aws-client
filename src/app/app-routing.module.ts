import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JobSchedulerComponent } from './features/job-scheduler/job-scheduler.component';
import { ConfigurationComponent } from './features/configuration/configuration.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LocaleSetupComponent } from './features/locale-setup/locale-setup.component';
import { ProductsComponent } from './features/products/products.component';
import { RouteErrorComponent } from './features/route-error/route-error.component';
import { CategoriesComponent } from './features/categories/categories.component';


const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'job-scheduler', component: JobSchedulerComponent },
  { path: 'locale-setup', component: LocaleSetupComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'configuration', component: ConfigurationComponent },
  { path: '',   redirectTo: '/job-scheduler', pathMatch: 'full' }, // redirect to `first-component`
  { path: '**', component: RouteErrorComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
