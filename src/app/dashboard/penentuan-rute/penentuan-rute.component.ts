import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService, DashboardServiceType, QueryService } from '../../dashboard.service';
import { Page } from '../../page.interface';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalDeleteConfirmComponent } from '../../shared/modal/modal-delete-confirm/modal-delete-confirm.component';
import { ToastrService } from 'ngx-toastr';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { FormModalPenentuanRuteComponent } from './form-modal-penentuan-rute/form-modal-penentuan-rute.component';
import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-penentuan-rute',
  templateUrl: './penentuan-rute.component.html',
  styleUrls: ['./penentuan-rute.component.scss']
})
export class PenentuanRuteComponent implements OnInit {
  rows: Array<any> = [];
  columns: Array<any> = [];
  data: any;
  selectedDate: Date = new Date(); 

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
      { name: 'Nama Pengepul', prop: 'nama_pengepul' },
      { name: 'Alamat', prop: 'alamat' },
      { name: 'Titik Koordinat', prop: 'koordinat' },
      { name: 'Nilai ekspektasi bobot kertas', prop: 'nilai_ekspektasi' },
      { name: 'Sudut polar', prop: 'sudut_polar' },
    ];
  }

  formatDateToYMD(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  getUserData(page: any) {
    this.page = page;

    const formattedDate = this.formatDateToYMD(this.selectedDate); // ⬅️ Pakai custom format

    let queryParams = this.querySvc.convert({
      keyword: page.keyword || '',
      limit: String(page.limit || 10),
      offset: String(page.offset || 0),
      tanggal: formattedDate // ⬅️ Kirim ke query
    });

    this.dashboardSvc.getParam(DashboardServiceType.DAILY_PENGEPUL, queryParams).subscribe((res) => {
      const data = res['data'] || [];

      this.rows = data.map((item: any) => ({
        ...item,
        auth: {
          canUpdate: true,
          canDelete: true
        },
        id: item.id,
        koordinat: `${item.latitude}, ${item.longitude}`,
        nilai_ekspektasi: `${item.nilai_ekspektasi} kg`,
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

  onDetailClicked(row: any) {
    this.route.navigate([this.route.url + '/update'], { queryParams: { id: row.id } });
  }

  async onDeleteClicked(row: any) {

    console.log(this.selectedDate);
    
    const modal = this.modalSvc.show(ModalDeleteConfirmComponent);
    (<ModalDeleteConfirmComponent>modal.content).showConfirmationModal({
      message: `Apakah Anda yakin ingin menghapus ${row.nama_pengepul} pada pengepul harian tanggal ${this.formatToIndonesianDate(this.selectedDate)} ?`,
    });

    const result = await new Promise<boolean>((resolve) => {
      (<ModalDeleteConfirmComponent>modal.content).onClose.subscribe((res) => {
        resolve(res);
      });
    });

    if (result) {
      this.doDelete(row?.id);
    }
  }

  onValidateClicked(row: any) {
    console.log('Validate clicked:', row);
  }

  formatToIndonesianDate(date: Date): string {
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
  
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
  
    return `${day} ${month} ${year}`;
  }
  

  onEditClicked(row: any) {
    // optional future feature
  }

  onRowSelected(row: any) {
    // optional feature
  }

  doDelete(id: any) {
    const params = `/${id}`;
    this.dashboardSvc.deleteV2(DashboardServiceType.DAILY_PENGEPUL, id).subscribe({
      next: (res) => {
        this.toastr.success(res?.message, 'Sukses');
        this.getUserData(this.page);
      },
      error: (err) => {
        const msg = err?.error?.detail || 'Gagal menghapus data';
        this.toastr.error(msg);
      }
    });
  }

  async onDeleteAllClicked() {
    const modal = this.modalSvc.show(ModalDeleteConfirmComponent);
    (<ModalDeleteConfirmComponent>modal.content).showConfirmationModal({
      message: "Apakah Anda yakin ingin menghapus data pada tanggal " + this.formatToIndonesianDate(this.selectedDate) + "?",
    });

    const result = await new Promise<boolean>((resolve) => {
      (<ModalDeleteConfirmComponent>modal.content).onClose.subscribe((res) => {
        resolve(res);
      });
    });

    if (result) {
      this.deleteAll();
    }
  }

  deleteAll(){
    if (!this.selectedDate) return;
  
    const formattedDate = this.formatDateToYMD(this.selectedDate);

    const params = new HttpParams().set('tanggal', formattedDate);

    this.dashboardSvc.deleteGpt(DashboardServiceType.DAILY_PENGEPUL_BY_DATE, params).subscribe({
      next: (res) => {
        this.toastr.success(res?.message, 'Berhasil');
        this.getUserData(this.page);
      },
      error: (err) => {
        const msg = err?.error?.detail || 'Gagal menghapus semua data';
        this.toastr.error(msg);
      }
    });
  }

  onAddClicked() {
    this.modalRef = this.modalSvc.show(FormModalPenentuanRuteComponent, {
      class: 'modal-lg',
      ignoreBackdropClick: true,
    });
  
    this.modalRef.onHidden?.subscribe(() => {
      this.getUserData(this.page);
    });
  }
  
  formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  }

  // Trigger get data kalau tanggal diganti
  onDateChange(date: Date) {
    this.selectedDate = date;
    this.getUserData(this.page);
  }
}
