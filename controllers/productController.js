import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import fs from "fs";
import slugify from "slugify";
import braintree from "braintree";
import dotenv from "dotenv";
import orderModel from "../models/orderModel.js";
import { json } from "express";

dotenv.config();
//Payment gateway 
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey : process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});








export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is required" });
      case !description:
        return res.status(500).send({ error: "description is required" });
      case !price:
        return res.status(500).send({ error: "price is required" });
      case !quantity:
        return res.status(500).send({ error: "quantity is required" });
      case !category:
        return res.status(500).send({ error: "category is required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is required and should be less than 1mb" });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while Creating Product",
    });
  }
};

export const getProductController = async (req, res) => {
  try {
    const Allproducts = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(201).send({
      success: true,
      totalcount: Allproducts.length,
      message: "All products ",
      Allproducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting Product",
    });
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    const { slug } = req.params;
    const singleProduct = await productModel
      .findOne({ slug: slug })
      .select("-photo")
      .populate("category");

    res.status(200).send({
      success: true,
      message: "Product found",
      singleProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: "Error while geeting single product",
      error,
    });
  }
};
export const productPhotoController = async (req, res) => {
  try {
    // const {pid}= ;
    const product = await productModel.findById(req.params.pid).select("photo");

    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while geeting photo",
      error,
    });
  }
};
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 10000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Updte product",
    });
  }
};

//filters
export const productFiltersController = async (req, res) => {
  try {
    const { check, radio } = req.body;
    let args = {};
    if (check.length > 0) {
      args.category = check;
    }
    if (radio.length) {
      //gte greater then equalto lte =less then equalto
      args.price = { $gte: radio[0], $lte: radio[1] };
    }
    const products = await productModel.find(args);

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in filtering product",
      error,
    });
  }
};

//Product Count
export const productCountController = async (req, res) => {
  try {
    const totalProducts = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      succes: true,
      totalProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in product count",
      error,
    });
  }
};
// Product List Container

export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const productlist = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

     res.status(200).send({
      sucess:true,
      productlist
     })
    



  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};


export const searchProductController=async(req,res)=>{
try {
  const {keyword}=req.params
  const result =await productModel.find({
    $or:[
        {name:{$regex :keyword,$options:"i"}},
        {description:{$regex :keyword,$options:"i"}}
    ]
  }).select("-photo")
console.log({result})
res.json({result});


} catch (error) {
  console.log(error)
  res.status(400).message({
    success:false,
    message:'Error in product controller',
    error
  })
}

}
// similar Products
export const ralatedProductController =async(req,res)=>{

try
{
  //cid =category Id ,//$ne means remove id /not included
const {pid,cid} =req.params
const products = await productModel.find({
category:cid, 
_id:{$ne:pid}

}).select("-photo").limit(3).populate("category")

;
console.log(products)
res.status(200).send({
  success:true,
  products
})
}

catch (error)
{
console.log(error);
res.status(400).send({
  success:false,
  message:'Error while geeting similar Products',
  error
})
}
}



export const productCategoryController =async(req,res)=>
{
try
{
  const category =await categoryModel.findOne({slug:req.params.slug})
  const products =await productModel.find({category}).select("-photo").populate('category')
res.status(200).send({
  success:true,
  category,
  products
})
} 
catch (error)
 {
  console.log(error);
  res.status(400).send({
    success:true,
    message:'Error while getting category',
    error
  })  



}






}







//payment gateway api
//token
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//payment
export const braintreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    console.log(cart)
    console.log(cart[0].product_id)
    let products=[];
    let total = 0;
    cart.map((i) => {
      total += i.product_price;
      products =[...products,i.product_id]
    });
    console.log(products)
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: products,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true});
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};