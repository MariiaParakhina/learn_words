import {createNewWord, deleteWordById, getAllWordsByCollectionId} from "../repositories/words";


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
        const words = await getAllWordsByCollectionId(req.body.collectionId);
        res.json(words);
    } catch (e) {
        res.status(401).send(`Error occurred: ${e.message}`);
    }
}
export function verifyWordsProvided(req,res,next): void{
    if(req.body.words.length == 0){
        res.status(401).send("No words has been provided");
        return;
    }else next();
}



export const addWords = async (req,res, next)=> {
    try{
            const wordsList = req.body.words;
            for(let i = 0; i< wordsList.length; i++ ){
                const word = wordsList[i];
                const wordData = {
                    origin: word.origin,
                    translation: word.translation,
                    collectionId: req.body.collectionId
                }
                await createNewWord(wordData);
            }

        console.log("words added")

            //res.status(201).send('Successfully added ' + wordsList.length + ' words');
            next();
        }
        catch(e){
            res.status(401).send(`Error occurred: ${e.message}`);

        }
}

export const deleteWord = async (req,res)=> {
    try{
        const result = await deleteWordById(req.params.id);
        res.status(200).send('Successfully deleted');
    }catch(err){
        res.status(401).send(`Error occurred: ${err.message}`);
    }
}

export const verifyWordsInCollection = async(id:string): Promise<boolean> =>{
    const words =  await getAllWordsByCollectionId(id);
    return words.length>=2;
}