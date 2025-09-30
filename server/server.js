import express from 'express';

const app = express()

app.use(express.json())

app.get("/health",(req,res)=>{
    res.send("server is running")
})

app.listen(8000, () => {
    console.log("server is running on post:", 8000);
})