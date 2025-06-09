import { Backdrop, CircularProgress, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../../api";
import { closeBackDrop, openBackDrop } from "../../../redux/action";
import { useSnackbar } from "../../../components/SnackbarContext";

function AddEmployee(){

    const open = useSelector(state => state.backdropAction);
    const dispatch = useDispatch();
    const { showSnackbar } = useSnackbar();
  const [user, setUser] = useState({
    fullname: "",
    phone: "",
    email: "",
    address: "",
    role: "",
    password: '',
  });

  async function createAccount(){
    try{
        dispatch(openBackDrop());
        await api.post(`admin/accounts/create`, user);
        showSnackbar("Tạo tài khoản thành công");
    }catch(e){
      if(e.response.status === 400){
        showSnackbar("Email đã được sử dụng");
      } else {
        showSnackbar("Xảy ra lỗi trong quá trình tạo tài khoản, vui lòng thử lại sau");
      }
    }
    dispatch(closeBackDrop());
  }

  function handleSubmit(e) {
    e.preventDefault();
    createAccount();
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

    return(
        <>
        <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="container-product-management">
        <div className="title-product-management">Thêm nhân viên mới</div>
        <div className="main-form-ui">
          <form onSubmit={handleSubmit}>
            <div className="box-inp">
              <label htmlFor="name-ui-inp">Họ và tên</label>
              <input
                id="name-ui-inp"
                className="ui-inp"
                onChange={handleChange}
                name="fullname"
                type="text"
                placeholder="Nhập tên"
                required
              />
            </div>
            <div className="box-inp">
              <label htmlFor="address-ui-inp">Địa chỉ</label>
              <input
                id="address-ui-inp"
                className="ui-inp"
                onChange={handleChange}
                name="address"
                required
                type="text"
                placeholder="Nhập địa chỉ"
              />
            </div>
            <div className="grid-2-col box-grid">
              <div className="box-inp">
                <label htmlFor="phone-ui-inp">Số điện thoại</label>
                <input
                  id="phone-ui-inp"
                  required
                  className="ui-inp"
                  onChange={handleChange}
                  name="phone"
                  type="text"
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div className="box-inp">
                <label htmlFor="email-ui-inp">Email</label>
                <input
                  id="email-ui-inp"
                  className="ui-inp"
                  name="email"
                  onChange={handleChange}
                  type="email"
                  required
                  placeholder="Nhập email"
                />
              </div>
            </div>
            <div className="grid-2-col box-grid">
            <div className="box-inp">
            <InputLabel id="demo-simple-select-label" sx={{height: '18px', color: "white"}} ><Typography fontFamily='Barlow' fontSize='14px' fontWeight='500'>Role</Typography></InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                className="ui-inp"
                sx={{height: '49.59px'}}
                name="role"
                value={user.role}
                onChange={handleChange}
                displayEmpty
                required
              >
                <MenuItem value="">-- Chọn role --</MenuItem>
                <MenuItem value={"admin"}>Admin</MenuItem>
                <MenuItem value={"staff"}>Staff</MenuItem>
                <MenuItem value={"delivery"}>Delivery</MenuItem>
              </Select>
              </div>
            <div className="box-inp">
                <label htmlFor="password-ui-inp">Password</label>
                <input
                  id="password-ui-inp"
                  className="ui-inp"
                  name="password"
                  onChange={handleChange}
                  type="password"
                  placeholder="Nhập mật khẩu"
                  required
                  />
              </div>
                  </div>
            <div className="group-btn group-btn-ui">
              <button
                type="button"
                className="discard-changes btn-pro"
              >
                Hủy bỏ
              </button>
              <button className="save-changes btn-pro" type="submit">
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
        </>
    );
}

export default AddEmployee;