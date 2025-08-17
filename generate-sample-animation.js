/**
 * This script generates sample animation data in the required JSON format
 * Run with: node generate-sample-animation.js
 */

import fs from 'fs';
import path from 'path';

// Create a sample animation with waving hand
function generateWavingAnimation() {
  // Define timestamps (in seconds) for keyframes
  const timestamps = [0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0];
  
  // Define the bone names we'll animate
  const boneNames = [
    'RightArm',
    'RightForeArm',
    'RightHand',
    'RightHandThumb1',
    'RightHandIndex1',
    'RightHandMiddle1',
    'RightHandRing1',
    'RightHandPinky1'
  ];
  
  // Define blend shape names
  const blendShapes = [
    'mouthSmile',
    'eyeBlink',
    'browRaise'
  ];
  
  // Create poses array
  const poses = [];
  
  // Helper function to create a quaternion for rotation
  // This is a simple function that creates a quaternion from Euler angles
  function createQuaternion(x, y, z) {
    // This is an extremely simplified conversion
    // In a real application, use a proper quaternion library or THREE.Quaternion
    return [
      Math.sin(x/2) * Math.cos(y/2) * Math.cos(z/2) - Math.cos(x/2) * Math.sin(y/2) * Math.sin(z/2),
      Math.cos(x/2) * Math.sin(y/2) * Math.cos(z/2) + Math.sin(x/2) * Math.cos(y/2) * Math.sin(z/2),
      Math.cos(x/2) * Math.cos(y/2) * Math.sin(z/2) - Math.sin(x/2) * Math.sin(y/2) * Math.cos(z/2),
      Math.cos(x/2) * Math.cos(y/2) * Math.cos(z/2) + Math.sin(x/2) * Math.sin(y/2) * Math.sin(z/2)
    ];
  }
  
  // Generate keyframes
  timestamps.forEach((timestamp, index) => {
    // Calculate animation progress (0 to 1)
    const t = index / (timestamps.length - 1);
    
    // Create a pose object
    const pose = {
      timestamp,
      bones: {},
      blendShapes: {}
    };
    
    // Set bone rotations for waving motion
    boneNames.forEach(boneName => {
      // Different bones get different animations
      switch(boneName) {
        case 'RightArm':
          // Raise arm up for waving
          pose.bones[boneName] = {
            rotation: createQuaternion(0, 0, -Math.sin(t * Math.PI) * 0.8)
          };
          break;
        case 'RightForeArm':
          // Bend elbow slightly
          pose.bones[boneName] = {
            rotation: createQuaternion(Math.sin(t * Math.PI) * 0.3, 0, 0)
          };
          break;
        case 'RightHand':
          // Wave hand side to side
          pose.bones[boneName] = {
            rotation: createQuaternion(0, Math.sin(t * Math.PI * 5) * 0.4, 0)
          };
          break;
        default:
          // Slight movement for fingers
          pose.bones[boneName] = {
            rotation: createQuaternion(Math.sin(t * Math.PI * 2) * 0.1, 0, 0)
          };
      }
    });
    
    // Set blend shapes
    // Smile increases through animation
    pose.blendShapes['mouthSmile'] = Math.min(t * 1.5, 1.0);
    
    // Eye blinks at specific points
    pose.blendShapes['eyeBlink'] = (t > 0.3 && t < 0.4) || (t > 0.8 && t < 0.9) ? 1.0 : 0.0;
    
    // Eyebrow raises towards end
    pose.blendShapes['browRaise'] = t > 0.7 ? (t - 0.7) * 3.3 : 0.0;
    
    poses.push(pose);
  });
  
  return {
    poses
  };
}

// Generate animation data
const animationData = generateWavingAnimation();

// Save to file
const targetDir = path.join(process.cwd(), 'public');
const filePath = path.join(targetDir, 'waving_animation.json');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.writeFileSync(filePath, JSON.stringify(animationData, null, 2));

console.log(`Generated sample animation data and saved to ${filePath}`);
console.log('You can use this animation with the Sign Loom 3 system.');
console.log('To use it, update src/main.js to load this file instead of the example animation.');