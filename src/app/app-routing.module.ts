import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryManagerComponent } from './features/category-manager/category-manager.component';
import { ConfigurationComponent } from './features/configuration/configuration.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { RouteErrorComponent } from './features/route-error/route-error.component';


const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'job-scheduler', component: CategoryManagerComponent },
  { path: 'configuration', component: ConfigurationComponent },
  { path: '',   redirectTo: '/category-manager', pathMatch: 'full' }, // redirect to `first-component`
  { path: '**', component: RouteErrorComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
