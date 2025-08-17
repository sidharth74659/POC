/**
 * Instructions for downloading and using a rigged human model
 * 
 * Since we can't directly download copyrighted 3D models programmatically,
 * this file provides instructions for obtaining a rigged model manually.
 */

console.log(`
===============================================================
 How to Get a Rigged Human Model for Sign Loom 3
===============================================================

Option 1: Download from Mixamo (Recommended for Beginners)
---------------------------------------------------------
1. Go to Mixamo: https://www.mixamo.com
2. Sign in with your Adobe account (or create a free one)
3. Click on "Characters" tab at the top
4. Select any character (e.g., "Y Bot" is a good standard model)
5. Download with these settings:
   - Format: FBX for Unity (.fbx)
   - Skin: With Skin
   - Pose: T-pose
   - Face: Without Face Animations

6. Convert the FBX to GLB:
   a. Go to: https://github.com/facebookincubator/FBX2glTF/releases
   b. Download the converter for your platform
   c. Run this command:
      FBX2glTF-windows-x64.exe --input YBot.fbx --output ./public/models/

7. Rename the output file to RiggedHuman.glb and place in:
   ./public/models/RiggedHuman.glb

Option 2: Use a Free Model from Sketchfab
-----------------------------------------
1. Visit: https://sketchfab.com/3d-models?features=downloadable&q=rigged+human
2. Find a model that is:
   - Free to download
   - Rigged (has a skeleton)
   - In T-pose or A-pose
   - Includes blend shapes/morph targets if possible
3. Download in glTF/GLB format
4. Rename to RiggedHuman.glb and place in:
   ./public/models/RiggedHuman.glb

Option 3: Use Blender to Create/Modify a Model
---------------------------------------------
1. Download Blender: https://www.blender.org/download/
2. Create or import a 3D human model
3. Set up an armature (skeleton)
4. Create shape keys (blend shapes) for facial expressions
5. Export as glTF 2.0 (.glb) with these settings:
   - Format: glTF Binary (.glb)
   - Include: Cameras, Punctual Lights, Selected Objects
   - Transform: +Y Up
   - Check: Apply Modifiers, Include Animation, Skinning, Shape Keys, Materials

6. Save as RiggedHuman.glb in:
   ./public/models/RiggedHuman.glb

===============================================================

After placing your model in the public/models directory, run:
npm run dev

The system will automatically load your model!
`);

// Create the models directory if it doesn't exist
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modelsDir = path.join(__dirname, 'public', 'models');
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
  console.log(`Created directory: ${modelsDir}`);
}