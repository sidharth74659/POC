import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeControlsComponent } from './components/theme-controls/theme-controls.component';
import { PreviewPanelComponent } from './components/preview-panel/preview-panel.component';
import { DarkThemePreviewComponent } from './components/dark-theme-preview/dark-theme-preview.component';
import { ThemeManagementComponent } from './components/theme-management/theme-management.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ThemeControlsComponent,
    PreviewPanelComponent,
    DarkThemePreviewComponent,
    ThemeManagementComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'ui-debugger';
  isMobile = false;
  activePanel = 'theme-controls'; // Default active panel for mobile view
  
  ngOnInit() {
    // Initial check for screen size
    this.checkScreenSize();
    
    // Try to restore previous active panel from session storage
    const savedPanel = sessionStorage.getItem('activePanel');
    if (savedPanel) {
      this.activePanel = savedPanel;
    }
  }
  
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }
  
  checkScreenSize() {
    const prevIsMobile = this.isMobile;
    this.isMobile = window.innerWidth < 768;
    
    // If transitioning between mobile and desktop view, ensure layout adjusts
    if (prevIsMobile !== this.isMobile) {
      // Force a reflow to ensure layout recalculates properly
      setTimeout(() => {
        const panels = document.querySelectorAll('.panel');
        panels.forEach(panel => {
          // Trigger reflow
          panel.classList.add('recalculating');
          
          // Force browser to process the class change
          void (panel as HTMLElement).offsetWidth;
          
          // Remove the class
          panel.classList.remove('recalculating');
        });
      }, 50);
    }
  }
  
  setActivePanel(panel: string) {
    this.activePanel = panel;
    
    // Save active panel to session storage for persistence
    sessionStorage.setItem('activePanel', panel);
  }
}
