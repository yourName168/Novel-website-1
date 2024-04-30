import cors from 'cors'
import dotenv from 'dotenv'
import express, { Express } from 'express'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import novelRouter from './routes/Novels.Routes'
import userRoute from './routes/User.Routes'
import adminRouter from './routes/Admin.Routes'
import { databaseService } from './services/database.services'
dotenv.config()

const app: Express = express()
const port = process.env.PORT

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
databaseService.run()
app.use(express.json())
app.use(cors())
app.use('/users', userRoute)
app.use('/novels', novelRouter)
app.use('/admin', adminRouter)
app.use(defaultErrorHandler)