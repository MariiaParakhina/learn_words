import {STATUS} from "@prisma/client";
import {getAllWordsByCollectionId} from "../repositories/words";
import {updateCollectionById} from "../repositories/collection";
export const startPractice = async (req,res)=>{

    const collection = req.body.collection;
    // verify that it is possible to start practice due to the time
    const  updatedAt  = collection.updatedAt

    console.log(collection)
    const isValidToStartPractice:Boolean = verifyIsValidToStartPractice(updatedAt, collection.status);
    console.log(isValidToStartPractice);
    if(!isValidToStartPractice){
        res.status(501).send({status:"error",message:"Too early to start practice yet"});
        return;
    }
    //check if practice is not started
    if(collection.isPracticed){
        res.status(501).send({status:"error", message:"This practice is already started so it cannot be started again"});
        return;
    }

    // get all words in the collection in order to mix them up
    let words = await getAllWordsByCollectionId(collection.id);
    words = shuffleWords(words);

    // set the practice tru and return the mixed list
    collection.isPracticed = true;
    await updateCollectionById(collection.id, collection);

    res.status(200).send({data:words});
}

export const endPractice = async (req,res)=>{
    const collection = req.body.collection;
    const isPassed = req.body.isPassed;
    if(!isPassed){
        collection.isPracticed = false;
        collection.isPassed= false;
        await updateCollectionById(collection.id, collection);
        res.status(500).send({data:"you can redo practice in hour"});
    }

}

const verifyIsValidToStartPractice = (updatedAt: string, status: STATUS): boolean => {
    const updatedDate = new Date(updatedAt);
    const now = new Date();
    const differenceInMs = now.getTime() - updatedDate.getTime();

    const differenceInHours = differenceInMs / (1000 * 60 * 60);
    const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);

    console.log(status)
    switch (status) {
        case STATUS.CREATED:
            return true;
        case STATUS.ONE_HOUR:
            return differenceInHours > 1;
        case STATUS.ONE_DAY:
            return differenceInDays > 1;
        case STATUS.TWO_DAYS:
            return differenceInDays > 2;
        case STATUS.FIVE_DAYS:
            return differenceInDays > 5;
        case STATUS.ONE_MONTH:
            return differenceInDays > 30;
        default:
            return false;
    }
};

const shuffleWords = (words)=> {

    const shuffledWords = words.slice();

    for (let i = shuffledWords.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));


        [shuffledWords[i], shuffledWords[j]] = [shuffledWords[j], shuffledWords[i]];
    }

    return shuffledWords;
}
