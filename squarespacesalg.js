
document.addEventListener("DOMContentLoaded", function() {
    console.log("JavaScript Loaded on Order Status Page");

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
        // Assuming currency is not directly provided, hence hardcoding 'USD' for this example
        var currency = 'USD';

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

        console.log("Order ID: " + orderDetails.orderId);
        console.log("Affiliate ID: " + aff_id);
        console.log("Network: " + network);
        console.log("Store: " + store);
        console.log("Full URL: " + fullUrl);
        console.log("Order Subtotal: " + orderDetails.orderSubtotal);
        console.log("Order Total: " + orderDetails.orderTotal);
        console.log("Currency: " + orderDetails.currency);
        console.log("Customer Email: " + orderDetails.customerEmail);

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
            order_id: orderDetails.orderId,
            store: store,
            full_url: fullUrl,
            order_subtotal: orderDetails.orderSubtotal,
            order_total: orderDetails.orderTotal,
            currency: orderDetails.currency,
            customer_email: orderDetails.customerEmail
        }));

        console.log("AJAX request sent");
    } else {
        console.log("Order details not found in DOM");
    }

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

    // Trigger the heartbeat function immediately
    sendHeartbeat();
});


