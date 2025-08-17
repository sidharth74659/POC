import { AnimationLoader } from './utils/AnimationLoader.js';

/**
 * AnimationPlayer class provides a simple interface for loading and playing animations
 */
export class AnimationPlayer {
  /**
   * Create a new AnimationPlayer
   * @param {AnimationSystem} animationSystem - The animation system to use
   */
  constructor(animationSystem) {
    this.animationSystem = animationSystem;
    this.animations = {};
    this.currentAnimation = null;
  }
  
  /**
   * Initialize the animation player
   * @returns {Promise} Promise that resolves when initialization is complete
   */
  async initialize() {
    // Add file input listener for loading local animation files
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';
    fileInput.id = 'animation-file-input';
    document.body.appendChild(fileInput);
    
    fileInput.addEventListener('change', (event) => {
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        this.loadAnimationFromFile(file);
      }
    });
    
    // Create UI for animation player
    this._createUI();
    
    return Promise.resolve();
  }
  
  /**
   * Create the user interface for the animation player
   * @private
   */
  _createUI() {
    // Set up animation select
    this.animationSelect = document.getElementById('animation-select');
    this.animationSelect.addEventListener('change', () => {
      const selectedAnimation = this.animationSelect.value;
      if (selectedAnimation && this.animations[selectedAnimation]) {
        this.playAnimation(selectedAnimation);
      }
    });
    
    // Set up load animation button
    const loadButton = document.getElementById('load-animation');
    loadButton.addEventListener('click', () => {
      document.getElementById('animation-file-input').click();
    });
    
    // Set up load samples button
    const loadSampleButton = document.getElementById('load-samples');
    loadSampleButton.addEventListener('click', () => {
      this.loadSampleAnimations();
    });
    
    // Set up playback controls
    const playPauseButton = document.getElementById('play-pause-animation');
    const resetButton = document.getElementById('reset-animation');
    const currentTimeDisplay = document.getElementById('current-time');
    const totalTimeDisplay = document.getElementById('total-time');
    
    // Initialize state
    this.isPlaying = false;
    this.playbackSpeed = 1;
    this.currentTime = 0;
    this.duration = 0;
    
    // Set up play/pause toggle
    playPauseButton.addEventListener('click', () => {
      this.isPlaying = !this.isPlaying;
      const icon = playPauseButton.querySelector('i');
      
      if (this.isPlaying) {
        this.animationSystem.play();
        icon.className = 'fas fa-pause';
      } else {
        this.animationSystem.pause();
        icon.className = 'fas fa-play';
      }
    });
    
    // Set up reset button
    resetButton.addEventListener('click', () => {
      this.animationSystem.reset();
      this.isPlaying = false;
      this.currentTime = 0;
      playPauseButton.querySelector('i').className = 'fas fa-play';
      this.updateTimeDisplay();
    });
    
    // Set up speed controls
    const speedButtons = document.querySelectorAll('.speed-button');
    speedButtons.forEach(button => {
      button.addEventListener('click', () => {
        const speed = parseFloat(button.dataset.speed);
        this.setPlaybackSpeed(speed);
        
        // Update active state
        speedButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
      });
    });
    
    // Set up animation timer
    const updateTimer = () => {
      if (this.isPlaying) {
        this.currentTime += (1/60) * this.playbackSpeed; // Assuming 60fps
        if (this.currentTime >= this.duration) {
          this.currentTime = 0;
        }
        this.updateTimeDisplay();
      }
      requestAnimationFrame(updateTimer);
    };
    
    updateTimer();
  }
  
  /**
   * Load animation data from a file
   * @param {File} file - The animation data file
   */
  async loadAnimationFromFile(file) {
    try {
      console.log(`Loading animation from file: ${file.name}`);
      
      // Create a temporary URL for the file
      const animationData = await AnimationLoader.loadFromBlob(file);
      
      // Add the animation
      const animationName = file.name.replace('.json', '');
      this.addAnimation(animationName, animationData);
      
      console.log(`Animation "${animationName}" loaded successfully`);
    } catch (error) {
      console.error('Error loading animation from file:', error);
      alert('Failed to load animation file. See console for details.');
    }
  }
  
  /**
   * Add an animation to the player
   * @param {string} name - Name of the animation
   * @param {Object} data - Animation data
   */
  addAnimation(name, data) {
    // Store the animation data
    this.animations[name] = data;
    
    // Add to dropdown
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    this.animationSelect.appendChild(option);
    
    // Select if first animation
    if (this.animationSelect.options.length === 1) {
      this.animationSelect.value = name;
      this.playAnimation(name);
    }
  }
  
  /**
   * Play an animation by name
   * @param {string} name - Name of the animation to play
   */
  playAnimation(name) {
    if (!this.animations[name]) {
      console.error(`Animation "${name}" not found`);
      return;
    }
    
    // Load the animation data into the animation system
    const animData = this.animations[name];
    this.animationSystem.loadAnimationData(animData);
    
    // Update duration from animation data
    this.duration = animData.poses[animData.poses.length - 1].timestamp;
    this.currentTime = 0;
    this.updateTimeDisplay();
    
    // Play the animation
    if (this.isPlaying) {
      this.animationSystem.play();
    }
    
    this.currentAnimation = name;
    console.log(`Playing animation: ${name}`);
  }
  
  /**
   * Set the playback speed
   * @param {number} speed - The new playback speed
   */
  setPlaybackSpeed(speed) {
    this.playbackSpeed = speed;
    if (this.animationSystem.mixer) {
      this.animationSystem.mixer.timeScale = speed;
    }
  }
  
  /**
   * Update the time display
   */
  updateTimeDisplay() {
    const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };
    
    document.getElementById('current-time').textContent = formatTime(this.currentTime);
    document.getElementById('total-time').textContent = formatTime(this.duration);
  }
  
  /**
   * Load sample animations from the server
   */
  async loadSampleAnimations() {
    try {
      console.log('Loading sample animations...');
      
      // Load the example animation
      const exampleAnimation = await AnimationLoader.loadFromUrl('/example_animation.json');
      this.addAnimation('Example Animation', exampleAnimation);
      
      // Load additional animations
      try {
        const wavingAnimation = await AnimationLoader.loadFromUrl('/waving_animation.json');
        this.addAnimation('Waving Hand', wavingAnimation);
        
        const waveGoodbyeAnimation = await AnimationLoader.loadFromUrl('/wave_goodbye_animation.json');
        this.addAnimation('Wave Goodbye', waveGoodbyeAnimation);
        
        const nodAnimation = await AnimationLoader.loadFromUrl('/nod_animation.json');
        this.addAnimation('Head Nod', nodAnimation);
      } catch (error) {
        console.warn('Some animations not found:', error);
      }
      
      console.log('Sample animations loaded successfully');
    } catch (error) {
      console.error('Error loading sample animations:', error);
      alert('Failed to load sample animations. See console for details.');
    }
  }
}