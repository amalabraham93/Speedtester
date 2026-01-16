import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-profile-header',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div *ngIf="user$ | async as user; else loginBtn" class="flex items-center gap-4">
       <!-- User Info -->
       <div class="flex items-center gap-3 bg-slate-900/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/50">
          <img [src]="user.avatar || 'https://ui-avatars.com/api/?name=' + user.name + '&background=0D8ABC&color=fff'" class="w-8 h-8 rounded-full border border-slate-600" alt="Avatar">
          <div class="hidden sm:block text-left">
              <div class="text-xs font-bold text-white leading-tight">{{ user.name }}</div>
              <div class="text-[9px] text-slate-400 cursor-pointer hover:text-neon-red transition-colors" (click)="logout()">LOGOUT</div>
          </div>
       </div>
    </div>
    
    <ng-template #loginBtn>
        <a routerLink="/login" class="px-5 py-2 rounded-full border border-slate-600 text-xs font-bold text-slate-300 hover:text-white hover:border-neon-cyan hover:bg-neon-cyan/10 transition-all duration-300">
            LOGIN
        </a>
    </ng-template>
  `
})
export class ProfileHeaderComponent {
    user$ = this.authService.currentUser$;

    constructor(public authService: AuthService) { }

    logout() {
        this.authService.logout();
    }
}
