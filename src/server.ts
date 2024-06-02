import express from 'express'
import router from './router'
import morgan from 'morgan'
import cors from 'cors'
import { createNewUser, signin } from './handlers/user'

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
app.post('/user', createNewUser)
app.post('/signin', signin)

export default app