import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SpeedTestService, TestState } from '../../services/speed-test.service';
import { GaugeComponent } from '../gauge/gauge.component';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, GaugeComponent],
  template: `
    <div class="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <!-- Background Elements -->
      <div class="absolute -bottom-40 left-0 right-0 h-96 bg-neon-blue opacity-20 blur-3xl rounded-full"></div>
      <div class="absolute top-10 left-10 w-24 h-24 bg-neon-cyan opacity-10 blur-xl rounded-full animate-pulse"></div>

      <!-- Header -->
      <div class="flex justify-between w-full max-w-4xl mb-8 items-center z-10">
        <div class="flex items-center gap-2">
           <svg class="w-6 h-6 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
           <span class="text-white font-bold tracking-widest text-lg">SPEEDTRACK</span>
        </div>
        <div class="px-4 py-1 rounded-full border border-slate-700 bg-slate-800 text-xs text-gray-400">
           {{ ipInfo.city || 'Detecting...' }}
        </div>
      </div>

      <!-- Main Card -->
      <div class="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-3xl shadow-2xl w-full max-w-md text-center relative z-10">
        
        <!-- Gauge Area -->
        <div class="mb-4 relative flex justify-center">
           <app-gauge 
             [value]="currentSpeed" 
             [max]="currentMax" 
             [label]="state.phase === 'idle' ? 'READY' : state.phase" 
             [unit]="state.phase === 'ping' ? 'ms' : 'Mbps'">
           </app-gauge>
        </div>

        <!-- Real-time Stats -->
        <div class="flex justify-between items-center mb-10 px-4">
            <div class="text-left">
                <span class="block text-xs text-slate-400 mb-1">Ping</span>
                <span class="text-2xl font-bold text-white">{{ state.ping | number:'1.0-0' }}<span class="text-sm font-normal text-slate-500 ml-1">ms</span></span>
            </div>
            
            <div class="text-right">
                <span class="block text-xs text-slate-400 mb-1">Download</span>
                <span class="text-2xl font-bold text-white">{{ state.downloadSpeed | number:'1.1-1' }}<span class="text-sm font-normal text-slate-500 ml-1">Mbps</span></span>
            </div>
        </div>

        <!-- Action / Progress -->
        <div *ngIf="state.phase === 'idle' || state.phase === 'complete'">
             <button (click)="startTest()" 
                class="w-full py-4 bg-gradient-to-r from-neon-blue to-neon-cyan text-slate-900 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(47,128,237,0.5)] hover:shadow-[0_0_30px_rgba(0,242,254,0.6)] transition-all duration-300 transform hover:-translate-y-1">
            {{ state.phase === 'complete' ? 'TEST AGAIN' : 'START TEST' }}
            </button>
        </div>

        <!-- Progress Bar when running -->
        <div *ngIf="state.phase !== 'idle' && state.phase !== 'complete'" class="w-full h-1 bg-slate-700 rounded-full mt-4 overflow-hidden relative">
            <div class="absolute top-0 left-0 h-full bg-gradient-to-r from-neon-blue to-neon-cyan transition-all duration-200" [style.width.%]="state.progress"></div>
            <div class="absolute top-0 left-0 h-full w-full bg-white opacity-20 animate-pulse"></div>
        </div>
        
        <div *ngIf="state.phase !== 'idle' && state.phase !== 'complete'" class="mt-4 text-neon-cyan text-sm animate-pulse tracking-widest uppercase">
            {{ state.phase }}...
        </div>

      </div>
      
      <!-- Footer Info -->
      <div class="mt-8 text-slate-500 text-xs text-center">
         Server: {{ ipInfo.org || 'Auto-Select' }} • {{ ipInfo.ip || 'Checking IP...' }}
      </div>
    </div>
  `
})
export class HomeComponent implements OnInit {
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

  constructor(
    private speedService: SpeedTestService,
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
    this.apiService.getIpInfo().subscribe({
      next: (data) => {
        this.ipInfo = data;
        console.log('IP Info:', data);
      },
      error: (err) => {
        // Suppress error log for cleaner console
        // console.error('Failed to get IP info', err);
        this.ipInfo = { city: 'Unknown', org: 'Standard' };
      }
    });
  }

  startTest() {
    this.speedService.getTestState().subscribe(state => {
      this.state = state;

      // Dynamic Gauge Logic
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
        this.saveAndRedirect(state);
      }
    });

    this.speedService.startTest().catch(err => alert('Error starting test'));
  }

  getPhaseColor() {
    if (this.state.phase === 'download') return '#10b981'; // Green
    if (this.state.phase === 'upload') return '#3b82f6'; // Blue
    return '#3F51B5';
  }

  saveAndRedirect(result: TestState) {
    // Save to backend
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
        // Pass data via state or query params ideally, for now just navigate
        // In real app, use a shared service or resolver
        this.router.navigate(['/results'], { state: { result: res } });
      },
      error: (err) => {
        console.error('Failed to save', err);
        // Navigate anyway?
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
