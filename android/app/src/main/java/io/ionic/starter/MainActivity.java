package io.ionic.starter;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import io.ionic.starter.plugins.GemmaLLMPlugin;
import io.ionic.starter.plugins.MediapipeTextBridgePlugin;

public class MainActivity extends BridgeActivity {

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Register the custom plugins here
    registerPlugin(GemmaLLMPlugin.class);
    registerPlugin(MediapipeTextBridgePlugin.class);
  }
}
