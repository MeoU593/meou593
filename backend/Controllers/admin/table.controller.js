const Table  = require("../../models/table.model")

const createTable = async (req, res) => {
    try {
        const tables = [];
        const TableQuantity = req.body.TableQuantity;
        for (let i = 0; i < TableQuantity; i++) {
            tables.push({ 
                numberofSeats: req.body.numberofSeats,
            });
        }
        const data = await Table.insertMany(tables);
        res.status(201).json({
            message : "Thêm bàn thành công",
            data,
        })
    } catch (error) {
        res.status(500).json({
            message : "Thêm bàn thất bại",
            error : error.message
        })
    } 
}

module.exports = {
    createTable
}