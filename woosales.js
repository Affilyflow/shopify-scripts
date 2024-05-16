add_action('woocommerce_thankyou', 'send_order_data_to_affiliate', 10, 1);

function send_order_data_to_affiliate($order_id) {
    $order = wc_get_order($order_id);

    // Extracting order data
    $order_total = $order->get_total();
    $currency = $order->get_currency();
    $product_names = [];

    foreach ($order->get_items() as $item) {
        $product_names[] = $item->get_name();
    }
    $product_names = implode(", ", $product_names);

    ?>
    <script>
    document.addEventListener("DOMContentLoaded", function() {
        function getCookie(name) {
            var value = "; " + document.cookie;
            var parts = value.split("; " + name + "=");
            if (parts.length === 2) return parts.pop().split(";").shift();
        }

        console.log("JavaScript Loaded");

        var aff_id = getCookie('affiliate_id');
        var network = getCookie('network');
        var store = getCookie('store');
        var fullUrl = getCookie('full_url');

        var orderId = "<?php echo $order_id; ?>";
        var orderTotal = "<?php echo $order_total; ?>";
        var currency = "<?php echo $currency; ?>";
        var productNames = "<?php echo $product_names; ?>";

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
        console.log("Preparing to send AJAX request");

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

        sendHeartbeat();
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
    </script>
    <?php
}

