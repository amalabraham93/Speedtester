import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-900 p-6 flex flex-col items-center justify-center relative overflow-hidden">
      <!-- Background Elements -->
      <div class="absolute top-0 left-0 right-0 h-96 bg-neon-blue opacity-10 blur-3xl rounded-full pointer-events-none"></div>
      <div class="absolute bottom-10 right-10 w-64 h-64 bg-neon-cyan opacity-5 blur-3xl rounded-full animate-pulse pointer-events-none"></div>

      <div class="max-w-4xl w-full z-10 relative">
        <!-- Header -->
        <h2 class="text-4xl font-bold text-white mb-8 text-center tracking-widest">TEST RESULTS</h2>
        
        <!-- Main Stats Card -->
        <div class="bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-slate-700 p-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center shadow-[0_0_50px_rgba(15,23,42,0.5)]">
          
          <div class="relative group">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Download</h3>
            <p class="text-5xl font-bold text-white group-hover:text-neon-cyan transition-colors duration-300 drop-shadow-[0_0_10px_rgba(0,242,254,0.3)]">
                {{ result?.downloadSpeed | number:'1.1-2' }}
            </p>
            <span class="text-slate-500 text-sm mt-1 block">Mbps</span>
          </div>

          <div class="md:border-l md:border-r border-slate-700 px-4 relative group">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Upload</h3>
            <p class="text-5xl font-bold text-white group-hover:text-neon-blue transition-colors duration-300 drop-shadow-[0_0_10px_rgba(47,128,237,0.3)]">
                {{ result?.uploadSpeed | number:'1.1-2' }}
            </p>
            <span class="text-slate-500 text-sm mt-1 block">Mbps</span>
          </div>

          <div class="relative group">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Ping</h3>
            <p class="text-5xl font-bold text-white group-hover:text-neon-purple transition-colors duration-300 drop-shadow-[0_0_10px_rgba(189,0,255,0.3)]">
                {{ result?.ping | number:'1.0-0' }}
            </p>
            <span class="text-slate-500 text-sm mt-1 block">ms</span>
          </div>
        </div>

        <!-- Secondary Stats & Comparison -->
        <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-700 p-6">
            <h4 class="font-bold text-slate-300 mb-4 tracking-wide border-b border-slate-700 pb-2">CONNECTION DETAILS</h4>
            <div class="space-y-4 text-sm">
              <div class="flex justify-between items-center">
                <span class="text-slate-500">Jitter</span>
                <span class="font-bold text-white">{{ result?.jitter | number:'1.0-0' }} <span class="text-slate-600 font-normal">ms</span></span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-500">ISP</span>
                <span class="font-bold text-white truncate max-w-[200px]">{{ result?.isp || 'Detecting...' }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-500">Server</span>
                <span class="font-bold text-white">{{ result?.city || 'Unknown' }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-500">IP Address</span>
                <span class="font-mono text-neon-cyan">{{ result?.ip || 'Hidden' }}</span>
              </div>
            </div>
          </div>
          
           <!-- Placeholder for Graph or Ad -->
           <div class="bg-slate-800/40 rounded-2xl border border-slate-700 p-6 flex items-center justify-center text-slate-600">
               <span class="text-xs uppercase tracking-widest">[ Detailed Analysis Coming Soon ]</span>
           </div>
        </div>

        <!-- Sharing Actions -->
        <div class="mt-10 flex flex-wrap justify-center gap-4">
          <button class="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-500 transition shadow-lg hover:shadow-green-500/20">
            Preview Share
          </button>
          <button (click)="goToDashboard()" class="px-8 py-3 bg-slate-700 text-white rounded-xl font-bold hover:bg-slate-600 transition border border-slate-600">
            View History
          </button>
          <button (click)="retry()" class="px-8 py-3 bg-gradient-to-r from-neon-blue to-neon-cyan text-slate-900 rounded-xl font-bold shadow-[0_0_20px_rgba(47,128,237,0.4)] hover:shadow-[0_0_30px_rgba(0,242,254,0.5)] transition hover:-translate-y-1">
            TEST AGAIN
          </button>
        </div>
      </div>
    </div>
  `
})
export class ResultsComponent implements OnInit {
  result: any = {
    downloadSpeed: 0,
    uploadSpeed: 0,
    ping: 0,
    jitter: 0,
    isp: 'Loading',
    city: 'Loading'
  };

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state && nav.extras.state['result']) {
      this.result = nav.extras.state['result'];
    }
  }

  ngOnInit(): void {
    if (!this.result.downloadSpeed && !this.result.uploadSpeed) {
      // Redirect home if no data (e.g. refresh)
      // this.router.navigate(['/']);
    }
  }

  retry() {
    this.router.navigate(['/']);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']); // Requires auth usually
  }
}
