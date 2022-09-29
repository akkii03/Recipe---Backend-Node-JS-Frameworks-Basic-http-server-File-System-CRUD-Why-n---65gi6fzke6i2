const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 8080;
const data = require("./data");
const connection = require("./connector");

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/api/recipes", (req, res) => {
  const sql = "SELECT * FROM RECIPES";
  connection.query(sql, (err, result) => {
    if (err) {
      console.log("err due to ", err);
      res.send({ msg: "err" });
    } else {
      console.log("fetch successully");
      res.send(result);
    }
  });
});


app.get("/api/recipes/:id", (req, res) => {
  const ids = req.params.id;
  const sqlCmd = `SELECT * FROM RECIPES WHERE ID = ${ids}`;
  connection.query(sqlCmd, (err, result) => {
    if (err) {
      console.log("err due to ", err);
    } else {
      if(result.length==0) {
        res.status(400).json({message:"error.message"})
      }else{
        res.json(result);
      }
    }
  });
});

app.post("/api/recipe", async (req, res) => {
  const {title, description, category, ingredients } = await req.body;
 
  const sqlCmd =  `INSERT INTO Recipes (title, description, category, ingredients) VALUES 
                    ("${title}", "${description}", "${category}", "${ingredients}");`
  connection.query(sqlCmd, (err, result) => {
    if (err) {
      console.log("data is not inserted due to ", err);
    } else {
      res.status(200).json({ id: result.insertId })
    }
  });
});

app.put("/api/recipe/:id", async (req, res) => {
  const idS = req.params.id;
  const {title, description, category, ingredients } = await req.body;

  const cmd = `UPDATE RECIPES SET 
                TITLE = '${title}',
                DESCRIPTION = '${description}',
                CATEGORY = '${category}',
                INGREDIENTS = '${ingredients}' WHERE ID = ${idS}`;
  connection.query(cmd, (err, result) => {
    if (err) {
      console.log("err due to ", err);
      res.status(400).send({ message: "Recipe id is invalid" });
    } else {
      console.log("value is updated");
      res.send({ message: "Successfully updated a recipe" });
    }
  });
});

app.delete("/api/recipe/:id", (req, res) => {
  const idS = req.params.id;
  const sqlCmd = `DELETE FROM RECIPES WHERE ID = ${idS}`;
  connection.query(sqlCmd, (err, result) => {
    if (err) {
        
        console.log("error due to ",err);
    } else {
      if(result.affectedRows==1) {
        console.log("id is deleted")
        return res.status(200)
      .send({ message: "Successfully deleted a Recipe" });
      }else{
        console.log("id not found");
        res.status(400)
        .send({ message: "Recipe id is invalid or does not exist" });
      }
    
      
    }
  });


});

app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;
