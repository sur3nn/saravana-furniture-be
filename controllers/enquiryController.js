const db = require('../config/db');
const sendEnquiryMail = require('../utils/mailer');

exports.saveEnquiry = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const { name, email, mobile, comment, productMapId } = req.body;

        await conn.beginTransaction();
        const [enquiryResult] = await conn.query(
            `INSERT INTO tbl_enquiry (name, email, mobile, comment) VALUES (?, ?, ?, ?)`,
            [name, email, mobile, comment]
        );

        const enquiryId = enquiryResult.insertId;
        if (productMapId && productMapId.length > 0) {
            const values = productMapId.map(id => [id, enquiryId]);
            await conn.query(
                `INSERT INTO tbl_enquiry_product_mapping (product_category_map_id, enquiryId) VALUES ?`,
                [values]
            );
        }

        await conn.commit();
        res.json({ data: "Successfully added", enquiryId });
        sendEnquiryMail({
            name,
            email,
            mobile,
            comment,
            enquiryId
        }).catch(err => console.error("Mail error:", err));

    } catch (e) {
        if (conn) await conn.rollback();
        console.error("DB error:", e);
        res.status(500).json({ data: "Failed", error: e.message });
    } finally {
        if (conn) conn.release();
    }
};
