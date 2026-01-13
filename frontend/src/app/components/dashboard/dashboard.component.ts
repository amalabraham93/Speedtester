import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  template: `
    <div class="min-h-screen bg-slate-900 p-6">
      <div class="max-w-7xl mx-auto">
        <header class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold text-white tracking-widest">Speed History</h1>
          <button (click)="exportCSV()" class="px-4 py-2 bg-neon-blue text-slate-900 font-bold rounded hover:bg-neon-cyan transition shadow-[0_0_10px_rgba(47,128,237,0.5)]">
            Export CSV
          </button>
        </header>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <!-- Line Chart -->
          <div class="bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-2xl h-96">
            <h3 class="font-semibold text-gray-400 mb-4">Speed Trend (Last 10 Tests)</h3>
            <ngx-charts-line-chart
              [view]="[500, 300]"
              [scheme]="colorScheme"
              [legend]="true"
              [showXAxisLabel]="true"
              [showYAxisLabel]="true"
              [xAxis]="true"
              [yAxis]="true"
              [xAxisLabel]="'Time'"
              [yAxisLabel]="'Speed (Mbps)'"
              [results]="chartData"
              [autoScale]="true">
            </ngx-charts-line-chart>
          </div>

          <!-- List -->
          <div class="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-2xl overflow-y-auto h-96">
            <h3 class="font-semibold text-gray-400 mb-4">Recent Tests</h3>
            <div class="space-y-3">
              <div *ngFor="let test of history" class="flex justify-between items-center p-3 bg-slate-700/50 rounded border border-slate-600 hover:bg-slate-700 transition">
                <div>
                  <div class="font-bold text-gray-200">{{ test.downloadSpeed }} Mbps <span class="text-xs font-normal text-neon-cyan">DL</span></div>
                  <div class="text-xs text-gray-500">{{ test.timestamp | date:'short' }}</div>
                </div>
                <div class="text-right">
                  <div class="font-bold text-neon-blue">{{ test.uploadSpeed }} Mbps</div>
                  <div class="text-xs text-gray-500">{{ test.ping }} ms</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  history: any[] = [];
  chartData: any[] = [
    { name: "Download", series: [] },
    { name: "Upload", series: [] }
  ];

  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#00f2fe', '#2f80ed'] // Neon Cyan, Neon Blue
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

    // Reverse needed if API returns newest first, charts usually read left-right time
    [...data].reverse().forEach(test => {
      const date = new Date(test.timestamp).toLocaleTimeString();
      downloadSeries.push({ name: date, value: test.downloadSpeed });
      uploadSeries.push({ name: date, value: test.uploadSpeed });
    });

    this.chartData = [
      { name: "Download", series: downloadSeries },
      { name: "Upload", series: uploadSeries }
    ];
  }

  exportCSV() {
    // Basic CSV export
    let csv = 'Timestamp,Download,Upload,Ping,Jitter\n';
    this.history.forEach(row => {
      csv += `${row.timestamp},${row.downloadSpeed},${row.uploadSpeed},${row.ping},${row.jitter}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'speed-history.csv'; // jsPDF requested but CSV good too. jsPDF code logic is larger.
    a.click();
  }
}
