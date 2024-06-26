document.addEventListener("DOMContentLoaded", function() {
  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    const cookieString = `${name}=${value || ""}${expires}; path=/;`;
    document.cookie = cookieString;
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  const urlParams = new URLSearchParams(window.location.search);
  const affiliateId = urlParams.get('aff_id');
  const network = urlParams.get('network');
  const store = urlParams.get('store'); // Get 'store' parameter from the URL
  const referrer = document.referrer || "Direct"; // Get the referrer or set to "Direct" if no referrer is available

  if (affiliateId && network && store) {
    setCookie('affiliate_id', affiliateId, 40);
    setCookie('network', network, 40);
    setCookie('store', store, 40);
    setCookie('full_url', window.location.href, 40);
    setCookie('referrer', referrer, 40); // Set the referrer as a cookie
  }

  // Check if referrer cookie is set, if not set it
  if (!getCookie('referrer')) {
    setCookie('referrer', referrer, 40);
  }
});

document.addEventListener('DOMContentLoaded', function() {
  function getQueryParam(param) {
    var result = window.location.search.match(
      new RegExp("(\\?|&)" + param + "(\\[\\])?=([^&]*)")
    );
    return result ? result[3] : null;
  }

  // Extract query parameters and referrer
  var aff_id = getQueryParam('aff_id');
  var network = getQueryParam('network');
  var store = getQueryParam('store');
  var full_url = window.location.href; // Get the full URL of the current page
  var referrer = document.referrer || "Direct"; // Get the referrer or set to "Direct"

  // Send the data to the API if the network is 'affilyflow'
  if (network && (network.toLowerCase() === 'affilyflow')) {
    fetch('https://xepn-38qp-in4n.f2.xano.io/api:-WVr0FO_/clicks/click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        aff_id: aff_id, 
        network: network, 
        store: store,
        full_url: full_url, // Include the full URL in the payload
        referrer: referrer // Include the referrer in the payload
      })
    })
    .then(response => response.json())
    .catch(error => {
      console.error('API Error:', error);
    });
  }
});


