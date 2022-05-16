const userID = window.localStorage.getItem("userID");

(async function () {
  try {
    const resFarm = await axios.get("/API/farms/" + userID);
    const resArticle = await axios.get(
      "/API/articles/farmid/" + resFarm.data[0]._id
    );
    createWholeMarkup(resFarm.data, resArticle.data);
  } catch (error) {
    console.error(error);
  }
})();

async function createWholeMarkup(resFarm, resArticle) {
  let pendingOrders = document.getElementById("activeOrders");
  let oldOrders = document.getElementById("oldOrders");
  let totalCartPrice = 0;
  let oneDiv;

  for (let i = 0; i < resArticle.length; i++) {
    oneDiv = createDivAndFarmName(resArticle[i], resFarm[0]);
    /* DISPLAY PRODUCTS ON ONE CART */
    createCartProducts(resArticle[i], oneDiv, totalCartPrice);

    try {
      const resCart = await axios.get(
        "/API/carts/articleid/" + resArticle[i]._id
      );
      getCartOrders(oneDiv, resCart.data);
    } catch (error) {
      console.log(error);
    }

    pendingOrders.append(oneDiv);
    /* INSERT ONE DIV BASED ON ORDER STATUS
      if (res[i].orderStatus == "pending") pendingOrders.append(oneDiv);
      if (res[i].orderStatus == "accepted") oldOrders.append(oneDiv);
      if (res[i].orderStatus == "cancelled") canceledOrders.append(oneDiv);
       */
  }
}


function createDivAndFarmName(resArticle, resFarm) {
  let oneDiv = document.createElement("div");
  oneDiv.setAttribute("id", `${resArticle.farmID}`);
  oneDiv.className =
    "oneOrder oneFarmOrder d-flex flex-column align-items-center";

  /* ONE DIV PER ARTICLE WITH FARM NAME AND DEALING DATE ON TOP */
  let farmNameDiv = document.createElement("div");
  farmNameDiv.className += "text-center";
  let p = document.createElement("p");
  p.innerHTML = "<i>Utlämningsdatum:</i> " + resArticle.dealingDate;
  farmNameDiv.append(p);
  let h3 = document.createElement("h3");
  h3.innerHTML += resFarm.farmName;
  farmNameDiv.append(h3);
  oneDiv.append(farmNameDiv);

  return oneDiv;
}

function createCartProducts(res, oneDiv, totalCartPrice) {
  for (let k = 0; k < res.products.length; k++) {
    if (res.products[k].pImg == "") res.products[k].pImg = "/no-image.jpg";
    oneDiv.innerHTML += `
      <div class="item container-fluid d-flex align-items-end">
        <div class="col-md-4"> 
          <img src="../pics/${res.products[k].pImg}" class="img-fluid cartImg" alt="Product img">
        </div>
        <div class="col-md-4"> 
          <p>${res.products[k].pName}</p>
        </div>
        <div class="col-md-2"> 
          <p>${res.products[k].pQuantity}st</p>
        </div>
        <div class="col-md-2"> 
          <p>${res.products[k].pPrice}:-</p>
        </div>
      </div>`;
  }
}

async function getCartOrders(oneDiv, resCart) {
  let oneUserDiv = document.createElement("div");
  oneUserDiv.className += "list-group d-flex oneUserDiv pt-3";
  oneUserDiv.innerHTML += `<div class="d-flex flex-row justify-content-center"><h5 class="text-center">Beställningar</h5></div>`;
  for (let i = 0; i < resCart.length; i++) {
    try {
      const resUser = await axios.get(
        "/API/users/fbuserid/" + resCart[i].userID
      );

      /* LIST USERNAMES DIV*/
      let user = document.createElement("div");
      user.className += "list-group-item d-flex flex-row container";
      user.innerHTML += `<div><p>` + resUser.data[0].username + `</p></div>`;

      /* LIST PRODUCT BOUGHT DIV*/
      let ul = document.createElement("ul");
      for (k = 0; k < resCart[i].products.length; k++) {
        let li = document.createElement("li");
        li.innerHTML +=
          resCart[i].products[k].pName +
          " " +
          resCart[i].products[k].pQuantity +
          "st";
        ul.append(li);
      }
      user.append(ul);

      /* LIST USERS THAT BOUGHT WITH QUANTITY AND ACCEPT AND RECEJT ORDER BUTTONS*/
      if (resCart[i].orderStatus == "accepted")
        user.className += " bg-success text-white";
      if (resCart[i].orderStatus == "rejected")
        user.className += " bg-danger text-white";

      if (resCart[i].orderStatus == "pending") {
        let acceptRejectDiv = document.createElement("div");
        acceptRejectDiv.innerHTML += `
        <form action="/change-orderstatus" method="POST">
          <button type="submit" class="btn btn-success" name="orderStatus" value="accepted">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
              <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
            </svg>
          </button>
          <button type="submit" class="btn btn-success" name="orderStatus" value="rejected">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
          <input type="hidden" id="cartID" name="cartID" value="${resCart[i]._id}">
        </form>
        `;
        user.append(acceptRejectDiv);
      }
      oneUserDiv.append(user);
    } catch (error) {
      console.log(error);
    }
  }
  exportXLS(oneUserDiv);
  oneDiv.append(oneUserDiv);
}

function exportXLS(oneUserDiv) {
  oneUserDiv.firstChild.innerHTML += `
  <form action="/export-xls" method="POST" id="exportXL">
    <button type="submit" class="btn btn-success">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-spreadsheet-fill" viewBox="0 0 16 16">
        <path d="M12 0H4a2 2 0 0 0-2 2v4h12V2a2 2 0 0 0-2-2zm2 7h-4v2h4V7zm0 3h-4v2h4v-2zm0 3h-4v3h2a2 2 0 0 0 2-2v-1zm-5 3v-3H6v3h3zm-4 0v-3H2v1a2 2 0 0 0 2 2h1zm-3-4h3v-2H2v2zm0-3h3V7H2v2zm4 0V7h3v2H6zm0 1h3v2H6v-2z"/>
      </svg>
    </button>
    <div class="hiddenInputs"></div>
    </form>`

let liItems = oneUserDiv.getElementsByClassName('list-group-item');
let hiddenInputs = oneUserDiv.getElementsByClassName('hiddenInputs');
console.log(liItems);
for (let i = 0; i < liItems.length; i++){
  hiddenInputs[0].innerHTML += `<input type="hidden" id="" name="export[${i}][username]" value="${liItems[i].children[0].firstChild.innerHTML}">`
  for (let k = 0; k < liItems[i].children[1].children.length; k++){
    console.log(liItems[i].children[1].children[k].innerHTML);
    hiddenInputs[0].innerHTML += `<input type="hidden" id="" name="export[${i}][products][${k}]" value="${liItems[i].children[1].children[k].innerHTML}">`
  }

}

}
