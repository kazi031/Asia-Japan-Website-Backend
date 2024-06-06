import {Router} from 'express'
import { body, oneOf, validationResult } from "express-validator";
import { handleInputErrors } from './modules/middleware';
import { validatePostProperty, validateUpdateProperty } from './modules/propertyMiddleware'
import { protect } from './modules/auth'
import { createNewProperty, getProperties, updateProperty } from './handlers/property';
// const multer = require('multer');
import multer from 'multer';


const router = Router()

const upload = multer({ dest: 'propertyImages/' }).array('assets', 3);

const updateUpload = multer({ dest: 'propertyImages/' }).array('assets', 2);

// Property //

router.get('/property', getProperties)
router.get('/property/:id', () => {})

router.put('/property/:id',
    protect,
    updateUpload,
    validateUpdateProperty,
    handleInputErrors, 
    updateProperty
)
router.post('/property', 
    protect, 
    upload,
    validatePostProperty,
    handleInputErrors,
    createNewProperty)

router.delete('/property/:id', protect,
() => {})


export default router

