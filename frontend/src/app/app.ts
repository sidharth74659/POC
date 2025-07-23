import { Component, signal } from "@angular/core";
import { NavbarComponent } from "./navbar/navbar";

@Component({
  selector: "app-root",
  imports: [NavbarComponent],
  template: `
    <h1>Welcome to {{ title() }}!</h1>
    <app-navbar></app-navbar>
  `,
  styles: [],
})
export class App {
  protected readonly title = signal("frontend");
}
