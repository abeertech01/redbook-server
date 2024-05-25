import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import { errorMiddleware } from "./middlewares/error"

dotenv.config({
  path: "./.env.local",
})

const app: Express = express()
const port = process.env.PORT || 3000

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server")
})

app.use(errorMiddleware)

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
