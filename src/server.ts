import express from 'express'
import router from './router'
import morgan from 'morgan'
import cors from 'cors'
import { createNewUser, signin } from './handlers/user'
import { validateUser } from './modules/userMiddleware'
import { handleInputErrors } from './modules/middleware'

const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use('/propertyImages', express.static('propertyImages'));
app.use(express.json())
app.use(express.urlencoded({extended: true}))


// app.use((req, res, next) => {
//     req.shh_secret = 'doggy'
//     res.status(401)
//     res.send('Nope')
// })

app.get('/', (req, res) => {
    console.log('hello from express')
    res.status(200)
    res.json({message: 'hello'})
})

app.use('/api', router)
app.post('/user', validateUser, handleInputErrors, createNewUser)
app.post('/signin', validateUser, handleInputErrors, signin)


app.use((err, req, res, next) => {
    if (err.type === 'auth'){
      res.status(401).json({message: "unauthorized"})
    } else if (err.type === 'input'){
      res.status(400).json({message: "invalid input"})
    } else {
        res.status(500).json({message: "oops, that's on us"})
    }
})


export default app