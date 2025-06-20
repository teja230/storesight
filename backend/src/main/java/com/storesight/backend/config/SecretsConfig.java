package com.storesight.backend.config;

import com.storesight.backend.service.SecretService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SecretsConfig {
  private final SecretService secretService;

  @Autowired
  public SecretsConfig(SecretService secretService) {
    this.secretService = secretService;
  }

  @PostConstruct
  public void init() {
    // Initialize secrets if they don't exist
    initializeSecrets();
  }

  private void initializeSecrets() {
    // Only initialize if secrets don't exist
    if (secretService.getSecret("shopify.api.key").isEmpty()) {
      // You would set these values through your deployment process or admin interface
      secretService.storeSecret("shopify.api.key", "your-shopify-api-key");
      secretService.storeSecret("shopify.api.secret", "your-shopify-api-secret");
      secretService.storeSecret("sendgrid.api.key", "your-sendgrid-api-key");
      secretService.storeSecret("twilio.account.sid", "your-twilio-account-sid");
      secretService.storeSecret("twilio.auth.token", "your-twilio-auth-token");
    }
  }

  public String getShopifyApiKey() {
    return secretService
        .getSecret("shopify.api.key")
        .orElseThrow(() -> new RuntimeException("Shopify API key not found"));
  }

  public String getShopifyApiSecret() {
    return secretService
        .getSecret("shopify.api.secret")
        .orElseThrow(() -> new RuntimeException("Shopify API secret not found"));
  }

  public String getSendgridApiKey() {
    return secretService
        .getSecret("sendgrid.api.key")
        .orElseThrow(() -> new RuntimeException("SendGrid API key not found"));
  }

  public String getTwilioAccountSid() {
    return secretService
        .getSecret("twilio.account.sid")
        .orElseThrow(() -> new RuntimeException("Twilio Account SID not found"));
  }

  public String getTwilioAuthToken() {
    return secretService
        .getSecret("twilio.auth.token")
        .orElseThrow(() -> new RuntimeException("Twilio Auth Token not found"));
  }
}
