require("dotenv").config()
const express = require("express")
const cors = require("cors")

const app = express()
const port = process.env.PORT
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(cors());

const productRoute = require("./routes/products")
const enuiryRoute = require("./routes/enquiry")
const metaRoute = require("./routes/meta")
app.use('/api/products',productRoute)
app.use('/api/enquiry',enuiryRoute)
app.use('/api/meta',metaRoute)

app.listen(port,'0.0.0.0',()=>{
    console.log(`Server running on port ${port}`,);
})