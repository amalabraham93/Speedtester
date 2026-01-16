import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    template: `
    <div class="min-h-screen bg-slate-900 flex items-center justify-center p-4">
       <div class="glass-card max-w-md w-full p-8 rounded-3xl border border-slate-700 bg-slate-800/50 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          
          <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-neon-purple/10 blur-[80px] rounded-full pointer-events-none"></div>

          <h2 class="text-3xl font-display font-bold text-white mb-6 text-center tracking-wide">CREATE ACCOUNT</h2>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
              
              <div>
                  <label class="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-widest">Full Name</label>
                  <input formControlName="name" type="text" class="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors" placeholder="Cyber User">
              </div>

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
                  {{ loading ? 'CREATING...' : 'SIGN UP' }}
              </button>
          </form>

          <div class="mt-8 text-center text-sm text-slate-400">
              Already have an account? <a routerLink="/login" class="text-neon-cyan hover:underline cursor-pointer">Login</a>
          </div>
       </div>
    </div>
  `
})
export class RegisterComponent {
    registerForm: FormGroup;
    loading = false;
    error = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.registerForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    onSubmit() {
        if (this.registerForm.invalid) return;

        this.loading = true;
        this.error = '';

        this.authService.register(this.registerForm.value).subscribe({
            next: () => {
                this.router.navigate(['/']);
            },
            error: (err) => {
                this.error = err.error?.msg || 'Registration failed';
                this.loading = false;
            }
        });
    }
}
