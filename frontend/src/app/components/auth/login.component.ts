import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, GoogleSigninButtonModule],
    template: `
    <div class="min-h-screen bg-slate-900 flex items-center justify-center p-4">
       <div class="glass-card max-w-md w-full p-8 rounded-3xl border border-slate-700 bg-slate-800/50 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          
          <!-- Background Glow -->
          <div class="absolute -top-24 -right-24 w-64 h-64 bg-neon-cyan/10 blur-[80px] rounded-full pointer-events-none"></div>

          <h2 class="text-3xl font-display font-bold text-white mb-6 text-center tracking-wide">WELCOME BACK</h2>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
              
              <div>
                  <label class="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-widest">Email Address</label>
                  <input formControlName="email" type="email" class="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors" placeholder="user@example.com">
              </div>

              <div>
                  <label class="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-widest">Password</label>
                  <input formControlName="password" type="password" class="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors" placeholder="••••••••">
              </div>

              <div *ngIf="error" class="text-neon-red text-sm text-center bg-neon-red/10 p-2 rounded-lg border border-neon-red/20">
                  {{ error }}
              </div>

              <button type="submit" [disabled]="loading" class="w-full py-3 bg-neon-cyan/10 border border-neon-cyan/50 text-neon-cyan rounded-xl font-bold font-display hover:bg-neon-cyan hover:text-slate-900 transition-all duration-300 shadow-[0_0_15px_rgba(0,224,255,0.2)]">
                  {{ loading ? 'AUTHENTICATING...' : 'LOGIN' }}
              </button>
          </form>

          <div class="relative my-8">
              <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-700"></div></div>
              <div class="relative flex justify-center text-xs uppercase"><span class="bg-slate-800 px-2 text-slate-500">Or continue with</span></div>
          </div>

          <div class="flex justify-center">
             <asl-google-signin-button type="standard" theme="filled_black" size="large" text="continue_with" [width]="250"></asl-google-signin-button>
          </div>

          <div class="mt-8 text-center text-sm text-slate-400">
              Don't have an account? <a routerLink="/register" class="text-neon-cyan hover:underline cursor-pointer">Sign up</a>
          </div>
       </div>
    </div>
  `
})
export class LoginComponent {
    loginForm: FormGroup;
    loading = false;
    error = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private socialAuthService: SocialAuthService
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });

        // Listen for Google Auth
        this.socialAuthService.authState.subscribe((user) => {
            if (user && user.idToken) {
                this.handleGoogleLogin(user.idToken);
            }
        });
    }

    onSubmit() {
        if (this.loginForm.invalid) return;

        this.loading = true;
        this.error = '';

        this.authService.login(this.loginForm.value).subscribe({
            next: () => {
                this.router.navigate(['/']);
            },
            error: (err) => {
                this.error = err.error?.msg || 'Login failed';
                this.loading = false;
            }
        });
    }

    handleGoogleLogin(token: string) {
        this.loading = true;
        this.authService.loginWithGoogle(token).subscribe({
            next: () => this.router.navigate(['/']),
            error: (err) => {
                this.error = 'Google Login Failed';
                this.loading = false;
            }
        });
    }
}
