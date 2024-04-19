<script>
  document.addEventListener("DOMContentLoaded", function() {
    console.log("Running Cookie Capturing Script");

    function setCookie(name, value, days) {
      let expires = "";
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    const urlParams = new URLSearchParams(window.location.search);
    const affiliateId = urlParams.get('aff_id');
    const network = urlParams.get('network');
    const store = urlParams.get('store');  // Get 'store' parameter from the URL

    if (affiliateId && network && store) {
      // Set cookies for all parameters and the full URL, only if all three parameters are present
      setCookie('affiliate_id', affiliateId, 40);
      setCookie('network', network, 40);
      setCookie('store', store, 40);
      setCookie('full_url', window.location.href, 40);
      console.log("Set cookies for all parameters and full URL:", document.cookie);
    }
  });
</script>

<script>
  console.log("Running Click Tracking Script");

  function getQueryParam(param) {
    var result = window.location.search.match(
      new RegExp("(\\?|&)" + param + "(\\[\\])?=([^&]*)")
    );
    return result ? result[3] : null;
  }

  document.addEventListener('DOMContentLoaded', function() {
    var aff_id = getQueryParam('aff_id');
    var network = getQueryParam('network');
    var store = getQueryParam('store');
    console.log("URL Parameters:", aff_id, network, store);

    if (aff_id && network === 'AffilyFlow') {  // Corrected line here
        console.log("Sending click data...");
        fetch('https://xepn-38qp-in4n.f2.xano.io/api:-WVr0FO_/Affiliate_clicks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ aff_id: aff_id, network: network, store: store })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Click data sent successfully:', data);
        })
        .catch(error => {
            console.log('Error sending click data:', error);
        });
    } else {
        console.log("No valid data to send.");
    }
  });
</script>
