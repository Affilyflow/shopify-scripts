<script>
// ------------------------------
// Version tag
// ------------------------------
const AFFILYFLOW_SCRIPT_VERSION = "1.0.7";

// ------------------------------
// Helpers
// ------------------------------
function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
}

function getStoreMeta() {
    return {
        store_url: window.location.origin,
        hostname: window.location.hostname,
        shopify_store: (window.Shopify && window.Shopify.shop) ? window.Shopify.shop : null
    };
}

// ------------------------------
// Heartbeat / Script presence tracking
// ------------------------------
function sendHeartbeat(type = "heartbeat") {
    var meta = getStoreMeta();

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://xepn-38qp-in4n.f2.xano.io/api:-WVr0FO_/scriptping", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(JSON.stringify({
        timestamp: new Date().toISOString(),
        type: type,
        version: AFFILYFLOW_SCRIPT_VERSION,

        // Store identification (dynamic)
        store_url: meta.store_url,
        hostname: meta.hostname,
        shopify_store: meta.shopify_store
    }));
}

// Send "installed" once per session
try {
    if (!sessionStorage.getItem("affilyflow_script_installed")) {
        sendHeartbeat("installed");
        sessionStorage.setItem("affilyflow_script_installed", "1");
    }
} catch (e) {}

// Always send a heartbeat when script loads
sendHeartbeat("heartbeat");

// Send heartbeat every 5 minutes
setInterval(function () {
    sendHeartbeat("interval");
}, 5 * 60 * 1000);

// ------------------------------
// Checkout event tracking
// ------------------------------
function sendData(event) {
    console.log("Checkout completed event captured");
    console.log("Event Data: ", event);

    if (!event.data || !event.data.checkout) {
        console.error("Checkout data is not available.");
        return;
    }

    var checkout = event.data.checkout;

    var orderId    = checkout.order ? checkout.order.id : '';
    var aff_id     = getCookie('affiliate_id') || '';
    var network    = getCookie('network') || '';
    var store      = getCookie('store') || '';
    var fullUrl    = getCookie('full_url') || '';
    var referrerCookie = getCookie('referrer') || getCookie('refferer') || '';

    var orderTotal = checkout.subtotalPrice ? checkout.subtotalPrice.amount : '';
    var currency   = checkout.subtotalPrice ? checkout.subtotalPrice.currencyCode : '';

    // Cookie timestamp
    var affiliateSetAt = getCookie('affiliate_set_at') || null;

    var cookieAgeSeconds = null;
    var cookieAgeHours   = null;
    var cookieAgeDays    = null;

    if (affiliateSetAt) {
        var createdMs = Date.parse(affiliateSetAt);
        if (!isNaN(createdMs)) {
            var nowMs   = Date.now();
            var diffMs  = nowMs - createdMs;

            if (diffMs >= 0) {
                cookieAgeSeconds = Math.floor(diffMs / 1000);
                cookieAgeHours   = Math.floor(diffMs / (1000 * 60 * 60));
                cookieAgeDays    = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            }
        }
    }

    // Product IDs safely
    var productIds = checkout.lineItems ? checkout.lineItems.map(function(item) {
        return item.id;
    }) : [];

    var productNames = productIds.length === 1 ? productIds[0] : productIds.join(", ");

    console.log("Order ID: " + orderId);
    console.log("Affiliate ID: " + aff_id);
    console.log("Network: " + network);
    console.log("Store: " + store);
    console.log("Full URL: " + fullUrl);
    console.log("Order Total: " + orderTotal);
    console.log("Currency: " + currency);
    console.log("Product Names: " + productNames);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://xepn-38qp-in4n.f2.xano.io/api:-WVr0FO_/sales/salg", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(JSON.stringify({
        aff_id: aff_id,
        refferer: referrerCookie,
        network: network,
        order_id: orderId,
        store: store,
        full_url: fullUrl,
        order_total: orderTotal,
        currency: currency,
        productIds: productNames,

        cookie_created_at: affiliateSetAt,
        cookie_age_seconds: cookieAgeSeconds,
        cookie_age_hours: cookieAgeHours,
        cookie_age_days: cookieAgeDays
    }));

    console.log("AJAX request sent");
}

// ------------------------------
// Shopify event listener
// ------------------------------
if (window.Shopify && window.Shopify.checkout) {
    document.addEventListener("shopify:checkout_completed", sendData);
}

console.log("Affilyflow script loaded. Version " + AFFILYFLOW_SCRIPT_VERSION);
</script>

