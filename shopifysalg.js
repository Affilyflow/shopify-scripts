// Function to get cookie value by name
function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
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
    var orderId = checkout.order ? checkout.order.id : '';
    var aff_id = getCookie('affiliate_id') || '';
    var network = getCookie('network') || '';
    var store = getCookie('store') || '';
    var fullUrl = getCookie('full_url') || '';
    var orderTotal = checkout.subtotalPrice ? checkout.subtotalPrice.amount : '';
    var currency = checkout.subtotalPrice ? checkout.subtotalPrice.currencyCode : '';
    var refferer = getCookie('refferer') || '';

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

    // Send data to your custom endpoint
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://xepn-38qp-in4n.f2.xano.io/api:-WVr0FO_/sales/salg", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    console.log("Preparing to send AJAX request");

    xhr.send(JSON.stringify({
        aff_id: aff_id,
        refferer: refferer,
        network: network,
        order_id: orderId,
        store: store,
        full_url: fullUrl,
        order_total: orderTotal,
        currency: currency,
        productIds: productNames
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

