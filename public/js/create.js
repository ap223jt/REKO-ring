
/**
 * Add more products FORM
 */
 let addMoreProducts = document.querySelector("#addMoreProducts")
 
 if (addMoreProducts)
 addMoreProducts.addEventListener("click", function () {
    let container = document.createElement("div");
    container.classList.add("product");
    container.classList.add("container");
    let productContainer = document.querySelector("#addProducts");
    let index = document.querySelectorAll('#addProducts .container').length;
    appendHTML = `<div class="row">
                      <div class="col-md-6">
                        <label for="productNamn" class="form-label">Produkt namn</label>
                        <input type="text" class="form-control" id="product" placeholder="Vita ägg 24st/pack" name="products[${index}][pName]" required/>
                      </div>

                      <div class="col-md-3">
                        <label for="quantity" class="form-label">Antal pack/liter/vikt</label>
                        <input type="number" class="form-control" id="quantity" name="products[${index}][pQuantity]" required/>
                      </div>
                      <div class="col-md-3">
                        <label for="quantity" class="form-label">Pris</label>
                        <input type="number" class="form-control" id="price" name="products[${index}][pPrice]" step=".01" required/>
                    </div>
                    </div>

                    <div class="row">
                      <div class="col-md-8">
                        <label for="productNamn" class="form-label">Valfri beskrivnig av produkten <span
                            class="smallText">(valfri)</span></label>
                        <input type="text" class="form-control" id="product" placeholder="Våra godaste ägg..köps 24st per paket"
                          name="products[${index}][pDesc]" />
                      </div>

                      <div class="col-md-4 align-self-end">
                        <label for="productPic" class="form-label">Lägg till bild <span
                            class="smallText">(valfri)</span></label>
                        <input type="file" id="productPic" name="products[${index}][pImg]">
                      </div>
                    </div>`;
    container.innerHTML = appendHTML;
    productContainer.append(container);
  });









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
