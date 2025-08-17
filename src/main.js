import { AnimationSystem } from './AnimationSystem.js';
import { AnimationPlayer } from './AnimationPlayer.js';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Create and initialize the animation system
  const container = document.getElementById('scene-container');
  const animationSystem = new AnimationSystem(container);
  const animationPlayer = new AnimationPlayer(animationSystem);

  // FPS counter
  const fpsElement = document.getElementById('fps');
  let frameCount = 0;
  let lastTime = performance.now();

  function updateFPS() {
    frameCount++;
    const now = performance.now();
    const elapsed = now - lastTime;
    
    if (elapsed >= 1000) {
      const fps = Math.round((frameCount * 1000) / elapsed);
      fpsElement.textContent = `FPS: ${fps}`;
      frameCount = 0;
      lastTime = now;
    }
    
    requestAnimationFrame(updateFPS);
  }

  updateFPS();

  // Example animation data (this would normally be loaded from a server)
  const exampleAnimationData = {
    "poses": [
      {
        "timestamp": 0.0,
        "bones": {
          "mixamorigRightArm": {
            "rotation": [0, 0, 0, 1]
          },
          "mixamorigRightForeArm": {
            "rotation": [0, 0, 0, 1]
          },
          "mixamorigRightHand": {
            "rotation": [0, 0, 0, 1]
          }
        },
        "blendShapes": {
          "mouthOpen": 0.0,
          "eyeBlink": 0.0
        }
      },
      {
        "timestamp": 0.5,
        "bones": {
          "mixamorigRightArm": {
            "rotation": [0, 0, 0.2, 0.98]
          },
          "mixamorigRightForeArm": {
            "rotation": [0, 0.1, 0, 0.995]
          },
          "mixamorigRightHand": {
            "rotation": [0.1, 0, 0, 0.995]
          }
        },
        "blendShapes": {
          "mouthOpen": 0.2,
          "eyeBlink": 0.0
        }
      },
      {
        "timestamp": 1.0,
        "bones": {
          "mixamorigRightArm": {
            "rotation": [0, 0, 0.4, 0.92]
          },
          "mixamorigRightForeArm": {
            "rotation": [0, 0.2, 0, 0.98]
          },
          "mixamorigRightHand": {
            "rotation": [0.2, 0, 0, 0.98]
          }
        },
        "blendShapes": {
          "mouthOpen": 0.5,
          "eyeBlink": 0.1
        }
      },
      {
        "timestamp": 1.5,
        "bones": {
          "mixamorigRightArm": {
            "rotation": [0, 0, 0.2, 0.98]
          },
          "mixamorigRightForeArm": {
            "rotation": [0, 0.1, 0, 0.995]
          },
          "mixamorigRightHand": {
            "rotation": [0.1, 0, 0, 0.995]
          }
        },
        "blendShapes": {
          "mouthOpen": 0.2,
          "eyeBlink": 0.8
        }
      },
      {
        "timestamp": 2.0,
        "bones": {
          "mixamorigRightArm": {
            "rotation": [0, 0, 0, 1]
          },
          "mixamorigRightForeArm": {
            "rotation": [0, 0, 0, 1]
          },
          "mixamorigRightHand": {
            "rotation": [0, 0, 0, 1]
          }
        },
        "blendShapes": {
          "mouthOpen": 0.0,
          "eyeBlink": 0.0
        }
      }
    ]
  };

  // Initialize the system
  Promise.all([
    animationSystem.initialize(),
    animationPlayer.initialize()
  ]).then(() => {
    // Hide loading message
    document.getElementById('loading').style.display = 'none';
    
    // Add the example animation
    animationPlayer.addAnimation('Example Animation', exampleAnimationData);
    
    // Load sample animations
    animationPlayer.loadSampleAnimations();
  }).catch(error => {
    console.error('Error initializing system:', error);
    document.getElementById('loading').textContent = 'Error loading model. Please try again.';
  });
});