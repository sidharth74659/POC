import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AnimationParser } from './utils/AnimationParser.js';
import { BoneMapper } from './utils/BoneMapper.js';
import { ModelControls } from './ModelControls.js';

export class AnimationSystem {
  constructor(container) {
    this.container = container;
    this.clock = new THREE.Clock();
    this.mixer = null;
    this.model = null;
    this.animationActions = [];
    this.currentAction = null;
    this.bones = {};
    this.morphTargets = {};
    
    this._initScene();
    this._startRenderLoop();
  }
  
  _initScene() {
    // Create the scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x333333);
    
    // Create the camera
    this.camera = new THREE.PerspectiveCamera(
      50, // FOV
      window.innerWidth / window.innerHeight, // Aspect ratio
      0.1, // Near clipping plane
      1000 // Far clipping plane
    );
    
    // Position the camera to show the model with legs near the bottom
    this.camera.position.set(0, 1.2, 2.5);
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);
    
    // Add lights
    this._addLights();
    
    // Add orbit controls for camera
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0.8, 0);
    this.controls.update();
    
    // Handle window resize
    window.addEventListener('resize', () => this._onWindowResize());
  }
  
  _addLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);
    
    // Add a ground plane to receive shadows
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xcccccc,
      roughness: 0.8,
      metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    ground.position.y = 0;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }
  
  _onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  _startRenderLoop() {
    const animate = () => {
      requestAnimationFrame(animate);
      
      const delta = this.clock.getDelta();
      
      // Update animation mixer
      if (this.mixer) {
        this.mixer.update(delta);
      }
      
      // Update controls
      this.controls.update();
      
      // Render the scene
      this.renderer.render(this.scene, this.camera);
    };
    
    animate();
  }
  
  async initialize() {
    try {
      // Load the 3D model
      await this._loadModel();
      
      // Initialize model controls
      this.modelControls = new ModelControls(this);
      
      // Create animation mixer
      this.mixer = new THREE.AnimationMixer(this.model);
      
      // Map bones for easier access
      this._mapBonesAndMorphTargets();
      
      return true;
    } catch (error) {
      console.error('Error initializing animation system:', error);
      return false;
    }
  }
  
  async _loadModel() {
    return new Promise((resolve, reject) => {
      // Create a GLTF loader
      const loader = new GLTFLoader();
      
      // Load a rigged model (in this case, we'll use a sample model)
      loader.load(
        // This should be replaced with a proper rigged human model path
        'models/RiggedHuman.glb',
        (gltf) => {
          // Add the model to the scene
          this.model = gltf.scene;
          this.model.position.set(0, 0, 0);
          this.model.scale.set(1, 1, 1);
          
          // Enable shadows for the model
          this.model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          
          this.scene.add(this.model);
          resolve(this.model);
        },
        (progress) => {
          // Loading progress
          console.log('Loading model:', (progress.loaded / progress.total) * 100, '%');
        },
        (error) => {
          console.error('Error loading model:', error);
          reject(error);
        }
      );
    });
  }
  
  _mapBonesAndMorphTargets() {
    // Map all bones for quick access
    let foundSkeleton = false;
    this.model.traverse((node) => {
      if (node.type === 'SkinnedMesh' && node.skeleton) {
        foundSkeleton = true;
        const skeleton = node.skeleton;
        skeleton.bones.forEach(bone => {
          this.bones[bone.name] = bone;
        });
        console.log('Mapped bones:', Object.keys(this.bones));
      }
    });
    
    if (!foundSkeleton) {
      console.warn('No skeleton found in model');
    }
    
    // Map morph targets (blend shapes)
    this.model.traverse((node) => {
      if (node.isMesh && node.morphTargetDictionary) {
        this.morphTargets[node.name] = {
          mesh: node,
          dictionary: node.morphTargetDictionary
        };
        console.log(`Mapped morph targets for ${node.name}:`, Object.keys(node.morphTargetDictionary));
      }
    });
  }
  
  loadAnimationData(data) {
    try {
      // Map the animation data to match the model's bone naming convention
      const mappedData = BoneMapper.mapAnimationData(data, this.bones);
      
      // Use the animation parser to convert JSON data to Three.js animation format
      const animationClip = AnimationParser.parseAnimationData(mappedData, this.bones, this.morphTargets);
      
      // Create animation action
      if (animationClip) {
        const action = this.mixer.clipAction(animationClip);
        this.animationActions.push(action);
        this.currentAction = action;
        
        // Set up animation properties
        action.setLoop(THREE.LoopRepeat);
        action.clampWhenFinished = true;
        action.timeScale = 1.0;
        
        console.log('Animation loaded successfully');
        return true;
      } else {
        console.error('Failed to create animation clip');
        return false;
      }
    } catch (error) {
      console.error('Error loading animation data:', error);
      return false;
    }
  }
  
  play() {
    if (this.currentAction) {
      this.currentAction.play();
      console.log('Animation playing');
    } else {
      console.warn('No animation to play');
    }
  }
  
  pause() {
    if (this.currentAction) {
      this.currentAction.paused = true;
      console.log('Animation paused');
    }
  }
  
  reset() {
    if (this.currentAction) {
      this.currentAction.reset();
      console.log('Animation reset');
    }
  }
  
  // Clean up resources
  dispose() {
    // Stop animations
    if (this.mixer) {
      this.mixer.stopAllAction();
    }
    
    // Dispose of geometries and materials
    this.scene.traverse((object) => {
      if (object.isMesh) {
        object.geometry.dispose();
        
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
    
    // Remove event listeners
    window.removeEventListener('resize', this._onWindowResize);
    
    // Dispose of renderer
    if (this.renderer) {
      this.renderer.dispose();
      this.container.removeChild(this.renderer.domElement);
    }
    
    console.log('Animation system resources disposed');
  }
}