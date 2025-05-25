import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Page } from 'src/app/page.interface';
import { FormModalKendaraanComponent } from './form-modal-kendaraan/form-modal-kendaraan.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  DashboardService,
  DashboardServiceType,
  QueryService,
} from '../../dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { ModalDeleteConfirmComponent } from '../../shared/modal/modal-delete-confirm/modal-delete-confirm.component';

@Component({
  selector: 'app-data-kendaraan',
  templateUrl: './data-kendaraan.component.html',
  styleUrls: ['./data-kendaraan.component.scss'],
})
export class DataKendaraanComponent implements OnInit {
  rows: Array<any> = [];
  columns: Array<any> = [];

  modalRef?: BsModalRef;

  constructor(
    private route: Router,
    private modalSvc: BsModalService,
    private dashboardSvc: DashboardService,
    private toastr: ToastrService,
    private querySvc: QueryService
  ) {}

  ngOnInit(): void {
    this.renderTable();
    this.getUserData(this.page);
  }

  renderTable() {
    this.columns = [
      {
        name: 'No',
        prop: 'number',
      },
      {
        name: 'Nama Kendaraan',
        prop: 'nama_kendaraan',
      },
      {
        name: 'Kapasitas kendaraan',
        prop: 'kapasitas_kendaraan',
      },
    ];

    // this.rows = [
    //   {
    //     name: 'Marta Mccoy',
    //     age: 31,
    //     auth: {
    //       canConfirm: true,
    //       canUpdate: true,
    //     }
    //   },
    //   {
    //     name: 'Fanny Holman',
    //     age: 23,
    //     auth: {
    //       canDelete: true,
    //     }
    //   },
    //   {
    //     name: 'Fanny Holman',
    //     age: 23,
    //     auth: {
    //       canDelete: true,
    //     }
    //   },
    //   {
    //     name: 'Fanny Holman',
    //     age: 23,
    //     auth: {
    //       canDelete: true,
    //     }
    //   },
    //   {
    //     name: 'Fanny Holman',
    //     age: 23,
    //     auth: {
    //       canDelete: true,
    //     }
    //   },
    //   {
    //     name: 'Fanny Holman',
    //     age: 23,
    //     auth: {
    //       canDelete: true,
    //     }
    //   },
    //   {
    //     name: 'Fanny Holman',
    //     age: 23,
    //     auth: {
    //       canDelete: true,
    //     }
    //   },
    //   {
    //     name: 'Fanny Holman',
    //     age: 23,
    //     auth: {
    //       canDelete: true,
    //     }
    //   },
    //   {
    //     name: 'Fanny Holman',
    //     age: 23,
    //     auth: {
    //       canDelete: true,
    //     }
    //   },
    //   {
    //     name: 'Fanny Holman',
    //     age: 23,
    //     auth: {
    //       canDelete: true,
    //     }
    //   },
    //   {
    //     name: 'Fanny Holman',
    //     age: 23,
    //     auth: {
    //       canDelete: true,
    //     }
    //   },
    //   {
    //     name: 'Fanny Holman',
    //     age: 23,
    //     auth: {
    //       canDelete: true,
    //     }
    //   },
    //   {
    //     name: 'Fanny Holman',
    //     age: 23,
    //     auth: {
    //       canDelete: true,
    //     }
    //   },
    //   {
    //     name: 'Fanny Holman',
    //     age: 23,
    //     auth: {
    //       canDelete: true,
    //     }
    //   },
    //   {
    //     name: 'Fanny Holman',
    //     age: 23,
    //     auth: {
    //       canDelete: true,
    //     }
    //   },
    // ];
  }

  getUserData(page: any) {
    this.page = page;

    const queryParams = {
      keyword: page.keyword || '',
      limit: String(page.limit || 10),
      offset: String(page.offset || 0),
    };

    this.dashboardSvc
      .getParam(DashboardServiceType.VEHICLES, '', queryParams)
      .subscribe((res) => {
        const data = res['data'] || [];

        this.rows = data.map((item: any) => ({
          ...item,
          auth: {
            canUpdate: true,
            canDelete: true,
          },
          id: item.id,
        }));
      });
  }

  page: Page = {
    size: 10,
    page: 0,
    totalElements: 3, // Total rows
    totalPages: 1, // Total pages based on size and elements
    keyword: '',
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
      message:
        'Apakah Anda yakin ingin menghapus kendaraan ' +
        row.nama_kendaraan +
        '?',
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

  doDelete(id: any) {
    this.dashboardSvc.deleteV3(DashboardServiceType.VEHICLES, id).subscribe({
      next: (res) => {
        this.toastr.success(res?.message, 'Sukses');
        this.getUserData(this.page);
      },
      error: (err) => {
        const msg = err?.error?.detail || 'Gagal menghapus data';
        this.toastr.error(msg);
      },
    });
  }

  onValidateClicked(row: any) {
    console.log('Validate clicked:', row);
  }

  onEditClicked(row: any) {
    console.log('Edit clicked:', row);
    this.modalRef = this.modalSvc.show(FormModalKendaraanComponent, {
      class: 'modal-lg',
      ignoreBackdropClick: true,
      initialState: {
        kendaraanData: row, // kirim data ke modal
      },
    });
  }

  onRowSelected(row: any) {
    console.log('Row selected:', row);
  }

  onAddClicked() {
    this.modalRef = this.modalSvc.show(FormModalKendaraanComponent, {
      class: 'modal-lg',
      ignoreBackdropClick: true,
    });
  }
}
