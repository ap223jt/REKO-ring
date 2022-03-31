window.fbAsyncInit = function () {
  FB.init({
    appId: 2835260340101626,
    autoLogAppEvents: true,
    xfbml: true,
    version: "v13.0",
    status: true,
  });

  FB.getLoginStatus(function (response) {
    statusChangeCallback(response);
  });
};

/**
 *   Called when a person is finished with the Login Button.
 */
 function checkLoginState() {
  FB.getLoginStatus(function (response) {
    // See the onlogin handler
    statusChangeCallback(response);
  });
}

/**
 * @param {*} response 
 * Check if user logged in
 */
function statusChangeCallback(response) {
  // Called with the results from FB.getLoginStatus().
  console.log("statusChangeCallback");
  console.log(response); // The current login status of the person.
  if (response.status === "connected") {
    // Logged into your webpage and Facebook.
    console.log("LOGGED IN");
    testAPI();
    document.querySelector(".fb-login-button").style.display = "none";
    document.querySelector("#logoutBtn").style.display = "block";
  } else {
    // Not logged into your webpage or we are unable to tell.
    console.log("NOT LOGGED IN");
    document.querySelector(".fb-login-button").style.display = "block";
    document.querySelector("#logoutBtn").style.display = "none";

  }
}

/**
 * onClick event on logout
 */
function facebookLogout() {
  FB.getLoginStatus(function (response) {
    FB.logout(function (response) {
      window.location = "/";
      document.getElementById("logoutBtn").style.display = "none";
    });
  });
}

function testAPI() {
  // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
  console.log("Welcome!  Fetching your information.... ");
  FB.api("/me", function (response) {
    console.log("Successful login for: " + response.name);
    console.log(response);
  });
}


/**
 * post article to facebook
 * @type \r\n\r\n generates new line aka <br>
 * @param {string} message a string with all the text that gets posted to facebook, ie description,product, quantity
 * @param {number} articleID the id of the article that will get posted, used to notice the user that the post has been created.
 */

function postArticle(message,articleID) {
  FB.api(
    '/1338804626636796/feed',
    'POST',
    {"message": message},
    function(res) {
      console.log(res.error);
      if (res != res.error){
        document.getElementById(articleID).getElementsByClassName('postStatus')[0].innerHTML = 'Ditt facebook inlägg har nu skapats!';

        axios.put("/article/"+articleID,  {facebookID: res.id}).then((response) => {console.log(response)})
      }
      if (res.error) {
        document.getElementById(articleID).getElementsByClassName('postStatus')[0].innerHTML = 'Något gick fel, ditt inlägg har inte skapats. Har du loggat in?';
        console.log(res.error);
      }
    }
  );
}



/**
 * gets all the comments of a FACEBOOK POST
 * @param {number} fbPostID when postArticle generates a facebook post, that post gets an ID.. This is that facebook generated id
 * @param {number} articleID one articles ID from mongoDB db
 */
function getArticleComments(fbPostID, articleID) {
  FB.api(
    `${fbPostID}/comments?fields=message,comments{message,comments}`,
    'GET',
    {},
    function(res) {
      let data = {};
      let commentData = {};
      for (let i = 0; i < res.data.length; i++){
        if (res.data[i].comments) {
          for (let k = 0; k < res.data[i].comments.data.length; k++){
              commentData[k] = {
                fbCommentID: res.data[i].comments.data[k].id,
                message: res.data[i].comments.data[k].message
              }
          }
        } else commentData = {};

        data = {
          fbCommentID: res.data[i].id,
          articleID: articleID,
          fbPostID: fbPostID,
          message: res.data[i].message,
          replies: commentData
        };
        axios.patch("/articles/"+articleID,  {data:data})
        .then((response) => {console.log(response)})
        .catch((error) => {console.log(error)})
      }
    }
  );
}