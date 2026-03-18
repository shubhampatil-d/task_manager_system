"use client";
import axios from "axios";
import { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
  try {
    const res = await axios.post("http://localhost:5000/auth/register", {
      email,
      password,
    });

    console.log("REGISTER SUCCESS:", res.data);
    alert("Registered successfully");
  } catch (err: any) {
    console.log("REGISTER ERROR:", err.response?.data);
    alert(err.response?.data?.msg || "Register failed");
  }
};

  return (
    <div>
      <h2>Register</h2>
      <input onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}