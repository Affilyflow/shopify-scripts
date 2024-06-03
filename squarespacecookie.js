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

    // Function to fetch IP address and set cookie
    function setIPCookie() {
      fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
          const currentIP = getCookie('ip');
          if (currentIP !== data.ip) {
            setCookie('ip', data.ip, 7);
          }
        })
        .catch(error => console.error('Error fetching IP address:', error));
    }

    // Call the function to set IP cookie
    setIPCookie();

    // Extract query parameters and referrer
    const urlParams = new URLSearchParams(window.location.search);
    const affiliateId = urlParams.get('aff_id');
    const network = urlParams.get('network');
    const store = urlParams.get('store'); // Get 'store' parameter from the URL
    const referrer = document.referrer || "Direct"; // Get the referrer or set to "Direct" if no referrer is available

    let newParams = false;

    if (affiliateId && network && store) {
      if (getCookie('affiliate_id') !== affiliateId) {
        setCookie('affiliate_id', affiliateId, 40);
        newParams = true;
      }
      if (getCookie('network') !== network) {
        setCookie('network', network, 40);
        newParams = true;
      }
      if (getCookie('store') !== store) {
        setCookie('store', store, 40);
        newParams = true;
      }
      if (getCookie('full_url') !== window.location.href) {
        setCookie('full_url', window.location.href, 40);
        newParams = true;
      }
      if (getCookie('referrer') !== referrer) {
        setCookie('referrer', referrer, 40);
        newParams = true;
      }
    }

    // Check if referrer cookie is set, if not set it
    if (!getCookie('referrer')) {
      setCookie('referrer', referrer, 40);
      newParams = true;
    }

    // Only send data if there are new parameters and the IP cookie is set
    if (newParams && getCookie('ip') && network && (network.toLowerCase() === 'affilyflow')) {
      fetch('https://xepn-38qp-in4n.f2.xano.io/api:-WVr0FO_/clicks/click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          aff_id: affiliateId,
          network: network,
          store: store,
          full_url: window.location.href, // Include the full URL in the payload
          referrer: referrer // Include the referrer in the payload
        })
      })
      .then(response => response.json())
      .catch(error => {
        console.error('API Error:', error);
      });
    }
  });
