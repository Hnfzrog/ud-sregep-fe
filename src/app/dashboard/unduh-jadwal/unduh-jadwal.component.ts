import { Component, OnInit } from '@angular/core';
import { Page } from '../../page.interface';
import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { DashboardService, QueryService, DashboardServiceType } from 'src/app/dashboard.service';
import { ModalDeleteConfirmComponent } from 'src/app/shared/modal/modal-delete-confirm/modal-delete-confirm.component';
import { FormModalPenentuanRuteComponent } from '../penentuan-rute/form-modal-penentuan-rute/form-modal-penentuan-rute.component';

// import * as XLSX from 'xlsx';
import * as XLSX from 'xlsx';

import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-unduh-jadwal',
  templateUrl: './unduh-jadwal.component.html',
  styleUrls: ['./unduh-jadwal.component.scss']
})
export class UnduhJadwalComponent implements OnInit {
  rows: Array<any> = [];
  columns: Array<any> = [];
  data: any;

  startDate: Date | null = null;
  endDate: Date | null = null;

  bsConfig!: Partial<BsDatepickerConfig>;

  modalRef?: BsModalRef;  

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
    this.getUserData(this.page);
    this.onInitDatepickerByDay();
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
      { name: 'cluster', prop: 'cluster_id' },
      { name: 'Tanggal cluster', prop: 'tanggal_cluster' },
      { name: 'Nama Pengepul', prop: 'nama_pengepul' },
      { name: 'Alamat', prop: 'alamat' },
      { name: 'Kendaraan', prop: 'nama_kendaraan' },
      { name: 'Nilai ekspektasi bobot kertas', prop: 'nilai_ekspektasi_awal' },
      { name: 'Bobot kertas diambil', prop: 'nilai_diangkut' },
      { name: 'Sisa bobot kertas', prop: 'nilai_ekspektasi_akhir' },
    ];
  }

  formatDateToYMD(date: Date | null): string {
    if (!date) return '';
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  
  getUserData(page: any) {
    this.page = page;
  
    const formattedStart = this.formatDateToYMD(this.startDate);
    const formattedEnd = this.formatDateToYMD(this.endDate);
  
    let queryParams = this.querySvc.convert({
      start_date: formattedStart,
      end_date: formattedEnd
    });
  
    this.dashboardSvc.getParam(DashboardServiceType.REPORT_ROUTES, queryParams).subscribe((res) => {
      this.data = res['data'] || [];
  
      this.rows = this.data.map((item: any) => ({
        ...item,
        auth: {
          canDelete: true
        },
        id: item.id,
        koordinat: `${item.latitude}, ${item.longitude}`,
        nilai_ekspektasi_awal: `${item.nilai_ekspektasi_awal} kg`,
        nilai_ekspektasi_akhir: `${item.nilai_ekspektasi_akhir} kg`,
        nilai_diangkut: `${item.nilai_diangkut} kg`,
        tanggal_cluster : this.formatToIndonesianDate(item.tanggal_cluster)
      }));
    });
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

  onValidateClicked(row: any) {
    console.log('Validate clicked:', row);
  }

  formatToIndonesianDate(date: Date | string): string {
    if (!date) return '';
  
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
  
    const d = typeof date === 'string' ? new Date(date) : date;
  
    if (isNaN(d.getTime())) return '';
  
    const day = d.getDate();
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();
  
    return `${day} ${month} ${year}`;
  }
  
  
  // Trigger get data kalau tanggal diganti
  onDateChange() {
    this.getUserData(this.page);
  }

  onDownloadClicked() {
    if (!this.data || this.data.length === 0) {
      this.toastr.warning('Tidak ada data untuk diunduh');
      return;
    }
  
    const exportData = this.data.map((item: any, index: number) => ({
      No: index + 1,
      Cluster: item.cluster_id,
      'Tanggal Cluster': this.formatToIndonesianDate(item.tanggal_cluster),
      'Nama Pengepul': item.nama_pengepul,
      Alamat: item.alamat,
      Kendaraan: item.nama_kendaraan,
      'Nilai Ekspektasi (kg)': `${item.nilai_ekspektasi_awal} kg`,
      'Bobot kertas diambil (kg)': `${item.nilai_diangkut} kg`,
      'Sisa bobot kertas (kg)': `${item.nilai_ekspektasi_akhir} kg`,
    }));
  
    const judul = 'Laporan pengambilan barang UD.SREGEP';
    const periode = `Periode: ${this.formatToIndonesianDate(this.startDate || new Date())} - ${this.formatToIndonesianDate(this.endDate || new Date())}`;
  
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
  
    // ➡️ Tambahkan judul & periode di atas tabel
    XLSX.utils.sheet_add_aoa(worksheet, [
      [judul],
      [periode],
      []
    ], { origin: 'A1' });
  
    // ➡️ Tambahkan data mulai dari baris A4
    XLSX.utils.sheet_add_json(worksheet, exportData, { origin: 'A4', skipHeader: false });
  
    // ➡️ Styling header (baris ke-4)
    const headerCellStyle: any = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '4F81BD' } }, // biru
      alignment: { horizontal: 'center' }
    };
  
    const headers = Object.keys(exportData[0]);
    headers.forEach((_, colIndex) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 3, c: colIndex }); // baris 4 (index 3)
      if (worksheet[cellAddress]) {
        worksheet[cellAddress].s = headerCellStyle;
      }
    });
  
    // ➡️ Auto-width kolom biar rapi
    worksheet['!cols'] = headers.map(header => ({ wch: header.length + 5 }));
  
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Laporan': worksheet },
      SheetNames: ['Laporan']
    };
  
    const excelBuffer: ArrayBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
      cellStyles: true
    });
  
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  
    const fileName = `jadwal_pengangkutan_${this.formatDateToYMD(this.startDate || new Date())}_sd_${this.formatDateToYMD(this.endDate || new Date())}.xlsx`;
    FileSaver.saveAs(blob, fileName);
  }

  
  // onDownloadClicked() {
  //   if (!this.data || this.data.length === 0) {
  //     this.toastr.warning('Tidak ada data untuk diunduh');
  //     return;
  //   }
  
  //   const exportData = this.data.map((item: any, index: number) => ({
  //     No: index + 1,
  //     Cluster: item.cluster_id,
  //     'Tanggal Cluster': this.formatToIndonesianDate(item.tanggal_cluster),
  //     'Nama Pengepul': item.nama_pengepul,
  //     Alamat: item.alamat,
  //     Kendaraan: item.nama_kendaraan,
  //     'Nilai Ekspektasi (kg)': `${item.nilai_ekspektasi_awal} kg`
  //   }));
  
  //   // Judul & periode
  //   const judul = 'Laporan pengambilan barang UD.SREGEP';
  //   const periode = `Tanggal: ${this.formatToIndonesianDate(this.startDate || new Date())} - ${this.formatToIndonesianDate(this.endDate || new Date())}`;
  
  //   // Generate sheet kosong dulu
  //   const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
  
  //   // Tambahkan judul & periode
  //   XLSX.utils.sheet_add_aoa(worksheet, [
  //     [judul],
  //     [periode],
  //     [] // baris kosong
  //   ], { origin: 'A1' });
  
  //   // Tambahkan data tabel dari baris ke-4
  //   XLSX.utils.sheet_add_json(worksheet, exportData, { origin: 'A4', skipHeader: false });
  
  //   // Buat file excel
  //   const workbook: XLSX.WorkBook = {
  //     Sheets: { data: worksheet },
  //     SheetNames: ['data']
  //   };
  
  //   const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  //   const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  
  //   // Nama file export
  //   const fileName = `jadwal_pengangkutan_${this.formatDateToYMD(this.startDate || new Date())}_sd_${this.formatDateToYMD(this.endDate || new Date())}.xlsx`;
  //   FileSaver.saveAs(blob, fileName);
  // }  
  
}
