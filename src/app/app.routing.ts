import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './shared/login/login.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { LandingComponent } from './landing/landing.component';
import { DataKendaraanComponent } from './dashboard/data-kendaraan/data-kendaraan.component';
import { DataLokasiComponent } from './dashboard/data-lokasi/data-lokasi.component';
import { DataPenggunaComponent } from './dashboard/data-pengguna/data-pengguna.component';
import { PenentuanRuteComponent } from './dashboard/penentuan-rute/penentuan-rute.component';
import { UnduhJadwalComponent } from './dashboard/unduh-jadwal/unduh-jadwal.component';
import { LandingPageComponent } from './dashboard/landing-page/landing-page.component';
import { FormDataPenggunaComponent } from './dashboard/data-pengguna/form-data-pengguna/form-data-pengguna.component';
import { FormDataLokasiComponent } from './dashboard/data-lokasi/form-data-lokasi/form-data-lokasi.component';
import { ModeratorComponent } from './dashboard/moderator/moderator.component';

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
      { 
        data: { breadcrumb: 'Data Lokasi' },
        path: 'data-lokasi', 
        children: [
          { path: '',component: DataLokasiComponent },
          { path: 'create',component: FormDataLokasiComponent },
          { path: 'update',component: FormDataLokasiComponent }
        ]
      },
      {
        path: 'data-pengguna',
        data: { breadcrumb: 'Data Pengguna' },
        children: [
          { path: '', component: DataPenggunaComponent }, 
          { path: 'create', component: FormDataPenggunaComponent },
          { path: 'update', component: FormDataPenggunaComponent },
        ]
      },      
      { path: 'penentuan-rute', component: PenentuanRuteComponent, data: { breadcrumb: 'Penentuan Rute' } },
      { path: 'unduh-jadwal', component: UnduhJadwalComponent, data: { breadcrumb: 'Unduh Jadwal' } }
    ]
  },
  {
    path: 'moderator',
    component: ModeratorComponent,
    children: [
      { path: '', redirectTo: 'landing-page', pathMatch: 'full' },
      { path: 'landing-page', component: LandingPageComponent, data: { breadcrumb: 'Home' } },
      { path: 'unduh-jadwal', component: UnduhJadwalComponent, data: { breadcrumb: 'Unduh Jadwal' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRouting {}
