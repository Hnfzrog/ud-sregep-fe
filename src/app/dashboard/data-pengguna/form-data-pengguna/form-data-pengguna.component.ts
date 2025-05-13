import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { DashboardService, DashboardServiceType } from '../../../dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-form-data-pengguna',
  templateUrl: './form-data-pengguna.component.html',
  styleUrls: ['./form-data-pengguna.component.scss']
})
export class FormDataPenggunaComponent implements OnInit {
  form!: FormGroup;
  positions = ['admin', 'moderator'];
  genders = ['Laki-laki', 'Perempuan'];
  bsConfig!: Partial<BsDatepickerConfig>;
  id: any;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private dashboardSvc: DashboardService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private localeSvc: BsLocaleService
  ) {
    this.localeSvc.use('id');
    this.activatedRoute.queryParams.subscribe(params => {
      if (params) {
        this.id = params['id'];
        console.log(this.id);
      }
    });
  }

  ngOnInit(): void {
    this.onInitDatepickerByDay();
    this.initForm();

    if (this.id) {
      this.getDetailUser();
    }
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

  private initForm() {
    this.form = this.fb.group({
      nama: ['', Validators.required],
      posisi: ['', Validators.required],
      username: ['', Validators.required],
      tanggal_lahir: [null],
      jenis_kelamin: [''],
      alamat: [''],
      alamat_domisili: [''],
      email: ['', [Validators.email]],
      nomor_hp: [''],
      password: ['', Validators.required]
    });
  }

  getDetailUser() {
    const param = `/${this.id}`;
    this.dashboardSvc.detail(DashboardServiceType.GET_ALL_USER, param).subscribe({
      next: (res) => {
        const data = res?.data;
        if (data) {
          this.form.patchValue({
            nama: data.nama || '',
            posisi: data.posisi || '',
            username: data.username || '',
            tanggal_lahir: data.tanggal_lahir ? new Date(data.tanggal_lahir) : null,
            jenis_kelamin: data.jenis_kelamin || '',
            alamat: data.alamat || '',
            alamat_domisili: data.alamat_domisili || '',
            email: data.email || '',
            nomor_hp: data.nomor_hp || '',
            password: ''
          });
        }
      },
      error: (err) => {
        const msg = err?.error?.message || 'Gagal mengambil data user';
        this.toastr.error(msg);
      }
    });
  }

  submitForm() {
    if (this.form.invalid) {
      this.toastr.warning('Form tidak valid');
      return;
    }

    const payload = {
      ...this.form.value,
      tanggal_lahir: this.form.value.tanggal_lahir
        ? new Date(this.form.value.tanggal_lahir).toISOString().split('T')[0]
        : null
    };

    if (this.id) {
      this.dashboardSvc.update(DashboardServiceType.GET_ALL_USER, `/${this.id}`,payload).subscribe({
        next: (res) => {
          this.toastr.success(res?.message, 'Sukses');
          this.goBack();
        },
        error: (err) => {        
          const msg = err?.error?.detail || 'Gagal menyimpan data';
          this.toastr.error(msg);
        }
      });
    } else {
      this.dashboardSvc.create(DashboardServiceType.USER_REGISTER, payload).subscribe({
        next: (res) => {
          this.toastr.success(res?.message, 'Sukses');
          this.goBack();
        },
        error: (err) => {        
          const msg = err?.error?.detail || 'Gagal menyimpan data';
          this.toastr.error(msg);
        }
      });
    }

  }

  goBack() {
    this.location.back();
  }
}
