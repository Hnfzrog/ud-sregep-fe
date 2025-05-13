import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { DashboardService, DashboardServiceType } from '../../dashboard.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-moderator',
  templateUrl: './moderator.component.html',
  styleUrls: ['./moderator.component.scss']
})
export class ModeratorComponent implements OnInit {
breadcrumb: string = '';
  sidebarVisible: boolean = true;
  isMobile: boolean = false;

  // Accordion menu state
  databaseMenuOpen: boolean = false;
  username: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dashboardSvc: DashboardService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.handleBreadcrumb();
    this.handleResponsiveSidebar();
  }

  private handleBreadcrumb(): void {
    this.username = localStorage.getItem('username');
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let child = this.route.firstChild;
        while (child?.firstChild) {
          child = child.firstChild;
        }
        return child?.snapshot.data['breadcrumb'] || '';
      })
    ).subscribe((breadcrumb: string) => {
      this.breadcrumb = breadcrumb;
    });
  }

  private handleResponsiveSidebar(): void {
    this.updateScreenStatus();
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  toggleDatabaseMenu(): void {
    this.databaseMenuOpen = !this.databaseMenuOpen;
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateScreenStatus();
  }

  private updateScreenStatus(): void {
    this.isMobile = window.innerWidth < 768;
    this.sidebarVisible = !this.isMobile;
  }

  logout(){
    this.dashboardSvc.create(DashboardServiceType.USER_LOGOUT,'').subscribe({
      next: (res) => {
        this.toastr.success(res?.message, 'Sukses');
        this.router.navigate(['/'])
      },
      error: (err) => {
        const msg = err?.error?.detail || 'Gagal logout';
        this.toastr.error(msg);
      }
    })
  }
}
