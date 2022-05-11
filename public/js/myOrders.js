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
  let pendingOrders = document.getElementById('activeOrders');
  let oldOrders = document.getElementById('oldOrders');
  console.log(res);
  for (let i = 0; i < res.length; i++) {
    try {
      const resFarms = await axios.get("/API/articles/" + res[i].articleID);
      console.log(resFarms.data);

      /* CREATE ONE DIV WITH ONE CART WITH THE FARMS NAME*/
      let oneDiv = document.createElement('div');
      oneDiv.className = `${res[i].articleID}`;
      let farmName = document.createElement('div');
      let h3 = document.createElement('h3');
      h3.innerHTML = resFarms.data.farmName;
      farmName.append(h3);
      oneDiv.append(farmName)

      /* LIST PRODUCTS IN ONE CART DIV */
      


      if (res[i].acceptedByFarm == false) pendingOrders.append(oneDiv);
      if (res[i].acceptedByFarm == true) oldOrders.append(oneDiv)
    } catch (error) {
      console.error(error);
    }
  }
}
