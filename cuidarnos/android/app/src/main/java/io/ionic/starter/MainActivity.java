package io.ionic.starter;

import android.os.Bundle;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Permitir medios sin gesto del usuario
    WebSettings settings = getBridge().getWebView().getSettings();
    settings.setMediaPlaybackRequiresUserGesture(false);

    // WebChromeClient para permitir cámara y micrófono
    getBridge().getWebView().setWebChromeClient(new WebChromeClient() {
      @Override
      public void onPermissionRequest(final PermissionRequest request) {
        runOnUiThread(() -> {
          request.grant(request.getResources());
        });
      }
    });
  }
}
