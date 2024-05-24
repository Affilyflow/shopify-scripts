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
    console.log(`Cookie set: ${cookieString}`);
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
  const referrer = document.referrer || "Direct"; // Get the referrer or set to "Direct"

  console.log('Affiliate ID:', affiliateId);
  console.log('Network:', network);
  console.log('Store:', store);
  console.log('Referrer:', referrer);

  if (affiliateId && network && store) {
    setCookie('affiliate_id', affiliateId, 40);
    setCookie('network', network, 40);
    setCookie('store', store, 40);
    setCookie('full_url', window.location.href, 40);
    setCookie('referrer', referrer, 40); // Set the referrer as a cookie
  } else {
    console.log('Missing one or more parameters: affiliateId, network, store');
  }

  // Check if referrer cookie is set, if not set it
  if (!getCookie('referrer')) {
    setCookie('referrer', referrer, 40);
  }

  console.log('Current Cookies:', document.cookie);
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
  var url = getQueryParam('full_url');
  var source = getQueryParam('referrer');

  console.log('Query Parameters:');
  console.log('aff_id:', aff_id);
  console.log('network:', network);
  console.log('store:', store);
  console.log('full_url:', url);
  console.log('referrer:', source);

  if (network && (network.toLowerCase() === 'affilyflow')) {
    fetch('https://xepn-38qp-in4n.f2.xano.io/api:-WVr0FO_/clicks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        aff_id: aff_id, 
        network: network, 
        store: store,
        referrer: document.referrer || "Direct" // Include the referrer in the payload
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('API Response:', data);
    })
    .catch(error => {
      console.error('API Error:', error);
    });
  } else {
    console.log('Network is not affilyflow');
  }
});

