import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ResultsComponent } from './components/results/results.component';
// import { DashboardComponent } from './components/dashboard/dashboard.component';
// import { AdminComponent } from './components/admin/admin.component';
// import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        data: {
            title: 'Internet Speed Test - Fast, Free & Accurate',
            description: 'Check your internet speed instantly with SpeedTrack. Accurate download, upload, ping, and jitter tests. Optimize your connection for gaming, streaming, and remote work.',
            keywords: 'speed test, internet speed test, wifi speed test, broadband speed test, ping test, jitter test, speedtrack'
        }
    },
    {
        path: 'results',
        component: ResultsComponent,
        data: {
            title: 'Your Speed Test Results',
            description: 'Detailed breakdown of your internet speed test results including download, upload, ping, and ISP information.',
            robots: 'noindex, follow'
        }
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
        data: {
            title: 'User Dashboard - Test History & Analytics',
            description: 'Access your internet speed test history, track performance trends over time, and manage your SpeedTrack account.',
            robots: 'noindex, nofollow'
        }
    },
    {
        path: 'login',
        loadComponent: () => import('./components/auth/login.component').then(m => m.LoginComponent),
        data: {
            title: 'Login to SpeedTrack',
            description: 'Sign in to your SpeedTrack account to save speed test history and access personalized analytics.'
        }
    },
    {
        path: 'register',
        loadComponent: () => import('./components/auth/register.component').then(m => m.RegisterComponent),
        data: {
            title: 'Join SpeedTrack - Create Your Account',
            description: 'Register for a SpeedTrack account to start tracking your internet performance and global outages.'
        }
    },
    {
        path: 'speed-test/:location',
        loadComponent: () => import('./components/location-test/location-test.component').then(m => m.LocationTestComponent)
    },
    {
        path: 'blog',
        loadComponent: () => import('./components/blog/blog-list.component').then(m => m.BlogListComponent)
    },
    {
        path: 'blog/:slug',
        loadComponent: () => import('./components/blog/blog-detail.component').then(m => m.BlogDetailComponent)
    },
    { path: '**', redirectTo: '' }
];
