import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService, DashboardServiceType, QueryService } from '../../dashboard.service';
import { Page } from '../../page.interface';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalDeleteConfirmComponent } from '../../shared/modal/modal-delete-confirm/modal-delete-confirm.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-data-lokasi',
  templateUrl: './data-lokasi.component.html',
  styleUrls: ['./data-lokasi.component.scss']
})
export class DataLokasiComponent implements OnInit {
  rows: Array<any> = [];
  columns: Array<any> = [];



  constructor(
    private route: Router,
    private dashboardSvc: DashboardService,
    private querySvc: QueryService,
    private modalSvc: BsModalService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.renderTable();

    this.getUserData(this.page);
  }

  renderTable() {
    this.columns = [
      {
        name: 'No',
        prop: 'number'
      },
      {
        name: 'Nama Pengepul',
        prop: 'nama_pengepul'
      },
      {
        name: 'Alamat',
        prop: 'alamat'
      },
      {
        name: 'Titik Koordinat',
        prop: 'koordinat'
      },
      {
        name: 'Nilai ekspektasi bobot kertas',
        prop: 'nilai_ekspektasi'
      },
      {
        name: 'Sudut polar',
        prop: 'sudut_polar'
      },
      { 
        name: 'Status pengambilan', 
        prop: 'status_diambil' 
      },
    ];

  }

  getUserData(page: any) {
    this.page = page;

    let queryParams = this.querySvc.convert({
      keyword: page.keyword || '',
      limit: String(page.limit || 10),
      offset: String(page.offset || 0)
    });

    this.dashboardSvc.getParam(DashboardServiceType.LOCATION, queryParams).subscribe((res) => {
      const data = res['data'] || [];

      this.rows = data.map((item: any) => ({
        ...item,
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

  page: Page = {
    size: 10,
    page: 0,
    totalElements: 3, // Total rows
    totalPages: 1, // Total pages based on size and elements
    keyword: ''
  };

  // Event handlers
  onPageChanged(page: Page) {
    console.log('Page changed:', page);
    this.page = page;
    // Simulate pagination logic here (e.g., fetch new data based on page)
  }

  onSearchChanged(page: any) {
    console.log('Search changed:', page);
    this.page = page;
    // Simulate search logic here (e.g., fetch data based on keyword)
  }

  onDetailClicked(row: any) {
    console.log('Detail clicked:', row);
  }

  public async onDeleteClicked(row: any) {
    const modal = this.modalSvc.show(ModalDeleteConfirmComponent);
    (<ModalDeleteConfirmComponent>modal.content).showConfirmationModal({
      message: "Apakah Anda yakin ingin menghapus pengepul " + row.nama_pengepul + "?",
    });

    const result = await new Promise<boolean>((resolve) => {
      (<ModalDeleteConfirmComponent>modal.content).onClose.subscribe((res) => {
        resolve(res);
      });
    });

    if (result) {
      this.doDelete(row?.id)
    }
  }

  doDelete(id: any) {
    console.log(id);
    
    const params =id
    this.dashboardSvc.deleteV2(DashboardServiceType.LOCATION, id).subscribe({
      next: (res) => {
        this.toastr.success(res?.message, 'Sukses');
        this.getUserData(this.page)
      },
      error: (err) => {
        const msg = err?.error?.detail || 'Gagal menghapus data';
        this.toastr.error(msg);
      }
    })
  }

  onValidateClicked(row: any) {
    console.log('Validate clicked:', row);
  }

  onEditClicked(row: any) {
    this.route.navigate([this.route.url + '/update'], { queryParams: { id: row.id } });
  }

  onRowSelected(row: any) {
    console.log('Row selected:', row);
  }

  onAddClicked() {
    this.route.navigate([this.route.url + `/create`]);
  }
}
