const express = require("express");
const router = express.Router();
const product = require("../controller/products/index");
const user = require("../controller/users/index");
const order = require("../controller/orders/");
const auth = require("./auth");

const upload = require("../middleware/upload");

let routes = (app) => {
  router.post("/upload",auth, upload.single("file"), product.upload);
  router.post("/adduser", user.adduser);
  router.post("/login", user.userlogin);
  router.post("/createorder",auth, order.createorder);
  router.post("/updateorder",auth, order.updateorder);
  router.post("/cancelorder",auth, order.cancelorder);

  router.get("/vieworder",auth, order.vieworders);
  router.get("/vieworderedcountbydate",auth, order.getorderedproductcountbydate);
  router.get("/viewpurchesedcountbycustomer",auth,order.getpurchesedproductcountbycustomer);

  app.use("/api", router);
};

module.exports = routes;