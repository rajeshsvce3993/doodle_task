const product = require('./service');
const CSVToJSON = require('csvtojson');
var uuid = require('uuid-random');

const upload = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload a CSV file!");
    }

    let path = "./files/" + req.file.filename;
    const products = await CSVToJSON().fromFile(path);
    var date = new Date();

    for(item of products)
    {
      const checkExists = await product.viewproductdetails({code:item.code})
      if(checkExists.length===0)
      {
      item.productid=uuid();
      item.createdOn=date.toISOString().slice(0,10) +" "+ date.toISOString().slice(11,19);
      item.isActive=true;
      const createproducts = await product.createproductsdetails(item)
      }
      else
      {
      item.createdOn=date.toISOString().slice(0,10) +" "+ date.toISOString().slice(11,19);
      const updateproduct = await product.updateproductdetails(item)

      }
    }
    res.send({ status: 200, result: "Success", message: 'Products Added Successfully!'});

  } catch (error) {
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};



module.exports = {
  upload,
};