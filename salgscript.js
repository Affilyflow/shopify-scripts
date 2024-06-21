document.addEventListener("DOMContentLoaded", function() {
    console.log("JavaScript Loaded");

    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    if (window.Shopify && Shopify.checkout) {
       
        var orderId = Shopify.checkout.order_id;
        var aff_id = getCookie('affiliate_id');
        var network = getCookie('network');
        var store = getCookie('store');  // Retrieve the store cookie
        var fullUrl = getCookie('full_url'); // Retrieve the full URL cookie
        var orderTotal = Shopify.checkout.total_price;
        var currency = Shopify.checkout.currency;
        var refferer = getCookie('refferer');
        
        // Get product IDs
        var productIds = Shopify.checkout.line_items.map(item => item.product_id);

        // Ensure product_names is scalar if there's only one item
        var productNames = productIds.length === 1 ? productIds[0] : productIds;

      

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
            productIds: productNames // Send product IDs as product_names
        }));

     
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
