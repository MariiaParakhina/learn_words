import {prisma} from '../db';
import {STATUS} from "@prisma/client";

export const getWords= async (req,res)=> {

    const { collection } = req.query;
    console.log(`Collection ID: ${collection}`);

    // TODO separate in different middleware
    if (!collection) {
        res.status(501).send("Collection ID was not specified in query");
        return;
    }

    try {


        const words = await prisma.word.findMany({
            where: { collectionId: collection },
        });
        res.json(words);
    } catch (e) {
        console.error(`Error occurred: ${e.message}`);
        res.status(501).send(`Error occurred: ${e.message}`);
    }
}

export const addWords = async (req,res)=> {
    try{
       // verify that each word is unique and then start adding it one by one in for loop
            if(req.body.words.length == 0){
                res.status(501).send("No words has been provided");
                return;
            }

            // verify that there is such a collection
            const collection = await prisma.collection.findUnique({
                where:{
                    id : req.body.collectionId
                }
            });
            if(!collection){
                res.status(404).send("Such collection has not been found");
                return;
            }
            if(collection.status !== STATUS.NO_WORDS){
                res.status(501).send("this collection cannot be used to add new words")
            }

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


            // change the status of the collection
            const result = await prisma.collection.update({
                where:{
                    id: collection.id
                },
                data:{
                    name: collection.name,
                    description: collection.description,
                    status: STATUS.CREATED,
                }
            });
            res.status(201).json(result);


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