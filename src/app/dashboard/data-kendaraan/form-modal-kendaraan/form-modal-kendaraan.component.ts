import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DashboardService, DashboardServiceType } from '../../../dashboard.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-form-modal-kendaraan',
  templateUrl: './form-modal-kendaraan.component.html',
  styleUrls: ['./form-modal-kendaraan.component.scss']
})
export class FormModalKendaraanComponent implements OnInit {
  form!: FormGroup;
  kendaraanData: any;

  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private dashboardSvc: DashboardService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {

    if (this.kendaraanData) {
      this.getVehicles();
    }

    this.form = this.fb.group({
      nama_kendaraan: ['', Validators.required],
      kapasitas_kendaraan: [null, [Validators.required, Validators.min(1)]],
    });
  }

  getVehicles(){
    this.dashboardSvc.detail(DashboardServiceType.VEHICLES, `/${this.kendaraanData?.id}`).subscribe((res) => {
      const data = res?.data
      
      this.form.patchValue({
        nama_kendaraan: data?.nama_kendaraan,
        kapasitas_kendaraan: data?.kapasitas_kendaraan
      })
    })
  }

  onSubmit(): void {

    const raw = this.form.value;
    const formData = new FormData();
  
    for (const key in raw) {
      if (raw[key] !== null && raw[key] !== undefined) {
        formData.append(key, raw[key]);
      }
    }

    if (this.kendaraanData) {
      this.dashboardSvc.update(DashboardServiceType.VEHICLES,`/${this.kendaraanData?.id}`, formData).subscribe({
        next: (res) => {
          this.toastr.success(res?.message, 'Sukses');
          this.bsModalRef.hide();
        },
        error: (err) => {
          const msg = err?.error?.detail || 'Gagal menyimpan data';
          this.toastr.error(msg);
        }
      })
    } else {
      this.dashboardSvc.create(DashboardServiceType.VEHICLES, formData).subscribe({
        next: (res) => {
          this.toastr.success(res?.message, 'Sukses');
          this.bsModalRef.hide();
        },
        error: (err) => {
          const msg = err?.error?.detail || 'Gagal menyimpan data';
          this.toastr.error(msg);
        }
      })
    }
  }

  onClose(): void {
    this.bsModalRef.hide();
  }
}
