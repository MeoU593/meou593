module.exports = (req) =>{
    let regex = "";
    if(req.query.keyword){
        regex = new RegExp(req.query.keyword , "i")
    }
    return regex
}