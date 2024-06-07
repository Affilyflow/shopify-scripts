document.addEventListener("DOMContentLoaded", function() {
    console.log("JavaScript Loaded");

    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    // Check if the Squarespace checkout object is available
    if (window.Squarespace && Squarespace.checkout) {
        console.log("Squarespace checkout object found");
        
        var orderId = Squarespace.checkout.id;
        var aff_id = getCookie('affiliate_id');
        var network = getCookie('network');
        var store = getCookie('store');  // Retrieve the store cookie
        var fullUrl = getCookie('full_url'); // Retrieve the full URL cookie
        var orderTotal = Squarespace.checkout.grandTotal.value;
        var currency = Squarespace.checkout.grandTotal.currency;
        var refferer = getCookie('refferer');
        
        // Get product IDs
        var productIds = Squarespace.checkout.lineItems.map(item => item.productId);

        // Ensure product_names is scalar if there's only one item
        var productNames = productIds.length === 1 ? productIds[0] : productIds;

        console.log("Order ID: " + orderId);
        console.log("Affiliate ID: " + aff_id);
        console.log("Network: " + network);
        console.log("Store: " + store);
        console.log("Full URL: " + fullUrl);
        console.log("Order Total: " + orderTotal);
        console.log("Currency: " + currency);
        console.log("Product Names (IDs): " + (Array.isArray(productNames) ? productNames.join(", ") : productNames));

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://xepn-38qp-in4n.f2.xano.io/api:-WVr0FO_/sales/salg", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        console.log("Preparing to send AJAX request");

        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                console.log("AJAX request state: " + xhr.readyState);
                if (xhr.status === 200) {
                    console.log("AJAX request successful");
                } else {
                    console.error("AJAX request failed with status: " + xhr.status);
                }
            }
        };

        xhr.send(JSON.stringify({
            aff_id: aff_id,
            refferer: refferer,
            network: network,
            order_id: orderId,
            store: store,
            full_url: fullUrl,
            order_total: orderTotal,
            currency: currency,
            productIds: productNames // Send product IDs as product_names
        }));

        console.log("AJAX request sent");
    } else {
        console.log("Squarespace checkout object not found");
    }
});

function sendHeartbeat() {
    console.log("Preparing to send heartbeat");
    var storeUrl = window.location.origin; // Get the full base URL, including the scheme
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://xepn-38qp-in4n.f2.xano.io/api:-WVr0FO_/scriptping", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            console.log("Heartbeat request state: " + xhr.readyState);
            if (xhr.status === 200) {
                console.log("Heartbeat request successful");
            } else {
                console.error("Heartbeat request failed with status: " + xhr.status);
            }
        }
    };

    xhr.send(JSON.stringify({
        store_id: storeUrl, // Use the full base URL as the store_id
        timestamp: new Date().toISOString(),
        type: "heartbeat"
    }));

    console.log("Heartbeat request sent");
}

// Trigger the heartbeat function when an order is made
document.addEventListener("DOMContentLoaded", function() {
    if (window.Squarespace && Squarespace.checkout) {
        sendHeartbeat();
    } else {
        console.log("Squarespace checkout object not found for heartbeat");
    }
});
