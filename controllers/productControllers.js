const db = require("../config/db");

exports.getAllproducts = async (req, res) => {
    const categoryId = req.query.categoryId;
    let conn;
    try {
        conn = await db.getConnection();

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

        res.json({ data: result });

    } catch (e) {
        console.error(e);
        res.status(500).json({ data: "failed", error: e.message });
    } finally {
        if (conn) conn.release();
    }
};

exports.addProduct = async (req, res) => {
    const { name, description, imageurl, price, categoryId, materialId } = req.body;
    let conn;
    try {
        conn = await db.getConnection();
        await conn.beginTransaction();
        const [productResult] = await conn.query(
            `INSERT INTO tbl_products (name, description, image, price) VALUES (?, ?, ?, ?)`,
            [name, description, imageurl, price]
        );

        const productId = productResult.insertId;
        await conn.query(
            `INSERT INTO tbl_category_product_mapping (categoryId, productId) VALUES (?, ?)`,
            [categoryId, productId]
        );
        await conn.query(
            `INSERT INTO tbl_product_material_mapping (productId, materialId) VALUES (?, ?)`,
            [productId, materialId]
        );

        await conn.commit();
        res.json({ data: "successfully added" });

    } catch (err) {
        if (conn) await conn.rollback();
        console.error(err);
        res.status(500).json({ data: "failed", error: err.message });
    } finally {
        if (conn) conn.release();
    }
};
