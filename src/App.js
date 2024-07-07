import React, { useState, useEffect } from 'react';

const appId = process.env.REACT_APP_FB_ID; 
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

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
  }, []); 

  const handleLogin = () => {
    window.FB.login((response)=>{
      console.log("response: ", response);
    },
  {
    config_id:process.env.REACT_APP_CONFIG_ID
  })

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