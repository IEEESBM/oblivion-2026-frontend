import { useState, useContext } from "react";
import "./LoginSignup.css";
import lockIcon from "../../assets/ls-icons/lock-keyhole.png";
import eyeIcon from "../../assets/ls-icons/eye.png";
import mailIcon from "../../assets/ls-icons/mail.png";
import phoneIcon from "../../assets/ls-icons/phone.png";
import userIcon from "../../assets/ls-icons/user-round.png";
import bookIcon from "../../assets/ls-icons/book-user.png";
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

  // ── Manual validation helpers ──────────────────────────────────────────────
  // We use noValidate on both forms + these checks instead of HTML `required`.
  // Reason: the browser's native "please fill this field" bubble renders at the
  // wrong position (sometimes off-screen) inside a 3D-CSS-transformed element.

  const validateLogin = () => {
    if (!loginData.email.trim()) {
      toast.error("Please enter your email");
      return false;
    }
    if (!loginData.password) {
      toast.error("Please enter your password");
      return false;
    }
    return true;
  };

  const validateSignup = () => {
    if (!signupData.name.trim()) {
      toast.error("Full name is required");
      return false;
    }
    if (!signupData.collegeName.trim()) {
      toast.error("College name is required");
      return false;
    }
    if (!signupData.phone) {
      toast.error("Phone number is required");
      return false;
    }
    const phoneStr = String(signupData.phone);
    if (!/^\d{10}$/.test(phoneStr)) {
      toast.error("Enter a valid 10-digit phone number");
      return false;
    }
    if (!signupData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!signupData.password) {
      toast.error("Password is required");
      return false;
    }
    if (signupData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleLogin = async function (e) {
    e.preventDefault();
    if (!validateLogin()) return;

    setIsLoading(true);
    try {
      const { data } = await axios.post("/auth/login", loginData, {
        withCredentials: true,
      });
      toast.success("Logged in successfully");
      setUser(data);
      toggleLoginSignup();
    } catch (ex) {
      const message = ex.response?.data?.error || "Something went wrong";
      toast.error(message);
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
    if (!validateSignup()) return;

    setIsLoading(true);
    const payload = {
      ...signupData,
      regNo: signupData.regNo || generateRandomReg(8),
    };

    try {
      await axios.post("/auth/register", payload);
      toast.success("Registered successfully! Please log in.");
      setIsChecked(false);
      setsignupData({
        name: "",
        regNo: "",
        collegeName: "",
        membershipNo: "",
        phone: "",
        email: "",
        password: "",
      });
    } catch (ex) {
      const message = ex.response?.data?.error || "Something went wrong";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!loginData.email) {
      return Promise.reject("Please enter your email first");
    }
    try {
      const payload = { email: loginData.email };
      const response = await axios.post("/password/forgot", payload);
      return Promise.resolve(response.data.message);
    } catch (error) {
      const message = error.response?.data?.error || "Something went wrong";
      return Promise.reject(message);
    }
  };

  const handleForgotPasswordWithToast = () => {
    const promise = handleForgotPassword();
    toast.promise(
      promise,
      {
        loading: "Sending email...",
        success: (message) => message,
        error: (errorMessage) => errorMessage,
      },
      { success: { duration: 5000 } }
    );
  };

  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = () => setIsChecked((s) => !s);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const handleTogglePassword = () => setPasswordVisible((v) => !v);

  return (
    <section className="ls-outer-container">
      <div className="container">
        <h6>
          <label htmlFor="reg-log">
            <span className={isChecked ? "login white" : "login purple"}>
              Log In
            </span>
            <span className={isChecked ? "signup purple" : "signup white"}>
              Sign Up
            </span>
          </label>
          <span
            className="close-button text-[#8B5CF6] border-2 rounded-2xl"
            onClick={toggleLoginSignup}
          >
            X
          </span>
        </h6>
        <div></div>
        <div></div>
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

            {/* ── LOGIN CARD ── */}
            <div className="card-front">
              {/* noValidate: disables browser native validation bubbles which
                  render at wrong positions inside 3D-transformed elements.
                  Validation is handled manually via toast in handleLogin. */}
              <form className="center-wrap" onSubmit={handleLogin} noValidate>
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
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                    />
                    <span className="see-password" onClick={handleTogglePassword}>
                      <img src={eyeIcon} alt="toggle password" />
                    </span>
                  </div>
                </div>
                <button className="btn mt-6" type="submit" disabled={isLoading}>
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
              </form>
            </div>

            {/* ── SIGNUP CARD ── */}
            <div className="card-back">
              <form className="center-wrap" onSubmit={handleSignup} noValidate>
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
                        setsignupData({ ...signupData, name: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="form-group mt-1">
                  <div className="form-style">
                    <img src={bookIcon} alt="book" />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Registration Number"
                      value={signupData.regNo}
                      onChange={(e) =>
                        setsignupData({ ...signupData, regNo: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="form-group mt-1">
                  <div className="form-style">
                    <img src={collegeIcon} alt="college" />
                    <span className="asterick">*</span>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="College Name"
                      value={signupData.collegeName}
                      onChange={(e) =>
                        setsignupData({ ...signupData, collegeName: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="form-group mt-1">
                  <div className="form-style">
                    <img src={worldIcon} alt="world" />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="IEEE Membership No"
                      value={signupData.membershipNo}
                      onChange={(e) =>
                        setsignupData({ ...signupData, membershipNo: e.target.value })
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
                        setsignupData({ ...signupData, phone: e.target.value })
                      }
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
                        setsignupData({ ...signupData, email: e.target.value })
                      }
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
                        setsignupData({ ...signupData, password: e.target.value })
                      }
                    />
                    <span className="see-password" onClick={handleTogglePassword}>
                      <img src={eyeIcon} alt="toggle password" />
                    </span>
                  </div>
                </div>
                <button className="btn mt-2" type="submit" disabled={isLoading}>
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