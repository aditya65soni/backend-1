const mongoose = require("mongoose");

(async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/mern-ecom22")
        console.log("mongoose connected");
    } catch (err) {
        console.log('error: ' + err)
    }
})()