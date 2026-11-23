const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require('./routes/userRoutes');
const moviesRoutes = require('./routes/moviesRoutes');
const cors = require("cors");
const app = express();
const port = 4000;

mongoose.connect("mongodb+srv://admin:admin1234@b645-alfaras.ttbstdp.mongodb.net/MovieCatalogSystem?appName=B645-Alfaras");
let db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error!"));
db.once("open", () => console.log("We're connected to the cloud database!"));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/users", userRoutes);
app.use("/movies", moviesRoutes);
app.use(cors());

if(require.main === module){
	app.listen(port, () => {
	    console.log(`API is now online on port ${port}`)
	});
}
module.exports = {app,mongoose};