const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const env = require('dotenv').config({path: __dirname + '/.env'})

const app = express();
const port = 8000;

// Where we will keep books
let books = [];

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/getAddresses', async (req, res) => {
    try {
        const latestBlockResult = await axios.get(`https://api.cronoscan.com/api?module=proxy&action=eth_blockNumber&apikey=${process.env.CRONOSACN_API_KEY}`);
        const latestBlockNumber = latestBlockResult.data.result;
        
        const topic0 = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";//event name hash
        const topic2 = "0x000000000000000000000000a588fa62c9722ea6824851641f3a51545d083e68";//to address
        const contractAddress = "0x6A69ac09e86aBca5b5d926a9047C03260C222aa5";

        const addresResult = await axios.get(`https://api.cronoscan.com/api?module=logs&action=getLogs&fromBlock=0&toBlock=${latestBlockNumber}&address=${contractAddress}&topic0=${topic0}&apikey=${process.env.CRONOSACN_API_KEY}&topic2=${topic2}`);
        
        const result = addresResult.data.result;
        let addresses = result.map( address => address.topics[1]);
        addresses = addresses.filter((address, index, self) => index === self.findIndex(sAddress => address === sAddress)); 
        res.send(JSON.stringify({
            success: true,
            result: addresses,
            length: addresses.length
        }));
    } catch(err) {
        res.send(JSON.stringify({
            success: false,
            message: err
        }))
    }
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));