# Getting a 3D Rigged Model for Sign Loom 3

## Option 1: Download from Mixamo (Recommended for Beginners)

1. Go to [Mixamo](https://www.mixamo.com)
2. Sign in with an Adobe account (you can create one for free)
3. Select a character from the characters tab
4. Choose a model with a T-pose or A-pose (ideal for animations)
5. Download the model with these settings:
   - Format: **glTF (.glb)**
   - Skin: Included
   - Animation: None (we'll apply our own animations)
   - Pose: T-pose (preferred) or A-pose

## Option 2: Create a Custom Model in Blender

If you prefer to create your own model:

1. Use Blender to create or modify a 3D character model
2. Ensure it has a proper skeleton (armature) with named bones
3. Add blend shapes for facial expressions
4. Export as glTF 2.0 (.glb format) with these settings:
   - Include: Selected Objects
   - Transform: +Y Up
   - Check: Apply Modifiers, Include Animation, Skinning
   - Check: Include Shape Keys (for blend shapes/morph targets)

## Required Bone Structure

Your model should ideally include these bones with standard naming:

- **Spine**, **Neck**, **Head** for upper body
- **LeftArm**, **LeftForeArm**, **LeftHand** for left arm
- **RightArm**, **RightForeArm**, **RightHand** for right arm
- **LeftHandThumb1/2/3**, **LeftHandIndex1/2/3**, etc. for fingers
- **LeftUpLeg**, **LeftLeg**, **LeftFoot** for left leg
- **RightUpLeg**, **RightLeg**, **RightFoot** for right leg

## Required Blend Shapes (for facial expressions)

Ideally, your model should include blend shapes like:

- **mouthOpen**, **mouthSmile**, **mouthFrown**
- **eyeBlink**, **eyeWide**
- **browRaise**, **browFurrow**

## Placing Your Model in the Project

1. Save your downloaded .glb file as `RiggedHuman.glb` 
2. Place it in the `/public/models/` directory
3. The animation system will automatically load this model