import React, { useState, useEffect } from 'react';

const appId = process.env.REACT_APP_FB_ID; 
const config_id = process.env.REACT_APP_CONFIG_ID;
console.log("appId: ", appId);
console.log("config_id: ", config_id);
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [fbSDKLoaded, setFbSDKLoaded] = useState(false); 
  
  useEffect(() => {
    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
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
      window.FB.AppEvents.logPageView();      
    };
    setFbSDKLoaded(true);
  }, []); 

  const handleLogin = () => {
    if (!fbSDKLoaded) {
      console.error("FB SDK not initialized yet.");
      return;
    }
    
    window.FB.login(
      function(response) {
        console.log(response);
      },
      {
        config_id: config_id
      }
    );

    window.FB.getLoginStatus((response) => {
      console.log("login status: ", response)
      if (response.status === 'connected') {
        setIsLoggedIn(true);
        window.FB.api('/me', (response) => {
          setUserData(response);
        });
      }
    });
  }


  return (
    <div className="App">
      {!isLoggedIn && (
        <button onClick={handleLogin}>Login with Facebook</button>
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