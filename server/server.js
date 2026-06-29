const PORT = process.env.PORT || 4000 
import app from './app.js'
import connectDB from './src/config/db.js'



app.listen(PORT,()=>{
    console.log(`App is Listening on PORT ${PORT}`)
})


connectDB()