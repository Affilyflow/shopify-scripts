<script>
document.addEventListener("DOMContentLoaded", function() {
  "use strict";

  // ------------------------------
  // Version tag
  // ------------------------------
  const AFFILYFLOW_SCRIPT_VERSION = "1.0.7";

  // ------------------------------
  // Helpers
  // ------------------------------
  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    const cookieString = `${name}=${encodeURIComponent(value || "")}${expires}; path=/;`;
    document.cookie = cookieString;
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  }

  function hashString(str) {
    let hash = 0;
    if (!str || !str.length) return hash.toString();
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  }

  function getStoreMeta() {
    return {
      store_url: window.location.origin,
      hostname: window.location.hostname,
      shopify_store: (window.Shopify && window.Shopify.shop) ? window.Shopify.shop : null
    };
  }

  // ------------------------------
  // Heartbeat sender
  // ------------------------------
  function sendHeartbeat(type = "heartbeat") {
    const meta = getStoreMeta();

    fetch("https://xepn-38qp-in4n.f2.xano.io/api:-WVr0FO_/scriptping", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        type: type,
        version: AFFILYFLOW_SCRIPT_VERSION,
        store_url: meta.store_url,
        hostname: meta.hostname,
        shopify_store: meta.shopify_store
      })
    }).catch(() => {});
  }

  // Send installed once per session
  try {
    if (!sessionStorage.getItem("affilyflow_script_installed")) {
      sendHeartbeat("installed");
      sessionStorage.setItem("affilyflow_script_installed", "1");
    }
  } catch(e) {}

  // Always ping on load
  sendHeartbeat("heartbeat");

  // Ping every 5 minutes
  setInterval(function () {
    sendHeartbeat("interval");
  }, 5 * 60 * 1000);

  // ------------------------------
  // CLICK TRACKING (uændret)
  // ------------------------------

  const urlParams = new URLSearchParams(window.location.search);

  const affiliateId = urlParams.get("aff_id");
  const network    = urlParams.get("network");
  const store      = urlParams.get("store");
  const fullUrl    = window.location.href;
  const referrer   = document.referrer || "Direct";

  // Sæt cookies
  if (affiliateId && network && store) {
    setCookie("affiliate_id", affiliateId, 40);
    setCookie("network", network, 40);
    setCookie("store", store, 40);
    setCookie("full_url", fullUrl, 40);
    setCookie("referrer", referrer, 40);
    setCookie("affiliate_set_at", new Date().toISOString(), 40);
  }

  if (!getCookie("referrer")) {
    setCookie("referrer", referrer, 40);
  }

  // Klik-tracking kun for affilyflow
  if (network && network.toLowerCase() === "affilyflow" && affiliateId && store) {

    const clickKey = `${affiliateId}|${store}|${fullUrl}`;
    const clickCookieName = "af_click_" + hashString(clickKey);

    if (getCookie(clickCookieName)) {
      return;
    }

    const userAgent   = navigator.userAgent || "";
    const language    = navigator.language || "";
    const screenWidth = (window.screen && window.screen.width)  || null;
    const screenHeight= (window.screen && window.screen.height) || null;
    const timeZone    = (Intl.DateTimeFormat().resolvedOptions().timeZone) || "";
    const pageTitle   = document.title || "";
    const timestamp   = new Date().toISOString();

    const utmSource   = urlParams.get("utm_source");
    const utmMedium   = urlParams.get("utm_medium");
    const utmCampaign = urlParams.get("utm_campaign");
    const utmTerm     = urlParams.get("utm_term");
    const utmContent  = urlParams.get("utm_content");

    const payload = {
      aff_id: affiliateId,
      network: network,
      store: store,
      full_url: fullUrl,
      referrer: referrer,
      user_agent: userAgent,
      language: language,
      screen_width: screenWidth,
      screen_height: screenHeight,
      time_zone: timeZone,
      page_title: pageTitle,
      timestamp: timestamp
    };

    if (utmSource)   payload.utm_source = utmSource;
    if (utmMedium)   payload.utm_medium = utmMedium;
    if (utmCampaign) payload.utm_campaign = utmCampaign;
    if (utmTerm)     payload.utm_term = utmTerm;
    if (utmContent)  payload.utm_content = utmContent;

    fetch("https://xepn-38qp-in4n.f2.xano.io/api:-WVr0FO_/clicks/click", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
    .then(function(response) {
      if (!response.ok) {
        console.error("API Error (status):", response.status, response.statusText);
        return null;
      }
      setCookie(clickCookieName, "1", 40);
      return response.json().catch(function() { return null; });
    })
    .catch(function(error) {
      console.error("API Error (network):", error);
    });

  }

});
</script>



