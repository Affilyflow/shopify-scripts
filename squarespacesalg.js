document.addEventListener("DOMContentLoaded", function() {
    // Function to get cookies
    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    // Extract order details using the provided tags
    function extractOrderDetails() {
        var orderId = '{orderId}';
        var orderTotal = '{orderGrandTotal}';
        var orderSubtotal = '{orderSubtotal}';
        var customerEmail = '{customerEmailAddress}';
        var currency = 'USD'; // Use the correct placeholder for currency if available

        return {
            orderId: orderId,
            orderTotal: orderTotal,
            orderSubtotal: orderSubtotal,
            currency: currency,
            customerEmail: customerEmail
        };
    }

    var orderDetails = extractOrderDetails();
    if (orderDetails) {
        var aff_id = getCookie('affiliate_id');
        var network = getCookie('network');
        var store = getCookie('store');
        var fullUrl = getCookie('full_url');
        var refferer = getCookie('refferer');

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://xepn-38qp-in4n.f2.xano.io/api:-WVr0FO_/sales/salg", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                // Handle successful request if needed
            }
        };

        xhr.send(JSON.stringify({
            aff_id: aff_id,
            refferer: refferer,
            network: network,
            order_id: orderDetails.orderId,
            store: store,
            full_url: fullUrl,
            order_subtotal: orderDetails.orderSubtotal,
            order_total: orderDetails.orderTotal,
            currency: orderDetails.currency,
            customer_email: orderDetails.customerEmail
        }));
    }

    function sendHeartbeat() {
        var storeUrl = window.location.origin; // Get the full base URL, including the scheme
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://xepn-38qp-in4n.f2.xano.io/api:-WVr0FO_/scriptping", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                // Handle successful request if needed
            }
        };

        xhr.send(JSON.stringify({
            store_id: storeUrl, // Use the full base URL as the store_id
            timestamp: new Date().toISOString(),
            type: "heartbeat"
        }));
    }

    // Trigger the heartbeat function immediately
    sendHeartbeat();
});

