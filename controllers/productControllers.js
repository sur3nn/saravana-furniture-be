const db = require("../config/db");

exports.getAllproducts = async(req, res) => {
    const categoryId = req.query.categoryId;
    try{
         const conn =await  db.getConnection()
   const [result] = await conn.query(
    `SELECT 
        tc.name AS category,
        tc.id AS categoryId,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'productMapId', tcpm.id,
                'productName', p.name,
                'description', p.description,
                'imgUrl', p.image,
                'materialId', tm.id,
                'materialName', tm.name,
                'price', p.price
            )
        ) AS productDetails
    FROM tbl_products p
    JOIN tbl_category_product_mapping tcpm ON tcpm.productId = p.id 
    JOIN tbl_category tc ON tc.id = tcpm.categoryId 
    JOIN tbl_material tm ON tm.id = tcpm.materialId
    WHERE p.deletedAt IS NULL
      AND ( ? = 0 OR tc.id = ? )
    GROUP BY tc.id`,
    [categoryId, categoryId]
);

        res.json({ data: result })
    }catch(e){

        res.json({data:"sucessfully failed"})
    }
   
    
}
exports.addProduct = (req, res) => {
const { name, description, imageurl, price, categoryId, materialId } = req.body;
        db.query(`insert into tbl_products (name,description,image,price)values(${name},${description},${imageurl},${price})`, (err, result1) => {
            if (err) return res.status(500).json({ error: err.message })
            db.query(`insert into tbl_category_product_mapping (categoryId,productId)values(${categoryId},${result1.id})`, (err, result2) => {
                if (err) return res.status(500).json({ error: err.message })
                db.query(`insert into tbl_product_material_mapping (productId,materialId)values(${result1.id},${materialId})`, (err, result3) => {
                    res.json({ data: "successfully added" })
                })
            })

        })
    }