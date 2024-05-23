import {Router} from 'express'
import { body, oneOf, validationResult } from "express-validator";
import { handleInputErrors, validateUpdateProperty } from './modules/middleware';

const router = Router()

// Property //

router.get('/property', (req,res) => {
    res.json({message: 'message'})
})
router.get('/property/:id', () => {})

router.put('/property/:id', 
    validateUpdateProperty,
    handleInputErrors, 
    (req, res) => {}
)
router.post('/property', body('title').isString(), handleInputErrors, (req, res) => {})

router.delete('/property/:id', () => {})


export default router

