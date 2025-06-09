import dayjs from 'dayjs';
import React, { useState } from "react";
import { CiTimer } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { useSnackbar } from "../../components/SnackbarContext";
import { closeBackDrop, openBackDrop } from "../../redux/action";
import "./BookTable.css";
import { Backdrop, CircularProgress } from '@mui/material';

const formatDate = (dayStr) => {
  return dayjs(dayStr).format("DD/MM/YYYY");
}

const BookTable = () => {
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const open = useSelector(state => state.backdropAction);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    numberofSeats: 1,
    bookingDate: "",
    bookingTime: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    try{
      dispatch(openBackDrop());
      formData.bookingDate = formatDate(formData.bookingDate);
      console.log(formData)
      await api.post(`table/create`, formData);
      showSnackbar("Đặt bàn thành công");
      navigate("/menu?order-type=Dine In");
    }catch(e){
      if(e.response.status === 400){
        showSnackbar("Không có bàn nào sẵn trong thời gian này");
      } else {
        showSnackbar("Đặt bàn thất bại");
      }
    }
    dispatch(closeBackDrop());
  };

  return (
    <div className="book-table-wrapper">
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/* Left Section */}
      <div className="book-table-left">
        <h1>Đặt Bàn</h1>
        <h2>Hãy đặt chỗ trước</h2>
        <div className="action-buttons">
        <CiTimer className='icon' /> 
          <button className="action-btn" onClick={() => navigate("/menu?order-type=Dine In")}>
            Thực đơn
          </button>
          <button className="action-btn1" onClick={() => navigate("/menu?order-type=Delivery")}>
            Giao tận nơi
          </button>
          <button className="action-btn2 active">Đặt bàn</button>
        </div>
      </div>

      {/* Right Section */}
      <div className="book-table-right">
        <h2>Đặt bàn</h2>
        <p>
        Không khí ăn uống của chúng tôi thoải mái và giản dị. Để phản ánh môi trường này, chúng tôi duy trì trang phục trang trọng.
        </p>
        <form onSubmit={handleConfirm}>
          <div className="input-group">
            <label htmlFor="numberofSeats">Số lượng khách</label>
            <input
              type="number"
              id="numberofSeats"
              name="numberofSeats"
              min="1"
              value={formData.numberofSeats}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-row">
            <div className="input-group">
              <label htmlFor="bookingDate">Ngày</label>
              <input
                type="date"
                id="bookingDate"
                name="bookingDate"
                value={formData.bookingDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="bookingTime">Giờ</label>
              <input
                type="time"
                id="bookingTime"
                name="bookingTime"
                value={formData.bookingTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button type="submit" className="confirm-btn">
            Xác nhận
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookTable;
