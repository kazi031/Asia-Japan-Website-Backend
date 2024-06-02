import { body } from "express-validator";

//Property Data Validation Middleware
export const validateUpdateProperty = [
    body('title').optional().isString().withMessage('Name must be a string'),
    body('subtitle').optional().isString().withMessage('Name must be a string'), 
    body('location').optional().isString().withMessage('Name must be a string'), 
    body('detailedLocation').optional().isString().withMessage('Name must be a string'), 
    body('area').optional().isString().withMessage('Name must be a string'),
    body('roadWidth').optional().isString().withMessage('Name must be a string'), 
    body('landFace').optional().isString().withMessage('Name must be a string'), 
    body('landDetails').optional().isString().withMessage('Name must be a string'), 

    body('status').optional().isIn(['AVAILABLE','UNAVAILABLE']),

    body('assets')
      .optional()
      .isArray({ min: 3 , max: 3 }).withMessage('Images must be an array with at least zero to three URL')
      .custom((array) => {
        array.forEach(url => {
          if (!/^(http|https):\/\/[^ "]+$/.test(url)) {
            throw new Error('Each image URL must be a valid URL');
          }
        });
        return true;
      }).withMessage('Invalid image URL'),
  ];

  export const validatePostProperty = [
    body('title').exists().isString().withMessage('Name must be a string'),
    body('subtitle').exists().isString().withMessage('Name must be a string'), 
    body('location').exists().isString().withMessage('Name must be a string'), 
    body('detailedLocation').exists().isString().withMessage('Name must be a string'), 
    body('area').exists().isString().withMessage('Name must be a string'),
    body('roadWidth').exists().isString().withMessage('Name must be a string'), 
    body('landFace').exists().isString().withMessage('Name must be a string'), 
    body('landDetails').exists().isString().withMessage('Name must be a string'), 

    // body('assets')
    //   .exists()
    //   .isArray({ min: 3 , max: 3 }).withMessage('Images must be an array with exactly 3 URLs')
    //   .custom((array) => {
    //     array.forEach(url => {
    //       if (!/^(http|https):\/\/[^ "]+$/.test(url)) {
    //         throw new Error('Each image URL must be a valid URL');
    //       }
    //     });
    //     return true;
    //   }).withMessage('Invalid image URL'),
  ];