import {body, validationResult} from "express-validator";


export const handleInputErrors=(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400);
        res.json({errors:errors.array()});
    } else {
        next()
    }
}

export const errorHandler  =(err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).send('Something broke!');
}