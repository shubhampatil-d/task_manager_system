
"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const router = useRouter();
  const logout = async ()=>{
    try{
      const refreshToken= localStorage.getItem("refreshToken");
      await axios.post("http://localhost:5000/auth/logout", {
        token:refreshToken,
      });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      router.push("/login");
    }catch(err){
      console.log("logout Error", err);
    }
  };
  
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  const [search, setSearch]= useState("");

  const fetchTasks = async () => {
    const res = await axios.get(`http://localhost:5000/tasks?search=${search}`, {
      headers: { Authorization: token },
    });
    setTasks(res.data);
  };

  const addTask = async () => {
    await axios.post(
      "http://localhost:5000/tasks",
      { title },
      { headers: { Authorization: token } }
    );
    setTitle("");
    fetchTasks();
  };

  const deleteTask = async (id: number) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`, {
      headers: { Authorization: token },
    });
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const toggleTask = async ( id:number) =>{
    await axios.patch(
      `http://localhost:5000/tasks/${id}/toggle`,
      {},
      { headers: {Authorization:token}}
    );
    fetchTasks();
  };

  return (
    <div>
      
      <div style={{ maxWidth:"500px", margin:"auto"}}></div>
      <h2>Dashboard</h2>
      <button onClick={logout}>Logout</button>

      <input value={title} onChange={(e) => setTitle(e.target.value)} />

      <button onClick={addTask}>Add Task</button>
      <br />
      <br />
      <input 
      placeholder="Search tasks"
      onChange={(e)=> setSearch(e.target.value)}
      />
      <button onClick={fetchTasks}>Search</button>  
      
      {tasks.map((task: any) => (
        <div key={task.id}>
          <span>{task.title} {task.completed?"Done":"incomplete" } </span>
          <button onClick={() => toggleTask(task.id)}>
            { task.completed? "Undo":"Done"}
          </button> 
          <button onClick={() => deleteTask(task.id)}>Delete</button>
          
        </div>
      ))}
    </div>
    
  );
}