getArticle();

async function getArticle() {
  try {
    const res = await axios.get("/articles");
    createWholeMarkup(res.data);
  } catch (error) {
    console.error(error);
  }
}

function createWholeMarkup(res) {
  let articlesDiv = document.getElementById("articles");
  for (let i = 0; i < res.length; i++) {
    let oneArticle = document.createElement("div");
    oneArticle.classList.add("article");
    oneArticle.setAttribute("id", res[i]._id);
    articlesDiv.append(oneArticle);

    /* Create Product information DIV */
    let infoDiv = document.createElement("div");
    infoDiv.classList.add("info");
    oneArticle.append(infoDiv);

    /* Create element description */
    let desc = document.createElement("p");
    desc.innerHTML = res[i].description;
    infoDiv.append(desc);

    /* Create element list products and quantity */

    let ul = document.createElement("ul");
    let li = document.createElement("li");
    ul.append(li);
    infoDiv.append(ul);
    let prod = document.createElement("span");
    let qty = document.createElement("span");
    prod.innerHTML = res[i].product;
    qty.innerHTML = res[i].quantity;
    li.append(prod);
    li.append(qty);

    /* Button to post to Facebook */
    let fbBtn = document.createElement("button");
    fbBtn.classList.add("postToFb");
    fbBtn.setAttribute("id", res[i]._id);
    fbBtn.addEventListener("click", sendDataFacebook);
    fbBtn.innerHTML = "Create FB-post";
    if (res[i].facebookPostID) {
      fbBtn.style.pointerEvents = "none";
      fbBtn.removeEventListener("click", sendDataFacebook);
      fbBtn.style.opacity = 0.5;
    }
    infoDiv.append(fbBtn);

    let postStatus = document.createElement("p");
    postStatus.setAttribute("class", "postStatus");
    infoDiv.append(postStatus);

    if (res[i].facebookPostID) getComments(res[i]._id, res[i].facebookPostID);
  }
}

/**
 * onCLick of PostToFacebook btn, gets one article of the clicked btn and sends to facebook API aka fb.js
 */
async function sendDataFacebook() {
  let resDataString = "";
  try {
    const res = await axios.get("/articles/" + this.getAttribute("id"));
    resDataString =
      res.data.description +
      "\r\n\r\n" +
      "Produkter till försäljning:" +
      "\r\n\r\n" +
      "- " +
      res.data.product +
      " " +
      res.data.quantity;
    postArticle(resDataString, res.data._id);
  } catch (error) {
    console.error(error);
  }
}

/**
 * After a post is made on facebook we have to retrieve the comments on that post
 * This has to be done either with the user pressing a button to get all the comments or with
 * @param {number} articleID gets the pressed articles ID
 */
function getComments(articleID, fbPostID) {
  let articleDiv = document.getElementById(articleID);

  /* Create the main comments div */
  let commentDiv = document.createElement("div");
  commentDiv.classList.add("getFBComments");
  articleDiv.append(commentDiv);

  /* Update comments button */
  let updateCommentsBtn = document.createElement("button");
  updateCommentsBtn.innerHTML = "Update Comments";
  updateCommentsBtn.addEventListener("click", function () {
    updateCommentsDB(fbPostID, articleID); //fb.js
    getOneArticle(articleID);
  });
  commentDiv.append(updateCommentsBtn);
}
async function getOneArticle(articleID) {
  try {
    const res = await axios.get("/articles/" + articleID);
    createCommentsMarkup(res, articleID);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Create HTML after receiving all the data from fb API
 * @param {json} data all comments and replies from a post
 */

function createCommentsMarkup(response, articleID) {
  let commentDiv = document
    .getElementById(articleID)
    .getElementsByClassName("getFBComments")[0];
  let res = response.data.comments;

  /* Create a div that contains all comments*/
  let allCommentsDiv = document.createElement("div");
  allCommentsDiv.classList.add("comments");
  commentDiv.append(allCommentsDiv);



  let embed = document.createElement('div');
  embed.setAttribute('data-href', 'https://www.facebook.com/groups/1338804626636796/posts/1351943298656262/');
  embed.setAttribute('data-width', '');
  embed.setAttribute('data-numposts', '1');
  embed.className.add('fb-comments')
  commentDiv.append(embed)



  /* Create h3 Comments*/
  let h3 = document.createElement("h3");
  h3.innerHTML = "Kommentarer";
  allCommentsDiv.append(h3);
  for (let i = 0; i < res.length; i++) {
    /* Create a div that contains one comment*/
    let oneComment = document.createElement("div");
    oneComment.classList.add("comment");
    oneComment.setAttribute("id", res[i].fbCommentID);
    allCommentsDiv.append(oneComment);
    let message = document.createElement("p");
    message.innerHTML = res[i].message;
    oneComment.append(message);

    /* Create a div that contains two buttons, accept or reject an comment order */
    createResponseButtons(oneComment);
    /* Create a p that contains replie if there is any */
    if (res[i].replies) {
      for (let k = 0; k < res[i].replies.length; k++) {
        let replie = document.createElement("p");
        replie.innerHTML = res[i].replies[k].message;
        replie.classList.add("replie");
        replie.setAttribute("id", res[i].replies[k].fbCommentID);
        oneComment.append(replie);
      }
    }
  } // END i FOR LOOP
}

function createResponseButtons(oneCommentDiv) {
  let btnDiv = document.createElement("div");
  oneCommentDiv.append(btnDiv);
  let accept = document.createElement("button");
  let reject = document.createElement("button");
  accept.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>`;
  reject.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>`;
  accept.classList.add("accept");
  reject.classList.add("reject");
  btnDiv.append(accept);
  btnDiv.append(reject);
  accept.addEventListener('click', function() {
    responseCommentFB('accept');
  })
  reject.addEventListener('click', function() {
    responseCommentFB('reject');
  })
}
