import { Component } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { jwtDecode } from "jwt-decode";
import { NgIf } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-navbar",
  imports: [NgIf, RouterLink],
  templateUrl: "./navbar.html",
  styleUrls: ["./navbar.scss"],
})
export class NavbarComponent {
  roles: string[] = [];

  constructor(private auth: AuthService) {
    const token = this.auth.getToken();
    if (token) {
      const decoded = jwtDecode(token) as { roles?: string[] };
      this.roles = decoded.roles || [];
    }
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }
}
