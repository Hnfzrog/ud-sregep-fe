import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-modal-delete-confirm',
  templateUrl: './modal-delete-confirm.component.html',
  styleUrls: ['./modal-delete-confirm.component.scss']
})
export class ModalDeleteConfirmComponent implements OnInit {
  title = 'Konfirmasi Hapus';
  message = 'Apakah Anda yakin ingin menghapus item ini?';

  onClose: Subject<boolean> = new Subject();

  isLoading = false;
  autoCloseInSeconds?: number;

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit(): void {
      
  }

  showConfirmationModal(data: {
    message?: string;
    title?: string;
    autoCloseInSeconds?: number;
  }) {
    if (data.message) this.message = data.message;
    if (data.title) this.title = data.title;
    if (data.autoCloseInSeconds) {
      this.autoCloseInSeconds = data.autoCloseInSeconds;
      setTimeout(() => this.cancelDelete(), this.autoCloseInSeconds * 1000);
    }
  }

  confirmDelete() {
    this.isLoading = true;
    setTimeout(() => {
      this.onClose.next(true);
      this.bsModalRef.hide();
      this.isLoading = false;
    }, 600); // simulasi delay tombol (opsional)
  }

  cancelDelete() {
    this.onClose.next(false);
    this.bsModalRef.hide();
  }
}
