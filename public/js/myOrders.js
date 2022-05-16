const userID = window.localStorage.getItem("userID");
(async function () {
  try {
    const res = await axios.get("/API/carts/" + userID);
    createWholeMarkup(res.data);
  } catch (error) {
    console.error(error);
  }
})();

async function createWholeMarkup(res) {
  let pendingOrders = document.getElementById("activeOrders");
  let oldOrders = document.getElementById("oldOrders");
  let canceledOrders = document.getElementById("canceledOrders");
  let totalCartPrice = 0;
  let oneDiv;

  for (let i = 0; i < res.length; i++) {

    try {
      const resProduct = await axios.get("/API/articles/" + res[i].articleID);
      const resFarm = await axios.get("/API/farms/" + res[i].articleID);
      oneDiv = createDivAndFarmName(res[i],resFarm.data[0]);
    } catch (error) {
      console.log(error);
    }
    /* DISPLAY PRODUCTS ON ONE CART */
    createCartProducts(res[i],oneDiv,totalCartPrice)
    /* INSERT ONE DIV BASED ON ORDER STATUS */
    if (res[i].orderStatus == "pending") pendingOrders.append(oneDiv);
    if (res[i].orderStatus == "accepted") oldOrders.append(oneDiv);
    if (res[i].orderStatus == "cancelled") canceledOrders.append(oneDiv);
  }
}

function createDivAndFarmName(res,resFarm) {
  let oneDiv = document.createElement("div");
  oneDiv.setAttribute("id", `${res.articleID}`);
  oneDiv.className = "oneOrder d-flex flex-column align-items-center";
  let farmNameDiv = document.createElement("div");
  let h3 = document.createElement("h3");
  h3.innerHTML += resFarm.farmName;
  farmNameDiv.append(h3);
  oneDiv.append(farmNameDiv);

  return oneDiv;
}

function createCartProducts(res, oneDiv, totalCartPrice) {
  for (let k = 0; k < res.products.length; k++) {
    oneDiv.innerHTML += `<div class="item container-fluid d-flex align-items-end">
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
    totalCartPrice += parseInt(res.products[k].pPrice);
  }

  oneDiv.innerHTML += `<div class="d-flex align-self-end orderPrice ">
                        <span>Totalt pris: <b>${totalCartPrice}:-</b></span>
                      </div>`;
  oneDiv.innerHTML += `<div class="d-flex align-self-start mt-3">
                        <span>Order skapad: ${res.createdAt}</span>
                      </div>`;
  oneDiv.innerHTML += `<div class="d-flex orderStatus ${res.orderStatus}">
                        <span class="status">${res.orderStatus}</span>
                      </div>`;
}
