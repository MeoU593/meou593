// import LeftLayout from "../../components/LeftComponentDefault";
import React, { useState } from "react";
import { FaFacebook, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../../components/SnackbarContext";
import { closeBackDrop, openBackDrop } from "../../redux/action";
import api from "./../../api";
import "./Register.css";
import { Backdrop, CircularProgress } from "@mui/material";

function SignUp() {
  const navigate = useNavigate();
  const open = useSelector(state => state.backdropAction);
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const [formRegister, setFormRegister] = useState({
    fullname: "",
      email: "",
      phone : "",
      password: "",
      address : "",
  });

  function handleChange(e){
    const { value, name } = e.target;
    setFormRegister((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e){
    e.preventDefault();
    try{
      dispatch(openBackDrop());
      await api.post(`users/register`, formRegister);
      showSnackbar("Đăng ký tài khoản thành công");
      navigate("/login");
    }catch(e){
      if(e.response.status === 400){
        showSnackbar("Email đã được sử dụng, vui lòng chọn email khác");
      } else {
        showSnackbar("Đăng kí thất bại");
      }
    }
    dispatch(closeBackDrop());
  }
  return (
    <>
      <div className="login-register-page">
        {/* Bên trái */}
        <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
        <div className="welcome-section">
          <h1>Roll the Carpet .!</h1>
          <button className="skip-button">Skip the lag?</button>
        </div>
        {/* Bên phải */}
        <div className={`wrapper`}>
          <div className="login">
            <h2>Đăng kí</h2>
            <p className="subtitle"></p>
            {/* Login Box */}
            <div className="form-box login">
              <form action="" onSubmit={handleSubmit}>
                <div className="input-box">
                  <input
                    type="email"
                    name="email"
                    placeholder="Nhập email"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div className="input-box">
                  <input
                    type="text"
                    placeholder="Nhập tên"
                    name="fullname"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div className="input-box">
                  <input
                    type="text"
                    name="phone"
                    placeholder="Nhập số điện thoại"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div className="input-box">
                  <input
                    type="password"
                    placeholder="Nhập mật khẩu"
                    required
                    name="password"
                    onChange={handleChange}
                  />
                </div>
                <div className="input-box">
                  <input
                    type="text"
                    placeholder="Nhập địa chỉ"
                    required
                    name="address"
                    onChange={handleChange}
                  />
                </div>
                <button
                  type="submit"
                  // className={email && password ? "active" : ""}
                  // disabled={!email || !password}
                >
                  {" "}
                  Đăng kí{" "}
                </button>

                <div className="social-login">
                  <div className="or-divider">
                    <hr />
                    <span>Hoặc</span>
                    <hr />
                  </div>
                  <div className="social-login-group">
                    <button type="button">
                      <FcGoogle className="loginicon" />
                    </button>
                    <button type="button">
                      <FaFacebook className="loginicon" />
                    </button>
                    <button type="button">
                      <FaGithub className="loginicon" />
                    </button>
                  </div>
                </div>
              </form>
              <div className="information-link">
                <div className="register-link">
                  <p>
                    Đã có tài khoản?{" "}
                    <a href="#" onClick={() => navigate("/login")}>
                      Đăng nhập
                    </a>
                  </p>
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

export default SignUp;
