let baseUrl = document.URL.split("/");
var lastSegment = baseUrl.pop() || baseUrl.pop(); // handle potential trailing slash

(async function () {
  try {
    const res = await axios.get("/API/articles/" + lastSegment);
    createWholeMarkup(res.data);
  } catch (error) {
    console.error(error);
  }
})();

function createWholeMarkup(res) {
  let productsDiv = document.getElementById("products");
  document.getElementById("farmName").innerHTML = res.farmName;
  let products = res.products;
  for (let i = 0; i < products.length; i++) {
    /* All the products wrapper inside form
     let pForm = document.createElement("form");
     pForm.setAttribute("action", "#");
     productsDiv.append(pForm);

*/
    /* Create one div per product inside form */
    let oneProduct = document.createElement("div");
    oneProduct.classList.add("product");
    oneProduct.setAttribute("id", res._id);
    productsDiv.append(oneProduct);

    /* Create card with product info */
    createCard(products[i], oneProduct);
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
  document.querySelectorAll(".cart")[0].addEventListener("click", addToCart);
}

function addToCart() {
  let productCartDiv = document.getElementById("productCart");
  let cardInfo =
    this.parentElement.parentElement.parentElement.parentElement.parentElement
      .parentElement; //this = inputfield ----- .parent.parent = whole product card class="product"
  let form;
  /* CREATE CART DIV only if there is no CART div, so that it wont create multiply every click */
  if (!document.getElementById("cart")) {
    let cartDiv = document.createElement("div");
    cartDiv.setAttribute("id", "cart");
    cartDiv.className = "red col-md-6";

    productCartDiv.append(cartDiv);

    /* CREATE CART DIV */
    let h3 = document.createElement("h3");
    h3.innerHTML = "Kundvagn:";
    cartDiv.append(h3);
    form = document.createElement("form");
    cartDiv.append(form);
    form.className = "";
    console.log(cardInfo.getAttribute("id"));
    form.innerHTML = `<div class="container" id="productTable">
                        <div class="row red">
                          <p class="col-md-4">Produkt</p>
                          <p class="col-md-2">Antal</p>
                          <p class="col-md-2">Pris</p>
                        </div>
                      </div>`;
  }
  console.log(cardInfo);
  document.getElementById("productTable").innerHTML += `
  <div class="row red">
    <div class="col-md-4"> 
      <img src="pics/logo-nobg100.png" alt="reko-ring logo">
      <input type="hidden" id="custId" name="custId" value="3487">
    </div>
    <div class="col-md-4"> 
      <img src="pics/logo-nobg100.png" alt="reko-ring logo">
    </div>
    <div class="col-md-4"> 
      <img src="pics/logo-nobg100.png" alt="reko-ring logo">
    </div>
  </div>
  </div>`//container div;
}
