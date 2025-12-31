import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const submit = async () => {
    try {
      console.log("Logging in with:", data);
      const res = await axios.post("/auth/login", data);
      console.log("Login response:", res.data);

      swal(res.data.message);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userRole", res.data.user.role);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      swal(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="bg-gray-200 h-screen w-screen flex justify-center items-center">
      <div className="w-[400px] bg-blue-100 p-8 rounded-xl shadow-xl border border-gray-300">
        
        <h2 className="font-semibold text-3xl bg-blue-200 p-3 rounded-lg text-center">
          Login
        </h2>

        <div className="mt-8 space-y-5">

          <div>
            <label className="block font-medium">Enter E-mail:</label>
            <input
              className="w-full mt-1 p-2 border rounded-md outline-none"
              placeholder="Email"
              type="email"
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-medium">Password:</label>
            <input
              className="w-full mt-1 p-2 border rounded-md outline-none"
              type="password"
              placeholder="Password"
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
          </div>

        </div>

        <button
          onClick={submit}
          className="mt-8 w-full h-12 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Login
        </button>

        <p className="text-blue-600 mt-4 text-center hover:underline">
            <Link to={"/register"}>Register</Link>
        </p>
      </div>
    </div>
  );
}
