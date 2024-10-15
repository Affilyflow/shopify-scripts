document.addEventListener("DOMContentLoaded", function() {
    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    console.log("JavaScript Loaded");

    // Retrieve cookies
    var aff_id = getCookie('affiliate_id');
    var network = getCookie('network');
    var store = getCookie('store');
    var fullUrl = getCookie('full_url');

    // Ensure that orderData is available
    if (typeof orderData !== 'undefined') {
        var orderId = orderData.orderId;
        var orderTotal = orderData.orderTotal;
        var currency = orderData.currency;
        var productNames = orderData.productNames;

        console.log("Order ID: " + orderId);
        console.log("Affiliate ID: " + aff_id);
        console.log("Network: " + network);
        console.log("Store: " + store);
        console.log("Full URL: " + fullUrl);
        console.log("Order Total: " + orderTotal);
        console.log("Currency: " + currency);
        console.log("Product Names: " + productNames);

        // Send data to the API
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://xepn-38qp-in4n.f2.xano.io/api:-WVr0FO_/sales/salg", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.send(JSON.stringify({
            aff_id: aff_id,
            network: network,
            order_id: orderId,
            store: store,
            full_url: fullUrl,
            order_total: orderTotal,
            currency: currency,
            product_names: productNames
        }));

        console.log("AJAX request sent");

        // Optional: send heartbeat
        sendHeartbeat();
    } else {
        console.warn("Order data is not available.");
    }
});

function sendHeartbeat() {
    var storeUrl = window.location.origin;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://xepn-38qp-in4n.f2.xano.io/api:-WVr0FO_/scriptping", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(JSON.stringify({
        store_id: storeUrl,
        timestamp: new Date().toISOString(),
        type: "heartbeat"
    }));
}

