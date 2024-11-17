import {prisma} from '../db';



export const getWords= async (req,res)=> {

    const { collectionId } = req.query;
    if(!collectionId){
        res.status(501).send("collection id was not specified in query");
        return;
    }

    try {
        const words = await prisma.word.findMany({
            where: { collectionId: collectionId },
        });
        res.json(words);
    } catch (e) {
       res.status(501).send(`Error occurred: ${e.message}`);
    }

}