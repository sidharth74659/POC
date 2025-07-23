// src/app/core/tenant.service.ts
import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class TenantService {
  getTenantId(): string {
    const host = window.location.hostname; // tenant1.example.com
    const parts = host.split(".");
    const subdomain = parts[0];
    return subdomain;
  }
}
