import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { LoginComponent } from './shared/login/login.component';
import { LandingComponent } from './landing/landing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LandingPageComponent } from './dashboard/landing-page/landing-page.component';
import { DataPenggunaComponent } from './dashboard/data-pengguna/data-pengguna.component';
import { DataLokasiComponent } from './dashboard/data-lokasi/data-lokasi.component';
import { DataKendaraanComponent } from './dashboard/data-kendaraan/data-kendaraan.component';
import { PenentuanRuteComponent } from './dashboard/penentuan-rute/penentuan-rute.component';
import { UnduhJadwalComponent } from './dashboard/unduh-jadwal/unduh-jadwal.component';
import { TableComponent } from './shared/table/table.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormDataPenggunaComponent } from './dashboard/data-pengguna/form-data-pengguna/form-data-pengguna.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { FormDataLokasiComponent } from './dashboard/data-lokasi/form-data-lokasi/form-data-lokasi.component';
import { FormModalKendaraanComponent } from './dashboard/data-kendaraan/form-modal-kendaraan/form-modal-kendaraan.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { QueryService } from './dashboard.service';
import { ModalDeleteConfirmComponent } from './shared/modal/modal-delete-confirm/modal-delete-confirm.component';
import { defineLocale, idLocale } from 'ngx-bootstrap/chronos';
import { FormModalPenentuanRuteComponent } from './dashboard/penentuan-rute/form-modal-penentuan-rute/form-modal-penentuan-rute.component';
import { DatePipe } from '@angular/common';
import { TabsetComponent } from './shared/tabset/tabset.component';
import { DailyPengepulComponent } from './dashboard/penentuan-rute/daily-pengepul/daily-pengepul.component';
import { FinalRuteComponent } from './dashboard/penentuan-rute/final-rute/final-rute.component';
import { TabItemComponent } from './shared/tabset/tab-item.component';
import { ClusterKendaraanComponent } from './dashboard/penentuan-rute/cluster-kendaraan/cluster-kendaraan.component';
import { ModeratorComponent } from './dashboard/moderator/moderator.component';

defineLocale('id', idLocale);
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    LandingComponent,
    LandingPageComponent,
    DataPenggunaComponent,
    DataLokasiComponent,
    DataKendaraanComponent,
    PenentuanRuteComponent,
    UnduhJadwalComponent,
    TableComponent,
    FormDataPenggunaComponent,
    FormDataLokasiComponent,
    FormModalKendaraanComponent,
    ModalDeleteConfirmComponent,
    FormModalPenentuanRuteComponent,
    TabsetComponent,
    DailyPengepulComponent,
    FinalRuteComponent,
    TabItemComponent,
    ClusterKendaraanComponent,
    ModeratorComponent,
    ],
      imports: [
        BrowserAnimationsModule,
        BrowserModule,
        ReactiveFormsModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        ModalModule.forRoot(),
        BsDatepickerModule.forRoot(),
        NgxSelectModule,
        ToastrModule.forRoot({
          positionClass: 'toast-top-right',
          timeOut: 3000,
          closeButton: true,
          progressBar: true,
          preventDuplicates: true
        })
      ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'id' },
    QueryService,
    DatePipe
  ],  
  bootstrap: [AppComponent]
})
export class AppModule { }
