const express = require('express')

const app = express()
app.disable('x-powered-by')
app.use('/projects', express.static('../projects/dist'))

// app.use(express.static(process.cwd()))

app.get('/', (_req, res) => res.send(`<html><head></head><body><canvas></canvas></body></html>`))
app.listen(4444, () => console.log('Running express server for Puppeteer pages'))
