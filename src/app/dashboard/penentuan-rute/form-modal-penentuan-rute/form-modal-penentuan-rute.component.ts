import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DashboardService, DashboardServiceType, QueryService } from '../../../dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Page } from '../../../page.interface';

@Component({
  selector: 'app-form-modal-penentuan-rute',
  templateUrl: './form-modal-penentuan-rute.component.html',
  styleUrls: ['./form-modal-penentuan-rute.component.scss']
})
export class FormModalPenentuanRuteComponent implements OnInit {
  form!: FormGroup;
  kendaraanData: any;

  rows: Array<any> = [];
  columns: Array<any> = [];

  bsConfig!: Partial<BsDatepickerConfig>;
  selectedDate: any;

  page: Page = {
    size: 10,
    page: 0,
    totalElements: 3,
    totalPages: 1,
    keyword: ''
  };

  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private dashboardSvc: DashboardService,
    private toastr: ToastrService,
    private localeSvc: BsLocaleService,
    private querySvc: QueryService
  ) {
    this.localeSvc.use('id');
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      tanggal_cluster: [null],
      pengepul_list: [[]]
    });

    this.renderTable();
    this.getLocations(this.page);
    this.onInitDatepickerByDay();
  }

  renderTable() {
    this.columns = [
      { name: 'No', prop: 'number' },
      { name: 'Nama Pengepul', prop: 'nama_pengepul' },
      { name: 'Alamat', prop: 'alamat' },
      { name: 'Titik Koordinat', prop: 'koordinat' },
      { name: 'Nilai Ekspektasi Pelanggan', prop: 'nilai_ekspektasi' },
      { name: 'Status pengambilan', prop: 'status_diambil' },
    ];
  }

  onInitDatepickerByDay() {
    this.bsConfig = {
      dateInputFormat: 'DD MMMM YYYY',
      showTodayButton: true,
      showClearButton: true,
      isAnimated: true,
      containerClass: 'theme-dark-blue'
    };
  }

  getLocations(page: any) {
    this.page = page;

    let queryParams = this.querySvc.convert({
      keyword: page.keyword || '',
      limit: String(page.limit || 10),
      offset: String(page.offset || 0)
    });

    this.dashboardSvc.getParam(DashboardServiceType.LOCATION, queryParams).subscribe((res) => {
      const data = res['data'] || [];

      this.rows = data.map((item: any, index: number) => ({
        ...item,
        number: index + 1 + page.offset,
        auth: {
          canUpdate: true,
          canDelete: true
        },
        koordinat: `${item.latitude}, ${item.longitude}`,
        nilai_ekspektasi: `${item.nilai_ekspektasi} kg`,
        id: item.id
      }));
    });
  }

  onSelectedRowsChange(selectedRows: any[]) {
    const pengepul_list = selectedRows.map(row => ({
      location_id: row.id,
      nama_pengepul: row.nama_pengepul
    }));

    this.form.patchValue({ pengepul_list });
  }

  onDateChange(date: Date) {
    this.selectedDate = date;
    this.form.patchValue({ tanggal_cluster: date });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
  
    const formRaw = this.form.value;
    const pengepulList = formRaw.pengepul_list || [];
  
    const payload = {
      tanggal_cluster: this.formatDate(formRaw.tanggal_cluster),
      pengepul_list: pengepulList
    };
  
    this.dashboardSvc.create(DashboardServiceType.DAILY_PENGEPUL, payload).subscribe({
      next: (res) => {
        this.toastr.success(res?.message, 'Sukses');
        this.bsModalRef.hide();
      },
      error: (err) => {
        const msg = err?.error?.detail || 'Gagal menyimpan data';
        this.toastr.error(msg);
      }
    });
  }
  

  formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  }

  onClose(): void {
    this.bsModalRef.hide();
  }

  onPageChanged(page: Page) {
    this.page = page;
    this.getLocations(page);
  }

  onSearchChanged(page: any) {
    this.page = page;
    this.getLocations(page);
  }
}
