(async function () {
  try {
    const res = await axios.get("/API/articles");
    createWholeMarkup(res.data);
  } catch (error) {
    console.error(error);
  }
})();

async function createWholeMarkup(res) {
  let articlesDiv = document.getElementById("articles");

  for (let i = 0; i < res.length; i++) {
    try {
      const resFarmInfo = await axios.get("/API/farms/" + res[i].articleID);
      /* Create one div per article */
      articlesDiv.innerHTML += `<div class="article" id="${res[i]._id}">
        <a href="${res[i]._id}">
          <img class="img-fluid" src="../pics/${resFarmInfo.data[0].farmImg}" alt="Card image">
          <div class="cardOverlay text-white">
            <h5 class="">${resFarmInfo.data[0].farmName}</h5>
            <p class="">${resFarmInfo.data[0].description}</p>
            <p class=""><b>Datum för uthämtning:</b> ${res[i].dealingDate}</p>
          </div>
        </a>
      </div>`;
    } catch (error) {
      console.error(error);
    }
  }
}
