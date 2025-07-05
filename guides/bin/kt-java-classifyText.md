```java
try {
    TextClassifierResult result = textClassifier.classify(inputText);

    // Extract label and score
    String label = result.classifications().get(0).categories().get(0).categoryName();
    float score = result.classifications().get(0).categories().get(0).score();

    // String label = result.getClassifications().get(0).getCategories().get(0).getCategoryName();
    // float score = result.getClassifications().get(0).getCategories().get(0).getScore();

    // Create a JSObject to return
    JSObject ret = new JSObject();
    ret.put("label", label);
    ret.put("score", score);

    // Resolve the call with the JSObject
    call.resolve(ret);

} catch (Exception e) {
    call.reject("Classification failed: " + e.getMessage());
} 


// another way to do it: ---
TextResultsListener listener = new TextResultsListener() {
@Override
public void onError(String error) {
    // Handle error, e.g. call.reject(error);
    call.reject(error);
}

@Override
public void onResult(TextClassifierResult result, long inferenceTime) {
    ClassificationResult classificationResult = result.classificationResult();
    String label = "";
    float score = 0.0f;

    if (!classificationResult.classifications().isEmpty() &&
            !classificationResult.classifications().get(0).categories().isEmpty()) {
        label = classificationResult.classifications().get(0).categories().get(0).categoryName();
        score = classificationResult.classifications().get(0).categories().get(0).score();
    }

    JSObject ret = new JSObject();
    ret.put("label", label);
    ret.put("score", score);
    ret.put("inferenceTime", inferenceTime);

    call.resolve(ret);
}
```    