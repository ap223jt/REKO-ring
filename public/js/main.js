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