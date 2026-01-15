import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SpeedTestService, TestState } from '../../services/speed-test.service';
import { GaugeComponent } from '../gauge/gauge.component';
import { BackgroundComponent } from '../background/background.component';
import { ApiService } from '../../services/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, GaugeComponent, BackgroundComponent],
  template: `
    <div class="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4">
      <!-- Interactive Particle Background -->
      <app-background></app-background>

      <!-- Decoration Orbs -> Deep Depth -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/10 blur-[100px] rounded-full animate-pulse-slow pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 blur-[100px] rounded-full animate-float pointer-events-none"></div>

      <!-- Header -->
      <div class="flex justify-between w-full max-w-5xl mb-12 items-center z-10 animate-fade-in-down">
        <div class="flex items-center gap-3 group cursor-pointer hover:scale-105 transition-transform">
           <div class="w-12 h-12 rounded-xl bg-slate-900/80 border border-slate-700/50 flex items-center justify-center shadow-[0_0_20px_rgba(0,224,255,0.1)] group-hover:shadow-[0_0_25px_rgba(0,224,255,0.3)] transition-all duration-300 backdrop-blur-md">
               <svg class="w-6 h-6 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
           </div>
           <div>
               <span class="block text-white font-display font-bold tracking-[0.2em] text-xl drop-shadow-md">SPEEDTRACK</span>
               <span class="block text-[8px] text-neon-cyan tracking-[0.4em] uppercase opacity-70">Deep Analysis Protocol</span>
           </div>
        </div>
        <div class="px-6 py-2 rounded-full bg-slate-900/40 border border-neon-cyan/20 backdrop-blur-md text-xs font-mono text-neon-cyan tracking-wider shadow-[0_0_15px_rgba(0,224,255,0.05)]">
           <span class="opacity-70">CONN:</span> {{ ipInfo.city || 'SCANNING...' }} <span class="mx-2 text-slate-600">|</span> <span class="opacity-70">IP:</span> {{ ipInfo.ip || '---.---.---.---' }}
        </div>
      </div>

      <!-- Main Gauge Card (Deep Glass) -->
      <div class="bg-slate-900/60 backdrop-blur-[12px] p-12 rounded-[3.5rem] border border-neon-cyan/10 shadow-[0_0_60px_rgba(0,0,0,0.4)] w-full max-w-xl text-center relative z-10 transition-all duration-500 hover:border-neon-cyan/30 hover:shadow-[0_0_50px_rgba(0,224,255,0.15)] group">
        
        <!-- Decoration Lines -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-30"></div>
        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-30"></div>
        
        <!-- Gauge Area -->
        <div class="mb-8 relative flex justify-center -mt-8">
           <app-gauge 
             [value]="currentSpeed" 
             [max]="currentMax" 
             [label]="state.phase === 'idle' ? 'SYSTEM READY' : state.phase" 
             [unit]="state.phase === 'ping' ? 'ms' : 'Mbps'">
           </app-gauge>
        </div>

        <!-- Real-time Stats Grid -->
        <div class="grid grid-cols-2 gap-4 mb-10">
            <div class="text-left p-5 rounded-3xl bg-slate-900/50 border border-white/5 transition-all duration-300 hover:bg-slate-800/60 hover:border-neon-cyan/20">
                <span class="block text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 pl-1">Latency</span>
                <span class="text-3xl font-display font-medium text-white tracking-tight">{{ state.ping | number:'1.0-0' }}<span class="text-xs font-sans font-bold text-slate-500 ml-1">ms</span></span>
            </div>
            
            <div class="text-right p-5 rounded-3xl bg-slate-900/50 border border-white/5 transition-all duration-300 hover:bg-slate-800/60 hover:border-neon-cyan/20">
                <span class="block text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 pr-1">Bandwidth</span>
                <span class="text-3xl font-display font-medium text-white tracking-tight">{{ state.downloadSpeed | number:'1.1-1' }}<span class="text-xs font-sans font-bold text-slate-500 ml-1">Mbps</span></span>
            </div>
        </div>

        <!-- Action / Progress -->
        <div *ngIf="state.phase === 'idle' || state.phase === 'complete'" class="relative group/btn">
             <!-- Button Glow -->
             <div class="absolute -inset-1 bg-gradient-to-r from-neon-blue to-neon-cyan rounded-2xl blur opacity-20 group-hover/btn:opacity-40 transition duration-500"></div>
             
             <button (click)="startTest()" 
                class="relative w-full py-6 bg-gradient-to-r from-slate-900 to-slate-800 border border-neon-cyan/30 text-white rounded-2xl font-display font-bold text-lg tracking-[0.2em] shadow-2xl transition-all duration-300 overflow-hidden group-hover/btn:border-neon-cyan/50 active:scale-[0.98]">
                
                <!-- Hover Sweep -->
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:animate-scan"></div>
                
                <span class="relative z-10 group-hover/btn:text-neon-cyan transition-colors">
                    {{ state.phase === 'complete' ? 'RESTART DIAGNOSTIC' : 'INITIATE SCAN' }}
                </span>
            </button>
        </div>

        <!-- Progress Bar (Scanning) -->
        <div *ngIf="state.phase !== 'idle' && state.phase !== 'complete'" class="relative pt-2">
             <div class="flex justify-between text-[10px] font-mono text-neon-cyan/70 uppercase tracking-widest mb-3">
                <span class="animate-pulse">Phase: {{ state.phase }}</span>
                <span>{{ state.progress | number:'1.0-0' }}%</span>
             </div>
             
             <div class="w-full h-2 bg-slate-900 rounded-full overflow-hidden relative border border-white/5">
                 <!-- Gradient Bar -->
                 <div class="absolute top-0 left-0 h-full bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-teal transition-all duration-200 ease-out shadow-[0_0_15px_rgba(0,224,255,0.6)]" [style.width.%]="state.progress"></div>
                 
                 <!-- Scanning Light -->
                 <div class="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent blur-sm animate-scan" style="left: -20%;"></div>
             </div>
        </div>

      </div>
      
      <!-- Footer Info -->
      <div class="mt-16 flex items-center gap-6 text-slate-600 text-[10px] font-mono tracking-widest uppercase">
         <div class="flex items-center gap-2 hover:text-neon-cyan transition-colors cursor-pointer group">
             <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:bg-neon-cyan shadow-[0_0_5px_currentColor]"></span>
             <span>{{ ipInfo.org || 'PROVIDER: AUTO' }}</span>
         </div>
         <span class="opacity-30">|</span>
         <span class="hover:text-white transition-colors cursor-pointer">ENCRYPTED: TLS 1.3</span>
      </div>

      <!-- Saving Overlay -->
      <div *ngIf="isSaving" class="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in">
          <div class="w-16 h-16 border-4 border-slate-700 border-t-neon-cyan rounded-full animate-spin mb-6 shadow-[0_0_30px_rgba(0,224,255,0.4)]"></div>
          <h3 class="text-2xl font-display font-bold text-white tracking-widest animate-pulse">PROCESSING RESULTS</h3>
          <p class="text-neon-cyan/70 font-mono text-sm mt-2">Encrypting & Saving to Cloud...</p>
      </div>
    </div>
  `
})
export class HomeComponent implements OnInit, OnDestroy {
  state: TestState = {
    downloadSpeed: 0,
    uploadSpeed: 0,
    ping: 0,
    jitter: 0,
    progress: 0,
    phase: 'idle'
  };

