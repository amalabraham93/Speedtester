import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <footer class="w-full bg-slate-900/80 border-t border-white/5 pt-16 pb-8 px-6 mt-20 backdrop-blur-md relative z-10">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <!-- Brand -->
          <div class="col-span-1 md:col-span-1">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                <svg class="w-5 h-5 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <span class="text-white font-bold tracking-widest text-lg">SPEEDTRACK</span>
            </div>
            <p class="text-slate-400 text-sm leading-relaxed">
              Professional-grade connectivity intelligence. Analyze your network performance with precision and ease.
            </p>
          </div>

          <!-- Tools -->
          <div>
            <h4 class="text-white font-bold mb-6 text-sm uppercase tracking-widest">Speed Tools</h4>
            <ul class="space-y-4 text-slate-400 text-sm">
              <li><a routerLink="/" class="hover:text-neon-cyan transition-colors">Internet Speed Test</a></li>
              <li><a routerLink="/results" class="hover:text-neon-cyan transition-colors">Historical Analytics</a></li>
              <li><a href="#" class="hover:text-neon-cyan transition-colors">Ping Monitor</a></li>
              <li><a href="#" class="hover:text-neon-cyan transition-colors">Outage Map</a></li>
            </ul>
          </div>

          <!-- Locations (SEO Links) -->
          <div>
            <h4 class="text-white font-bold mb-6 text-sm uppercase tracking-widest">Global Locations</h4>
            <ul class="space-y-4 text-slate-400 text-sm">
              <li><a routerLink="/speed-test/india" class="hover:text-neon-cyan transition-colors">Speed Test India</a></li>
              <li><a routerLink="/speed-test/usa" class="hover:text-neon-cyan transition-colors">Speed Test USA</a></li>
              <li><a routerLink="/speed-test/uk" class="hover:text-neon-cyan transition-colors">Speed Test UK</a></li>
              <li><a routerLink="/speed-test/uae" class="hover:text-neon-cyan transition-colors">Speed Test UAE</a></li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h4 class="text-white font-bold mb-6 text-sm uppercase tracking-widest">Resources</h4>
            <ul class="space-y-4 text-slate-400 text-sm">
              <li><a routerLink="/blog" class="hover:text-neon-cyan transition-colors">Network Blog</a></li>
              <li><a href="#" class="hover:text-neon-cyan transition-colors">Privacy Policy</a></li>
              <li><a href="#" class="hover:text-neon-cyan transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div class="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="text-slate-500 text-[10px] font-mono tracking-widest uppercase">
            © 2026 SPEEDTRACK PROTOCOL | ALL SYSTEMS NOMINAL
          </div>
          <div class="flex gap-6">
            <span class="text-slate-500 text-[10px] uppercase font-mono tracking-widest">ENCRYPTED: TLS 1.3</span>
            <span class="text-slate-500 text-[10px] uppercase font-mono tracking-widest cursor-pointer hover:text-neon-cyan">API STATUS: ONLINE</span>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent { }
