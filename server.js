const {MongoClient} = require('mongodb');
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const mongourl = "mongodb+srv://durgaguna:durgaguna@cluster0.j32t12j.mongodb.net/?retryWrites=true&w=majority";

const port =process.env.port || 7000;

const requestListner =  async function(req,res) {
    console.log(req.url)
    if (req.url === '/'){
        res.writeHead(200,{'Content-Type':'text/html'});
        fs.readFile(path.join(__dirname,'public','index.html'),(err,data)=>{
            if(err) throw err;
            res.writeHead(200,{'Content-Type':'text/html'});
            res.end(data);
        })
    }
    
    else if(req.url === '/api') {
        fs.readFile(path.join(__dirname, '','db.json'), (err, data) =>{
            if(err) throw err;
            res.writeHead(200, {'content-Type':'application/json'});
            res.end(data);
        })
    
    } else if (req.url === '/covid') {
        res.writeHead(200, { 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*" });
    res.write(JSON.stringify(await dbClient()));
    res.end();
    }
    else{
        res.end("<h1> 404 not found </h1>");
    }
}

const server = http.createServer(requestListner);


//const server = http.createServer(requestListener);
server.listen(port,() => {
    console.log(`Server is running on http://${port}`);
})

async function dbClient() {
    const client = new MongoClient(mongourl);
    const list = await stateCovidData(client);
    return list;
}


async function stateCovidData(client) {
    var covidDetails = null;
    try {
        
        client.connect();
       // const query = { state: "CT" };
        covidDetails = await client.db("covid").collection("covid_data").find().toArray();
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
    //console.log(hospitalsDetails);
    return covidDetails;
}
