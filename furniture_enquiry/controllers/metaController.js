const db = require('../config/db')

exports.getCategories = async(req,res)=>{
    const conn = await db.getConnection();
try{
const [result] =await  conn.query(`select id,name from tbl_category where deletedAt is null`);
res.json({data:result})

}catch(e){res.json({data:`successfuly failed ${e}`})}
}

exports.getMaterials = async(req,res)=>{
    const conn = await db.getConnection();
try{
const [result] =await  conn.query(`select id,name from tbl_material where deletedAt is null`);
res.json({data:result})

}catch(e){res.json({data:`successfuly failed ${e}`})}
}