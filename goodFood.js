const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const baseUrl = "https://www.bbcgoodfood.com";
const searchUrl = "https://www.bbcgoodfood.com/search/recipes/page/";
const startPage = 1;
const endPage = 100; // Hard coded amount of pages of recipes, max = 417

const recipeUrls = [];
const recipes = [];

async function getUrls() {
  for (let i = startPage; i <= endPage; i++) {
    await axios.get(searchUrl + i).then((res) => {
      const $ = cheerio.load(res.data);
      $("a.standard-card-new__article-title").each((index, value) => {
        recipeUrls.push(baseUrl + $(value).attr("href"));
      });
    });
  }
}

async function getRecipes() {
  for (let i = 0; i < recipeUrls.length; i++) {
    const url = recipeUrls[i];
    await axios
      .get(url)
      .then((res) => {
        const recipe = {
          title: "",
          image: "",
          sourceName: "BBC Good Food",
          sourceUrl: url,
          ingredients: [],
          method: [],
        };
        const $ = cheerio.load(res.data);
        recipe.title = $(".post-header__title").text();
        let img = $(".image__img").attr("src");
        recipe.image = img.split("?")[0];
        $(".recipe__ingredients")
          .find("li")
          .each((index, value) => {
            recipe.ingredients.push($(value).text());
          });
        $(".recipe__method-steps")
          .find("p")
          .each((index, value) => {
            recipe.method.push($(value).text());
          });
        recipes.push(recipe);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

function writeToFile() {
  if (fs.existsSync("output.json")) {
    fs.readFile("output.json", function (err, data) {
      var json = JSON.parse(data);
      json.push(recipes);
      fs.writeFileSync("output.json", JSON.stringify(json));
    });
  } else {
    fs.writeFileSync("output.json", JSON.stringify(recipes));
  }
}

getUrls().then(() => {
  console.log(recipeUrls.length);
  getRecipes().then(() => {
    writeToFile();
  });
});
