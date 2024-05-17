document.addEventListener("DOMContentLoaded", function() {
    console.log("JavaScript Loaded");

    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    if (window.Shopify && Shopify.checkout) {
        console.log("Shopify checkout object found");
        
        var orderId = Shopify.checkout.order_id;
        var aff_id = getCookie('affiliate_id');
        var network = getCookie('network');
        var store = getCookie('store');  // Retrieve the store cookie
        var fullUrl = getCookie('full_url'); // Retrieve the full URL cookie
        var orderTotal = Shopify.checkout.total_price;
        var currency = Shopify.checkout.currency;
        
        // Create a map of product names to product IDs
        var productMap = Shopify.checkout.line_items.reduce((map, item) => {
            map[item.title] = item.variant_id;
            return map;
        }, {});

        console.log("Order ID: " + orderId);
        console.log("Affiliate ID: " + aff_id);
        console.log("Network: " + network);
        console.log("Store: " + store);
        console.log("Full URL: " + fullUrl);
        console.log("Order Total: " + orderTotal);
        console.log("Currency: " + currency);
        console.log("Product Map: ", productMap);

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://xepn-38qp-in4n.f2.xano.io/api:-WVr0FO_/sales/salg", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        console.log("Preparing to send AJAX request");

        xhr.send(JSON.stringify({
            aff_id: aff_id,
            network: network,
            order_id: orderId,
            store: store,
            full_url: fullUrl,
            order_total: orderTotal,
            currency: currency,
            product_names: productMap
        }));

        console.log("AJAX request sent");
    }
});

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

// Trigger the heartbeat function when an order is made
document.addEventListener("DOMContentLoaded", function() {
    if (window.Shopify && Shopify.checkout) {
        sendHeartbeat();
    }
});
