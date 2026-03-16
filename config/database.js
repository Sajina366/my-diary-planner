const mongoose = require("mongoose");

mongoose.connect(
"mongodb://sajinaphilomina_db_user:diary123@ac-lpjoerp-shard-00-00.c3x2qzn.mongodb.net:27017,ac-lpjoerp-shard-00-01.c3x2qzn.mongodb.net:27017,ac-lpjoerp-shard-00-02.c3x2qzn.mongodb.net:27017/diaryplanner?ssl=true&replicaSet=atlas-jtk3s2-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0"
)
.then(()=>console.log("MongoDB Atlas Connected"))
.catch(err=>console.log(err));

module.exports = mongoose;