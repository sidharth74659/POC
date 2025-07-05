# Developer Guide

## References:
- Text classification guide for Android: https://ai.google.dev/edge/mediapipe/solutions/text/text_classifier/android
    - Models(contains the `.tflite` file): https://ai.google.dev/edge/mediapipe/solutions/text/text_classifier/android#models


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