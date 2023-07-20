import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import { toyService } from './services/toy.service.js'
import { loggerService } from './services/logger.service.js'
const app = express()


// Express Config:
app.use(express.json())
app.use(cookieParser())
app.use(express.static('public'))



if (process.env.NODE_ENV === 'production') {
    // Express serve static files on production environment
    app.use(express.static(path.resolve(__dirname, 'public')))
} else {
    // Configuring CORS
    const corsOptions = {
        // Make sure origin contains the url your frontend is running on
        origin: [
            'http://127.0.0.1:5173',
            'http://localhost:5173',
            'http://127.0.0.1:3000',
            'http://localhost:3000',
        ],
        credentials: true,
    }
    app.use(cors(corsOptions))
}

// Express Routing:


// Get Toy (READ)
app.get('/api/toy/:toyId', (req, res) => {
    const toyId = req.params.toyId
    toyService.getById(toyId)
        .then(toy => {
            res.send(toy)
        })
        .catch((err) => {
            loggerService.error('Cannot get toy', err)
            res.status(400).send('Cannot get toy')
        })
})

// Get Toys (READ)
app.get('/api/toy', (req, res) => {
    console.log("🚀 ~ file: server.js:53 ~ app.get ~ req:", req.query)
    const filterBy = {
        name: req.query.name || '',
        price: req.query.price || 100,
        inStock: req.query.inStock || 'all'
        // pageIdx: req.query.pageIdx,
    }
    toyService.query(filterBy)
        .then(toys => {
            res.send(toys)
        })
        .catch(err => {
            loggerService.error('Cannot get toys', err)
            res.status(400).send('Cannot get toys')
        })
})

// Save Toy (/UPDATE)
app.put('/api/toy/:toyId', (req, res) => {
    const { _id, name, price, inStock } = req.body
    const toyToSave = { _id, name, price, inStock }
    
    toyService.save(toyToSave)
        .then(savedToy => {
            loggerService.info('Toy saved!', toyToSave)
            res.send(savedToy)
        })
        .catch((err) => {
            loggerService.error('Cannot save toy', err)
            res.status(400).send('Cannot save toy')
        })
    })
    
// Save Toy (CREATE)
app.post('/api/toy/', (req, res) => {
    const { name, price } = req.body
    const toyToSave = { name, price }

    toyService.save(toyToSave)
        .then(savedToy => {
            loggerService.info('Toy saved!', toyToSave)
            res.send(savedToy)
        })
        .catch((err) => {
            loggerService.error('Cannot save toy', err)
            res.status(400).send('Cannot save toy')
        })
})

// Delete toy (DELETE)
app.delete('/api/toy/:toyId', (req, res) => {
    const toyId = req.params.toyId
    toyService.remove(toyId)
        .then(toy => {
            loggerService.info(`Toy ${toyId} removed`)
            res.send(`Toy ${toyId} Removed`)
            // res.redirect('/api/toy')
        })
        .catch((err) => {
            loggerService.error('Cannot remove toy', err)
            res.status(400).send('Cannot remove toy')
        })
})


const port = process.env.PORT || 3030
app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)

