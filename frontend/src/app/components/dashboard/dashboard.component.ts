import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { BackgroundComponent } from '../background/background.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, BackgroundComponent, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-900 p-6 relative overflow-hidden">
       <app-background></app-background>
       
      <div class="max-w-7xl mx-auto relative z-10">
        <!-- Header -->
        <header class="flex justify-between items-center mb-10">
          <div>
              <div class="flex items-center gap-3 mb-1">
                 <a routerLink="/" class="flex items-center gap-2 group cursor-pointer hover:opacity-80 transition-opacity">
                    <svg class="w-5 h-5 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                    <span class="text-neon-cyan font-mono text-xs uppercase tracking-widest">Back to Test</span>
                 </a>
              </div>
              <h1 class="text-4xl font-display font-bold text-white tracking-widest drop-shadow-md">SPEED HISTORY</h1>
          </div>
          
          <button (click)="exportCSV()" class="px-6 py-3 bg-slate-800 border border-neon-blue/30 text-neon-blue font-bold rounded-xl hover:bg-neon-blue hover:text-white transition-all shadow-[0_0_15px_rgba(0,114,255,0.2)] hover:shadow-[0_0_25px_rgba(0,114,255,0.5)]">
            EXPORT DATA
          </button>
        </header>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <!-- Line Chart -->
          <div class="glass-card p-6 rounded-3xl shadow-2xl h-[28rem] flex flex-col">
            <h3 class="font-display font-bold text-slate-300 mb-6 tracking-wide border-b border-white/5 pb-2">PERFORMANCE TREND</h3>
            <div class="flex-grow">
                <ngx-charts-line-chart
                [view]="[500, 300]"
                [scheme]="colorScheme"
                [legend]="true"
                [showXAxisLabel]="false"
                [showYAxisLabel]="true"
                [xAxis]="true"
                [yAxis]="true"
                [yAxisLabel]="'Mbps'"
                [results]="chartData"
                [autoScale]="true"
                [timeline]="true"
                [gradient]="true">
                </ngx-charts-line-chart>
            </div>
          </div>

          <!-- List -->
          <div class="glass-card p-6 rounded-3xl shadow-2xl h-[28rem] flex flex-col">
            <h3 class="font-display font-bold text-slate-300 mb-6 tracking-wide border-b border-white/5 pb-2">RECENT CHECKS</h3>
            <div class="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-grow">
              <div *ngFor="let test of history" class="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition group">
                <div>
                  <div class="font-display font-bold text-white text-lg group-hover:text-neon-cyan transition-colors">{{ test.downloadSpeed }} <span class="text-sm font-sans font-normal text-slate-500">Mbps</span></div>
                  <div class="text-[10px] font-mono text-slate-500 uppercase">{{ test.timestamp | date:'medium' }}</div>
                </div>
                <div class="text-right">
                  <div class="font-bold text-neon-blue">{{ test.uploadSpeed }} <span class="text-xs text-slate-600 font-normal">UP</span></div>
                  <div class="text-xs text-neon-purple font-mono">{{ test.ping }} ms</div>
                </div>
              </div>
              
              <div *ngIf="history.length === 0" class="text-center text-slate-500 py-10">
                  No tests recorded yet.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Custom Scrollbar */
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.02);
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.2);
    }
  `]
})
export class DashboardComponent implements OnInit {
  history: any[] = [];
  chartData: any[] = [];

  colorScheme: Color = {
    name: 'neon',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#00E0FF', '#0072FF'] // Neon Cyan, Blue
  };

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getHistory().subscribe({
      next: (data) => {
        this.history = data;
        this.processChartData(data);
      },
      error: (e) => console.error(e)
    });
  }

  processChartData(data: any[]) {
    const downloadSeries: { name: string, value: number }[] = [];
    const uploadSeries: { name: string, value: number }[] = [];

    // Take last 10 tests for chart cleanness
    const recentData = [...data].reverse().slice(0, 20).reverse();

    recentData.forEach(test => {
      const date = new Date(test.timestamp);
      // Format simpler time string
      const label = date.getHours() + ':' + date.getMinutes();

      downloadSeries.push({ name: label, value: test.downloadSpeed });
      uploadSeries.push({ name: label, value: test.uploadSpeed });
    });

    this.chartData = [
      { name: "Download", series: downloadSeries },
      { name: "Upload", series: uploadSeries }
    ];
  }

  exportCSV() {
    let csv = 'Timestamp,Download,Upload,Ping,Jitter\n';
    this.history.forEach(row => {
      csv += `${row.timestamp},${row.downloadSpeed},${row.uploadSpeed},${row.ping},${row.jitter}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'speedtime_history.csv';
    a.click();
  }
}
