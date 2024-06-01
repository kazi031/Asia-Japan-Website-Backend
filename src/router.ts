import {Router} from 'express'
import { body, oneOf, validationResult } from "express-validator";
import { handleInputErrors } from './modules/middleware';
import { validatePostProperty, validateUpdateProperty } from './modules/propertyMiddleware'
import { protect } from './modules/auth'
import { createNewProperty, getProperties } from './handlers/property';


const router = Router()

// Property //

router.get('/property', getProperties)
router.get('/property/:id', () => {})

router.put('/property/:id',
    protect,
    validateUpdateProperty,
    handleInputErrors, 
    (req, res) => {}
)
router.post('/property', 
    protect, 
    createNewProperty)

router.delete('/property/:id', protect,
() => {})


export default router

