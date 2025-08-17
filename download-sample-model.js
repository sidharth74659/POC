/**
 * This script downloads a sample rigged human model from a public source
 * You can run it with: node download-sample-model.js
 */

import fs from 'fs';
import path from 'path';
import https from 'https';

// Create models directory if it doesn't exist
const modelsDir = path.join(process.cwd(), 'public', 'models');
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
  console.log('Created models directory at', modelsDir);
}

// URL to a sample rigged human model (this is just an example URL - replace with a real one)
// This is a placeholder URL - in a real scenario you would use a specific model URL
const MODEL_URL = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SimpleSkin/glTF-Binary/SimpleSkin.glb';

// Target file path
const targetPath = path.join(modelsDir, 'RiggedHuman.glb');

console.log(`Downloading model from ${MODEL_URL} to ${targetPath}...`);

// Download the file
https.get(MODEL_URL, (response) => {
  if (response.statusCode !== 200) {
    console.error(`Failed to download model: ${response.statusCode} ${response.statusMessage}`);
    return;
  }

  const fileStream = fs.createWriteStream(targetPath);
  response.pipe(fileStream);

  fileStream.on('finish', () => {
    fileStream.close();
    console.log('Model downloaded successfully!');
    console.log('You can now run the application with: npm run dev');
  });
}).on('error', (err) => {
  console.error('Error downloading model:', err.message);
  
  // Provide alternative instructions
  console.log('\nAlternative instructions:');
  console.log('1. Visit https://www.mixamo.com');
  console.log('2. Sign in with an Adobe account');
  console.log('3. Download a character in T-pose as glTF (.glb) format');
  console.log('4. Rename the file to "RiggedHuman.glb"');
  console.log('5. Place it in the public/models/ directory');
});