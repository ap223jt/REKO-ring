const userID = window.localStorage.getItem("userID");
document.getElementById("fbUserID").value = userID;

(async function () {
  try {
    const res = await axios.get("/API/farms/" + userID);
    createWholeMarkup(res.data);
    inputsPlaceholders(res.data);
  } catch (error) {
    console.error(error);
  }
})();

function createWholeMarkup(res) {
  let articlesDiv = document.getElementById("articles");
  for (let i = 0; i < res.length; i++) {
    /* Create one div per article */
    if (res[i].farmImg == "") res[i].farmImg = "../pics/no-image.jpg";
    articlesDiv.innerHTML += `<div class="article" id="${res[i]._id}">
      <img class="img-fluid" src="../pics/${res[i].farmImg}" alt="Card image">
      <div class="cardOverlay text-white">
        <h5 class="">${res[i].farmName}</h5>
        <p class="">${res[i].description}</p>
      </div>
  </div>`;
  }
}

function inputsPlaceholders(res) {
  for (let i = 0; i < res.length; i++) {
    document.getElementById("farmName").value = res[i].farmName;
    document.getElementById("description").value = res[i].description;
    document.getElementById("productPic").value = res[i].productPic;
    document.getElementById("farmName").value = res[i].farmName;

  }
}
