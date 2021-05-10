const fs = require("fs");

const recipes = JSON.parse(fs.readFileSync("output.json"));

const output = new Map();

for (let i = 0; i < recipes.length; i++) {
  const recipe = recipes[i];
  try {
    for (let i = 0; i < recipe.ingredients.length; i++) {
      let ingredient = recipe.ingredients[i];
      ingredient = ingredient.split(",")[0];
      ingredient = ingredient.replace(/[a-z]*\d+[a-z]*/gi, "");
      ingredient = ingredient.replace("½", "");
      ingredient = ingredient.replace("¼", "");
      ingredient = ingredient.replace(".", "");
      ingredient = ingredient.replace("- ", "");
      ingredient = ingredient.replace("x ", "");
      ingredient = ingredient.replace("  ", " ");
      ingredient = ingredient.replace("about ", "");
      ingredient = ingredient.replace("litre ", "");
      ingredient = ingredient.replace("/ ", "");
      ingredient = ingredient.split(" or ")[0];
      ingredient = ingredient.split("(")[0];

      if (ingredient.includes(" of ")) {
        ingredient = ingredient.split(" of ")[1];
      } else if (ingredient.includes("tbsp")) {
        ingredient = ingredient.split("tbsp")[1];
      } else if (ingredient.includes("tsp")) {
        ingredient = ingredient.split("tsp")[1];
      }
      ingredient = ingredient.trim();

      ingredient = titleCase(ingredient);

      if (output.has(ingredient)) {
        output.set(ingredient, output.get(ingredient) + 1);
      } else {
        output.set(ingredient, 1);
      }
    }
  } catch (e) {
    console.log(e);
    console.log(recipe.title);
  }
}

function titleCase(str) {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(" ");
}

const mapAscending = new Map([...output.entries()].sort((a, b) => a[1] - b[1]));
const mapDescending = new Map(
  [...output.entries()].sort((a, b) => b[1] - a[1])
);

//console.log(mapDescending);
console.log(mapAscending);
