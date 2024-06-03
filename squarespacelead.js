<script>
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

    // Fetch IP address and set cookie
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

    // Function to handle form submission
    function handleFormSubmission(event) {
      event.preventDefault(); // Prevent the default form submission

      // Check if all necessary cookies are present
      const aff_id = getCookie('affiliate_id');
      const network = getCookie('network');
      const store = getCookie('store');
      const referrer = getCookie('referrer');
      const ip = getCookie('ip');

      if (aff_id && network && store && referrer && ip) {
        // Gather form data
        const formData = new FormData(event.target);
        const info = {};
        formData.forEach((value, key) => {
          info[key] = value;
        });

        // Send data to the API
        fetch('https://xepn-38qp-in4n.f2.xano.io/api:-WVr0FO_/sales/lead', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            store: store,
            referrer: referrer,
            aff_id: parseInt(aff_id, 10),
            ip: ip,
            info: info
          })
        })
        .then(response => response.json())
        .then(data => {
          // Handle success response
          console.log('Success:', data);
        })
        .catch(error => {
          // Handle error response
          console.error('API Error:', error);
        });
      } else {
        console.error('Missing required cookies');
      }
    }

    // Add event listener to the Leadsubmit form
    const leadForm = document.querySelector('form[name="Leadsubmit"]');
    if (leadForm) {
      leadForm.addEventListener('submit', handleFormSubmission);
    }
  });
