import { IoMdMail } from "react-icons/io";
import { RiLock2Line } from "react-icons/ri";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useState } from "react";
import { FaRegCircleUser } from "react-icons/fa6";
import toast from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword, email, username } = formData;
    if (password !== confirmPassword) {
      toast.error("Password and confirm password should be same.", {
        duration: 1000,
      });
      return false;
    } else if (username.length > 6) {
      toast.error("Username must be less 6 chars", { duration: 1000 });
    } else if (password.length < 5) {
      toast.error("Password is too short.", { duration: 1000 });
      return false;
    } else if (email === "") {
      toast.error("Email is required!", { duration: 1000 });
      return false;
    } else if (username === "") {
      toast.error("Username is required!", { duration: 1000 });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, username } = formData;
    try {
      setLoading(true);
      if (handleValidation()) {
        const url = import.meta.env.VITE_BACKEND_URL + "/register";

        const response = await axios.post(url, {
          password,
          email,
          username,
        });

        const { data } = response;

        if (response.status === 201) {
          Cookies.set("discordToken", data.jwtToken);
          setFormData({
            password: "",
            email: "",
            username: "",
            confirmPassword: "",
          });
          toast.success("Registration Successful", {
            duration: 1000,
          });

          setTimeout(() => {
            navigate("/");
          }, 1000);
        }
      }
    } catch (error) {
      toast.error(error.response.data.message, { duration: 1000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh min-w-[300px] flex-col items-center justify-center bg-white">
      <form
        onSubmit={handleSubmit}
        className="flex w-4/5 min-w-[300px] max-w-md flex-col gap-2 rounded-2xl bg-white p-8 text-sm shadow-2xl"
      >
        <h1 className="mb-3 text-2xl font-bold text-black md:text-3xl">
          Discord <span className="text-discord">Register</span>
        </h1>

        <label className="font-semibold text-black">Username</label>

        <div className="flex h-12 items-center rounded-lg border-2 border-gray-300 pl-2 transition focus-within:border-blue-500">
          <FaRegCircleUser className="mr-2" size={20} />
          <input
            onChange={handleChange}
            name="username"
            value={formData.username}
            type="text"
            className="ml-2 h-full w-[80%] border-none focus:outline-none"
            placeholder="Enter username"
          />
        </div>

        <label className="font-semibold text-black">Email</label>

        <div className="flex h-12 items-center rounded-lg border-2 border-gray-300 pl-2 transition focus-within:border-blue-500">
          <IoMdMail className="mr-2" size={20} />
          <input
            onChange={handleChange}
            value={formData.email}
            name="email"
            type="text"
            className="ml-2 h-full w-[80%] border-none focus:outline-none"
            placeholder="Enter your Email"
          />
        </div>

        <label className="font-semibold text-black">Password</label>

        <div className="flex h-12 items-center rounded-lg border-2 border-gray-300 pl-2 transition focus-within:border-blue-500">
          <RiLock2Line className="mr-2" size={20} />
          <input
            onChange={handleChange}
            value={formData.password}
            name="password"
            type={showPassword ? "text" : "password"}
            className="ml-2 h-full w-full border-none focus:outline-none"
            placeholder="Enter your Password"
          />
          {showPassword ? (
            <AiOutlineEyeInvisible
              onClick={() => setShowPassword(!showPassword)}
              className="mr-2 cursor-pointer"
              size={20}
            />
          ) : (
            <AiOutlineEye
              onClick={() => setShowPassword(!showPassword)}
              className="mr-2 cursor-pointer"
              size={20}
            />
          )}
        </div>

        <label className="font-semibold text-black">Confirm Password</label>

        <div className="flex h-12 items-center rounded-lg border-2 border-gray-300 pl-2 transition focus-within:border-blue-500">
          <RiLock2Line className="mr-2" size={20} />
          <input
            onChange={handleChange}
            value={formData.confirmPassword}
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            className="ml-2 h-full w-full border-none focus:outline-none"
            placeholder="Enter your Password"
          />
          {showPassword ? (
            <AiOutlineEyeInvisible
              onClick={() => setShowPassword(!showPassword)}
              className="mr-2 cursor-pointer"
              size={20}
            />
          ) : (
            <AiOutlineEye
              onClick={() => setShowPassword(!showPassword)}
              className="mr-2 cursor-pointer"
              size={20}
            />
          )}
        </div>

        <button
          type="submit"
          className="mb-2 mt-5 flex h-12 w-full items-center justify-center rounded-lg bg-discord text-sm font-medium text-white transition"
        >
          {loading ? (
            <TailSpin
              visible={true}
              height="30"
              width="30"
              color="white"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
            />
          ) : (
            "Submit"
          )}
        </button>
        <p className="text-center text-sm text-black">
          Already have an account?
          <span
            className="ml-2 cursor-pointer font-medium text-discord"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
