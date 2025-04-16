import React,{useState} from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function LeetcodeProfile() {

  const [username,setUsername]=useState("")
  const [profile,setProfile]=useState(null)
  const [status,setStatus]=useState(null)

  const fetchleetcodedata=async()=>{

    const URL="http://localhost:4500/api/leetcode"

    const query1={
      "query":`
      query userPublicProfile($username: String!) { matchedUser(username: $username) { contestBadge { name expired hoverText icon } username profile { ranking userAvatar realName aboutMe school countryName skillTags reputation reputationDiff solutionCount solutionCountDiff } } }`,
      "variables": {
    "username":username
  },
  "operationName": "userPublicProfile"
    }


    const query2={
      "query":`
      query userSolvedProblems($username: String!) { matchedUser(username: $username) { submitStatsGlobal { acSubmissionNum { difficulty count submissions } } } }
      `, 
      "variables": {
        "username":username
      }
    }


    try{
      //first request
const res1=await fetch(URL,{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify(query1),
  })
  const data1=await res1.json()

  //second request
  const res2=await fetch(URL,{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify(query2),
  })
  const data2=await res2.json()

  //data1.data.matchedUser give entire user information
  setProfile(data1.data.matchedUser)
  setStatus(data2.data.matchedUser.submitStatsGlobal.acSubmissionNum)
  
    }
    catch(error){
console.log("Error: ",error)
    }
  }

  const getCount=(difficulty)=>{
    //agar tatus nhi hai toh show this sign -
    if(!status) return "-"

    for(let i=0;i<status.length;i++){

      let item=status[i]

      if(item.difficulty===difficulty){
        return item.count + " (Submissions: " + item.submissions + ")"
      }
    }

    return "-"
  }

  //for line chart
  //mention name as difficulty so that on x axis it shows whether it is easy medium and hard problem..
 //item represent each element in the status array
  const chartdata=status?.map(item=>({
    name:item.difficulty,
    solved:item.count,
    submissions:item.submissions
  })) || [] //write || [] because if ststus is undefined and null then it return empty array instead of undefined..

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
{/* Heading*/}
      <h2 className="text-2xl font-semibold mb-4 text-indigo-600">LeetCode Profile Finder</h2>

{/*Div for enter username and button for fetch..*/}
      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter Leetcode username"
          className="px-4 py-2 border rounded-md w-64 text-sm"
        />
        
        <button
          onClick={fetchleetcodedata}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm"
        >
          Fetch Profile
        </button>
      </div>



      {profile && (

        <div className="bg-white shadow-md p-8 rounded-lg w-full max-w-6xl">

{/*Div for user photo and usrname... */}
{/*Div for horizontal show data */}
<div className="flex gap-8">
          <div className="flex flex-col items-center">
            <img
              src={profile.profile.userAvatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full mb-2"
            />
            <h3 className="text-lg font-bold">
              {profile.profile.realName || profile.username}
            </h3>
          </div>

{/*Div for the data.. */}
          <div className="mt-4 text-sm text-gray-700 space-y-1">
            <p>
              <span className="font-medium">🏆Ranking:</span> {profile.profile.ranking}
            </p>
            <p>
              <span className="font-medium">🌍Country:</span> {profile.profile.countryName}
            </p>
            <p>
              <span className="font-medium">🎓School:</span> {profile.profile.school}
            </p>
            <p>
              <span className="font-medium">💬About:</span> {profile.profile.aboutMe}
            </p>
            <p>
              <span className="font-medium">⭐Reputation:</span> {profile.profile.reputation}
            </p>
          </div>

{/* Horizontal line separate profile details and status..*/}
          <hr className="my-4" />

          <div className="text-sm text-gray-800 space-y-1">
            <p>
              <span className="font-medium">🟢Easy:</span> {getCount('Easy')}
            </p>
            <p>
              <span className="font-medium">🟡Medium:</span> {getCount('Medium')}
            </p>
            <p>
              <span className="font-medium">🔴Hard:</span> {getCount('Hard')}
            </p>
            </div>
          </div>

          {/* Line chart for solved problems */}
<div className="flex-1 mt-6">
  <h3 className="text-center font-bold text-gray-900 mb-4">Solved Problems Count</h3>
  <ResponsiveContainer width="100%" height={300}>
<LineChart data={chartdata}>
  <XAxis dataKey="name"/>
  <YAxis/>
  <Tooltip/>
  <Legend iconType="square"/>
  <Line type="monotone" dataKey="solved" stroke="blue"/>
  <Line type="monotone" dataKey="submissions" stroke="green"/>

</LineChart>
  </ResponsiveContainer>
</div>   
</div>
      )}
    </div>
  );
}

export default LeetcodeProfile