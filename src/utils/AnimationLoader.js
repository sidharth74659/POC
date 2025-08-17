/**
 * Utility class for loading animation data from external sources
 */
export class AnimationLoader {
  /**
   * Load animation data from a JSON file
   * @param {string} url - URL to the JSON file
   * @returns {Promise<Object>} - Promise that resolves with the animation data
   */
  static async loadFromUrl(url) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to load animation data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error loading animation data:', error);
      throw error;
    }
  }
  
  /**
   * Load animation data from a blob (e.g., from a file input)
   * @param {Blob} blob - The blob containing animation data
   * @returns {Promise<Object>} - Promise that resolves with the animation data
   */
  static loadFromBlob(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          resolve(data);
        } catch (error) {
          reject(new Error('Invalid JSON format'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(blob);
    });
  }
  
  /**
   * Normalize animation data to ensure consistent format
   * @param {Object} data - The animation data to normalize
   * @returns {Object} - Normalized animation data
   */
  static normalizeData(data) {
    // Clone the data to avoid modifying the original
    const normalizedData = JSON.parse(JSON.stringify(data));
    
    // Ensure poses array exists
    if (!normalizedData.poses || !Array.isArray(normalizedData.poses)) {
      normalizedData.poses = [];
      return normalizedData;
    }
    
    // Sort poses by timestamp
    normalizedData.poses.sort((a, b) => a.timestamp - b.timestamp);
    
    // Ensure each pose has required properties
    normalizedData.poses.forEach(pose => {
      // Ensure timestamp exists
      if (typeof pose.timestamp !== 'number') {
        pose.timestamp = 0;
      }
      
      // Ensure bones object exists
      if (!pose.bones || typeof pose.bones !== 'object') {
        pose.bones = {};
      }
      
      // Ensure blendShapes object exists
      if (!pose.blendShapes || typeof pose.blendShapes !== 'object') {
        pose.blendShapes = {};
      }
    });
    
    return normalizedData;
  }
  
  /**
   * Convert animation data to a different format
   * @param {Object} data - The animation data to convert
   * @param {string} format - Target format ('threejs', 'custom', etc.)
   * @returns {Object} - Converted animation data
   */
  static convertFormat(data, format) {
    switch (format.toLowerCase()) {
      case 'threejs':
        // Convert to Three.js animation format (already done by AnimationParser)
        return data;
        
      case 'custom':
        // Example of converting to a different custom format
        // This is just a placeholder - implement as needed
        return {
          duration: data.poses[data.poses.length - 1].timestamp,
          frames: data.poses.map(pose => ({
            time: pose.timestamp,
            bone_transforms: pose.bones,
            morph_values: pose.blendShapes
          }))
        };
        
      default:
        // Unknown format, return original
        return data;
    }
  }
}