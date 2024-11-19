import {Router} from 'express';
import {body}  from 'express-validator';
import {getWords, addWords, deleteWord} from './handlers/word';
import {addCollection, getCollections, moveCollectiontoNextStep} from "./handlers/collection";
import {handleInputErrors} from "./modules/middleware";

const router = Router();

router.get('/words/',getWords);
router.post('/words/', [body('collectionId').isString()],
                        handleInputErrors,
                        addWords)
router.delete('/words/:id', handleInputErrors, deleteWord)



router.get('/collections',getCollections);
router.post('/collections', [body('name').isString(),
                            body('description').isString()],
                            handleInputErrors,
                            addCollection);

router.delete('/collections/:id',handleInputErrors, deleteCollection);
router.post('/collections/:id', handleInputErrors, moveCollectiontoNextStep);



export default router;