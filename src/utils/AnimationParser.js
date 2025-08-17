import * as THREE from 'three';

export class AnimationParser {
  /**
   * Parse JSON animation data into a Three.js AnimationClip
   * @param {Object} data - The animation data in the specified JSON format
   * @param {Object} bones - Map of bone names to bone objects
   * @param {Object} morphTargets - Map of morph target dictionaries by mesh name
   * @returns {THREE.AnimationClip} The created animation clip
   */
  static parseAnimationData(data, bones, morphTargets) {
    // Validate input data
    if (!data || !data.poses || !Array.isArray(data.poses) || data.poses.length === 0) {
      console.error('Invalid animation data format');
      return null;
    }
    
    const tracks = [];
    
    // Track creation helpers
    const createBoneTrack = (boneName, propertyName, times, values) => {
      if (propertyName === 'position') {
        return new THREE.VectorKeyframeTrack(
          `${boneName}.position`, 
          times, 
          values
        );
      } else if (propertyName === 'rotation') {
        return new THREE.QuaternionKeyframeTrack(
          `${boneName}.quaternion`, 
          times, 
          values
        );
      }
      return null;
    };
    
    const createMorphTrack = (meshName, morphName, times, values) => {
      return new THREE.NumberKeyframeTrack(
        `${meshName}.morphTargetInfluences[${morphTargets[meshName].dictionary[morphName]}]`,
        times,
        values
      );
    };
    
    // Process bone animations
    const boneData = {};
    
    // Process blend shape animations
    const morphData = {};
    
    // First, collect all the bones and morph targets used in the animation
    data.poses.forEach(pose => {
      const timestamp = pose.timestamp;
      
      // Process bones
      if (pose.bones) {
        Object.entries(pose.bones).forEach(([boneName, properties]) => {
          // Initialize bone data structure if needed
          if (!boneData[boneName]) {
            boneData[boneName] = {
              position: { times: [], values: [] },
              rotation: { times: [], values: [] }
            };
          }
          
          // Add position keyframe if present
          if (properties.position) {
            boneData[boneName].position.times.push(timestamp);
            boneData[boneName].position.values.push(...properties.position);
          }
          
          // Add rotation keyframe if present
          if (properties.rotation) {
            boneData[boneName].rotation.times.push(timestamp);
            boneData[boneName].rotation.values.push(...properties.rotation);
          }
        });
      }
      
      // Process blend shapes (morph targets)
      if (pose.blendShapes) {
        Object.entries(pose.blendShapes).forEach(([shapeName, weight]) => {
          // We need to find which mesh this blend shape belongs to
          for (const [meshName, morphTarget] of Object.entries(morphTargets)) {
            if (shapeName in morphTarget.dictionary) {
              // Initialize morph data structure if needed
              if (!morphData[`${meshName}_${shapeName}`]) {
                morphData[`${meshName}_${shapeName}`] = {
                  meshName,
                  shapeName,
                  times: [],
                  values: []
                };
              }
              
              // Add keyframe
              morphData[`${meshName}_${shapeName}`].times.push(timestamp);
              morphData[`${meshName}_${shapeName}`].values.push(weight);
              break;
            }
          }
        });
      }
    });
    
    // Create bone animation tracks
    Object.entries(boneData).forEach(([boneName, properties]) => {
      // Check if the bone exists
      if (!bones[boneName]) {
        console.warn(`Bone "${boneName}" not found in model`);
        return;
      }
      
      // Create position track if we have position keyframes
      if (properties.position.times.length > 0) {
        const track = createBoneTrack(boneName, 'position', 
          new Float32Array(properties.position.times),
          new Float32Array(properties.position.values)
        );
        if (track) tracks.push(track);
      }
      
      // Create rotation track if we have rotation keyframes
      if (properties.rotation.times.length > 0) {
        const track = createBoneTrack(boneName, 'rotation', 
          new Float32Array(properties.rotation.times),
          new Float32Array(properties.rotation.values)
        );
        if (track) tracks.push(track);
      }
    });
    
    // Create morph target animation tracks
    Object.values(morphData).forEach(data => {
      const { meshName, shapeName, times, values } = data;
      
      // Create morph track
      const track = createMorphTrack(meshName, shapeName,
        new Float32Array(times),
        new Float32Array(values)
      );
      
      if (track) tracks.push(track);
    });
    
    // Calculate animation duration (use the latest timestamp as duration)
    let duration = 0;
    data.poses.forEach(pose => {
      if (pose.timestamp > duration) duration = pose.timestamp;
    });
    
    // Create and return the animation clip
    if (tracks.length > 0) {
      return new THREE.AnimationClip('parsedAnimation', duration, tracks);
    } else {
      console.warn('No animation tracks were created');
      return null;
    }
  }
  
  /**
   * Validates the JSON animation data structure
   * @param {Object} data - The animation data to validate
   * @returns {boolean} True if the data is valid, false otherwise
   */
  static validateAnimationData(data) {
    // Check if data is an object and has poses array
    if (!data || typeof data !== 'object' || !Array.isArray(data.poses)) {
      console.error('Invalid animation data: missing or invalid poses array');
      return false;
    }
    
    // Check if poses array is empty
    if (data.poses.length === 0) {
      console.warn('Animation data contains no poses');
      return false;
    }
    
    // Check each pose for required properties
    for (let i = 0; i < data.poses.length; i++) {
      const pose = data.poses[i];
      
      // Check for timestamp
      if (typeof pose.timestamp !== 'number') {
        console.error(`Pose at index ${i} has invalid or missing timestamp`);
        return false;
      }
      
      // Check bones if present
      if (pose.bones && typeof pose.bones !== 'object') {
        console.error(`Pose at index ${i} has invalid bones object`);
        return false;
      }
      
      // Check blendShapes if present
      if (pose.blendShapes && typeof pose.blendShapes !== 'object') {
        console.error(`Pose at index ${i} has invalid blendShapes object`);
        return false;
      }
    }
    
    return true;
  }
}