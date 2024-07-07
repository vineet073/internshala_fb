import React, { useState, useEffect } from 'react';

const appId = process.env.REACT_APP_FB_ID; 
const config_id = process.env.REACT_APP_CONFIG_ID;
console.log("appId: ", appId);
console.log("config_id: ", config_id);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  // const [[profilePicture, setProfilePicture]]=useState(null);
  const [accessToken,setAccessToken]=useState(null);
  // const [pages,setPages]=useState([]);
  const [userID,setUserID]=useState(null);
  
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
    window.FB.login((response) => {
      console.log(response)
      if(response.status==='connected'){
        setAccessToken(response.authResponse.accessToken);
        setUserID(response.authResponse.userID);
      }
    });

    window.FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
        setIsLoggedIn(true);
        fetchUserData(accessToken)
        fetchProfilePicture();
      }
    });
  }

  const fetchUserData = async (accessToken) => {
    window.FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      setUserData(response);
    });
  }

  const fetchProfilePicture = async () => {
    console.log("userID",userID);
    window.FB.api(
      `/${userID}/picture`,
      'GET',
      {},
      function(response) {
        console.log(response);
      }
    );

  };

  return (
    <div className="App">
      {!isLoggedIn && (
        <button onClick={()=>handleLogin()}>Login with Facebook</button>
      )}
      {isLoggedIn && (
        <div>
          <h1>Welcome, {userData?.name}</h1>
          
        </div>
      )}
    </div>
  );
}

export default App;