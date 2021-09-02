const HandlerError = require('../error')

module.exports = {
    errorHandling(req, res, next){
        const keys = Object.keys(HandlerError);
        keys.forEach((key) => {
            res[key] = (msg) => HandlerError[key](msg);
        }); 
        
        return next() 
    }
}