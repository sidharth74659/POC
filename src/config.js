/**
 * Configuration file for the 3D animation system
 * All adjustable parameters are centralized here for easy updates
 */
export const config = {
  // Model position configuration
  model: {
    // Default position
    defaultPosition: {
      x: -50,
      y: -60,
      z: 30
    },
    // Position control limits
    positionLimits: {
      min: -10,
      max: 10,
      step: 0.1
    }
  },

  // Camera configuration
  camera: {
    // Default camera position
    defaultPosition: {
      x: 0,
      y: 1.2,
      z: 2.5
    },
    // Default look-at target
    defaultTarget: {
      x: 0,
      y: 0.8,
      z: 0
    },
    // Zoom configuration
    zoom: {
      defaultLevel: 80,  // percentage
      minLevel: 20,     // percentage
      maxLevel: 200,    // percentage
      step: 10,         // percentage per click
      // Fit-to-view settings
      fitToView: {
        distance: 4,    // units from target
        height: 1,      // target height
        padding: 0.2    // extra space around model (percentage)
      }
    }
  },

  // UI configuration
  ui: {
    // Animation panel width
    panelWidth: 30, // percentage of window width
    // Model container settings
    modelContainer: {
      border: '1px solid var(--border-color)',
      background: 'var(--primary-bg)'
    },
    // Control overlay settings
    controls: {
      background: 'rgba(0, 0, 0, 0.6)',
      blur: '10px',
      padding: '8px',
      borderRadius: '8px'
    }
  },

  // Theme configuration
  theme: {
    colors: {
      primary: '#1e1e1e',
      secondary: '#2d2d2d',
      border: '#3d3d3d',
      text: '#ffffff',
      accent: '#0078d4',
      hover: '#2b88d8'
    }
  }
};