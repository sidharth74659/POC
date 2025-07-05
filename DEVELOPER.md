

# Developer Guide

## References:
- Text classification guide for Android: https://ai.google.dev/edge/mediapipe/solutions/text/text_classifier/android
    - Models(contains the `.tflite` file): https://ai.google.dev/edge/mediapipe/solutions/text/text_classifier/android#models
    - [Text classification with TensorFlow Lite Model Maker](https://ai.google.dev/edge/litert/libraries/modify/text_classification)
- [Writing a native Ionic plugin for Capacitor in less than 30 minutes](https://blog.theodo.com/2021/07/writing-a-native-ionic-plugin-for-capacitor/)


- Playing Simon Says with Gemma-2b and MediaPipe
- Running Gemma 3n Full Version with 2GB RAM: World's First Sub
- Google Gemma 3n AI model launched | Croma Unboxed


## Agenda:

1. Using Gemma 3n or similar small LLM variants locally on an Android device for offline AI tasks (vision, reasoning, multi-modal, audio).
2. Integrating this local LLM setup into an Ionic-Angular app using Capacitor or suitable native bridges.
3. Verifying if MediaPipe Android SDK can be embedded in the same Ionic project to add vision or gesture features, and what extra build steps or plugins are needed.
4. Designing the flow to handle function-calling so the LLM can output a local SQL query to run on SQLite and summarize the result.
5. Supporting voice input with local Whisper or similar STT.
6. Covering responsive UI/UX with dark mode, proper accessibility, and a clean, tested modal or form layout.
7. Explaining all feasible parts, technical limits, realistic device constraints, and giving practical steps, not hallucinated guesses — clear, cost-effective, and actionable.


---

# Error Handling:

#### Error 1:
```
npx cap sync android       

[error] Could not find the web assets directory: ./www.
        Please create it and make sure it has an index.html file. You can change
        the path of this directory in capacitor.config.json (webDir option). You
        may need to compile the web assets for your app (typically npm run
        build). More info:
        https://capacitorjs.com/docs/basics/workflow#sync-your-project
```

**Solution:**

- Run: `npx cap sync android`
- Check value of `webDir` in `capacitor.config.ts`
- Also, check which folder you're in and run the command from there.


---

<!-- 
-Xmx1536m means a maximum of 1536 megabytes, while -Xmx2048m increases it to 2048 megabytes

in  `gradle.properties` file, add:
```
org.gradle.jvmargs=-Xmx2048m
```
 -->








