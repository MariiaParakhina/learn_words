import {STATUS} from "@prisma/client";
import {verifyWordsInCollection} from "./word";
import {
    createNewCollection,
    findCollectionByName,
    getAllCollections,
    getCollectionByIdWithWords,
    deleteCollectionById, updateCollectionById, getCollectionById
} from "../repositories/collection";
import {deleteWordsForCollection} from "../repositories/words";



export const addCollection = async (req,res) =>
{

    try{
        let collection = await findCollectionByName(req.body.name);
        if(collection){res.status(501).send("This collection already exists");return}

        collection = await createNewCollection(
            {
                name: req.body.name,
                description: req.body.description
            })

        res.status(201).json(collection);
    }
    catch(err){
        res.status(501).send(`Error occurred: ${err.message}`);
    }
}

export const getCollections = async (req,res)=>{
    const collections = await getAllCollections();
    res.status(200).json(collections);

}

// get collection including words
export const getCollection = async (req,res)=>{
    const result = await getCollectionByIdWithWords(req.params.id);
    if(!result){
        res.status(404).send("Such collection does not exist");
        return;
    }
    res.status(200).json({result});
}

export const deleteCollection = async (req,res)=>{

   try{
       await deleteWordsForCollection(req.params.id);
        await deleteCollectionById(req.params.id);
       res.status(200).send(`Successfully deleted`);
   } catch(err){
       console.log(err);
       res.status(404).send("Such collection has not been found, thus could not be deleted");
   }
}
const updateCollectionStatus = async(collection, nextStatus: STATUS) =>{

   const updatedCollection =   {
            name: collection.name,
            description: collection.description,
            status: nextStatus,
            isPassed: false,
            isPracticed: false
    }
    await updateCollectionById(collection.id,  updatedCollection);

}
export const verifyCollectionExists= async (req,res,next)=>{

    const collection = await getCollectionById(req.body.collectionId);
    if(!collection){
        res.status(404).send("Such collection has not been found");
        return;
    }
    req.body.collection = collection;
    next();
}
export const verifyCollectionStatus = (req,res,next)=>{

    if(req.body.collection.status !== STATUS.NO_WORDS){
        res.status(501).send("this collection cannot be used to add new words")
        return;
    }
    next();

}

export const moveCollectionToNextStep = async (req,res, next)=>{
    const collection = req.body.collection;
    const currentStep = collection.status;
    switch(currentStep){
        case STATUS.NO_WORDS:
            console.log("moving to the next step to be created")
            const wordsInCollection = await verifyWordsInCollection(collection.id);
            if(!wordsInCollection){
                res.status(501).send("This collection does not have words yet, or not enough, make sure there are at least 2 words in collection");
            }
            await updateCollectionStatus(collection, STATUS.CREATED);
            break;
        case STATUS.CREATED:
            await updateCollectionStatus(collection, STATUS.ONE_HOUR);
            break;
        case STATUS.ONE_HOUR:
            await updateCollectionStatus(collection, STATUS.ONE_DAY);
            break;
        case STATUS.ONE_DAY:
            await updateCollectionStatus(collection, STATUS.TWO_DAYS);
            break;
        case STATUS.TWO_DAYS:
            await updateCollectionStatus(collection, STATUS.FIVE_DAYS);
            break;
        case STATUS.FIVE_DAYS:
            await updateCollectionStatus(collection, STATUS.ONE_MONTH);
            break;
        case STATUS.ONE_MONTH:
            res.status(500).send("You have finished this collection");
            return;
        default:break;


    }
    res.status(201).send("Move to the next status ");


}