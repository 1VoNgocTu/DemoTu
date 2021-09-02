module.exports = {
    transformHandler(req, res, next){
        res.transform = (data,{ status = 200, msg}) =>{
            
            let message = 'Internal server error'
            if(!msg) if(status >= 200 && status < 300) message = 'Successfull'
            return res.status(status).json({
                status_code: status,
                message: msg || message,
                data
            })
        }
        return next() 
    }
}
