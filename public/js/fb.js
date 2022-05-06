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
  console.log(response); // The current login status of the person.
  if (response.status === "connected") {
    // Logged into your webpage and Facebook.
    console.log("LOGGED IN");
    document.querySelector("main").classList.remove("is_blurred");
    document.querySelector("#login-popup").style.display = "none";
    document.querySelector("#logoutBtn").style.display = "block";
    getUserInfo();
  } else {
    // Not logged into your webpage or we are unable to tell.
    document.querySelector("main").removeEventListener("click", function () {});

    console.log("NOT LOGGED IN");
  }
}

async function saveUserCreds(res) {
  try {
    const response = await axios.post("/API/users", {
      username: res.name,
      fbUserId: res.id,
    });
    console.log(response);
  } catch (error) {
    console.log(error);
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

function getUserInfo() {
  // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
  FB.api("/me?", function (response) {
    console.log("Successful login for: " + response.name);
    saveUserCreds(response);
  });
}

/**
 * post article to facebook
 * @type \r\n\r\n generates new line aka <br>
 * @param {string} message a string with all the text that gets posted to facebook, ie description,product, quantity
 * @param {number} articleID the id of the article that will get posted, used to notice the user that the post has been created.
 */

function postArticle(message, articleID) {
  FB.api(
    "/1338804626636796/feed",
    "POST",
    { message: message },
    function (res) {
      console.log(res.error);
      if (res != res.error) {
        document
          .getElementById(articleID)
          .getElementsByClassName("postStatus")[0].innerHTML =
          "Ditt facebook inlägg har nu skapats!";

        axios
          .put("/article/" + articleID, { facebookID: res.id })
          .then(response => {
            console.log(response);
          });
      }
      if (res.error) {
        document
          .getElementById(articleID)
          .getElementsByClassName("postStatus")[0].innerHTML =
          "Något gick fel, ditt inlägg har inte skapats. Har du loggat in?";
        console.log(res.error);
      }
    }
  );
}
