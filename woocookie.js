document.addEventListener("DOMContentLoaded", function() {
  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
    console.log(`Cookie set: ${name}=${value} (expires in ${days} days)`);
  }

  const urlParams = new URLSearchParams(window.location.search);
  const affiliateId = urlParams.get('aff_id');
  const network = urlParams.get('network');
  const store = urlParams.get('store'); // Get 'store' parameter from the URL

  console.log("URL Parameters:");
  console.log("Affiliate ID:", affiliateId);
  console.log("Network:", network);
  console.log("Store:", store);

  if (affiliateId && network && store) {
    setCookie('affiliate_id', affiliateId, 40);
    setCookie('network', network, 40);
    setCookie('store', store, 40);
    setCookie('full_url', window.location.href, 40);
  } else {
    console.warn("Missing one or more required URL parameters (aff_id, network, store).");
  }
});

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

  console.log("Extracted Query Parameters:");
  console.log("Affiliate ID:", aff_id);
  console.log("Network:", network);
  console.log("Store:", store);

  // Make the network check case-insensitive by converting to lowercase
  if (network && network.toLowerCase() === 'affilyflow'.toLowerCase()) {
    console.log("Network matches 'AffilyFlow'. Proceeding with API call...");

    const requestData = { aff_id: aff_id, network: network, store: store };
    console.log("API Request Data:", requestData);

    fetch('https://xepn-38qp-in4n.f2.xano.io/api:-WVr0FO_/clicks/click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("API Response Data:", data);  // Log the successful API response
    })
    .catch(error => {
      console.error("API fetch error:", error);  // Log any errors in the fetch request
    });
  } else {
    console.warn(`Network parameter does not match 'AffilyFlow'. Current network: ${network}`);
  }
});

