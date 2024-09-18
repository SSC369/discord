import { IoMdMail } from "react-icons/io";
import { RiLock2Line } from "react-icons/ri";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
import { TailSpin } from "react-loader-spinner";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleValidation = () => {
    const { password, email } = formData;
    if (password === "") {
      toast.error("Please enter password!", { duration: 1000 });
      return false;
    } else if (email === "") {
      toast.error("Please enter email !", { duration: 1000 });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    try {
      setLoading(true);
      if (handleValidation()) {
        const url = import.meta.env.VITE_BACKEND_URL + "/login";

        const response = await axios.post(url, {
          password,
          email,
        });

        if (response.status === 200) {
          Cookies.set("discordToken", response.data?.jwtToken);
          setFormData({
            password: "",
            email: "",
          });
          toast.success("Login successful", {
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
        className="flex w-4/5 min-w-[300px] max-w-md flex-col gap-3 rounded-2xl bg-white p-8 text-sm shadow-2xl"
      >
        <h1 className="mb-3 text-2xl font-bold text-black">
          Discord <span className="text-discord">Login</span>
        </h1>
        <label className="font-semibold text-black">Email</label>

        <div className="flex h-12 items-center rounded-lg border-2 border-gray-300 pl-2 transition focus-within:border-blue-500">
          <IoMdMail className="mr-2" size={20} />
          <input
            onChange={handleChange}
            name="email"
            value={formData.email}
            type="email"
            className="ml-2 h-full w-[80%] border-none focus:outline-none"
            placeholder="Enter your Email"
          />
        </div>

        <label className="font-semibold text-black">Password</label>

        <div className="flex h-12 items-center rounded-lg border-2 border-gray-300 pl-2 transition focus-within:border-blue-500">
          <RiLock2Line className="mr-2" size={20} />
          <input
            onChange={handleChange}
            name="password"
            value={formData.password}
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
          Dont have an account?
          <span
            className="mx-2 cursor-pointer text-discord"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
