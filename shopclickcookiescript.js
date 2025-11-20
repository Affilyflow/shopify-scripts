<script>
document.addEventListener("DOMContentLoaded", function() {
  "use strict";

  // ---------- Helpers ----------
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

  // Simpel hash til at lave unikke cookie-navne pr. (aff_id + store + url)
  function hashString(str) {
    let hash = 0;
    if (!str || !str.length) return hash.toString();
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0; // konverter til 32-bit int
    }
    return Math.abs(hash).toString(36); // base36 -> kort og cookie-venligt
  }

  // ---------- URL / basic data ----------
  const urlParams = new URLSearchParams(window.location.search);

  const affiliateId = urlParams.get("aff_id");
  const network    = urlParams.get("network");
  const store      = urlParams.get("store");
  const fullUrl    = window.location.href;
  const referrer   = document.referrer || "Direct";

  // ---------- Sæt cookies for tracking (uanset network) ----------
  if (affiliateId && network && store) {
    setCookie("affiliate_id", affiliateId, 40);
    setCookie("network", network, 40);
    setCookie("store", store, 40);
    setCookie("full_url", fullUrl, 40);
    setCookie("referrer", referrer, 40);
  }

  // Sørg for at referrer altid er sat mindst én gang
  if (!getCookie("referrer")) {
    setCookie("referrer", referrer, 40);
  }

  // ---------- Kun klik-tracking for Affilyflow ----------
  if (network && network.toLowerCase() === "affilyflow" && affiliateId && store) {

    // Nøgle til "samme bruger + samme URL + samme affiliate"
    const clickKey = `${affiliateId}|${store}|${fullUrl}`;
    const clickCookieName = "af_click_" + hashString(clickKey);

    // Hvis cookie eksisterer, har vi allerede registreret dette klik
    if (getCookie(clickCookieName)) {
      // Allerede tracket denne (aff_id + store + url) kombination inden for 40 dage
      return;
    }

    // ---------- Ekstra data, der er nyttig for affiliates ----------
    const userAgent   = navigator.userAgent || "";
    const language    = navigator.language || "";
    const screenWidth = (window.screen && window.screen.width)  || null;
    const screenHeight= (window.screen && window.screen.height) || null;
    const timeZone    = (Intl.DateTimeFormat().resolvedOptions().timeZone) || "";
    const pageTitle   = document.title || "";
    const timestamp   = new Date().toISOString();

    // Typiske UTM-parametre, hvis du vil køre omnichannel / bedre attribution
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

    // Tilføj kun UTM-felter, hvis de faktisk findes
    if (utmSource)   payload.utm_source   = utmSource;
    if (utmMedium)   payload.utm_medium   = utmMedium;
    if (utmCampaign) payload.utm_campaign = utmCampaign;
    if (utmTerm)     payload.utm_term     = utmTerm;
    if (utmContent)  payload.utm_content  = utmContent;

    // ---------- Send til API ----------
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
        // Hvis vi når hertil, regner vi med at klikket er registreret → sæt dedupe-cookie
        setCookie(clickCookieName, "1", 40);
        return response.json().catch(function() {
          // Hvis body ikke er JSON, er det ligemeget her
          return null;
        });
      })
      .catch(function(error) {
        console.error("API Error (network):", error);
      });
  }
});
</script>



