import express from "express"
const dotenv = require("dotenv")
import identifyRoute from "./routes/identify"

dotenv.config()

const app = express()
app.use(express.json())

app.use("/identify", identifyRoute)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})