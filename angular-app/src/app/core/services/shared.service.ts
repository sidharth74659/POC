import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  /* 
  getBaseUrl(): string {
    const subdomain = window.location.hostname.split('.')[0];
    return `https://${subdomain}.${environment.apiBaseUrl}`;
  }
   */

  getSubdomain(): string {
    return window.location.hostname.split('.')[0] || '';
  }
}
