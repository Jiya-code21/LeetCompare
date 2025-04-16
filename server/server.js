import express from "express"
import cors from "cors"

const app=express()
app.use(cors())
app.use(express.json())


app.post('/api/leetcode',async(req,res)=>{
  try{
  const response=await fetch('https://leetcode.com/graphql/',{
  method:"POST",
  headers:{
    'Content-Type':'application/json'
  },
  body:JSON.stringify(req.body)
  })

  //leetcode se hamme joh data milta hai voh raw format main milta hai toh usse javascript object banana hota hai 
  //isiliye .json method ka use karte hai
  //await means wait until poora data nhi aata hai 
  

  const data=await response.json()

  //abh iss data ko frontend par return kar rhe hai 
  //res.json means response bhejna json format main
  res.json(data)

  }
  catch(error){
  console.log("Error:",error.message)
  res.status(500).json({error:"Failed to fetch data from leetcode."})
  }
})

const PORT=4500
app.listen(PORT,()=>{
  console.log(`Server is running at port: ${PORT}`)
})