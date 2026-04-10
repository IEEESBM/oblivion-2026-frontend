import { useState, useContext } from "react";
import "./LoginSignup.css";
import lockIcon from "../../assets/ls-icons/lock-keyhole.png";
import eyeIcon from "../../assets/ls-icons/eye.png";
import mailIcon from "../../assets/ls-icons/mail.png";
import phoneIcon from "../../assets/ls-icons/phone.png";
import userIcon from "../../assets/ls-icons/user-round.png";
import bookIcon from "../../assets/ls-icons/book-user.png";
import closeIcon from "../../assets/ls-icons/close.png";
import collegeIcon from "../../assets/ls-icons/college.png";
import worldIcon from "../../assets/ls-icons/world.png";
import axios from "axios";
import circleSpinner from "../../assets/circles.svg";
import { toast } from "react-hot-toast";
import { UserContext } from "../../App";

const LoginSignup = function ({ toggleLoginSignup }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const { setUser } = useContext(UserContext);

  const handleLogin = async function (e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post("auth/login", loginData, {
        withCredentials: true,
      });
      toast.success("Logged in successfully");
      setUser(data);
      toggleLoginSignup();
    } catch (ex) {
      if (ex.response.data.error) {
        toast.error(ex.response.data.error);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const [signupData, setsignupData] = useState({
    name: "",
    regNo: "",
    collegeName: "",
    membershipNo: "",
    phone: "",
    email: "",
    password: "",
  });

  const generateRandomReg = (n) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < n; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  const handleSignup = async function (e) {
    e.preventDefault();
    setIsLoading(true);
    if (signupData["regNo"] == "") {
      const randomRegNo = generateRandomReg(8);
      await setsignupData((data) => ({ ...data, regNo: randomRegNo }));
    }
    try {
      const { data } = await axios.post("/auth/register", signupData);
      toast.success("User created successfully");
      handleCheckboxChange();
    } catch (ex) {
      if (ex.response.data.error) {
        toast.error(ex.response.data.error);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // const handleForgotPassword = async function () {
  //   //check if email is filled or not
  //   if (!loginData.email) {
  //     toast.error("Please enter email first");
  //     return;
  //   }
  //   try {
  //     const payload = { email: loginData.email };
  //     const { data } = await axios.post("/password/forgot", payload);
  //     toast.success(data?.message, {
  //       duration: 8000,
  //     });
  //   } catch (ex) {
  //     if (ex.response.data.error) {
  //       toast.error(ex.response.data.error);
  //     } else {
  //       toast.error("Something went wrong");
  //     }
  //   }
  // };

  const handleForgotPassword = async () => {
    // Check if email is filled or not
    if (!loginData.email) {
      return Promise.reject("Email not provided");
    }

    try {
      const payload = { email: loginData.email };
      const response = await axios.post("/password/forgot", payload);
      return Promise.resolve(response.data.message);
    } catch (error) {
      if (error.response && error.response.data.error) {
        return Promise.reject(error.response.data.error);
      } else {
        return Promise.reject("Something went wrong");
      }
    }
  };

  // Call handleForgotPassword and display a toast based on the promise state
  const handleForgotPasswordWithToast = () => {
    const promise = handleForgotPassword();

    toast.promise(
      promise,
      {
        loading: "Sending email...",
        success: (message) => {
          return message;
        },
        error: (errorMessage) => {
          return errorMessage;
        },
      },
      {
        success: {
          duration: 5000,
        },
      }
    );
  };

  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = () => {
    setIsChecked((s) => !s);
  };

  const [passwordVisible, setPasswordVisible] = useState(false);
  const handleTogglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };
  return (
    <section className="ls-outer-container">
      <div className="container">
        <h6>
          <label htmlFor="reg-log" className="tab-toggle">
            <span className={isChecked ? "login white" : "login purple"}>
              Log In
            </span>
            <span className={isChecked ? "signup purple" : "signup white"}>
              Sign Up
            </span>
          </label>
          <span className="close-button" onClick={toggleLoginSignup}>
            ✕
          </span>
        </h6>
        <input
          className="checkbox"
          type="checkbox"
          id="reg-log"
          name="reg-log"
          onChange={handleCheckboxChange}
          checked={isChecked}
        />
        <label htmlFor="reg-log" className="slider"></label>
        <div className="card-3d-wrap mx-auto">
          <div className="card-3d-wrapper">
            <div className="card-front">
              <form className="center-wrap" onSubmit={handleLogin}>
                <div className="form-group mt-6">
                  <div className="form-style">
                    <img src={mailIcon} alt="email" />
                    <input
                      type="email"
                      className="form-input"
                      placeholder="Email"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="form-group mt-4">
                  <div className="form-style">
                    <img src={lockIcon} alt="lock" />
                    <input
                      type={passwordVisible ? "text" : "password"}
                      className="form-input"
                      placeholder="Password"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({
                          ...loginData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                    <span
                      className="see-password"
                      onClick={handleTogglePassword}
                    >
                      <img src={eyeIcon} alt="eye" />
                    </span>
                  </div>
                </div>
                <button className="btn mt-6" type="submit">
                  {isLoading && (
                    <img
                      src={circleSpinner}
                      width="24"
                      alt=""
                      style={{ marginRight: "8px" }}
                    />
                  )}
                  Login
                </button>
                <p className="mb-0 mt-3 text-center">
                  <span
                    className="link"
                    onClick={handleForgotPasswordWithToast}
                  >
                    Forgot password?
                  </span>
                </p>
              </form>
            </div>
            <div className="card-back">
              <form className="center-wrap" onSubmit={handleSignup}>
                <div className="form-group mt-1">
                  <div className="form-style">
                    <img src={userIcon} alt="user" />
                    <span className="asterick">*</span>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Full Name"
                      value={signupData.name}
                      onChange={(e) =>
                        setsignupData({
                          ...signupData,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="form-group mt-1">
                  <div className="form-style">
                    <img src={bookIcon} alt="book" />
                    <input
                      type="text"
                      className="form-input"
                      id="numberInput"
                      placeholder="Registration Number"
                      value={signupData.regNo}
                      onChange={(e) =>
                        setsignupData({
                          ...signupData,
                          regNo: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="form-group mt-1">
                  <div className="form-style">
                    <img src={collegeIcon} alt="book" />
                    <span className="asterick">*</span>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="College Name"
                      value={signupData.collegeName}
                      onChange={(e) =>
                        setsignupData({
                          ...signupData,
                          collegeName: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="form-group mt-1">
                  <div className="form-style">
                    <img src={worldIcon} alt="book" />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="IEEE Membership No"
                      value={signupData.membershipNo}
                      onChange={(e) =>
                        setsignupData({
                          ...signupData,
                          membershipNo: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="form-group mt-1">
                  <div className="form-style">
                    <img src={phoneIcon} alt="phone" />
                    <span className="asterick">*</span>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="Phone Number"
                      value={signupData.phone}
                      onChange={(e) =>
                        setsignupData({
                          ...signupData,
                          phone: Number(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="form-group mt-1">
                  <div className="form-style">
                    <img src={mailIcon} alt="mail" />
                    <span className="asterick">*</span>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="Email"
                      value={signupData.email}
                      onChange={(e) =>
                        setsignupData({
                          ...signupData,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="form-group mt-1">
                  <div className="form-style">
                    <img src={lockIcon} alt="lock" />
                    <span className="asterick">*</span>
                    <input
                      type={passwordVisible ? "text" : "password"}
                      className="form-input"
                      placeholder="Password"
                      value={signupData.password}
                      onChange={(e) =>
                        setsignupData({
                          ...signupData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                    <span
                      className="see-password"
                      onClick={handleTogglePassword}
                    >
                      <img src={eyeIcon} alt="eye" />
                    </span>
                  </div>
                </div>
                <button className="btn mt-2">
                  {isLoading && (
                    <img
                      src={circleSpinner}
                      width="24"
                      alt=""
                      style={{ marginRight: "8px" }}
                    />
                  )}
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginSignup;
