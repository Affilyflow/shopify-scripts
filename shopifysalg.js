// Function to get cookie value by name
function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
}

// Function to send data to your custom endpoint
function sendData(event) {
    console.log("Checkout completed event captured");

    // Log the entire event object to verify the data structure
    console.log("Event Data: ", event);

    // Ensure the event data is available
    if (!event.data || !event.data.checkout) {
        console.error("Checkout data is not available.");
        return;
    }

    var checkout = event.data.checkout;

    // Use the correct property for order ID
    var orderId    = checkout.order ? checkout.order.id : '';
    var aff_id     = getCookie('affiliate_id') || '';
    var network    = getCookie('network') || '';
    var store      = getCookie('store') || '';
    var fullUrl    = getCookie('full_url') || '';

    // Prøv både 'referrer' (korrekt) og 'refferer' (legacy)
    var referrerCookie = getCookie('referrer') || getCookie('refferer') || '';

    var orderTotal = checkout.subtotalPrice ? checkout.subtotalPrice.amount : '';
    var currency   = checkout.subtotalPrice ? checkout.subtotalPrice.currencyCode : '';

    // NYT: hent tidspunkt for hvornår affiliate-cookien blev sat
    var affiliateSetAt = getCookie('affiliate_set_at') || null;

    var cookieAgeSeconds = null;
    var cookieAgeHours   = null;
    var cookieAgeDays    = null;

    if (affiliateSetAt) {
        var createdMs = Date.parse(affiliateSetAt); // forventer ISO string
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

    // Get product IDs safely
    var productIds = checkout.lineItems ? checkout.lineItems.map(function(item) {
        return item.id;
    }) : [];
    var productNames = productIds.length === 1 ? productIds[0] : productIds.join(", ");

    // Log data to console for debugging
    console.log("Order ID: " + orderId);
    console.log("Affiliate ID: " + aff_id);
    console.log("Network: " + network);
    console.log("Store: " + store);
    console.log("Full URL: " + fullUrl);
    console.log("Order Total: " + orderTotal);
    console.log("Currency: " + currency);
    console.log("Product Names (IDs): " + productNames);
    console.log("Affiliate cookie set at: " + affiliateSetAt);
    console.log("Cookie age (seconds): " + cookieAgeSeconds);
    console.log("Cookie age (hours): " + cookieAgeHours);
    console.log("Cookie age (days): " + cookieAgeDays);

    // Send data to your custom endpoint
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://xepn-38qp-in4n.f2.xano.io/api:-WVr0FO_/sales/salg", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    console.log("Preparing to send AJAX request");

    xhr.send(JSON.stringify({
        aff_id: aff_id,
        refferer: referrerCookie, // behold navnet som Xano forventer
        network: network,
        order_id: orderId,
        store: store,
        full_url: fullUrl,
        order_total: orderTotal,
        currency: currency,
        productIds: productNames,

        // NYE FELTER TIL COOKIE-TID
        cookie_created_at: affiliateSetAt,       // ISO timestamp
        cookie_age_seconds: cookieAgeSeconds,    // heltal eller null
        cookie_age_hours: cookieAgeHours,        // heltal eller null
        cookie_age_days: cookieAgeDays           // heltal eller null
    }));

    console.log("AJAX request sent");
}

// Heartbeat function to ensure the script is running
function sendHeartbeat() {
    var storeUrl = window.location.origin; // Get the full base URL, including the scheme
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://xepn-38qp-in4n.f2.xano.io/api:-WVr0FO_/scriptping", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(JSON.stringify({
        store_id: storeUrl, // Use the full base URL as the store_id
        timestamp: new Date().toISOString(),
        type: "heartbeat"
    }));
}

// Trigger the heartbeat function directly
if (window.Shopify && window.Shopify.checkout) {
    sendHeartbeat();
    console.log("Heartbeat function executed.");
}
console.log("Script execution completed.");
