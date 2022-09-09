const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080
const data = require("./data");
const {connection} = require('./connector');


// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get("/api/recipes",(req,res)=>{
    res.send(data);
})

app.get("/api/recipes/:id",(req,res)=>{
    const id = req.params.id;
    const myObj = data.filter((item)=>item.id==id);
    if(myObj) {
        res.send(myObj);
    }
    else{
        res.status(400).send({message: error.message});
    }
});

app.post('/api/recipe',async(req,res)=>{
    const {title,description,category,ingredients} = await req.body;
    const sqlCmd = `INSERT INTO Recipes VALUES ('${title}','${description}','${category}','${ingredients}')`
    connection.query(sqlCmd,(err,result)=>{
        if(err) {
            console.log("data is not inserted dut to ",err);
        }else{
            console.log("data is inserted successfully");
        }
    })
    res.status(200).send(`recipe is inserted `);
})

app.put('/api/recipe/:id',(req,res)=>{
    const idS = req.params.id;
    const sqlCmd = `SELECT * FROM RECIPES WHERE ID = ${idS}`;
    connection.query(sqlCmd,(err,result)=>{
        if(err) {
            res.status(400).send({message: "Recipe id is invalid"});
        }else{
            res.status(200).send({message: "Successfully updated a recipe"});   
        }
    })
});

app.delete('/api/recipe/:id',(req,res)=>{
    const idS = req.params.id;
    const sqlCmd = `SELECT * FROM RECIPES WHERE ID = ${idS}`;
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