import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export enum DashboardServiceType {
  USER_LOGIN,
  GET_ALL_USER,
  USER_REGISTER,

  LOCATION,
  
  VEHICLES,

  DAILY_PENGEPUL,
  DAILY_PENGEPUL_BY_DATE,
  CLUSTERING,
  CLUSTERING_GENERATE_ROUTE,
  REPORT_ROUTES,
  USER_LOGOUT,
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private BASE_URL_API = 'https://ud-sregep-be-production.up.railway.app';

  constructor(private httpSvc: HttpClient) { }

  private getUrl(serviceType: DashboardServiceType): string {
    switch (serviceType) {

      case DashboardServiceType.USER_LOGIN:
        return `${this.BASE_URL_API}/api/v1/auth/login`;

      case DashboardServiceType.USER_LOGOUT:
        return `${this.BASE_URL_API}/api/v1/auth/logout`;

      case DashboardServiceType.GET_ALL_USER:
        return `${this.BASE_URL_API}/api/v1/auth/users`;

      case DashboardServiceType.USER_REGISTER:
        return `${this.BASE_URL_API}/api/v1/auth/register`;

      case DashboardServiceType.LOCATION:
        return `${this.BASE_URL_API}/api/v1/locations/`;

      case DashboardServiceType.VEHICLES:
        return `${this.BASE_URL_API}/api/v1/vehicles`;

      case DashboardServiceType.DAILY_PENGEPUL:
        return `${this.BASE_URL_API}/api/v1/pengepul/daily-pengepul`;

      case DashboardServiceType.DAILY_PENGEPUL_BY_DATE:
        return `${this.BASE_URL_API}/api/v1/pengepul/daily-pengepul/by-date`;

      case DashboardServiceType.CLUSTERING:
        return `${this.BASE_URL_API}/api/v1/clusters/clustering`;

      case DashboardServiceType.CLUSTERING_GENERATE_ROUTE:
        return `${this.BASE_URL_API}/api/v1/clusters/generate-routes`;

      case DashboardServiceType.REPORT_ROUTES:
        return `${this.BASE_URL_API}/api/v1/clusters/report-routes`;

        default:
          return '';

    }
  }

  create(serviceType: DashboardServiceType, body: any): Observable<any> {
    return this.httpSvc.post(this.getUrl(serviceType), body);
  }

  createParam(serviceType: DashboardServiceType, body: any, param: string = ''): Observable<any> {
    return this.httpSvc.post(`${this.getUrl(serviceType)}${param}`, body);
  }

  delete(serviceType: DashboardServiceType, params?: any): Observable<any> {
    return this.httpSvc.delete(this.getUrl(serviceType), { params });
  }

  deleteV2(serviceType: DashboardServiceType, id?: number, params?: any): Observable<any> {
    const baseUrl = this.getUrl(serviceType); // Get the base URL
    const url = id !== undefined ? `${baseUrl}/${id}` : baseUrl; // Append the ID if provided
    return this.httpSvc.delete(url, { params });
  }
  deleteV3(serviceType: DashboardServiceType, id?: number, params?: any): Observable<any> {
    const baseUrl = this.getUrl(serviceType); // Get the base URL
    const url = id !== undefined ? `${baseUrl}${id}` : baseUrl; // Append the ID if provided
    return this.httpSvc.delete(url, { params });
  }
  
  deleteGpt(serviceType: DashboardServiceType, params?: any): Observable<any> {
    let httpParams = params instanceof HttpParams ? params : new HttpParams({ fromObject: params });
    return this.httpSvc.delete(this.getUrl(serviceType), { params: httpParams });
  }
    

  detail(serviceType: DashboardServiceType, params: string = ''): Observable<any> {
    return this.httpSvc.get(`${this.getUrl(serviceType)}${params}`);
  }

  list(serviceType: DashboardServiceType, params?: any): Observable<any> {
    return this.httpSvc.get(this.getUrl(serviceType), { params });
  }

  update(serviceType: DashboardServiceType, param: string, body: any): Observable<any> {
    return this.httpSvc.put(`${this.getUrl(serviceType)}${param}`, body);
  }

  getParam(serviceType: DashboardServiceType, parameter: string, params?: any): Observable<any> {
    return this.httpSvc.get(`${this.getUrl(serviceType)}${parameter}`, { params });
  }

  pagedList(serviceType: DashboardServiceType, page: Page, params?: any): Observable<any> {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('page', page.pageNumber.toString());
    httpParams = httpParams.append('size', page.pageSize.toString());

    if (params) {
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          httpParams = httpParams.append(key, params[key]);
        }
      }
    }

    return this.httpSvc.get(this.getUrl(serviceType), { params: httpParams });
  }

  pagedListParam(serviceType: DashboardServiceType, page: Page, parameter: string, params?: any): Observable<any> {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('page', page.pageNumber.toString());
    httpParams = httpParams.append('size', page.pageSize.toString());

    if (params) {
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          httpParams = httpParams.append(key, params[key]);
        }
      }
    }

    return this.httpSvc.get(`${this.getUrl(serviceType)}${parameter}`, { params: httpParams });
  }

  login(username: string, password: string): Observable<LoginResponse> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
  
    return this.httpSvc.post<LoginResponse>(this.getUrl(DashboardServiceType.USER_LOGIN), formData).pipe(
      tap(response => {
        const token = response.data.token;
        const posisi = response.data.posisi;
        localStorage.setItem('access_token', token);
        localStorage.setItem('user_role', posisi);
        localStorage.setItem('username', username); 
      })
    );
  }
  
}

export class QueryService {
  constructor() { }

  convert(params:any) {
    return '?' + new URLSearchParams(params).toString();
  }
}

export interface Page {
  pageNumber: number;
  pageSize: number;
}

export interface LoginResponse {
  message: string;
  data: {
    token: string;
    id: number;
    username: string;
    email: string;
    posisi: string;
  };
}

