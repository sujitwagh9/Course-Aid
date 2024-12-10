import connectDB from "./db/connect.db.js";
import dotenv from "dotenv"
import {app} from "./app.js"


dotenv.config({
    path:'./.env'
});


connectDB()
.then(() => {
    app.listen(process.env.PORT || 7000, () => {
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})

