import {Router} from 'express'

const router = Router()

// Property //

router.get('/property', (req,res) => {
    res.json({message: 'message'})
})
router.get('/property/:id', () => {})

router.put('/property/:id', () => {})
router.post('/property', () => {})

router.delete('/property/:id', () => {})


export default router

