/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-comment-textnodes */
import { MuiOtpInput } from "mui-one-time-password-input";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { useSnackbar } from "../../components/SnackbarContext";
import { closeBackDrop, openBackDrop } from "../../redux/action";
import "./ForgotPassword.css";
import { Backdrop, CircularProgress } from "@mui/material";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [action, setAction] = useState("");
  const open = useSelector(state => state.backdropAction);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [otp, setOtp] = React.useState("");
  const { showSnackbar } = useSnackbar();
  const handleChange = (newValue) => {
    setOtp(newValue);
  };
  const handlePasswordReset = async () => {
    const formOtp = {
      email: email,
    }
    try{
      dispatch(openBackDrop());
      await api.post(`users/requestOtp`, formOtp);
      showSnackbar("Yêu cầu đổi mật khẩu thành công");
      setAction(" active");
    }catch(e){
      if(e.response.status === 400){
        showSnackbar("Tài khoản không tồn tại");
      } else {
        showSnackbar("Đã xảy ra lỗi, vui lòng thử lại");
      }
    }
    dispatch(closeBackDrop());
  };

  async function handleChangePassword(e){
    e.preventDefault();
    const formResetPass = {
      email: email,
      otp: otp,
      newPassword: password,
    }
    try{
      dispatch(openBackDrop());
      await api.post(`users/verifyOtp`, formResetPass);
      showSnackbar("Đổi mật khẩu thành công");
      navigate("/login");
    }catch(e){
      if(e.response.status === 400){
        showSnackbar("Tài khoản không tồn tại");
      } else {
        showSnackbar("Đã xảy ra lỗi, vui lòng thử lại");
      }
    }
    dispatch(closeBackDrop());
  }

  return (
    <div className="login-register-page">
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/* Left Section */}
      <div className="welcome-section">
        <h1>No Worries.!!</h1>
        <button className="skip-button" onClick={() => navigate("/login")}>
          Take me back.!
        </button>
      </div>

      {/* Right Section */}
      <div className={`wrapper`}>
        <div className="login">
          <h2>Quên mật khẩu ?</h2>
          <p className="subtitle">{action === ""?"Vui lòng nhập email của bạn" : "Kiểm tra mã otp đã được gửi về email"}</p>
          <div className={`form-box`}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePasswordReset();
              }}
              className={`forget${action}`}
            >
              {/* Email Input */}
              <div className="input-box">
                <input
                  type="email"
                  placeholder="example@mail.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Reset Password Button */}
              <button
                type="submit"
                style={{
                  background: "linear-gradient(91deg, #FF6F61, #D61A42)",
                }}
              >
                Tiếp tục
              </button>
              {/* Footer Links */}
            <p className="register-link">
              Chưa có tài khoản?{" "}
              <a href="#" onClick={() => navigate("/sign-up")}>
                Đăng kí
              </a>
            </p>
            <div className="footer-links">
              <a href="#">Terms & Conditions</a>
              <a href="#">Support</a>
              <a href="#">Customer Care</a>
            </div>
            </form>
            <form className={`forget${action}`} onSubmit={handleChangePassword}>
              <MuiOtpInput
                length={6}
                className="inp-otp"
                TextFieldProps={{
                  sx: {
                    "& .Mui-focused": {
                      borderColor: "#1976d2", // Màu viền khi được focus
                    },
                  },
                }}
                value={otp}
                onChange={handleChange}
              />
              <div className="input-box">
                <input
                  type="password"
                  required
                  placeholder="Nhập mật khẩu mới của bạn"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                style={{
                  background: "linear-gradient(91deg, #FF6F61, #D61A42)",
                }}
              >
                Đổi mật khẩu
              </button>
              {/* Footer Links */}
            <p className="register-link">
              <a href="#" onClick={() => setAction('')}>
                Quay lại
              </a>
            </p>
            <div className="footer-links">
              <a href="#">Terms & Conditions</a>
              <a href="#">Support</a>
              <a href="#">Customer Care</a>
            </div>
            </form>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
