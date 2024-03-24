const shopauth= (req, res, next)=>{
    console.log("123");
    next();
}
const userauth= (req, res, next)=>{
    console.log("user");
    next();   
}
const commonauth= (req, res, next)=>{
    console.log("common");
    
    next();   
}

module.exports={shopauth,userauth,commonauth}