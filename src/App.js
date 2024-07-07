import React, { useState, useEffect } from 'react';

const appId = process.env.REACT_APP_FB_ID; 
console.log(appId);
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) { return; }
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));


    window.fbAsyncInit = function() {
      window.FB.init({
        appId,
        cookie: true,
        xfbml: true,
        version: 'v20.0'
      });


      window.FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
      });
    };
  }, []); 

  const statusChangeCallback = (response) => {
    if (response.status === 'connected') {
      setIsLoggedIn(true);
      fetchUserData();
    } else {
      setIsLoggedIn(false);
      setUserData(null);
    }
  };

  const fetchUserData = () => {
    window.FB.api('/me', {fields: 'name,email'}, function(response) {
      setUserData(response);
    });
  };

  const handleLogin = () => {
    window.FB.login(function(response) {
      statusChangeCallback(response);
    }, {scope: 'public_profile,email'});
  };

  return (
    <div className="App">
      {!isLoggedIn && (
        <button onClick={handleLogin}>
          Login with Facebook
        </button>
      )}
      {isLoggedIn && (
        <div>
          <h1>Welcome, {userData?.name}</h1>
          <p>Email: {userData?.email}</p>
        </div>
      )}
    </div>
  );
}

export default App;