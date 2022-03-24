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
  for (let i = 0; i < res.length; i++){
    let oneArticle = document.createElement("div");
    oneArticle.classList.add("article");
    articlesDiv.append(oneArticle);

    /* Create element description */
    let desc = document.createElement('p');
    desc.innerHTML = res[i].description;
    oneArticle.append(desc);

    /* Create element list products and quantity */
    let ul = document.createElement('ul');
    let li = document.createElement('li');
    ul.append(li);
    oneArticle.append(ul);
    let prod = document.createElement('p');
    let qty = document.createElement('span');
    prod.innerHTML = res[i].product;
    qty.innerHTML = res[i].quantity
    li.append(prod);
    li.append(qty);

    /* Button to post to Facebook */
    let fbBtn = document.createElement('button');
    fbBtn.classList.add('postToFb');
    fbBtn.addEventListener("click", sendDataFacebook);
    fbBtn.innerHTML = 'Create FB-post';
    oneArticle.append(fbBtn);
  }
}


function sendDataFacebook(e) {
  console.log();
}