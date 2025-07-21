import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {
  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/']);
  }

  goAbout(): void {
    this.router.navigate(['/about']);
  }

  submitContactForm(): void {
    // Mock form submission - in a real app, this would send data to a backend
    alert('Thank you for your message! We will get back to you soon.');
  }
}
