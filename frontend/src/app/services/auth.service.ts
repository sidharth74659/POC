// src/app/services/auth.service.ts
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http
      .post<{ token: string }>("/api/auth/login", { email, password })
      .subscribe((res) => {
        localStorage.setItem("access_token", res.token);
      });
  }

  logout() {
    localStorage.removeItem("access_token");
  }

  getToken(): string | null {
    return localStorage.getItem("access_token");
  }
}
