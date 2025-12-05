const db = require('../config/db');

exports.getCategories = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const [result] = await conn.query(`SELECT id, name FROM tbl_category WHERE deletedAt IS NULL`);
        res.json({ data: result });
    } catch (e) {
        console.error(e);
        res.status(500).json({ data: "failed", error: e.message });
    } finally {
        if (conn) conn.release();
    }
};

exports.getMaterials = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const [result] = await conn.query(`SELECT id, name FROM tbl_material WHERE deletedAt IS NULL`);
        res.json({ data: result });
    } catch (e) {
        console.error(e);
        res.status(500).json({ data: "failed", error: e.message });
    } finally {
        if (conn) conn.release();
    }
};
