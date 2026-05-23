import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { LiaAddressCard } from "react-icons/lia";
import { registeruser } from "../store/authslice";

const Registerpage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // FIXED
  const status = useSelector((state) => state.auth.status);

  const [submitted, setSubmitted] = useState(false);

  const [userdata, setUserdata] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handlechange = (e) => {
    const { name, value } = e.target;

    setUserdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlesubmit = (e) => {
    e.preventDefault();

    setSubmitted(true);

    dispatch(registeruser(userdata));
  };

  useEffect(() => {
    if (!submitted) return;

    if (status === "succeeded") {
      navigate("/login");
    }

    if (status === "error") {
      alert("Something went wrong, please try again later");
      setSubmitted(false);
    }
  }, [status, submitted, navigate]);

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <LiaAddressCard className="mx-auto h-14 w-auto mt-15" />

        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          className="space-y-6"
          onSubmit={handlesubmit}
          autoComplete="off"
        >
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-900"
            >
              Username
            </label>

            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="off"
                onChange={handlechange}
                value={userdata.username}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900"
            >
              Email address
            </label>

            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="off"
                onChange={handlechange}
                value={userdata.email}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900"
            >
              Password
            </label>

            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="off"
                onChange={handlechange}
                value={userdata.password}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
              />
            </div>
          </div>

          {/* Button */}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Register
            </button>
          </div>
        </form>

        <p className="text-center mt-5 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Registerpage;