const db = require('../config/db')
const sendEnquiryMail = require('../utils/mailer')

exports.saveEnquiry = async (req, res) => {
    const conn = await db.getConnection()
    try {
        const { name, email, mobile, comment, productMapId } = req.body;
        await conn.beginTransaction();
        const [result1] = await conn.query(`insert into tbl_enquiry (name,email,mobile,comment)values(?,?,?,?)`, [name, email, mobile, comment]);
      for(id of productMapId) {
            await conn.query(`insert into tbl_enquiry_product_mapping (product_category_map_id,enquiryId)values(?,?)`, [id, result1.insertId]);
        }; 
        await conn.commit();
         await sendEnquiryMail({
        name,
        email,
        mobile,
        comment,
        enquiryId:result1.insertId
    });
        res.json({ data: "Sucessfully added" });
    } catch (e) {
        await conn.rollback()
        console.log("error",e);
        
         res.json({ data: "Sucessfully failed" ,error:e});

    }finally{
        conn.release()
    }

}