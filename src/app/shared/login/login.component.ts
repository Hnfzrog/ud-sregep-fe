import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  error: string = '';
  isSubmitted: boolean = false;

  constructor(
    private router: Router,
    private dashboardService: DashboardService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    this.error = '';

    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;

    this.dashboardService.login(username, password).subscribe({
      next: (res) => {
        const posisi = res.data.posisi;
        this.toastr.success('Login berhasil', 'Sukses');

        if (posisi === 'admin') {
          this.router.navigate(['/dashboard']);
        } else if (posisi === 'manajer') {
          this.router.navigate(['/manajer']);
        } else {
          this.error = 'Role tidak dikenali';
        }
      },
      error: (err) => {
        this.error = 'Username atau password salah';
        console.error(err);
      }
    });
  }
}
