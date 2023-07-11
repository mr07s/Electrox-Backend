import categoryModel from "../models/categoryModel.js";
import slugify from 'slugify'

export const createCategoryController = async( req,res)=>{
try {
    const {name} =req.body;
    if(!name) 
    {
        return res.status(401).send({message:'Name is required'})

    }
const existingCategory =await categoryModel.findOne({name})

if(existingCategory){
    return res.status(200).send({
        success:false,
        message:'Category already exists'
    })
}
else{
    const category =await new categoryModel({name ,slug:slugify(name)}).save()
    res.status(201).send({
        success:true,
        message:'new category created',
        category
    })
}


}
 catch (error) {
    console.log(error);
    res.status(500).send({
success:false,
error,
message:'Error in category'

    })
}




}


export const updateCategoryController =async(req,res)=>{


try {
    
const {name} =req.body
const {id} =req.params
const category =await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})

res.status(200).send({
    success:true,
    message:'Category updated Successfully',
    category

})
    
}
 catch (error) {

    console.log(error);
    res.status(500).send({
         success:false,
        message:error
    })



}














}

// get all cat
export const getcategoryController = async(req,res)=>{

try {
    const category =await categoryModel.find({})
    res.status(200).send({
        success:true,
        message:'All categories',
        category
    
    })
      

} catch (error) {    
console.log(error);
res.status(500).send({
    success:false,
    message:'Error while geting Category'

})


}



}





export const singlecategoryController =async (req,res)=>{
try {


    const category =await categoryModel.findOne({slug:req.params.slug})
    res.status(200).send({
        success:true,
        message:'Get Single Category Successfully',
        category
    
    })




} catch (error) {
    
    console.log(error);
res.status(500).send({
    success:false,
    message:'Error while geting Single Category'

})
}




}

export const deletecategoryController =async(req,res)=>{

try {
  
  
  const {id} =req.params;
    const category =await categoryModel.findByIdAndDelete(id)
    res.status(200).send({
        success:true,
        message:'Category SuccessFully deleted',
        category
    
    })
    
} 

catch (error) 
{
    console.log(error);
res.status(500).send({
    success:false,
    message:'Error while geting Single Category'

})  
}




}