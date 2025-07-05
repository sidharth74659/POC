## Requirements for Integrating MediaPipe Android SDK with Ionic (Capacitor) App

### Context

- You are developing an **Ionic Angular application targeting Android**.
- You want to integrate **MediaPipe’s native Android SDK** (as described in [MediaPipe Android Setup](https://ai.google.dev/edge/mediapipe/solutions/setup_android)) to leverage its CPU/GPU accelerated vision or text processing tasks.
- The goal is to have **all core MediaPipe logic (native CPU/GPU processing, model inference, etc.) handled within the Android native layer (via Gradle, NDK, or Android Studio setup)**.
- The Ionic app will provide the **user interface (UI)** to accept input content (text, images, video, etc.) and pass it to the native MediaPipe code.
- You want to understand the **best practical approach to bridge Ionic and native MediaPipe SDK**, including what plugins, packages, or native modules are required, build and configuration steps, and any limitations or extra effort involved.
- You want to keep the integration **as simple as possible**, ideally starting with **text tasks** (e.g., text classification) before moving on to more complex vision or gesture tasks.
- You want a **minimal working example** or proof-of-concept that demonstrates the round-trip: Ionic UI → native MediaPipe SDK → results back to Ionic UI.
- You want to understand the **limitations of using MediaPipe JS libraries inside Ionic** as an alternative approach and how it compares with native SDK integration.

### Requirements and Expectations

1. **Architecture & Integration Approach:**
   - Use a **custom Capacitor plugin** as the bridge between Ionic (Angular/TypeScript) and native Android MediaPipe SDK.
   - The native layer handles all MediaPipe processing and exposes simple methods to JS.
   - The Ionic app handles UI input and displays results.
   - For text tasks, pass strings from Ionic to native and get classification results back.
   - For vision tasks (future scope), consider passing images or video frames efficiently.

2. **Build & Configuration:**
   - Add MediaPipe Android SDK dependencies in the plugin’s `build.gradle`.
   - Include TFLite models or MediaPipe assets in the plugin’s Android assets folder.
   - Use Android Studio and Gradle to build the native plugin.
   - Sync the plugin with Ionic via `npx cap sync android`.
   - Handle Android permissions (camera, storage) as needed.

3. **Minimal Implementation Example:**
   - Provide a minimal Capacitor plugin method for **text classification**:
     - Accept a text string from Ionic.
     - Run MediaPipe TextClassifier on native side.
     - Return classification label and confidence score.
   - Provide minimal Ionic UI code to input text, call the plugin, and display results.

4. **Limitations & Practical Considerations:**
   - Native integration requires **advanced Android and Capacitor plugin development skills**.
   - Debugging and maintenance are more complex than pure Ionic/JS apps.
   - Passing large data (images, video) between JS and native is non-trivial.
   - Using MediaPipe JS libraries inside Ionic is simpler but has **performance and hardware acceleration limitations**.
   - Camera access and real-time video processing in WebView may be unreliable.
   - Native SDK integration is recommended for production-grade, high-performance use cases.

5. **Alternative Approach (MediaPipe JS in Ionic):**
   - Use official MediaPipe JS packages (`@mediapipe/face_mesh`, etc.) in the Ionic app.
   - Access camera via browser APIs (`getUserMedia`).
   - Render results on a canvas overlay.
   - Understand this approach is easier but limited in performance and features.

### Deliverables So Far

- Explanation of feasibility and challenges of embedding MediaPipe Android SDK inside Ionic via Capacitor.
- Overview of required packages, plugins, and build/config steps.
- Minimal Ionic + MediaPipe JS example for vision tasks.
- Minimal Capacitor plugin example for native MediaPipe text classification task.
- Summary of pros/cons and practical advice for novices.

If you want to proceed, please confirm or specify if you want to:

- Focus on building the **minimal Capacitor plugin for MediaPipe Text Tasks** with full code and setup instructions.
- Explore **vision tasks** integration next.
- Get a **step-by-step tutorial** for plugin development, Gradle setup, and Ionic integration.
- Review or improve the MediaPipe JS approach for quick prototyping.
