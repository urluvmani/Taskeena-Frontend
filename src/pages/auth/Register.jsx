import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const Register = () => {
  const Navigate = useNavigate();
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [phone, setphone] = useState("");
  const [address, setaddress] = useState("");
  const [answer, setanswer] = useState("");

  const handlesubmit = async (e) => {
    e.preventDefault();
    let res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/v1/auth/register`,
      {
        name,
        email,
        password,
        phone,
        address,
        answer,
      }
    );
    if (res) {
      toast.success("🎉 Registered Successfully! Welcome aboard 🌼");
      Navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-amber-50 to-emerald-100 p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-pink-200 rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-extrabold text-pink-600 drop-shadow-sm">
            🏥 Create Your Account
          </h2>
          <p className="text-gray-600 text-sm mt-2">
            We’re happy to have you join the family 💕
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handlesubmit}>
          <div>
            <label className="text-gray-700 font-medium">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setname(e.target.value)}
              className="w-full mt-2 p-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="text-gray-700 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              className="w-full mt-2 p-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="text-gray-700 font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              className="w-full mt-2 p-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="text-gray-700 font-medium">Phone</label>
            <input
              type="text"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setphone(e.target.value)}
              className="w-full mt-2 p-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="text-gray-700 font-medium">Address</label>
            <input
              type="text"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setaddress(e.target.value)}
              className="w-full mt-2 p-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="text-gray-700 font-medium">
              Just for Fun 🎈 (Your Favourite Sport)
            </label>
            <input
              type="text"
              placeholder="Enter your favourite sport"
              value={answer}
              onChange={(e) => setanswer(e.target.value)}
              className="w-full mt-2 p-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          <button
            type="submit"
            className="mt-3 bg-gradient-to-r from-pink-500 to-rose-400 text-white font-semibold py-3 rounded-xl hover:from-rose-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-pink-300/50"
          >
            Register 👨‍⚕️
          </button>

          <p className="text-center text-gray-600 text-sm mt-5">
            Already have an account?{" "}
            <span
              onClick={() => Navigate("/login")}
              className="text-pink-600 font-semibold cursor-pointer hover:underline"
            >
              Login here 
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
