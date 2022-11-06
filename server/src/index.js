require("dotenv").config();
const express = require('express')
const cookieParses = require('cookie-parser')
const cors = require('cors')
const app = express()
const port = 3001;
const { connectToMongoDatabase } = require('./db-config.js')
// use express middleware for easier cookie handling
app.use(cookieParses());

// needed to be able to support JSON-encoded bodies
app.use(express.json())
app.use(express.urlencoded({extended: true})) // support URL-encoded bodies
connectToMongoDatabase()

app.use('/', require('./services/usersAPI'))
app.use('/post', require('./services/postsAPI'))
app.use('/comment', require('./services/commentsAPI'))

app.use(cors({
    origin:`http://localhost:${port}`,
    credentials: true
}))



app.listen(port, () => {
    console.log(`Listening ${port}`)
})