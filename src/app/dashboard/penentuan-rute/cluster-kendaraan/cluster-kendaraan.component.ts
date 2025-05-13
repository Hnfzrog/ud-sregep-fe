import { Component, OnInit } from '@angular/core';
import { DashboardService, DashboardServiceType, QueryService } from '../../../dashboard.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Page } from '../../../page.interface';

@Component({
  selector: 'app-cluster-kendaraan',
  templateUrl: './cluster-kendaraan.component.html',
  styleUrls: ['./cluster-kendaraan.component.scss']
})
export class ClusterKendaraanComponent implements OnInit {
rows: Array<any> = [];
  columns: Array<any> = [];
  
  second_rows: Array<any> = [];
  second_columns: Array<any> = [];
  data: any;
  selectedDate: Date = new Date(); 

  bsConfig!: Partial<BsDatepickerConfig>;
  
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
  }

  formatDateToYMD(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  getCluster(page:any){

    this.page = page;

    const formattedDate = this.formatDateToYMD(this.selectedDate); // ⬅️ Pakai custom format

    let queryParams = this.querySvc.convert({
      // keyword: page.keyword || '',
      // limit: String(page.limit || 10),
      // offset: String(page.offset || 0),
      tanggal: formattedDate // ⬅️ Kirim ke query
    });

    this.dashboardSvc.getParam(DashboardServiceType.CLUSTERING, queryParams).subscribe((res) => {
      const data = res['data'] || [];

      this.rows = data.map((item: any) => ({
        ...item,
        auth: {
          canDelete: true
        },
        id: item.id,
        koordinat: `${item.latitude}, ${item.longitude}`,
        nilai_ekspektasi: `${item.nilai_ekspektasi} kg`,
        nilai_diangkut: `${item.nilai_diangkut} kg`,
        nilai_ekspektasi_akhir: `${item.nilai_ekspektasi_akhir} kg`,
      }));
    })
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
      { name: 'Bobot kertas diambil', prop: 'nilai_diangkut' },
      { name: 'Sisa bobot kertas diambil', prop: 'nilai_ekspektasi_akhir' },
      { name: 'Kendaraan', prop: 'nama_kendaraan' },
      { name: 'status', prop: 'status' },
    ];

    this.second_columns = [
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
}
