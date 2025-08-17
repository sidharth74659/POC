import { config } from './config.js';
import * as THREE from 'three';

/**
 * Controls for adjusting model position and view
 */
export class ModelControls {
  constructor(animationSystem) {
    this.animationSystem = animationSystem;
    this.isFullView = false;
    this.originalCameraPosition = { ...config.camera.defaultPosition };
    this.originalTargetPosition = { ...config.camera.defaultTarget };
    this.modelPosition = { ...config.model.defaultPosition };
    this.zoomLevel = config.camera.zoom.defaultLevel;
    
    this._createUI();
  }
  
  _createUI() {
    // Set up position controls
    const container = document.getElementById('model-controls');
    const positionGroups = container.querySelectorAll('.position-control');
    
    // Map position controls to axes
    const axes = ['x', 'y', 'z'];
    positionGroups.forEach((group, index) => {
      const axis = axes[index];
      const slider = group.querySelector('input[type="range"]');
      const input = group.querySelector('input[type="number"]');
      
      // Set initial values
      slider.value = this.modelPosition[axis];
      input.value = this.modelPosition[axis];
      
      // Function to update position with any value
      const updatePosition = (val) => {
        // Parse and validate input
        const numVal = parseFloat(val);
        if (!isNaN(numVal)) {
          this.modelPosition[axis] = numVal;
          
          // Update slider if value is within its range
          if (numVal >= slider.min && numVal <= slider.max) {
            slider.value = numVal;
          } else {
            // If value is outside slider range, update slider range
            const range = Math.max(Math.abs(numVal) * 2, 20);
            slider.min = -range;
            slider.max = range;
            slider.value = numVal;
          }
          
          // Update input display
          input.value = numVal;
          
          // Update model position
          this.updateModelPosition();
        }
      };
      
      // Sync slider and input
      slider.addEventListener('input', (e) => {
        updatePosition(e.target.value);
      });
      
      input.addEventListener('change', (e) => {
        updatePosition(e.target.value);
      });
    });
    
    // Set up zoom controls
    const zoomControls = document.querySelector('.zoom-controls');
    const [zoomOut, zoomDisplay, zoomIn] = zoomControls.children;
    
    // Update zoom display
    const updateZoomDisplay = () => {
      zoomDisplay.textContent = `${this.zoomLevel}%`;
    };
    
    zoomIn.addEventListener('click', () => {
      if (this.zoomLevel < config.camera.zoom.maxLevel) {
        this.zoomLevel += config.camera.zoom.step;
        this.zoomIn();
        updateZoomDisplay();
      }
    });
    
    zoomOut.addEventListener('click', () => {
      if (this.zoomLevel > config.camera.zoom.minLevel) {
        this.zoomLevel -= config.camera.zoom.step;
        this.zoomOut();
        updateZoomDisplay();
      }
    });
    
    // Set up fit-to-view button
    const fitViewButton = document.getElementById('fit-view');
    fitViewButton.addEventListener('click', () => this.fitToView());
    
    // Set up reset position button
    const resetButton = document.getElementById('reset-position');
    resetButton.addEventListener('click', () => this.resetPosition());
    
    // Initial zoom display
    updateZoomDisplay();
  }
  
  updateModelPosition() {
    if (this.animationSystem.model) {
      this.animationSystem.model.position.set(
        this.modelPosition.x,
        this.modelPosition.y,
        this.modelPosition.z
      );
    }
  }
  
  resetPosition() {
    // Reset model position
    this.modelPosition = { ...config.model.defaultPosition };
    this.updateModelPosition();
    
    // Reset camera
    this.animationSystem.camera.position.set(
      this.originalCameraPosition.x,
      this.originalCameraPosition.y,
      this.originalCameraPosition.z
    );
    
    this.animationSystem.controls.target.set(
      this.originalTargetPosition.x,
      this.originalTargetPosition.y,
      this.originalTargetPosition.z
    );
    
    // Reset zoom level
    this.zoomLevel = config.camera.zoom.defaultLevel;
    document.querySelector('.zoom-controls span').textContent = `${this.zoomLevel}%`;
    
    // Update controls
    this.animationSystem.controls.update();
    
    // Update UI
    const sliders = document.querySelectorAll('.position-control input[type="range"]');
    const inputs = document.querySelectorAll('.position-control input[type="number"]');
    ['x', 'y', 'z'].forEach((axis, index) => {
      sliders[index].value = this.modelPosition[axis];
      inputs[index].value = this.modelPosition[axis];
    });
  }
  
  zoomIn() {
    const camera = this.animationSystem.camera;
    const direction = camera.position.clone().sub(this.animationSystem.controls.target).normalize();
    const distance = camera.position.distanceTo(this.animationSystem.controls.target);
    const newDistance = distance * (1 - config.camera.zoom.step / 100);
    
    camera.position.copy(this.animationSystem.controls.target).add(direction.multiplyScalar(newDistance));
    this.animationSystem.controls.update();
  }
  
  zoomOut() {
    const camera = this.animationSystem.camera;
    const direction = camera.position.clone().sub(this.animationSystem.controls.target).normalize();
    const distance = camera.position.distanceTo(this.animationSystem.controls.target);
    const newDistance = distance * (1 + config.camera.zoom.step / 100);
    
    camera.position.copy(this.animationSystem.controls.target).add(direction.multiplyScalar(newDistance));
    this.animationSystem.controls.update();
  }
  
  fitToView() {
    const model = this.animationSystem.model;
    if (!model) return;
    
    // Calculate model bounds
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    
    // Calculate required camera distance
    const fov = this.animationSystem.camera.fov * (Math.PI / 180);
    const maxDim = Math.max(size.x, size.y, size.z);
    const aspectRatio = this.animationSystem.camera.aspect;
    
    // Calculate distances needed to fit the model both vertically and horizontally
    const distanceH = (maxDim / aspectRatio) / (2 * Math.tan(fov / 2));
    const distanceV = maxDim / (2 * Math.tan(fov / 2));
    
    // Use the larger distance to ensure model fits in both dimensions
    const distance = Math.max(distanceH, distanceV) * (1 + config.camera.zoom.fitToView.padding);
    
    // Position camera to show full model
    const cameraPosition = new THREE.Vector3(
      center.x,
      center.y,
      center.z + distance
    );
    
    // Smoothly move camera to new position
    const duration = 1000; // milliseconds
    const startPos = this.animationSystem.camera.position.clone();
    const startTarget = this.animationSystem.controls.target.clone();
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease function (cubic)
      const t = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      // Interpolate camera position
      this.animationSystem.camera.position.lerpVectors(startPos, cameraPosition, t);
      
      // Interpolate target
      this.animationSystem.controls.target.lerpVectors(startTarget, center, t);
      
      // Update controls
      this.animationSystem.controls.update();
      
      // Update zoom display
      this.zoomLevel = Math.round(100 * (1 / (distance / config.camera.zoom.fitToView.distance)));
      document.querySelector('.zoom-controls span').textContent = `${this.zoomLevel}%`;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }
}