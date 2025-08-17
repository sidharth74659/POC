# Sign Loom 3 - Real-time Human Animation System

A real-time human animation system using Three.js for displaying and animating rigged human models with precise control over skeletal movements and facial expressions.

## Technical Features

- **Three.js Integration** - Leverages Three.js for 3D rendering and animation
- **Animation Mixer** - Uses Three.js AnimationMixer for skeletal animation blending
- **JSON Animation Data** - Parses and applies animation data from JSON input
- **Morph Targets** - Supports facial expressions via morph targets (blend shapes)
- **Performance Optimized** - Targets 60fps performance

## Project Structure

```
sign-loom-3/
├── public/
│   └── models/              # 3D model assets
├── src/
│   ├── utils/
│   │   └── AnimationParser.js  # Animation data parser
│   ├── AnimationSystem.js      # Core animation system
│   └── main.js                 # Main application entry point
├── index.html                  # Main HTML file
├── package.json                # Project dependencies
└── README.md                   # This file
```

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Open your browser to the provided URL (usually http://localhost:5173)

## Adding Your Own Models

To use your own rigged human model:

1. Ensure your model is fully rigged with a skeletal hierarchy including arm and finger bones
2. Make sure your model includes facial blend shapes (morph targets) for expression control
3. Export your model as a GLTF/GLB file
4. Place the model file in the `public/models` directory
5. Update the model path in `AnimationSystem.js`

## Animation Data Format

The system accepts animation data in the following JSON format:

```json
{
  "poses": [
    {
      "timestamp": 0.0,
      "bones": {
        "boneName": {
          "position": [x, y, z],
          "rotation": [x, y, z, w]
        }
      },
      "blendShapes": {
        "shapeName": weight
      }
    }
  ]
}
```

## Performance Optimization Tips

1. **Limit Bone Updates**: Only animate necessary bones; avoid updating all bones each frame
2. **Keyframe Optimization**: Use fewer keyframes for smoother parts of animation
3. **Model Complexity**: Use lower-poly models for better performance
4. **Texture Sizes**: Use appropriate texture sizes for your target devices

## Credits

- Three.js - https://threejs.org/
- Example models can be sourced from Mixamo - https://www.mixamo.com/