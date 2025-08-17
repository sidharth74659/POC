/**
 * Utility class for mapping between different bone naming conventions
 */
export class BoneMapper {
  // Standard bone names to Mixamo bone names mapping
  static standardToMixamo = {
    'Hips': 'mixamorigHips',
    'Spine': 'mixamorigSpine',
    'Spine1': 'mixamorigSpine1',
    'Spine2': 'mixamorigSpine2',
    'Neck': 'mixamorigNeck',
    'Head': 'mixamorigHead',
    'LeftShoulder': 'mixamorigLeftShoulder',
    'LeftArm': 'mixamorigLeftArm',
    'LeftForeArm': 'mixamorigLeftForeArm',
    'LeftHand': 'mixamorigLeftHand',
    'RightShoulder': 'mixamorigRightShoulder',
    'RightArm': 'mixamorigRightArm',
    'RightForeArm': 'mixamorigRightForeArm',
    'RightHand': 'mixamorigRightHand',
    'LeftUpLeg': 'mixamorigLeftUpLeg',
    'LeftLeg': 'mixamorigLeftLeg',
    'LeftFoot': 'mixamorigLeftFoot',
    'RightUpLeg': 'mixamorigRightUpLeg',
    'RightLeg': 'mixamorigRightLeg',
    'RightFoot': 'mixamorigRightFoot',
    // Add finger mappings
    'LeftHandThumb1': 'mixamorigLeftHandThumb1',
    'LeftHandThumb2': 'mixamorigLeftHandThumb2',
    'LeftHandThumb3': 'mixamorigLeftHandThumb3',
    'LeftHandIndex1': 'mixamorigLeftHandIndex1',
    'LeftHandIndex2': 'mixamorigLeftHandIndex2',
    'LeftHandIndex3': 'mixamorigLeftHandIndex3',
    'LeftHandMiddle1': 'mixamorigLeftHandMiddle1',
    'LeftHandMiddle2': 'mixamorigLeftHandMiddle2',
    'LeftHandMiddle3': 'mixamorigLeftHandMiddle3',
    'RightHandThumb1': 'mixamorigRightHandThumb1',
    'RightHandThumb2': 'mixamorigRightHandThumb2',
    'RightHandThumb3': 'mixamorigRightHandThumb3',
    'RightHandIndex1': 'mixamorigRightHandIndex1',
    'RightHandIndex2': 'mixamorigRightHandIndex2',
    'RightHandIndex3': 'mixamorigRightHandIndex3',
    'RightHandMiddle1': 'mixamorigRightHandMiddle1',
    'RightHandMiddle2': 'mixamorigRightHandMiddle2',
    'RightHandMiddle3': 'mixamorigRightHandMiddle3'
  };

  // Mixamo bone names to standard names mapping
  static mixamoToStandard = Object.fromEntries(
    Object.entries(BoneMapper.standardToMixamo).map(([k, v]) => [v, k])
  );

  /**
   * Get the Mixamo bone name for a standard bone name
   * @param {string} standardName - The standard bone name
   * @returns {string} The Mixamo bone name
   */
  static getMixamoName(standardName) {
    return this.standardToMixamo[standardName] || standardName;
  }

  /**
   * Get the standard bone name for a Mixamo bone name
   * @param {string} mixamoName - The Mixamo bone name
   * @returns {string} The standard bone name
   */
  static getStandardName(mixamoName) {
    return this.mixamoToStandard[mixamoName] || mixamoName;
  }

  /**
   * Check if a bone name is a Mixamo bone
   * @param {string} boneName - The bone name to check
   * @returns {boolean} True if it's a Mixamo bone name
   */
  static isMixamoBone(boneName) {
    return boneName.startsWith('mixamorig');
  }

  /**
   * Map animation data to use the correct bone names for the model
   * @param {Object} data - The animation data
   * @param {Object} bones - The model's bones
   * @returns {Object} The mapped animation data
   */
  static mapAnimationData(data, bones) {
    // Determine if we're using a Mixamo model
    const isMixamoModel = Object.keys(bones).some(boneName => 
      boneName.startsWith('mixamorig')
    );

    // Clone the data to avoid modifying the original
    const mappedData = JSON.parse(JSON.stringify(data));

    // Map the bone names in each pose
    mappedData.poses.forEach(pose => {
      if (pose.bones) {
        const mappedBones = {};
        Object.entries(pose.bones).forEach(([boneName, boneData]) => {
          const targetName = isMixamoModel ? 
            this.getMixamoName(boneName) : 
            this.getStandardName(boneName);
          
          // Only include the bone if it exists in the model
          if (bones[targetName]) {
            mappedBones[targetName] = boneData;
          }
        });
        pose.bones = mappedBones;
      }
    });

    return mappedData;
  }
}