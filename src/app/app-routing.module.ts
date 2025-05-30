import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRouting } from './app.routing';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { LoginComponent } from './shared/login/login.component';
import { LandingComponent } from './landing/landing.component';
import { LandingPageComponent } from './dashboard/landing-page/landing-page.component';
import { DataKendaraanComponent } from './dashboard/data-kendaraan/data-kendaraan.component';
import { DataLokasiComponent } from './dashboard/data-lokasi/data-lokasi.component';
import { DataPenggunaComponent } from './dashboard/data-pengguna/data-pengguna.component';
import { FormDataPenggunaComponent } from './dashboard/data-pengguna/form-data-pengguna/form-data-pengguna.component';
import { PenentuanRuteComponent } from './dashboard/penentuan-rute/penentuan-rute.component';
import { UnduhJadwalComponent } from './dashboard/unduh-jadwal/unduh-jadwal.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'landing-page', pathMatch: 'full' },
      { path: 'landing-page', component: LandingPageComponent, data: { breadcrumb: 'Home' } },
      { path: 'data-kendaraan', component: DataKendaraanComponent, data: { breadcrumb: 'Data Kendaraan' } },
      { path: 'data-lokasi', component: DataLokasiComponent, data: { breadcrumb: 'Data Lokasi' } },
      {
        path: 'data-pengguna',
        component: DataPenggunaComponent,
        data: { breadcrumb: 'Data Pengguna' },
        children: [
          { path: '', component: DataPenggunaComponent },
          { path: 'create', component: FormDataPenggunaComponent },
        ]
      },
      { path: 'penentuan-rute', component: PenentuanRuteComponent, data: { breadcrumb: 'Penentuan Rute' } },
      { path: 'unduh-jadwal', component: UnduhJadwalComponent, data: { breadcrumb: 'Unduh Jadwal' } }
    ]
  }
];

@NgModule({
  imports: [
    AppRouting,
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
