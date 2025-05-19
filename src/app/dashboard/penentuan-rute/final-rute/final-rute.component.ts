import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { DashboardService, DashboardServiceType, QueryService } from '../../../dashboard.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Page } from '../../../page.interface';

@Component({
  selector: 'app-final-rute',
  templateUrl: './final-rute.component.html',
  styleUrls: ['./final-rute.component.scss']
})
export class FinalRuteComponent implements OnInit {

  rows: Array<any> = [];
  columns: Array<any> = [];
  
  data: any;
  selectedDate: Date = new Date(); 

  bsConfig!: Partial<BsDatepickerConfig>;

  isOptimasi: boolean = false;
  
  constructor(
    private route: Router,
    private dashboardSvc: DashboardService,
    private querySvc: QueryService,
    private modalSvc: BsModalService,
    private toastr: ToastrService,
    private localeSvc: BsLocaleService,
    private datePipe: DatePipe
  ) {
    this.localeSvc.use('id');
   }

  ngOnInit(): void {
    this.renderTable();
    this.onInitDatepickerByDay();
    this.getCluster(this.page);
  }

  formatDateToYMD(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  getCluster(page: any, isOptimasi: boolean = this.isOptimasi) {
    this.page = page;
  
    const formattedDate = this.formatDateToYMD(this.selectedDate);
    let queryParams = this.querySvc.convert({
      tanggal: formattedDate,
      optimize: isOptimasi
    });
  
    this.dashboardSvc.getParam(DashboardServiceType.CLUSTERING_GENERATE_ROUTE, queryParams)
      .subscribe((res) => {
        const data = res['data'] || {};
        const hasilRoutes = data['hasil_routes'] || [];
  
        const formattedIndoDate = this.formatToIndonesianDate(data.tanggal);

        this.isOptimasi = data.is_optimized
  
        this.rows = hasilRoutes.map((cluster: any) => ({
          clusterId: cluster.cluster_id,
          tanggal: formattedIndoDate,
          totalJarak: cluster.total_jarak_cluster_km,
          totalWaktu: cluster.total_waktu_cluster,
          kendaraan: cluster.routes[0]?.nama_kendaraan || '-',
          rute: cluster.rute,
          routes: cluster.routes.map((r: any, index: number) => ({
            no: index + 1,
            nama_pengepul: r.nama_pengepul,
            alamat: r.alamat,
            total_waktu: r.total_waktu,
            nilai_diangkut: r.nilai_diangkut + ' kg',
            nilai_akhir: r.nilai_akhir + ' kg',
            nilai_awal: r.nilai_awal + ' kg',
          }))
        }));
      });
  }
  
  formatToIndonesianDate(date: string | Date): string {
    const dateObj = new Date(date); // ⬅️ Convert string ke Date
  
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
  
    const day = dateObj.getDate();
    const month = monthNames[dateObj.getMonth()];
    const year = dateObj.getFullYear();
  
    return `${day} ${month} ${year}`;
  }
  

  private onInitDatepickerByDay() {
    this.bsConfig = {
      dateInputFormat: 'DD MMMM YYYY',
      showTodayButton: true,
      showClearButton: true,
      isAnimated: true,
      containerClass: 'theme-dark-blue'
    };
  }

  renderTable() {
    this.columns = [
      { name: 'No', prop: 'number' },
      { name: 'Nama Pengepul', prop: 'nama_pengepul' },
      { name: 'Alamat', prop: 'alamat' },
      { name: 'Nilai ekspektasi bobot kertas', prop: 'nilai_ekspektasi' },
      { name: 'Kendaraan', prop: 'kendaraan' },
      { name: 'Total waktu', prop: 'kendaraan' }
    ]
  }

  page: Page = {
      size: 10,
      page: 0,
      totalElements: 3,
      totalPages: 1,
      keyword: ''
    };
  
    onPageChanged(page: Page) {
      this.page = page;
    }
  
    onSearchChanged(page: any) {
      this.page = page;
    }

    onDateChange(date: Date) {
      this.selectedDate = date;
      this.getCluster(this.page);
    }

    onToggleOptimasi(event: any) {
      this.isOptimasi = event
      this.getCluster(this.page, this.isOptimasi);
    }
    
    
}
