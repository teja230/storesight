package com.storesight.backend.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.Map;

import jakarta.servlet.http.HttpSession;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.reactive.function.client.WebClient;

import com.storesight.backend.config.BackendConfig;
import com.storesight.backend.config.ShopifyConfig;
import com.storesight.backend.service.DataPrivacyService;
import com.storesight.backend.service.ShopService;

import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

/**
 * Unit tests for {@link AnalyticsController#unifiedAnalytics} focusing on Redis caching behaviour
 * and timestamp propagation.
 */
class UnifiedAnalyticsControllerTest {

  @Mock private WebClient.Builder webClientBuilder;
  @Mock private WebClient webClient;
  @Mock private ShopService shopService;
  @Mock private StringRedisTemplate redisTemplate;
  @Mock private ValueOperations<String, String> valueOps;
  @Mock private DataPrivacyService dataPrivacyService;
  @Mock private ShopifyConfig shopifyConfig;
  @Mock private BackendConfig backendConfig;
  @Mock private HttpSession httpSession;

  private AnalyticsController controller;

  private static final String SHOP = "test-shop.myshopify.com";

  @BeforeEach
  void setup() {
    MockitoAnnotations.openMocks(this);

    when(webClientBuilder.build()).thenReturn(webClient);
    when(redisTemplate.opsForValue()).thenReturn(valueOps);
    when(shopService.getTokenForShop(eq(SHOP), anyString())).thenReturn("test-token");
    when(httpSession.getId()).thenReturn("session123");

    controller = spy(new AnalyticsController(
        webClientBuilder,
        shopService,
        redisTemplate,
        dataPrivacyService,
        shopifyConfig,
        backendConfig));

    // Stub internal metric endpoints with predictable data to avoid external calls
    ResponseEntity<Map<String, Object>> okMap = ResponseEntity.ok(Map.of());
    Mono<ResponseEntity<Map<String, Object>>> okMono = Mono.just(okMap);
    doReturn(okMono).when(controller).revenue(anyString(), any());
    doReturn(okMono).when(controller).productAnalytics(anyString(), any());
    doReturn(okMono).when(controller).lowInventory(anyString(), any());
    doReturn(okMono).when(controller).newProducts(anyString(), any());
    doReturn(okMono).when(controller).conversionRate(anyString(), any());
    doReturn(okMono).when(controller).abandonedCarts(anyString(), any());
  }

  @Test
  void firstCallPopulatesRedisAndReturnsLastUpdated() {
    when(valueOps.get(anyString())).thenReturn(null);

    Mono<ResponseEntity<Map<String, Object>>> mono = controller.unifiedAnalytics(SHOP, httpSession);

    StepVerifier.create(mono)
        .assertNext(resp -> {
          assertTrue(resp.getStatusCode().is2xxSuccessful());
          Map<String, Object> body = resp.getBody();
          assertNotNull(body);
          assertTrue(body.containsKey("lastUpdated"));
        })
        .verifyComplete();

    // Verify cache written
    verify(valueOps, times(1)).set(anyString(), anyString(), any());
    // Internal endpoints called once (revenue as representative)
    verify(controller, times(1)).revenue(eq(SHOP), any());
  }

  @Test
  void secondCallUsesRedisAndSkipsInternalFetches() {
    // Simulate cached payload existing
    String cachedJson = "{\"lastUpdated\":\"2025-01-01T00:00:00Z\"}";
    when(valueOps.get(anyString())).thenReturn(cachedJson);

    Mono<ResponseEntity<Map<String, Object>>> mono = controller.unifiedAnalytics(SHOP, httpSession);

    StepVerifier.create(mono)
        .assertNext(resp -> {
          assertTrue(resp.getStatusCode().is2xxSuccessful());
          Map<String, Object> body = resp.getBody();
          assertNotNull(body);
          assertEquals("2025-01-01T00:00:00Z", body.get("lastUpdated"));
        })
        .verifyComplete();

    // Ensure no new cache write
    verify(valueOps, never()).set(anyString(), anyString(), any());
    // Ensure internal endpoints were NOT invoked
    verify(controller, times(0)).revenue(eq(SHOP), any());
  }
}