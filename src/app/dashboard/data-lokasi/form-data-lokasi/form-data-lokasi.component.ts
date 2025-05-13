import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';

// @ts-ignore: leaflet-control-geocoder gak ada typing-nya
import 'leaflet-control-geocoder';
import { DashboardService, DashboardServiceType } from '../../../dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/marker-icon-2x.png',
  iconUrl: 'assets/marker-icon.png',
  shadowUrl: 'assets/marker-shadow.png'
});

@Component({
  selector: 'app-form-data-lokasi',
  templateUrl: './form-data-lokasi.component.html',
  styleUrls: ['./form-data-lokasi.component.scss']
})
export class FormDataLokasiComponent implements OnInit {
  form!: FormGroup;
  private map: any;
  private marker: any;
  id: any;

  constructor(
    private fb: FormBuilder,
    private dashboardSvc: DashboardService,
    private toastr: ToastrService,
    private location: Location,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params) {
        this.id = params['id'];
      }
    })
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      nama_pengepul: ['', Validators.required],
      latitude: [null, Validators.required],
      longitude: [null, Validators.required],
      nilai_ekspektasi: [null],
      alamat: ['']
    });

    this.initMap();

    if (this.id) {
     this.getUserdata(); 
    }
  }

  getUserdata() {
    const param = `/${this.id}`;
  
    this.dashboardSvc.detail(DashboardServiceType.LOCATION, param).subscribe((res) => {
      if (res?.data) {
        this.form.patchValue({
          nama_pengepul: res?.data.nama_pengepul,
          latitude: res?.data.latitude,
          longitude: res?.data.longitude,
          nilai_ekspektasi: res?.data.nilai_ekspektasi,
          alamat: res?.data.alamat
        });
  
        if (res?.data.latitude && res?.data.longitude) {
          this.setMarker(res?.data.latitude, res?.data.longitude);
        }
      }
    });
  }
  

  initMap() {
    this.map = L.map('map').setView([-6.2, 106.8], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      this.setMarker(lat, lng);
      // this.getAddressFromCoordinates(lat, lng); // Komen dulu bro
    });

    // @ts-ignore
    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: false
    })
      .on('markgeocode', (e: any) => {
        const center = e.geocode.center;
        this.map.setView(center, 18);

        L.popup()
          .setLatLng(center)
          .setContent('Klik pada lokasi di peta untuk memilih titik yang presisi.')
          .openOn(this.map);
      })
      .addTo(this.map);
  }

  setMarker(lat: number, lng: number) {
    this.form.patchValue({
      latitude: lat,
      longitude: lng
    });

    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng]).addTo(this.map);
    }
  }

  // getAddressFromCoordinates(lat: number, lng: number) {
  //   const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
  //   fetch(url, {
  //     headers: {
  //       'Accept': 'application/json',
  //       'User-Agent': 'your-app-name/1.0'
  //     }
  //   })
  //     .then(response => response.json())
  //     .then(data => {
  //       this.form.patchValue({ alamat: data.display_name || '' });
  //       console.log('Alamat ditemukan:', data.display_name);
  //     })
  //     .catch(error => console.error('Gagal mengambil alamat:', error));
  // }

  submitForm() {
    if (this.form.invalid) {
      this.toastr.warning('Form tidak valid');
      return;
    }
  
    const raw = this.form.value;
    const formData = new FormData();
  
    for (const key in raw) {
      if (raw[key] !== null && raw[key] !== undefined) {
        formData.append(key, raw[key]);
      }
    }
  
    if (this.id) {
      this.dashboardSvc.update(DashboardServiceType.LOCATION, `/${this.id}`, formData).subscribe({
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
      this.dashboardSvc.create(DashboardServiceType.LOCATION, formData).subscribe({
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
