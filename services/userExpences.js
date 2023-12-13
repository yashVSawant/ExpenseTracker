const userExpences = (req,where)=>{
    return req.user.getExpences(where)
}

module.exports = {userExpences};