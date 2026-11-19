import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  escapeHtml,
  formatAlertMessage,
  shouldSendAlert,
  resetSentAlertsForTesting,
  sendTelegramAlertNow,
} from "./notify.ts";

describe("notify module", () => {
  beforeEach(() => {
    resetSentAlertsForTesting();
  });

  describe("escapeHtml", () => {
    it("escapes &, <, > characters", () => {
      assert.equal(escapeHtml("Hello & World <test> > 1"), "Hello &amp; World &lt;test&gt; &gt; 1");
    });

    it("leaves safe strings untouched", () => {
      assert.equal(escapeHtml("Clean string 123!"), "Clean string 123!");
    });
  });

  describe("formatAlertMessage", () => {
    it("formats message with level, title, env and details", () => {
      const msg = formatAlertMessage(
        {
          level: "🔴 CRITICAL",
          title: "Payment Error <500>",
          rateKey: "test",
          details: {
            service: "checkout",
            status: 503,
          },
        },
        "production",
      );

      assert.ok(msg.includes("🔴 CRITICAL"));
      assert.ok(msg.includes("Payment Error &lt;500&gt;"));
      assert.ok(msg.includes("env: production"));
      assert.ok(msg.includes("<b>service:</b> <code>checkout</code>"));
      assert.ok(msg.includes("<b>status:</b> <code>503</code>"));
    });

    it("filters out undefined and null details", () => {
      const msg = formatAlertMessage(
        {
          level: "🟠 WARNING",
          title: "Warning",
          rateKey: "test",
          details: {
            valid: "yes",
            missing: undefined,
            empty: null,
          },
        },
        "preview",
      );

      assert.ok(msg.includes("<b>valid:</b> <code>yes</code>"));
      assert.ok(!msg.includes("missing"));
      assert.ok(!msg.includes("empty"));
    });
  });

  describe("shouldSendAlert", () => {
    it("allows the first alert and suppresses subsequent alerts within window", () => {
      const t0 = 1000000;
      assert.equal(shouldSendAlert("key1", t0), true);
      // Immediate subsequent call with same key should be suppressed
      assert.equal(shouldSendAlert("key1", t0 + 1000), false);
      // Different key should be allowed
      assert.equal(shouldSendAlert("key2", t0 + 1000), true);
      // After window (5 minutes = 300,000ms), original key is allowed again
      assert.equal(shouldSendAlert("key1", t0 + 300001), true);
    });
  });

  describe("sendTelegramAlertNow", () => {
    it("returns false cleanly when env vars are not set without throwing", async () => {
      const origToken = process.env.TELEGRAM_BOT_TOKEN;
      const origChat = process.env.TELEGRAM_ADMIN_CHAT_ID;
      try {
        delete process.env.TELEGRAM_BOT_TOKEN;
        delete process.env.TELEGRAM_ADMIN_CHAT_ID;
        delete process.env.TELEGRAM_CHAT_ID;

        const result = await sendTelegramAlertNow({
          level: "🔴 CRITICAL",
          title: "Test",
          rateKey: "test-missing-env",
        });

        assert.equal(result, false);
      } finally {
        if (origToken) process.env.TELEGRAM_BOT_TOKEN = origToken;
        if (origChat) process.env.TELEGRAM_ADMIN_CHAT_ID = origChat;
      }
    });
  });
});
