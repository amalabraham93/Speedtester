import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BackgroundComponent } from '../background/background.component';
import { QualityService } from '../../services/quality.service';
import { SeoService } from '../../services/seo.service';
import { ImageGenService } from '../../services/image-gen.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, BackgroundComponent],
  template: `
    <div class="min-h-screen bg-slate-900 p-6 flex flex-col items-center justify-center relative overflow-y-auto overflow-x-hidden">
      <!-- Interactive Particle Background -->
      <app-background></app-background>

      <!-- Background Elements (Static Glows) -->
      <div class="absolute top-0 left-0 right-0 h-96 bg-neon-blue opacity-10 blur-3xl rounded-full pointer-events-none"></div>
      <div class="absolute bottom-10 right-10 w-64 h-64 bg-neon-cyan opacity-5 blur-3xl rounded-full animate-pulse pointer-events-none"></div>

      <div class="max-w-4xl w-full z-10 relative my-10">
        <!-- Header -->
        <h2 class="text-2xl md:text-4xl font-display font-bold text-white mb-6 md:mb-8 text-center tracking-widest drop-shadow-md">TEST RESULTS</h2>
        
        <!-- Main Stats Card -->
        <div id="result-card" class="glass-card mb-6 md:mb-8 p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center shadow-[0_0_50px_rgba(15,23,42,0.5)] bg-slate-800/80 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-slate-700">


           <div class="relative group border-b md:border-b-0 md:border-r border-slate-700 pb-4 md:pb-0">
             <h3 class="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 md:mb-2">Download</h3>
             <p class="text-4xl md:text-5xl font-display font-bold text-white group-hover:text-neon-cyan transition-colors duration-300 drop-shadow-[0_0_10px_rgba(0,242,254,0.3)]">
                 {{ result?.downloadSpeed | number:'1.1-1' }}
             </p>
             <span class="text-slate-500 text-xs md:text-sm mt-1 block">Mbps</span>
           </div>
 
           <div class="md:border-r border-slate-700 pb-4 md:pb-0 md:px-4 relative group border-b md:border-b-0">
             <h3 class="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 md:mb-2">Upload</h3>
             <p class="text-4xl md:text-5xl font-display font-bold text-white group-hover:text-neon-blue transition-colors duration-300 drop-shadow-[0_0_10px_rgba(47,128,237,0.3)]">
                 {{ result?.uploadSpeed | number:'1.1-1' }}
             </p>
             <span class="text-slate-500 text-xs md:text-sm mt-1 block">Mbps</span>
           </div>
 
           <div class="relative group">
             <h3 class="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 md:mb-2">Ping</h3>
             <p class="text-4xl md:text-5xl font-display font-bold text-white group-hover:text-neon-purple transition-colors duration-300 drop-shadow-[0_0_10px_rgba(189,0,255,0.3)]">
                 {{ result?.ping | number:'1.0-0' }}
             </p>
             <span class="text-slate-500 text-xs md:text-sm mt-1 block">ms</span>
           </div>
        </div>

        <!-- Service Quality Dashboard -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
             <!-- Quality Scores -->
             <div class="bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-700 p-6 flex flex-col justify-between">
                <div class="flex justify-between items-center border-b border-slate-700 pb-2 mb-4">
                    <h4 class="font-display font-bold text-slate-300 tracking-wide">SERVICE QUALITY</h4>
                    <span class="text-xs font-mono text-neon-cyan">AI ANALYSIS</span>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <!-- Browsing -->
                    <div class="p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition group">
                        <div class="flex items-center gap-3 mb-2">
                             <span class="p-2 rounded-lg bg-slate-900 border border-slate-700 text-neon-blue group-hover:text-white transition">🌐</span>
                             <div>
                                 <div class="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Browsing</div>
                                 <div class="text-xs font-bold" [ngClass]="scores['browsing']?.class">{{ scores['browsing']?.label }}</div>
                             </div>
                        </div>
                        <!-- Stars -->
                        <div class="flex gap-1">
                            <div *ngFor="let i of [1,2,3,4,5]" class="w-full h-1 rounded-full transition-all duration-300"
                                [ngClass]="i <= scores['browsing']?.score ? (scores['browsing']?.score < 3 ? 'bg-neon-red' : (scores['browsing']?.score < 4 ? 'bg-yellow-400' : 'bg-neon-cyan')) : 'bg-slate-700'"></div>
                        </div>
                    </div>

                    <!-- Gaming -->
                    <div class="p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition group">
                        <div class="flex items-center gap-3 mb-2">
                             <span class="p-2 rounded-lg bg-slate-900 border border-slate-700 text-neon-purple group-hover:text-white transition">🎮</span>
                             <div>
                                 <div class="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Gaming</div>
                                 <div class="text-xs font-bold" [ngClass]="scores['gaming']?.class">{{ scores['gaming']?.label }}</div>
                             </div>
                        </div>
                         <div class="flex gap-1">
                            <div *ngFor="let i of [1,2,3,4,5]" class="w-full h-1 rounded-full transition-all duration-300"
                                [ngClass]="i <= scores['gaming']?.score ? (scores['gaming']?.score < 3 ? 'bg-neon-red' : (scores['gaming']?.score < 4 ? 'bg-yellow-400' : 'bg-neon-purple')) : 'bg-slate-700'"></div>
                        </div>
                    </div>

                    <!-- Streaming -->
                    <div class="p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition group">
                        <div class="flex items-center gap-3 mb-2">
                             <span class="p-2 rounded-lg bg-slate-900 border border-slate-700 text-neon-red group-hover:text-white transition">📺</span>
                             <div>
                                 <div class="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Streaming</div>
                                 <div class="text-xs font-bold" [ngClass]="scores['streaming']?.class">{{ scores['streaming']?.label }}</div>
                             </div>
                        </div>
                         <div class="flex gap-1">
                            <div *ngFor="let i of [1,2,3,4,5]" class="w-full h-1 rounded-full transition-all duration-300"
                                [ngClass]="i <= scores['streaming']?.score ? (scores['streaming']?.score < 3 ? 'bg-neon-red' : (scores['streaming']?.score < 4 ? 'bg-yellow-400' : 'bg-neon-red')) : 'bg-slate-700'"></div>
                        </div>
                    </div>

                    <!-- Video Call -->
                    <div class="p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition group">
                        <div class="flex items-center gap-3 mb-2">
                             <span class="p-2 rounded-lg bg-slate-900 border border-slate-700 text-neon-green group-hover:text-white transition">📹</span>
                             <div>
                                 <div class="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Video Call</div>
                                 <div class="text-xs font-bold" [ngClass]="scores['videoCall']?.class">{{ scores['videoCall']?.label }}</div>
                             </div>
                        </div>
                         <div class="flex gap-1">
                            <div *ngFor="let i of [1,2,3,4,5]" class="w-full h-1 rounded-full transition-all duration-300"
                                [ngClass]="i <= scores['videoCall']?.score ? (scores['videoCall']?.score < 3 ? 'bg-neon-red' : (scores['videoCall']?.score < 4 ? 'bg-yellow-400' : 'bg-neon-green')) : 'bg-slate-700'"></div>
                        </div>
                    </div>
                </div>
             </div>

             <!-- Connection Details -->
             <div class="bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-700 p-6">
                <h4 class="font-display font-bold text-slate-300 mb-4 tracking-wide border-b border-slate-700 pb-2">CONNECTION DETAILS</h4>
                <div class="space-y-4 text-sm font-mono">
                  <div class="flex justify-between items-center border-b border-slate-700/50 pb-2">
                    <span class="text-slate-500">Jitter</span>
                    <span class="font-bold text-white">{{ result?.jitter | number:'1.0-0' }} <span class="text-slate-600 font-sans font-normal">ms</span></span>
                  </div>
                  <div class="flex justify-between items-center border-b border-slate-700/50 pb-2">
                    <span class="text-slate-500">ISP Provider</span>
                    <span class="font-bold text-white truncate max-w-[200px]">{{ result?.isp || 'Detecting...' }}</span>
                  </div>
                  <div class="flex justify-between items-center border-b border-slate-700/50 pb-2">
                    <span class="text-slate-500">Test Server</span>
                    <span class="font-bold text-white">{{ result?.city || 'Unknown' }}</span>
                  </div>
                  <div class="flex justify-between items-center pt-2">
                    <span class="text-slate-500">IP Address</span>
                    <span class="font-bold text-neon-cyan drop-shadow-sm">{{ result?.ip || 'Hidden' }}</span>
                  </div>
                </div>
             </div>
        </div>

        <!-- Sharing Actions -->
        <div class="mt-8 flex flex-wrap justify-center gap-4">
          <button (click)="shareResult()" class="px-8 py-3 bg-slate-800 text-slate-300 rounded-xl font-bold font-display tracking-wide hover:bg-slate-700 transition border border-slate-700 hover:text-white flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
            SHARE IMAGE
          </button>
          <button (click)="goToDashboard()" class="px-8 py-3 bg-slate-800 text-slate-300 rounded-xl font-bold font-display tracking-wide hover:bg-slate-700 transition border border-slate-700 hover:text-white">
            VIEW FULL HISTORY
          </button>
          <button (click)="retry()" class="px-10 py-3 bg-gradient-to-r from-neon-blue to-neon-cyan text-slate-900 rounded-xl font-display font-bold text-lg tracking-widest shadow-[0_0_20px_rgba(47,128,237,0.4)] hover:shadow-[0_0_30px_rgba(0,242,254,0.6)] transition hover:-translate-y-1 active:scale-95">
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

  scores: any = {};

  constructor(
    private router: Router,
    private qualityService: QualityService,
    private seoService: SeoService,
    private imageGenService: ImageGenService
  ) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state && nav.extras.state['result']) {
      this.result = nav.extras.state['result'];
    }
  }

  ngOnInit(): void {
    if (!this.result.downloadSpeed && !this.result.uploadSpeed) {
      // Handle page refresh data loss if needed
    }

    // Calculate Quality Scores
    this.scores = this.qualityService.calculateScores(
      this.result.downloadSpeed || 0,
      this.result.uploadSpeed || 0,
      this.result.ping || 0,
      this.result.jitter || 0
    );

    // Update SEO
    this.seoService.updateSeoData({
      title: `My Speed: ${this.result.downloadSpeed} Mbps`,
      description: `I just hit ${this.result.downloadSpeed} Mbps Download & ${this.result.uploadSpeed} Mbps Upload on SpeedTrack! Test your internet speed now.`,
      keywords: 'speed test results, internet speed, speedtrack score'
    });
  }

  async shareResult() {
    const element = document.getElementById('result-card'); // Need to ID the card
    if (element) {
      try {
        const dataUrl = await this.imageGenService.generateResultImage(element);
        this.imageGenService.downloadImage(dataUrl, `speedtrack-result-${Date.now()}.png`);
      } catch (err) {
        console.error('Share failed', err);
      }
    }
  }

  retry() {
    this.router.navigate(['/']);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
