const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express()

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

/*
 * Routes
 */
const authRoutes = require('./routes/auth.routes')
const moodRoutes = require('./routes/mood.routes')
const userRoutes = require('./routes/user.routes')
const itunesRoutes = require('./routes/itunes.routes')

app.use('/api/auth', authRoutes)
app.use('/api/mood', moodRoutes)
app.use('/api/user', userRoutes)
app.use('/api/itunes', itunesRoutes)

module.exports = app
