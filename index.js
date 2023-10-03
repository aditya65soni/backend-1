const express = require("express");
const User = require("./model/user");

const jwt = require("jsonwebtoken");

const jwtkey = "e-com";

const AddProduct = require("./model/AddProduct");

const cors = require("cors");
const app = express();
require("./db/db");

app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
    let getdata = new User(req.body);
    let data = await getdata.save();
    data = data.toObject();
    delete data.password;

    jwt.sign({ data }, jwtkey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
            res.send("user not valid");
        }

        res.send({ data, token: token });
    });
});

app.post("/login", async (req, res) => {
    if (req.body.email && req.body.password) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
            jwt.sign({ user }, jwtkey, { expiresIn: "2h" }, (err, data) => {
                if (err) {
                    res.send({ result: "user not valid" });
                }
                res.send({ user, token: data });
            });
        } else {
            res.send({ result: "user not found" });
        }
    } else {
        res.send({ result: "user not found" });
    }
});

app.post("/addproduct", verifyToken, async (req, res) => {
    try {
        let addpro = new AddProduct(req.body);
        addpro = await addpro.save();
        res.send(addpro);
    } catch (error) {
        res.send(error);
    }
});

app.get("/products", verifyToken, async (req, res) => {
    try {
        let data = await AddProduct.find();

        res.send(data);
    } catch (error) {
        res.send(error);
    }
});

app.delete("/product/:id", verifyToken, async (req, res) => {
    try {
        let id = req.params.id;
        let data = await AddProduct.findByIdAndDelete({ _id: id });
        res.send(data);
    } catch (error) {
        res.send(error);
    }
});

app.get("/product/:id", verifyToken, async (req, res) => {
    try {
        let id = req.params.id;
        console.log(id);

        let data = await AddProduct.findOne({ _id: id });
        res.send(data);
    } catch (error) {
        res.send(error);
    }
});

app.patch("/update/:id", verifyToken, async (req, res) => {
    try {
        let id = req.params.id;

        let result = await AddProduct.findByIdAndUpdate({ _id: id }, req.body, {
            new: true,
        });

        res.send(result);
    } catch (error) {
        res.send(error);
    }
});

app.get("/serch/:key", verifyToken, async (req, res) => {
    try {
        let key = req.params.key;
        let data = await AddProduct.find({
            $or: [{ name: { $regex: key } }, { company: { $regex: key } }],
        });
        res.send(data);
    } catch (error) { }
});

// verify token

function verifyToken(req, res, next) {
    let token = req.headers["authoriation"];
    // console.log(token);
    if (token) {
        jwt.verify(token, jwtkey, (err, data) => {
            if (err) {
                res.send({ result: "please provide valid token" });
            } else {
                next();
            }
        });
    } else {
        res.status(403).send({ result: "please provide token" });
    }
}

app.listen(8000, () => {
    console.log("listening in port no 8000");
});
