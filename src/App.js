import React, { useState, useEffect } from 'react';

const appId = process.env.REACT_APP_FB_ID; 
const config_id = process.env.REACT_APP_CONFIG_ID;
console.log("appId: ", appId);
console.log("config_id: ", config_id);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [accessToken,setAccessToken]=useState(null);
  const [userID,setUserID]=useState(null);
  const [profilePic, setProfilePic] = useState('');
  const [userPosts, setUserPosts] = useState([]);

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
      
      window.FB.getLoginStatus((response) => {
        console.log("login status :", response);
        if (response.status === 'connected') {
          setIsLoggedIn(true);
        }
      });
    };    
  }, []);
  


  const handleLogin = () => {  
    window.FB.login((response) => {
      console.log("response :", response)
      if(response.status==='connected'){
        setAccessToken(response.authResponse.accessToken);
        setUserID(response.authResponse.userID);
        fetchUserData();
        fetchUserPosts();
      }
    });
  }

  const fetchUserData = () => {
    window.FB.api('/me?fields=name,email,picture', function(response) {
      setUserData(response);
      if (response.picture && response.picture.data && response.picture.data.url) {
        setProfilePic(response.picture.data.url);
        console.log("profile data :", userData)
      }
    });
  }

  console.log("user id before :", userID);

  const fetchUserPosts = () => {
    window.FB.api('/me/posts?fields=message,likes.summary(true),comments.summary(true),shares', function(response) {
      if (response && response.data) {
        setUserPosts(response.data);
        console.log("user posts :", userPosts)
      }
    });

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