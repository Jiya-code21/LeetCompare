import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Contest=()=>{
  const [username1,setUsername1]=useState("");
  const [username2,setUsername2]=useState("");
  const [data,setData]=useState([]);

  const fetchData=async()=>{
    if (!username1 ||!username2) return;

    const query=`
      query userContestRankingInfo($username: String!) {
        userContestRanking(username: $username) {
          attendedContestsCount
          rating
          globalRanking
          totalParticipants
          topPercentage
          badge {
            name
          }
        }
        userContestRankingHistory(username: $username) {
          attended
          rating
          contest {
            title
            startTime
          }
        }
      }
    `;

try{
    const res1=await fetch('http://localhost:4500/api/leetcode',{
      method:"POST",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({query,variables:{username:username1}}),
    })
    const result1=await res1.json()

    const res2=await fetch('http://localhost:4500/api/leetcode',{
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({query,variables:{username:username2}})
    })
    const result2=await res2.json()

      const history1=result1.data.userContestRankingHistory || []
      const history2=result2.data.userContestRankingHistory || []
      
        {/*filter method array me se sirf wo items choose karta hai joh condition pass karte hai*/} 
                {/*toLocaleDateString() aapke date ko MM/DD/YYYY MAIN convert kar deta hai*/} 
                              {/*rating points main aa rhi thi toh round ka use kiya hai ...*/}   

      const map1=history1.filter((item)=>item.attended).map((item)=>({
        date:new Date(item.contest.startTime*1000).toLocaleDateString(),
        [username1]:Math.round(item.rating),
      }))

      const map2=history2.filter((item)=>item.attended).map((item)=>({
        date:new Date(item.contest.startTime*1000).toLocaleDateString(),
        [username2]:Math.round(item.rating),
      }))
      
      {/*remove duplicate dates*/}
      const allDatesSet=new Set([...map1,...map2].map((item)=>item.date))
        {/*convert set to array*/}
        

        const finaldata=Array.from(allDatesSet).map((date)=>{

            const obj={date}

            const entry1=map1.find((item)=>item.date===date);
            const entry2=map2.find((item)=>item.date===date);

            if (entry1&&entry1[username1]!== undefined) {
                obj[username1]=entry1[username1]
              }
              if (entry2&&entry2[username2]!==undefined) {
                obj[username2]=entry2[username2]
              }
              return obj

        })
        {/* It is necesary because date ke according nhi aa rha tha graph */}
        finaldata.sort((a,b)=>new Date(a.date)-new Date(b.date));

      setData(finaldata)

  }
  catch(error){
    console.log("Error",error)
  }
}

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-white">
    <h2 className="text-2xl sm:text-3xl font-bold text-indigo-800 mb-6">
      LeetCode Contest Rating
    </h2>


    <div className="flex flex-wrap justify-center gap-4 mb-4 w-full max-w-4xl">

        <input type="text" placeholder="Enter username" value={username1} onChange={(e)=>setUsername1(e.target.value)}
          className="p-2 rounded-lg border border-indigo-300 bg-white text-sm w-64 shadow-md"
        />
         <input type="text" placeholder="Enter username" value={username2} onChange={(e)=>setUsername2(e.target.value)}
          className="p-2 rounded-lg border border-indigo-300 bg-white text-sm w-64 shadow-md"
        />

<button
  onClick={fetchData}
  className="px-5 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 shadow hover:opacity-90 transition"
>
  Compare
</button>

      </div>
      <div className="w-full max-w-5xl rounded-xl bg-white p-4 shadow-xl border border-purple-100">
        
        {/*for names */}
        <div className="flex justify-end gap-6 mb-2 px-2">
          {username1&&(
            <div className="flex items-center gap-2 text-sm font-medium text-indigo-700">
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: '#6366f1' }}></span>{username1}</div>
          )}
          {username2 && (
            <div className="flex items-center gap-2 text-sm font-medium text-purple-700">
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: '#a855f7' }}></span> {username2}</div>
          )}
        </div>



  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
     {/*<CartesianGrid stroke="darkgrey" />*/}  {/*isse grid show hoti hai*/} 
      <XAxis dataKey="date" stroke="#555" />
      <YAxis stroke="#555" />
      <Tooltip
        contentStyle={{backgroundColor: "#fff",borderRadius: "10px",border: "1px solid #ccc",fontSize: "14px", }}
       labelStyle={{color:"black"}}
      />
   
      <Line connectNulls  type="monotone" dataKey={username1} stroke="#6366f1" strokeWidth={3} dot={{r:4}} activeDot={{r:6}}/>
      <Line connectNulls type="monotone" dataKey={username2} stroke="#a10bdb" strokeWidth={3} dot={{r:4}} activeDot={{r:6}} />
    </LineChart>
  </ResponsiveContainer>
</div>
    </div>
  );
};

export default Contest;
