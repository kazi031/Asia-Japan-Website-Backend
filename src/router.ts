import {Router} from 'express'
import { body, oneOf, validationResult } from "express-validator";
import { handleInputErrors } from './modules/middleware';
import { validatePostProperty, validateUpdateProperty } from './modules/propertyMiddleware'
import { protect } from './modules/auth'


const router = Router()

// Property //

router.get('/property', (req,res) => {
    res.json({message: 'message'})
})
router.get('/property/:id', () => {})

router.put('/property/:id',
    protect,
    validateUpdateProperty,
    handleInputErrors, 
    (req, res) => {}
)
router.post('/property', 
    protect,
    validatePostProperty, 
    handleInputErrors, 
    (req, res) => {})

router.delete('/property/:id', protect,
() => {})


export default router

