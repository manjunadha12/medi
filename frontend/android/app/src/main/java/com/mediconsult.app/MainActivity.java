package com.mediconsult.app;

import android.os.Bundle;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public void onStart() {
        super.onStart();
        
        // Prevent window.close() from closing the entire app
        // Capacitor's bridge handles the WebView, we can inject our client here
        WebView webView = this.getBridge().getWebView();
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onCloseWindow(WebView window) {
                // Return true to signal we handled it (by doing nothing), 
                // preventing the app from finishing.
                return true;
            }
        });
    }

    @Override
    public void onBackPressed() {
        WebView webView = this.getBridge().getWebView();
        if (webView.canGoBack()) {
            webView.goBack(); // Navigate back inside the web app history
        } else {
            // Only close the app if there is no more web history
            super.onBackPressed();
        }
    }
}
