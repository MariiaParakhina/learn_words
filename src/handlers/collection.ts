import {prisma} from '../db';



export const addCollection = async (req,res) =>
{

    try{
        let collection = await prisma.collection.findUnique({
            where:{
                name: req.body.name,
            }
        });
        if(collection){res.status(501).send("This collection already exists");return}
        collection = await prisma.collection.create({
            data:{
                name: req.body.name,
                description: req.body.description,
            }
        });

        res.status(201).json(collection);
    }
    catch(err){
        res.status(501).send(`Error occurred: ${err.message}`);
    }
}

export const getCollections = async (req,res)=>{
    const collection = await prisma.collection.findMany({});
    return res.status(200).json(collection);

}


export const deleteCollection = async (req,res)=>{

}

export const moveCollectionToNextStep = async (req,res)=>{

    const collectionId= req.params.id;

}