  currentSpeed = 0;
  currentMax = 100;
  ipInfo: any = {};
  isSaving = false;

  private testSub: Subscription | null = null;
  private ipSub: Subscription | null = null;

  constructor(
    private speedService: SpeedTestService,
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
    this.ipSub = this.apiService.getIpInfo().subscribe({
      next: (data) => {
        this.ipInfo = data;
      },
      error: (err) => {
        this.ipInfo = { city: 'Unknown', org: 'Standard' };
      }
    });
  }

  ngOnDestroy() {
    if (this.testSub) this.testSub.unsubscribe();
    if (this.ipSub) this.ipSub.unsubscribe();
  }

  startTest() {
    // Prevent multiple subs
    if (this.testSub) this.testSub.unsubscribe();

    this.testSub = this.speedService.getTestState().subscribe(state => {
      this.state = state;

      // Dynamic Gauge Logic (Dampening)
      if (state.phase === 'download') {
        this.currentSpeed = state.downloadSpeed;
        this.currentMax = Math.max(100, Math.ceil(state.downloadSpeed / 100) * 100);
      } else if (state.phase === 'upload') {
        this.currentSpeed = state.uploadSpeed;
        this.currentMax = Math.max(100, Math.ceil(state.uploadSpeed / 100) * 100);
      } else if (state.phase === 'ping') {
        this.currentSpeed = state.ping;
        this.currentMax = 200;
      } else {
        this.currentSpeed = 0;
      }

      if (state.phase === 'complete') {
        this.isSaving = true; // Trigger loading overlay
        this.saveAndRedirect(state);
      }
    });

    this.speedService.startTest().catch(err => alert('Error starting test'));
  }

  saveAndRedirect(result: TestState) {
    this.apiService.saveTestResult({
      downloadSpeed: result.downloadSpeed,
      uploadSpeed: result.uploadSpeed,
      ping: result.ping,
      jitter: result.jitter,
      isp: this.ipInfo.org || this.ipInfo.asn || 'Unknown ISP',
      city: this.ipInfo.city || 'Unknown City',
      ip: this.ipInfo.ip,
      region: this.ipInfo.region,
      country: this.ipInfo.country_name
    }).subscribe({
      next: (res) => {
        this.router.navigate(['/results'], { state: { result: res } });
      },
      error: (err) => {
        console.error('Failed to save', err);
        this.router.navigate(['/results'], {
          state: {
            result: {
              ...result,
              isp: this.ipInfo.org || 'Offline',
              city: this.ipInfo.city || 'Local'
            }
          }
        });
      }
    });
  }
}
