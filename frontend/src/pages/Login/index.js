import React, { useState } from "react";
import { FaFacebook, FaGithub, FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSnackbar } from "../../components/SnackbarContext";
import { login } from "../../redux/action";
import api from "./../../api";
import "./LoginRegister.css";
import { Backdrop, CircularProgress } from "@mui/material";

function Login() {
  
  const [action, setAction] = useState('');
  const navigate = useNavigate();
  const open = useSelector(state => state.backdropAction);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const [rememberMe, setRememberMe] = useState(false);
  const LoginApi = (email,password) => {
    return api.post("users/login", {email,password});
  }
const handleLoginSubmit = async (event) => {
  event.preventDefault(); // Prevent default form submission behavior
  if (!email || !password) {
    toast.error("Email and password are required");
    return;
  }
  try {
    const res = await LoginApi(email, password);
    console.log(res);
    if (res && res.data.token) {
      dispatch(login(res.data));
      showSnackbar("Đăng nhập thành công");
      navigate("/");
    }
  } catch (error) {
    if(error.response.data.message){
      showSnackbar(error.response.data.message);
    } else {
      showSnackbar("Đăng nhập thất bại");
    }
  }
};

  return (
    <>
    <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
        <div className="login-register-page">
         {/* Bên trái */}
            <div className="welcome-section">
                  <h1>Welcome Back .!</h1>
            <button className="skip-button">Skip the lag?</button>
            </div>
        {/* Bên phải */}
            <div className={`wrapper${action}`}>
                <div className="login">
                <h2>Đăng nhập</h2>
                <p className="subtitle">Rất vui khi bạn trở lại.!</p>
                {/* Login Box */}
                <div className="form-box login">
                    <form action="" onSubmit={handleLoginSubmit}>
                        <div className="input-box">
                        <input
                            type="text"
                            placeholder='Nhập email'
                            value={email}
                            required
                            onChange={(event) => setEmail(event.target.value)}
                        />
                            <FaUser className='icon' />
                        </div>
                        <div className="input-box">
                            <input type="password"
                            placeholder='Nhập password'
                            value={password}
                            required
                            onChange = {(event) => setPassword(event.target.value)} />
                            <FaLock className='icon'/>
                        </div>
                        <div className="remember-me">
                        <input
                          type="checkbox"
                          id="rememberMe"
                          checked={rememberMe}
                          onChange={() => setRememberMe(!rememberMe)}
                        />
                        <label htmlFor="rememberMe">Nhớ lần đăng nhập này</label>
                      </div>
                        <button 
                                type="submit"
                                > Đăng Nhập </button>
                        <div className="forgot-password" onClick={() => navigate('/forget-password')}>Quên mật khẩu?</div>
                        <div className="social-login">
                              <div className="or-divider">
                                  <hr />
                                  <span>Hoặc</span>
                                  <hr />
                                </div>
                              <div className="social-login-group">
                                    <button type="button">
                                        <FcGoogle className='loginicon' />
                                    </button>
                                    <button type="button">
                                          <FaFacebook className='loginicon' />
                                    </button>
                                    <button type="button">
                                      <FaGithub className='loginicon' />
                                    </button>
                              </div>
                        </div>
                        </form>
                        <div className="information-link">
                            <div className="register-link">
                                <p>Chưa có tài khoản?  <a href="#" onClick={() => navigate('/sign-up')}>Đăng kí</a></p>
                            </div>
                            <div className="footer-links">
                            <a href="#">Terms & Conditions</a>
                            <a href="#">Support</a>
                            <a href="#">Customer Care</a>
                          </div>
                      </div>
                </div>
                </div>
                {/* <div className="form-box registration">
                    <form action="">
                        <h1>Registration</h1>
                        <div className="input-box">
                            <input type="text"
                            placeholder='Username' required />
                            <FaUser className='icon' />
                        </div>
                        <div className="input-box">
                            <input type="email"
                            placeholder='Email' required />
                            <FaEnvelope className='icon' />
                        </div>
                        <div className="input-box">
                            <input type="password"
                            placeholder='Password' required />
                            <FaLock className='icon'/>
                        </div>

                        <button type="submit">Login</button>
                        <div className="register-link">
                            <p>Already have an account? <a href="#" onClick = {loginLink}>Login</a></p>
                        </div>
                    </form>
                </div> */}
            </div>
        </div>
    </>
  );
}

export default Login;
