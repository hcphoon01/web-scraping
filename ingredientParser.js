const fs = require("fs");

parseIngredients("test.json", 100);

function parseIngredients(input, trim, modifications = true) {
  const recipes = JSON.parse(fs.readFileSync(input));

  const map = new Map();
  const output = [];

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    try {
      for (let i = 0; i < recipe.ingredients.length; i++) {
        let ingredient = recipe.ingredients[i];
        if (modifications) {
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
          ingredient = ingredient.replace("can ", "");
          ingredient = ingredient.replace("small ", "");
          ingredient = ingredient.replace("large ", "");
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
        }
        ingredient = ingredient.trim();

        ingredient = titleCase(ingredient);

        if (map.has(ingredient)) {
          map.set(ingredient, map.get(ingredient) + 1);
        } else {
          map.set(ingredient, 1);
        }
      }
    } catch (e) {
      console.log(e);
      console.log(recipe.title);
    }
  }

  const mapAscending = new Map([...map.entries()].sort((a, b) => a[1] - b[1]));
  const mapDescending = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));

  for (const elem of map.entries()) {
    if (elem[1] >= trim) {
      output.push({
        name: elem[0],
        category: 0,
      });
    }
  }

  fs.writeFileSync("common-ingredients.json", JSON.stringify(output));

  //console.log(mapDescending);
  //console.log(mapAscending);
}

function titleCase(str) {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(" ");
}
