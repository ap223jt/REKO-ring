
(async function() {
    try {
      const res = await axios.get("/API/articles");
      createWholeMarkup(res.data);
    } catch (error) {
      console.error(error);
    }
  })();
  
  function createWholeMarkup(res) {
    console.log(res);
    let articlesDiv = document.getElementById("articles");
  
    for (let i = 0; i < res.length; i++) {
  
      /* Create one div per article */
      let oneArticle = document.createElement("div");
      oneArticle.classList.add("article");
      oneArticle.setAttribute("id", res[i]._id);
      articlesDiv.append(oneArticle);
  
      /* Make the div clickable */
      let farmClick = document.createElement("a");
      farmClick.setAttribute("href", res[i]._id);
      oneArticle.append(farmClick);
  
      /* Create element farmName */
      let farmNm = document.createElement("h3");
      farmNm.innerHTML = res[i].farmName;
      farmClick.append(farmNm);
  
       /* Create element farmName */
       let desc = document.createElement("p");
       desc.innerHTML = res[i].description;
       farmClick.append(desc);  
      }
  }
  
  