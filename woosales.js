document.addEventListener("DOMContentLoaded", function() {
    // Function to get a cookie by name
    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    console.log("JavaScript Loaded");

    // Retrieve cookies set during the user's session
    var aff_id = getCookie('affiliate_id');
    var network = getCookie('network');
    var store = getCookie('store');
    var fullUrl = getCookie('full_url');

    // Attempt to scrape order data from the Thank You page HTML
    var orderId = document.querySelector(".woocommerce-order-overview__order strong") 
        ? document.querySelector(".woocommerce-order-overview__order strong").textContent 
        : null;

    var orderTotal = document.querySelector(".woocommerce-order-overview__total strong") 
        ? document.querySelector(".woocommerce-order-overview__total strong").textContent.replace(/[^0-9.]/g, '') 
        : null;

    var currency = document.querySelector(".woocommerce-order-overview__total strong") 
        ? document.querySelector(".woocommerce-order-overview__total strong").textContent.replace(/[0-9,.]/g, '') 
        : null;

    var productNames = Array.from(document.querySelectorAll(".woocommerce-order-details__name")).map(function(el) {
        return el.textContent.trim();
    }).join(", ");

    console.log("Order ID: " + orderId);
    console.log("Affiliate ID: " + aff_id);
    console.log("Network: " + network);
    console.log("Store: " + store);
    console.log("Full URL: " + fullUrl);
    console.log("Order Total: " + orderTotal);
    console.log("Currency: " + currency);
    console.log("Product Names: " + productNames);

    // AJAX request to send the data to the external API
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://xepn-38qp-in4n.f2.xano.io/api:-WVr0FO_/sales/salg", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    console.log("Preparing to send AJAX request");

    // Sending data
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

    // Send heartbeat
    sendHeartbeat();
});

// Function to send a heartbeat request to the server
function sendHeartbeat() {
    var storeUrl = window.location.origin; // Get the full base URL
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://xepn-38qp-in4n.f2.xano.io/api:-WVr0FO_/scriptping", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    // Sending heartbeat data
    xhr.send(JSON.stringify({
        store_id: storeUrl, // Use the full base URL as the store_id
        timestamp: new Date().toISOString(),
        type: "heartbeat"
    }));
}
