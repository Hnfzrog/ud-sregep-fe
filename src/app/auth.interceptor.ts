import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private modalService: BsModalService 
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('access_token');

    let authReq = req;
    if (token) {
      authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Terjadi kesalahan. Silakan coba lagi.';

        if (error.status === 401 || error.status === 403) {
          errorMessage = 'Sesi kamu sudah habis. Silakan login kembali.';
          this.modalService.hide();
          localStorage.removeItem('access_token');
          localStorage.removeItem('user_role');
          this.router.navigate(['/login']);
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }

        this.toastr.error(errorMessage, 'Gagal');
        return throwError(() => error);
      })
    );
  }
}
