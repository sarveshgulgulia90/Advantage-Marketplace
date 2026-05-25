import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      navigate("/admin/dashboard");
    } catch (error) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-black flex justify-center items-center">
      
      <form
        onSubmit={handleLogin}
        className="bg-gray-900 p-10 rounded-3xl w-[400px] shadow-2xl"
      >
        <h1 className="text-4xl text-white font-bold mb-8 text-center">
          Admin Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-5 p-4 rounded-xl bg-gray-800 text-white outline-none"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-4 rounded-xl bg-gray-800 text-white outline-none"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-semibold">
          Login
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;