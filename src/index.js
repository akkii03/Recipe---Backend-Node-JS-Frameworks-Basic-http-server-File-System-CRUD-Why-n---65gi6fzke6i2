const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080
const data = require("./data");
const connection = require('./connector');


// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get("/api/recipes",(req,res)=>{
    const sql = 'SELECT * FROM RECIPES';
    connection.query(sql,(err,result)=>{
        if(err) {
            console.log("err due to ",err);
            res.send({msg:"err"});
        } else{
            console.log("fetch successully");
            res.send(result);
        }
    });
})

app.get("/api/recipes/:id",(req,res)=>{
    const ids = req.params.id;
    const sqlCmd = `SELECT * FROM RECIPES WHERE ID = ${ids}`;
    connection.query(sqlCmd,(err,result)=>{
        if(err) {

            console.log("err due to ",err);
            res.send("not found");
        }else{
            res.send(result);
        }
    })
});

app.post('/api/recipe',async(req,res)=>{
    const {id,title,description,category,ingredients} = await req.body;
    const sqlCmd = `INSERT INTO Recipes VALUES (${id},'${title}','${description}','${category}','${ingredients}')`
    connection.query(sqlCmd,(err,result)=>{
        if(err) {
            console.log("data is not inserted due to ",err);
        }else{
            console.log("data is inserted successfully");
            res.send(req.body);
        }
    })
})

app.put('/api/recipe/:id',async(req,res)=>{
    const idS = req.params.id;
    const {id,title,description,category,ingredients} = await req.body;

    const cmd = `UPDATE RECIPES SET ID = ${id},
                TITLE = '${title}',
                DESCRIPTION = '${description}',
                CATEGORY = '${category}',
                INGREDIENTS = '${ingredients}' WHERE ID = 13`;
    connection.query(cmd,(err,result)=>{
        if(err) {
            console.log("err due to ",err);
            res.status(400).send({message: "Recipe id is invalid"});
        } else{
            console.log("value is updated");
              res.send(req.body);
        }
    })
});

app.delete('/api/recipe/:id',(req,res)=>{
    const idS = req.params.id;
    const sqlCmd = `DELETE FROM RECIPES WHERE ID = ${idS}`;
    connection.query(sqlCmd,(err,result)=>{
        if(err) {
            res.status(400).send({message: "Recipe id is invalid or does not exist"});
        }else{
            res.status(200).send({message: "Successfully deleted a Recipe"});   
        }
    })  
})

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;