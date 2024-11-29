//YAN Zhengyang 21104095d, ZHOU Yutong 22098552d
import { MongoClient, ServerApiVersion } from 'mongodb'; 
import config from './config.js'; 

const connect_uri = config.CONNECTION_STR; 
const client = new MongoClient(connect_uri, { 
  connectTimeoutMS: 2000, 
  serverSelectionTimeoutMS: 2000, 
  serverApi: {
    version: ServerApiVersion.v1, 
    strict: true, 
    deprecationErrors: true, 
  }, 
}); 
  
async function connect() { 
  try { 
    // TODO
    const date = new Date(Date.now())
    var hour = date.getHours()>12?date.getHours()%13 + 1:date.getHours();
    hour = hour.toString().padStart(2,'0');
    const dayPeriod = date.getHours()>12?"PM":"AM";
    const dateString = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + 
    ", " + hour + ":" + date.getMinutes().toString().padStart(2,'0') + ":" + date.getSeconds().toString().padStart(2,'0')
    + " " + dayPeriod;
    console.log(dateString)
    //console.log("Server started at https://127.0.0.1:8080")
    await client.connect()
    await client.db("lab5db").command({
        ping:1
    })
    console.log('Successfully connected to the database!')
  } catch (err) { 
    // TODO
    process.exit(1)
  } 
} 

connect().catch(console.dir); 
  
export default client;