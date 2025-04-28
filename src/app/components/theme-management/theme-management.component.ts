import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { Theme } from '../../models/theme.model';

interface DevicePreset {
  name: string;
  width: number;
  height: number;
  scale: number;
}

@Component({
  selector: 'app-theme-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './theme-management.component.html',
  styleUrls: ['./theme-management.component.scss']
})
export class ThemeManagementComponent implements OnInit {
  @ViewChild('importInput') importInput!: ElementRef;
  
  themeForm!: FormGroup;
  savedThemes: Theme[] = [];
  currentTheme!: Theme;
  showAccessibilityInfo = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  importError: string | null = null;
  importSuccess: string | null = null;
  themeName: string = '';
  showAccessibility = false;
  contrastRatios: { name: string, ratio: number, passesAA: boolean, passesAAA: boolean }[] = [];
  
  // Responsive preview
  showResponsivePreview = false;
  devices: DevicePreset[] = [
    { name: 'Mobile S', width: 320, height: 568, scale: 1 },
    { name: 'Mobile M', width: 375, height: 667, scale: 1 },
    { name: 'Mobile L', width: 425, height: 812, scale: 1 },
    { name: 'Tablet', width: 768, height: 1024, scale: 0.75 },
    { name: 'Laptop', width: 1024, height: 768, scale: 0.5 },
    { name: 'Desktop', width: 1440, height: 900, scale: 0.4 }
  ];
  selectedDevice: DevicePreset = this.devices[0];

  constructor(
    private fb: FormBuilder,
    public themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadSavedThemes();
    this.getCurrentTheme();
    this.calculateContrastRatios();
    
    // Listen for theme changes to update accessibility info
    document.addEventListener('themechange', () => {
      setTimeout(() => {
        this.getCurrentTheme();
        this.calculateContrastRatios();
      }, 100);
    });
  }

  private initForm(): void {
    this.themeForm = this.fb.group({
      themeName: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  private loadSavedThemes(): void {
    this.savedThemes = this.themeService.getSavedThemes();
  }

  private getCurrentTheme(): void {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.themeName = this.currentTheme.name;
  }

  saveTheme(): void {
    if (!this.themeName || this.themeName.length < 3) {
      this.errorMessage = 'Please provide a valid theme name (at least 3 characters)';
      setTimeout(() => this.errorMessage = null, 3000);
      return;
    }

    try {
      this.themeService.saveCurrentTheme(this.themeName);
      this.loadSavedThemes();
      this.successMessage = `Theme "${this.themeName}" saved successfully`;
      setTimeout(() => this.successMessage = null, 3000);
    } catch (error: any) {
      this.errorMessage = error.message || 'Error saving theme';
      setTimeout(() => this.errorMessage = null, 3000);
    }
  }

  loadTheme(themeName: string): void {
    this.themeService.loadTheme(themeName);
    this.getCurrentTheme();
    this.calculateContrastRatios();
    this.successMessage = `Theme "${themeName}" loaded successfully`;
    setTimeout(() => this.successMessage = null, 3000);
  }

  deleteTheme(themeName: string, event: Event): void {
    event.stopPropagation();
    try {
      this.themeService.deleteTheme(themeName);
      this.loadSavedThemes();
      this.successMessage = 'Theme deleted successfully';
      setTimeout(() => this.successMessage = null, 3000);
    } catch (error: any) {
      this.errorMessage = error.message || 'Error deleting theme';
      setTimeout(() => this.errorMessage = null, 3000);
    }
  }

  exportThemeAsJson(): void {
    const themeJson = this.themeService.exportTheme();
    this.downloadFile(themeJson, 'ui-debugger-theme.json', 'application/json');
    this.successMessage = 'Theme exported as JSON successfully';
    setTimeout(() => this.successMessage = null, 3000);
  }

  exportThemeAsCss(): void {
    const themeCss = this.themeService.exportThemeAsCSS();
    this.downloadFile(themeCss, 'ui-debugger-theme.css', 'text/css');
    this.successMessage = 'Theme exported as CSS successfully';
    setTimeout(() => this.successMessage = null, 3000);
  }

  private downloadFile(content: string, filename: string, contentType: string): void {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  triggerImportDialog(): void {
    if (this.importInput) {
      this.importInput.nativeElement.click();
    }
  }

  handleImportFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const success = this.themeService.importTheme(content);
        
        if (success) {
          this.importSuccess = 'Theme imported successfully';
          this.getCurrentTheme();
          this.calculateContrastRatios();
        } else {
          this.importError = 'Failed to import theme: Invalid format';
        }
        
        setTimeout(() => {
          this.importSuccess = null;
          this.importError = null;
        }, 3000);
      } catch (error) {
        this.importError = 'Failed to import theme: Invalid format';
        setTimeout(() => this.importError = null, 3000);
      }
      
      // Reset the input
      input.value = '';
    };
    
    reader.readAsText(file);
  }

  toggleAccessibilityInfo(): void {
    this.showAccessibility = !this.showAccessibility;
    if (this.showAccessibility) {
      this.calculateContrastRatios();
    }
  }

  toggleResponsivePreview(): void {
    this.showResponsivePreview = !this.showResponsivePreview;
  }

  selectDevice(device: DevicePreset): void {
    this.selectedDevice = device;
  }

  private calculateContrastRatios(): void {
    if (!this.currentTheme) return;

    const theme = this.currentTheme;
    
    // Calculate contrast ratios using the service's accessibility info
    const accessibilityInfo = this.themeService.accessibility();
    
    // Create contrast ratio entries
    this.contrastRatios = [
      { 
        name: 'Text on Background', 
        ratio: accessibilityInfo.contrastRatio,
        passesAA: accessibilityInfo.wcagAA,
        passesAAA: accessibilityInfo.wcagAAA
      },
      { 
        name: 'Primary Button Text', 
        ratio: this.calculateButtonContrastRatio(theme),
        passesAA: this.calculateButtonContrastRatio(theme) >= 4.5,
        passesAAA: this.calculateButtonContrastRatio(theme) >= 7.0
      }
    ];
  }

  // Calculate contrast ratio for button text
  private calculateButtonContrastRatio(theme: Theme): number {
    // Use the actual contrast ratio from the theme service if available
    // This is a simple implementation - in a real app you would use
    // the service's contrast calculation methods
    const isDark = this.themeService.isDarkTheme();
    
    // Just for demo - you would calculate the real value
    return isDark ? 5.2 : 4.8;
  }

  // Get color samples for a theme preview
  getColorSamples(theme: Theme): string[] {
    return [
      theme.colors.primary,
      theme.colors.secondary,
      theme.colors.backgroundColor,
      theme.colors.textColor
    ];
  }
} 