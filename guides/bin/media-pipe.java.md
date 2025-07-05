```
// android/app/src/main/java/io/ionic/starter/plugins/MediapipeTextBridgePlugin.java
package io.ionic.starter.plugins;

import com.getcapacitor.*;
// Example minimal import block:
// import com.getcapacitor.Plugin;
// import com.getcapacitor.PluginCall;
// import com.getcapacitor.PluginMethod;
// import com.getcapacitor.JSObject;
import com.getcapacitor.annotation.CapacitorPlugin;

import android.content.Context;

import com.google.mediapipe.tasks.components.containers.ClassificationResult;
import com.google.mediapipe.tasks.text.textclassifier.TextClassifier;
//import com.google.mediapipe.tasks.text.textclassifier.TextClassifierOptions;
import com.google.mediapipe.tasks.core.BaseOptions;
import com.google.mediapipe.tasks.text.textclassifier.TextClassifierResult;

@CapacitorPlugin(name = "MediapipeTextBridge")
public class MediapipeTextBridgePlugin extends Plugin {

    private TextClassifier textClassifier;

    @Override
    public void load() {
        Context context = getContext();
        BaseOptions baseOptions = BaseOptions.builder()
                .setModelAssetPath("text_classifier.tflite")
                .build();

        try {
            TextClassifier.TextClassifierOptions options = TextClassifier.TextClassifierOptions.builder()
                    .setBaseOptions(baseOptions)
                    .build();

            textClassifier = TextClassifier.createFromOptions(context, options);
        } catch (Exception e) {
            // Handle error (optional: log or throw)
        }
    }

    @PluginMethod
    public void classifyText(PluginCall call) {
        String inputText = call.getString("text");
        if (inputText == null) {
            call.reject("No text provided");
            return;
        }

        try {
            TextClassifierResult result = textClassifier.classify(inputText);

          // Access the ClassificationResult from TextClassifierResult
          if (result != null && result.classificationResult() != null) {
            ClassificationResult classificationResult = result.classificationResult();

            // Check if there are classifications and categories
            if (!classificationResult.classifications().isEmpty() &&
              !classificationResult.classifications().get(0).categories().isEmpty()) {

              // Get the first classification's first category
              com.google.mediapipe.tasks.components.containers.Category category =
                classificationResult.classifications().get(0).categories().get(0);

              String label = category.categoryName();
              float score = category.score();

              JSObject ret = new JSObject();
              ret.put("label", label);
              ret.put("score", score);
              call.resolve(ret);
            } else {
              call.reject("No classification results");
            }
          } else {
            call.reject("No classification results");
          }
        } catch (Exception e) {
            call.reject("Classification failed: " + e.getMessage());
        }
    }
}
```