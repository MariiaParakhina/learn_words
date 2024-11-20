import {prisma} from '../db';
import {STATUS} from "@prisma/client";

export function verifyCollectionInQuery(req,res, next){
    const { collection } = req.query;

    if (!collection) {
        res.status(501).send("Collection ID was not specified in query");
        return;
    }
    req.body.collectionId = collection;
    next();
}
export const getWords= async (req,res)=> {
    try {
        const words = await prisma.word.findMany({
            where: { collectionId: req.body.collectionId },
        });
        res.json(words);
    } catch (e) {
        res.status(501).send(`Error occurred: ${e.message}`);
    }
}
export function verifyWordsProvided(req,res,next): void{
    if(req.body.words.length == 0){
        res.status(501).send("No words has been provided");
        return;
    }else next();
}
export const verifyCollectionExists= async (req,res,next)=>{
    const collection = await prisma.collection.findUnique({
        where:{
            id : req.body.collectionId
        }
    });
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
    }

    next();
}

export const addWords = async (req,res)=> {
    try{
            const wordsList = req.body.words;
            for(let i = 0; i< wordsList.length; i++ ){
                const word = wordsList[i];
                const result = await prisma.word.create({
                    data:{
                        origin: word.origin,
                        translation: word.translation,
                        collectionId: req.body.collectionId
                    }
                });
                console.log(result);
            }



            res.status(201).send('Successfully added ' + wordsList.length + ' words');
        }
        catch(e){
            res.status(501).send(`Error occurred: ${e.message}`);

        }
}

export const deleteWord = async (req,res)=> {
    try{
        const result = await prisma.collection.delete({
            where:{
                id: req.params.id
            }
        });
        res.status(200).send('Successfully deleted');
    }catch(err){
        res.status(501).send(`Error occurred: ${err.message}`);
    }
}

export const verifyWordsInCollection = async(id:string): Promise<boolean> =>{
    const words = await prisma.word.findMany({
        where:{
            collectionId:id
        },
    });
    return words.length>=2;
}