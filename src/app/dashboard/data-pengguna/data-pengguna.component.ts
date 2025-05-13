import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService, DashboardServiceType, QueryService } from '../../dashboard.service';
import { Page } from '../../page.interface';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalDeleteConfirmComponent } from '../../shared/modal/modal-delete-confirm/modal-delete-confirm.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-data-pengguna',
  templateUrl: './data-pengguna.component.html',
  styleUrls: ['./data-pengguna.component.scss']
})
export class DataPenggunaComponent implements OnInit {
  rows: Array<any> = [];
  columns: Array<any> = [];
  data: any;

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

  renderTable(){
    this.columns = [
      {
        name: 'No',
        prop: 'number'
      },
      {
        name: 'Username',
        prop: 'username'
      },
      {
        name: 'Nama lengkap',
        prop: 'nama'
      },
      {
        name: 'Email',
        prop: 'email'
      },
      {
        name: 'Nomor telepon/hp',
        prop: 'nomor_hp'
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

    let queryParams = this.querySvc.convert({
      keyword: page.keyword || '',
      limit: String(page.limit || 10),
      offset: String(page.offset || 0)
    });
  
    this.dashboardSvc.getParam(DashboardServiceType.GET_ALL_USER, queryParams).subscribe((res) => {
      const data = res['data'] || [];
  
      this.rows = data.map((item: any) => ({
        ...item,
        auth: {
          canUpdate: true,
          canDelete: true
        },
        id : item.id
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

  onSearchChanged(page:any) {
    console.log('Search changed:', page);
    this.page = page;
    // Simulate search logic here (e.g., fetch data based on keyword)
  }

  onDetailClicked(row: any) {
    this.route.navigate([this.route.url + '/update'], { queryParams: {  id: row.id} });
  }

  public async onDeleteClicked(row: any) {
      const modal = this.modalSvc.show(ModalDeleteConfirmComponent);
      (<ModalDeleteConfirmComponent>modal.content).showConfirmationModal({
        message: "Apakah Anda yakin ingin menghapus " + row.nama + "?",
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

  onValidateClicked(row: any) {
    console.log('Validate clicked:', row);
  }

  onEditClicked(row: any) {
    // this.route.navigate([this.route.url+`/update`, {queryParams: {id: row.id}}]);
  }

  onRowSelected(row: any) {
   
  }

  doDelete(id: any){
    const params = `/${id}`
    this.dashboardSvc.deleteV2(DashboardServiceType.GET_ALL_USER, id).subscribe({
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

  onAddClicked(){
    this.route.navigate([this.route.url+`/create`]);
  }
}
