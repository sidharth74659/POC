/**
 * Utility class for optimizing animation system performance
 */
export class PerformanceOptimizer {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.isLowPerformanceMode = false;
    this.fpsTarget = 60;
    this.fpsHistory = [];
    this.fpsHistorySize = 60; // 1 second at 60fps
    this.lastOptimizationTime = 0;
    this.optimizationInterval = 5000; // Check every 5 seconds
  }
  
  /**
   * Initialize performance monitoring
   */
  init() {
    // Start monitoring FPS
    this._monitorFPS();
  }
  
  /**
   * Monitor current FPS and store in history
   * @private
   */
  _monitorFPS() {
    let lastTime = performance.now();
    let frames = 0;
    
    const updateFPS = () => {
      const now = performance.now();
      frames++;
      
      if (now >= lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (now - lastTime));
        
        // Add to history and limit size
        this.fpsHistory.push(fps);
        if (this.fpsHistory.length > this.fpsHistorySize) {
          this.fpsHistory.shift();
        }
        
        // Check if optimization is needed
        const currentTime = performance.now();
        if (currentTime - this.lastOptimizationTime > this.optimizationInterval) {
          this._checkPerformance();
          this.lastOptimizationTime = currentTime;
        }
        
        // Reset
        frames = 0;
        lastTime = now;
      }
      
      requestAnimationFrame(updateFPS);
    };
    
    updateFPS();
  }
  
  /**
   * Check performance and apply optimizations if needed
   * @private
   */
  _checkPerformance() {
    if (this.fpsHistory.length === 0) return;
    
    // Calculate average FPS
    const avgFPS = this.fpsHistory.reduce((sum, fps) => sum + fps, 0) / this.fpsHistory.length;
    
    // If FPS is below target, apply optimizations
    if (avgFPS < this.fpsTarget * 0.8 && !this.isLowPerformanceMode) {
      this._applyLowPerformanceMode();
    } 
    // If FPS is good and we're in low performance mode, try to restore quality
    else if (avgFPS > this.fpsTarget * 0.9 && this.isLowPerformanceMode) {
      this._restorePerformance();
    }
  }
  
  /**
   * Apply low performance mode optimizations
   * @private
   */
  _applyLowPerformanceMode() {
    console.log('Applying low performance mode optimizations');
    this.isLowPerformanceMode = true;
    
    // Reduce render resolution
    this.renderer.setPixelRatio(Math.max(1, window.devicePixelRatio * 0.75));
    
    // Simplify shadows
    if (this.renderer.shadowMap.enabled) {
      this.renderer.shadowMap.autoUpdate = false;
      this.renderer.shadowMap.needsUpdate = true;
    }
    
    // Reduce anti-aliasing if applicable
    if (this.renderer.capabilities.isWebGL2) {
      this.renderer.antialias = false;
    }
    
    // Simplify scene if possible
    this._simplifyScene();
  }
  
  /**
   * Restore normal performance settings
   * @private
   */
  _restorePerformance() {
    console.log('Restoring normal performance settings');
    this.isLowPerformanceMode = false;
    
    // Restore render resolution
    this.renderer.setPixelRatio(window.devicePixelRatio);
    
    // Restore shadows
    if (this.renderer.shadowMap.enabled) {
      this.renderer.shadowMap.autoUpdate = true;
    }
    
    // Restore scene complexity
    this._restoreScene();
  }
  
  /**
   * Simplify the scene for better performance
   * @private
   */
  _simplifyScene() {
    // Traverse the scene and simplify objects
    this.scene.traverse(object => {
      if (object.isMesh) {
        // Store original settings for later restoration
        if (!object.userData.originalSettings) {
          object.userData.originalSettings = {
            castShadow: object.castShadow,
            receiveShadow: object.receiveShadow,
            frustumCulled: object.frustumCulled
          };
        }
        
        // Disable shadows for smaller objects
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        if (Math.max(size.x, size.y, size.z) < 0.5) {
          object.castShadow = false;
        }
        
        // Ensure frustum culling is enabled
        object.frustumCulled = true;
      }
    });
  }
  
  /**
   * Restore the scene to its original complexity
   * @private
   */
  _restoreScene() {
    // Traverse the scene and restore objects to original settings
    this.scene.traverse(object => {
      if (object.isMesh && object.userData.originalSettings) {
        object.castShadow = object.userData.originalSettings.castShadow;
        object.receiveShadow = object.userData.originalSettings.receiveShadow;
        object.frustumCulled = object.userData.originalSettings.frustumCulled;
      }
    });
  }
  
  /**
   * Set target FPS
   * @param {number} target - Target FPS (default: 60)
   */
  setFPSTarget(target) {
    this.fpsTarget = target;
  }
  
  /**
   * Force low performance mode
   * @param {boolean} enable - Whether to enable low performance mode
   */
  forceLowPerformanceMode(enable) {
    if (enable) {
      this._applyLowPerformanceMode();
    } else {
      this._restorePerformance();
    }
  }
  
  /**
   * Get current performance statistics
   * @returns {Object} Performance statistics
   */
  getPerformanceStats() {
    const avgFPS = this.fpsHistory.length > 0 
      ? this.fpsHistory.reduce((sum, fps) => sum + fps, 0) / this.fpsHistory.length 
      : 0;
      
    return {
      currentMode: this.isLowPerformanceMode ? 'low' : 'normal',
      averageFPS: Math.round(avgFPS),
      targetFPS: this.fpsTarget,
      fpsHistory: [...this.fpsHistory]
    };
  }
}