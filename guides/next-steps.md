# Next Steps

Refer: https://www.perplexity.ai/search/using-the-setup-in-https-ai-go-mN45LzuqRhGft1n_Q6SSOw

## **Why I’m Only Getting Labels or Scores from MediaPipe**

```
Clarify why I’m only getting labels or scores from MediaPipe when my actual requirement is to get text answers (like a language model would produce). Confirm whether the MediaPipe Android SDK at https://ai.google.dev/edge/mediapipe/solutions/setup_android can be used for offline text generation inside an Ionic-Angular app, or if it’s limited to tasks like vision and classification only. If it cannot produce free-form text answers, explain what additional local LLM setup is needed to get proper natural language responses, and how to bridge that with Ionic using Capacitor or native plugins — keep it practical and exact.

If needed, refer other links like:
https://developers.googleblog.com/en/introducing-gemma-3n-developer-guide/
https://ai.google.dev/edge/mediapipe/solutions/genai/llm_inference
https://ai.google.dev/edge/mediapipe/solutions/genai/llm_inference/android
https://ai.google.dev/edge/mediapipe/solutions/setup_android#example_code
```

You are only getting **labels or scores** from MediaPipe’s text APIs because the **standard MediaPipe Text Classifier and Text Embedder tasks are designed for classification or embedding**—not for free-form text generation like a language model (LLM). These APIs return categories (e.g., “positive”, “negative”, “sports”, “politics”) or vector embeddings, but **not open-ended text answers**[2][3].

## **Can MediaPipe Android SDK Do Offline Text Generation (LLM)?**

**By default, no**—the standard MediaPipe Tasks Android SDK (`tasks-text`) is limited to:
- Text classification (returns categories/labels)[3]
- Text embedding (returns vectors for semantic similarity)[2]
- Vision and audio tasks (object detection, face mesh, etc.)[1][5]

**It does not support free-form text generation** (i.e., answering questions, summarizing, or chat like a language model).

## **What If I Want On-Device LLM/Text Generation?**

**MediaPipe recently introduced experimental support for on-device LLM inference** via the [MediaPipe GenAI LLM Inference API][1]:
- You must use the new `tasks-genai` library, not `tasks-text`.
- You must provide a compatible LLM model (e.g., Gemma, Gemma 3n, or other supported models)[1][5].
- The model must be converted to a `.tflite` or other supported format and bundled with your app[1].

**See official docs for LLM Inference:**  
- [MediaPipe LLM Inference API](https://ai.google.dev/edge/mediapipe/solutions/genai/llm_inference)
- [Android LLM Inference Guide](https://ai.google.dev/edge/mediapipe/solutions/genai/llm_inference/android)
- [Gemma 3n Developer Guide](https://developers.googleblog.com/en/introducing-gemma-3n-developer-guide/)

## **How to Use LLM Inference with Ionic (Practical Steps)**

1. **Add the GenAI dependency:**
   - In your plugin’s `android/build.gradle`:
     ```groovy
     implementation 'com.google.mediapipe:tasks-genai:latest.release'
     ```

2. **Bundle a supported LLM model** (e.g., Gemma 3n) in your plugin’s `android/src/main/assets/` folder.

3. **Write a native plugin method** that:
   - Loads the LLM model with MediaPipe’s GenAI API.
   - Accepts a prompt string from JS.
   - Runs inference and returns the generated text.

4. **Expose this method to your Ionic app** using Capacitor’s `registerPlugin` as previously described.

5. **Call the plugin from your Angular/TypeScript code** and display the generated text in your UI.

## **What If I Need a Local LLM Model?**

- You must obtain or convert a compatible LLM (e.g., Gemma 3n, Gemma 2B, or similar) to a format supported by MediaPipe GenAI.
- The model must fit on-device (Gemma 3n is designed for mobile/edge use)[1].
- See [Gemma 3n Developer Guide](https://developers.googleblog.com/en/introducing-gemma-3n-developer-guide/) for model download and conversion instructions.

## **Summary Table**

| MediaPipe Task/Library        | Output Type         | Free-form Text Generation? | Example Use                |
|------------------------------|---------------------|----------------------------|----------------------------|
| `tasks-text` (Text Classifier)| Category labels     | No                         | Sentiment, topic detection |
| `tasks-text` (Text Embedder)  | Vector embeddings   | No                         | Semantic similarity        |
| `tasks-genai` (LLM Inference) | Generated text      | **Yes**                    | Chat, Q&A, summarization   |

## **Conclusion**

- **The standard MediaPipe Android SDK (`tasks-text`) cannot generate free-form text answers; it is limited to classification and embedding tasks**[2][3].
- **For on-device text generation (LLM), you must use the new MediaPipe GenAI LLM Inference API (`tasks-genai`) and bundle a compatible LLM model**[1].
- **To use this in an Ionic app, you need a Capacitor plugin that bridges your prompt from JS to the native LLM inference code and returns the generated text.**

If you need a minimal code example or further details on how to bridge this with Capacitor, let me know!

**References:**  
[1]: MediaPipe Tasks setup and LLM Inference API  
[2]: MediaPipe Text Embedder Android  
[3]: MediaPipe Text Classifier Android  
[5]: MediaPipe Solutions Guide

[1] https://ai.google.dev/edge/mediapipe/solutions/setup_android
[2] https://ai.google.dev/edge/mediapipe/solutions/text/text_embedder/android
[3] https://ai.google.dev/edge/mediapipe/solutions/text/text_classifier/android
[4] https://developers.googleblog.com/en/mediapipe-on-device-text-to-image-generation-solution-now-available-for-android-developers/
[5] https://ai.google.dev/edge/mediapipe/solutions/guide
[6] https://www.infoq.com/news/2023/10/mediapipe-image-generator/
[7] https://github.com/google-ai-edge/mediapipe-samples/blob/main/examples/llm_inference/android/README.md
[8] https://github.com/google-ai-edge/mediapipe
[9] https://codelabs.developers.google.com/mp-image-generation-basic-android
[10] https://developers.googleblog.com/introducing-mediapipe-solutions-for-on-device-machine-learning/