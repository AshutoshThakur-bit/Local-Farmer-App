import { useState } from "react";
import axios from "axios";
import swal from "sweetalert";
import { Link } from "react-router-dom";

export default function Register() {
  const [data, setData] = useState({ name: "", email: "", password: "", role: "Customer" });
  const [error, setError] = useState("");

  const submit = async () => {
    if (!data.name || !data.email || !data.password) {
      setError("All fields are required!");
      return;
    }

    try {
      const res = await axios.post("/auth/register", data);
      swal(res.data.message);
      setError("");
    } catch (err) {
      swal(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="bg-gray-200 h-screen w-screen flex justify-center items-center">
      <div className="w-[400px] bg-blue-100 p-8 rounded-xl shadow-xl border border-gray-300">

        <h2 className="font-semibold text-3xl bg-blue-200 p-3 rounded-lg text-center">
          Register
        </h2>

        <div className="mt-8 space-y-5">

          <div>
            <label className="block font-medium">Full Name:</label>
            <input
              className="w-full mt-1 p-2 border rounded-md outline-none"
              placeholder="Enter your name"
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-medium">E-mail:</label>
            <input
              className="w-full mt-1 p-2 border rounded-md outline-none"
              type="email"
              placeholder="Enter email"
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-medium">Role:</label>
            <select
              value={data.role}
              onChange={(e) => setData({ ...data, role: e.target.value })}
              className="w-full mt-1 p-2 border rounded-md outline-none"
            >
              <option value="Customer">Customer</option>
              <option value="Farmer">Farmer</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Password:</label>
            <input
              className="w-full mt-1 p-2 border rounded-md outline-none"
              type="password"
              placeholder="Enter password"
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}

        </div>

        <button
          onClick={submit}
          className="mt-8 w-full h-12 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Register
        </button>

        <p className="text-blue-600 mt-4 text-center hover:underline">
          <Link to="/login">Login, if registered</Link>
        </p>

      </div>
    </div>
  );
}
