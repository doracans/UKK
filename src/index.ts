
import express from "express"
import path from "path"
import cors from "cors"
import userRoute from "./route/userRoute"
import menuRoute from "./route/menuRoute"
import transaksiRoute from "./route/transaksiRoute"
import mejaRoute from "./route/mejaRoute"


const app = express()
const PORT: number = 8000

app.use(cors())
app.use(express.json())


app.use(`/user`, userRoute)
app.use(`/menu`, menuRoute)
app.use(`/transaksi`, transaksiRoute)
app.use(`/meja`, mejaRoute)
app.use(`/public`, express.static(path.join(__dirname, `public`)))
app.listen(PORT, () => console.log(`Server dora caffe run on port ${PORT}`))
