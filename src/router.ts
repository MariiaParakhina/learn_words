import {Router} from 'express';
import {body}  from 'express-validator';
import {getWords} from './handlers/word';
import {addCollection, getCollections} from "./handlers/collection";
import {handleInputErrors} from "./modules/middleware";

const router = Router();

router.get('/words/',getWords);




router.get('/collections',getCollections);
router.post('/collections', [body('name').isString(),
                            body('description').isString()],
                            handleInputErrors,
                            addCollection);




export default router;