import {Router} from 'express';
import {body}  from 'express-validator';
import {
    getWords,
    addWords,
    deleteWord,
    verifyCollectionInQuery,
    verifyWordsProvided,
    verifyCollectionExists,
    verifyCollectionStatus
} from './handlers/word';
import {
    addCollection,
    getCollections,
    moveCollectionToNextStep,
    deleteCollection,
} from "./handlers/collection";
import {handleInputErrors} from "./modules/middleware";

const router = Router();

router.get('/words/',verifyCollectionInQuery,getWords);
router.post('/words/', [body('collectionId').isString()],
                        handleInputErrors,
                        verifyWordsProvided,
                        verifyCollectionExists,
                        verifyCollectionStatus,
                        addWords,
                        moveCollectionToNextStep)
router.delete('/words/:id', handleInputErrors, deleteWord)



router.get('/collections',getCollections);
router.post('/collections', [body('name').isString(),
                            body('description').isString()],
                            handleInputErrors,
                            addCollection);

router.delete('/collections/:id',handleInputErrors, deleteCollection);
router.post('/collections/', handleInputErrors,verifyCollectionInQuery,verifyCollectionExists, moveCollectionToNextStep);



export default router;