const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const newsRoutes = require('./routes/newsRoutes');
const socket = require('./socket/socket');
require('dotenv').config();
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

const corsOptions = {
    origin: ['http://localhost:5173'],
    credentials: true,
    optionSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/news', newsRoutes);

mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once('open', () => {
    console.log("Now connected to MongoDB Atlas");
});

const server = http.createServer(app);
socket.init(server);

if (require.main === module) {
    server.listen(4000, () => console.log(`Server running at port 4000`));
}