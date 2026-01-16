import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ResultsComponent } from './components/results/results.component';
// import { DashboardComponent } from './components/dashboard/dashboard.component';
// import { AdminComponent } from './components/admin/admin.component';
// import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'results', component: ResultsComponent },
    {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
        // canActivate: [AuthGuard]
    },
    { path: 'login', loadComponent: () => import('./components/auth/login.component').then(m => m.LoginComponent) },
    { path: 'register', loadComponent: () => import('./components/auth/register.component').then(m => m.RegisterComponent) },
    { path: '**', redirectTo: '' }
];
