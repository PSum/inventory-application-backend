require('dotenv').config();
const express = require('express')
const pool = require('./db/pool')
const port = process.env.PORT;
const cors = require('cors');
const databaseName = "inventoryApplication"

const app = express()
app.use(express.json())
app.use(cors());


app.get('/', async (req, res) => {
    try {
        const data = await pool.query(`SELECT * FROM ${databaseName}`)
        res.status(200).send(data.rows)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

app.get('/selectItem', async (req, res) => {
    const itemName = req.query.itemName;
    try{
        const data = await pool.query(`SELECT * FROM ${databaseName} WHERE itemName = $1`, [itemName]);
        res.status(200).send(data.rows);
    } catch (err){
        console.log(err);
        res.sendStatus(500);
    }
})


app.delete('/deleteItem', async (req, res) => {
    const itemName = req.query.itemName;
    try {
        const data = await pool.query(`DELETE FROM ${databaseName} WHERE item = $1`, [itemName]);
        res.status(200).send(`Item ${itemName} deleted`);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});


app.post('/addItem', async (req, res) => {
    // possible post request with possible body:
    // localhost:3000/
    // {
    //     "name":"Friedensschule",
    //     "location": "Duesseldorf"
    // }
    const { item, price, description } = req.body
    try {
        await pool.query(`INSERT INTO ${databaseName} (item, price, description) VALUES ($1, $2, $3)`, [item, price, description])
        res.status(200).send({ message: "Successfully added child" })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})


app.get('/setup', async (req, res) => {
    try {
        await pool.query(
          `CREATE TABLE IF NOT EXISTS ${databaseName}(id SERIAL PRIMARY KEY, item VARCHAR(100), price FLOAT(10), description VARCHAR(300))`
        );
        res.status(200).send({ message: "Successfully created table" });
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

app.get("/deleteAll", async (req,res) => {
    try{
        await pool.query(
            `DELETE FROM ${databaseName}`
        );
        res.status(200).send({
            message: "Sucessfully deleted all the content"
        });
    } catch (err){
        console.log(err);
        res.sendStatus(500);
    }
})

app.listen(port, () => console.log(`Server has started on port: ${port}`))