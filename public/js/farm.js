let baseUrl = document.URL.split("/");
var lastSegment = baseUrl.pop() || baseUrl.pop(); // handle potential trailing slash

(async function () {
  try {
    const res = await axios.get("/API/articles/" + lastSegment);
    const res2 = await axios.get("/API/products/articleid/" + lastSegment);
    createWholeMarkup(res.data, res2.data);
  } catch (error) {
    console.error(error);
  }
})();

function createWholeMarkup(resFarmInfo, resProductInfo) {
  let productsDiv = document.getElementById("products");
  document.getElementById("farmName").innerHTML = resFarmInfo.farmName;
  document.getElementById("farmDesc").innerHTML = resFarmInfo.description;

  for (let i = 0; i < resProductInfo.length; i++) {
    /* All the products wrapper inside form
     let pForm = document.createElement("form");
     pForm.setAttribute("action", "#");
     productsDiv.append(pForm);

*/
    /* Create one div per product inside form */
    let oneProduct = document.createElement("div");
    oneProduct.classList.add("product");
    oneProduct.setAttribute("id", resProductInfo[i]._id);
    productsDiv.append(oneProduct);

    /* Create card with product info */
    createCard(resProductInfo[i], oneProduct);
  }
}

function createCard(product, oneProductDiv) {
  if (product.pImg == "") product.pImg = "/pics/no-image.jpg";
  markupHTML = `<div class="card mb-3" style="max-width: 540px;">
                          <div class="row g-0">
                            <div class="col-md-4">
                              <img src="${product.pImg}" class="img-fluid rounded-start" alt="image of the product">
                            </div>
                            <div class="col-md-8">
                              <div class="card-body text-center">
                                <h5 class="card-title">${product.pName}</h5>
                                <p class="card-text">${product.pDesc}</p>
                                <div class="d-flex justify-content-around">
                                  <p class="card-text"><b>Pris:</b> ${product.pPrice}</p>
                                  <p class="card-text"><b>Antal i lager:</b> ${product.pQuantity}</p>
                                </div>
                                <div class="d-flex justify-content-around">
                                <input type="number" class="form-control" id="quantity" name="cart[][pQuantity]" min="1" max="${product.pQuantity}" required/>
                                <button class="cart">Lägg till i kundvagn</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>`;
  oneProductDiv.innerHTML = markupHTML;
  for (let i = 0; i < document.querySelectorAll(".cart").length; i++)
    document.querySelectorAll(".cart")[i].addEventListener("click", addToCart);
}

function addToCart() {
  /* BASE LAYOUT FOR CART SHOULD ONLY BE CREATED ONCE PER BTN CLICK*/
  if (!document.getElementById("cart")) cartLayout();
  
  addProductToCart(this);
}

/**
 * @description adds cartHeader layout, should only be called the first time user clicks on add to cart
 */

function cartLayout() {
  let productCartDiv = document.getElementById("productCart");
  let cartDiv = document.createElement("div");
  cartDiv.setAttribute("id", "cart");
  cartDiv.className = "red col-md-6";

  productCartDiv.append(cartDiv);

  /* CREATE CART DIV */
  let h3 = document.createElement("h3");
  h3.innerHTML = "Kundvagn";
  h3.className = "text-center";
  cartDiv.append(h3);
  let form = document.createElement("form");
  form.setAttribute("method", "POST");
  form.setAttribute("action", "/completed-cart");

  cartDiv.append(form);
  form.className = "";
  form.innerHTML = `<div class="container" id="productTable">
                        <div class="cartHeader row">
                          <p class="col-md-6">Produkt</p>
                          <p class="col-md-2">Antal</p>
                          <p class="col-md-2">Pris</p>
                        </div>
                      </div>`;
}

/**
 * @description adds products to the cart based on which add to cart button gets clicked
 */
async function addProductToCart(self) {
  const userID = window.localStorage.getItem('userID');
  let cartItemsNr = document.querySelectorAll('.cartProduct').length;
  let cardInfo =
    self.parentElement.parentElement.parentElement.parentElement.parentElement
      .parentElement; //returns div class=product with product_id
  let productID = cardInfo.getAttribute("id");
  try {
    const res = await axios.get("/API/products/" + productID);
    if (res.data.pImg == "") res.data.pImg = "/pics/no-image.jpg";
    document.getElementById("productTable").innerHTML += `
  <div class="cartProduct row align-items-center">
    <div class="col-md-2"> 
      <img src="${res.data.pImg}" class="img-fluid" alt="Product img">
      <input type="hidden" id="custId" name="cart[${cartItemsNr}][userID]" value="${userID}">
      <input type="hidden" id="custId" name="cart[${cartItemsNr}][articleID]" value="${lastSegment}">
      <input type="hidden" id="custId" name="cart[0][products][${cartItemsNr}][pID]" value="${res.data._id}">
      <input type="hidden" id="custId" name="cart[0][products][${cartItemsNr}][pQuantity]" value="${res.data.pQuantity}">
      <input type="hidden" id="custId" name="cart[0][products][${cartItemsNr}][pPrice]" value="${res.data.pPrice}">
    </div>
    <div class="col-md-4"> 
      <p>${res.data.pName}</p>
    </div>
    <div class="col-md-2"> 
      <p>${res.data.pQuantity}</p>
    </div>
    <div class="col-md-2"> 
      <p>${res.data.pPrice}</p>
    </div>
    <div class="col-md-2 mb-3"> 
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path>
          <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path>
        </svg>
    </div>
  </div>`;

    /* Add submit button only once, and append it every time as lastchild*/
    if (!document.getElementById("cartSubmit")) addSubmitBtn();
    else {
      var d = document.getElementById("cartSubmit");
      d.parentNode.appendChild(d);
    }
  } catch (error) {
    console.error(error);
  }
}

function addSubmitBtn() {
  document.getElementById(
    "productTable"
  ).innerHTML += `<div id="cartSubmit" class="row"><input type="submit" value="Bekräfta Köp" onClick="confirmCart()"></div></div>`;
}

function confirmCart() {
    document.getElementById('showCartResult').style.display = "block";
}