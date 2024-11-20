import {prisma} from '../db';
import {STATUS} from "@prisma/client";
import {verifyWordsInCollection} from "./word";



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

// get collection with words
export const getCollection = async (req,res)=>{
    const result = await prisma.collection.findUnique({
        where:{
            id: req.params.id
        },
        include:{
            words: true
        }

    });
    if(!result){
        res.status(404).send("Such collection does not exist");
        return;
    }
    res.status(200).json({result});
}

export const deleteCollection = async (req,res)=>{

   try{
        await prisma.collection.delete({
           where:{
               id: req.params.id
           }
       });
       res.status(200).send(`Successfully deleted`);
   } catch{
       res.status(404).send("Such collection has not been found, thus could not be deleted");
   }
}
const updateCollectionStatus = async(collection, nextStatus: STATUS) =>{
    const result = await prisma.collection.update({
        where:{
            id: collection.id
        },
        data: {
            name: collection.name,
            description: collection.description,
            status: nextStatus
        }
    });

}
// we need function for study:
/// start test where we get the shiffled tasks and then our isPracticed as true setted up
/// finish test where we submit whether it has been passed or not, if passed mark as true and move to the next level
export const moveCollectionToNextStep = async (req,res)=>{
// we know that such collection exists and that there is collection data in the req.body.collection
    const collection = req.body.collection;
    const currentStep = collection.status;
    switch(currentStep){
        case STATUS.NO_WORDS:
            // manage to check if there is any words in db to verify to move to the next step and more then 1
            // move to the next step
            if(!verifyWordsInCollection(collection.id)){
                res.status(501).send("This collection does not have words yet, or not enough, make sure there are at least 2 words in collection");
            }


            updateCollectionStatus(collection, STATUS.CREATED);

            break;
        case STATUS.CREATED: // verify that isPracticed true

    }


}