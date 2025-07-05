package io.ionic.starter.plugins;

import android.content.Context;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import com.google.mediapipe.tasks.genai.llminference.LlmInference;
// import com.google.mediapipe.tasks.genai.llminference.LlmInferenceOptions;

import java.io.File;

@CapacitorPlugin(name = "GemmaLLM")
public class GemmaLLMPlugin extends Plugin {

    private static final String TAG = "GemmaLLMPlugin";
    private LlmInference llmInference;
    private boolean isModelLoaded = false;

    @PluginMethod()
    public void initializeModel(PluginCall call) {
        try {
            Context context = getActivity().getApplicationContext();

            /* Error:
            ```
            /Users/srikanthvudharapu/Desktop/work/poc/28.gemma-3n/test-gemma--one/android/app/src/main/java/plugins/GemmaLLMPlugin.java:13: error: cannot find symbol
            import com.google.mediapipe.tasks.genai.llminference.LlmInferenceOptions;
                                                                ^
              symbol:   class LlmInferenceOptions
              location: package com.google.mediapipe.tasks.genai.llminference
            ```


             */

            // Model path in assets folder
            String modelPath = "gemma-3n-E2B-it-int4.task";

            // Try internal storage first
            File internalModel = new File(context.getFilesDir(), modelPath);
            if (!internalModel.exists()) {
                // Try app-specific external storage
                File extModel = new File(context.getExternalFilesDir(null), modelPath);
                if (extModel.exists()) {
                    // Use extModel.getAbsolutePath() for inference
                    modelPath = extModel.getAbsolutePath();
                } else {
                    Log.e(TAG, "Model not found. Please download or push the model to the assets folder.");
                    JSObject error = new JSObject();
                    error.put("success", false);
                    error.put("error", "Model not found. Please download or push the model to the assets folder.");
                    call.reject("Model not found", error);
                }
            }

            // Now load model from internalModel.getAbsolutePath()

            LlmInference.LlmInferenceOptions options = LlmInference.LlmInferenceOptions.builder()
                .setModelPath(modelPath)
                .setMaxTokens(1000)
                // .setTopK(40)
                // .setMaxTopK(40)
                // .setTemperature(0.8f)
                // .setRandomSeed(101)
                .build();

            llmInference = LlmInference.createFromOptions(context, options);
            isModelLoaded = true;

            JSObject result = new JSObject();
            result.put("success", true);
            result.put("message", "Model initialized successfully");
            call.resolve(result);

        } catch (Exception e) {
            Log.e(TAG, "Error initializing model: " + e.getMessage());
            JSObject error = new JSObject();
            error.put("success", false);
            error.put("error", e.getMessage());
            call.reject("Model initialization failed", error);
        }
    }

    @PluginMethod()
    public void generateText(PluginCall call) {
        if (!isModelLoaded) {
            JSObject error = new JSObject();
            error.put("success", false);
            error.put("error", "Model not initialized");
            call.reject("Model not ready", error);
            return;
        }

        String prompt = call.getString("prompt");
        if (prompt == null || prompt.isEmpty()) {
            JSObject error = new JSObject();
            error.put("success", false);
            error.put("error", "Prompt is required");
            call.reject("Invalid prompt", error);
            return;
        }

        try {
            String response = llmInference.generateResponse(prompt);

            JSObject result = new JSObject();
            result.put("success", true);
            result.put("response", response);
            result.put("prompt", prompt);
            call.resolve(result);

        } catch (Exception e) {
            Log.e(TAG, "Error generating text: " + e.getMessage());
            JSObject error = new JSObject();
            error.put("success", false);
            error.put("error", e.getMessage());
            call.reject("Text generation failed", error);
        }
    }

    @PluginMethod()
    public void isModelReady(PluginCall call) {
        JSObject result = new JSObject();
        result.put("ready", isModelLoaded);
        call.resolve(result);
    }
}
