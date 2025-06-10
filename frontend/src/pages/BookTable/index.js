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

const formatTime = (timeStr) => {
  // Chuyển HH:mm thành HH:mm:ss
  return timeStr + ":00";
}

const BookTable = () => {
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const open = useSelector(state => state.backdropAction);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    numberofSeats: 2, // Đặt default là 2 thay vì 1
    bookingDate: "",
    bookingTime: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    
    // Kiểm tra dữ liệu trước khi gửi
    if (!formData.bookingDate || !formData.bookingTime) {
      showSnackbar("Vui lòng điền đầy đủ ngày và giờ đặt bàn");
      return;
    }

    // Kiểm tra thời gian đặt bàn phải trong tương lai
    const bookingDateTime = dayjs(`${formData.bookingDate} ${formData.bookingTime}`);
    const now = dayjs();
    
    if (bookingDateTime.isBefore(now)) {
      showSnackbar("Thời gian đặt bàn phải trong tương lai");
      return;
    }

    // Kiểm tra thời gian đặt bàn phải ít nhất 5 phút sau hiện tại
    if (bookingDateTime.diff(now, 'minute') < 5) {
      showSnackbar("Thời gian đặt bàn phải ít nhất 5 phút sau hiện tại");
      return;
    }

    try {
      dispatch(openBackDrop());
      
      const requestData = {
        numberofSeats: parseInt(formData.numberofSeats),
        bookingDate: formatDate(formData.bookingDate),
        bookingTime: formatTime(formData.bookingTime)
      };
      
      console.log("Sending booking data:", requestData);
      
      const response = await api.post(`table/create`, requestData);
      console.log("Booking response:", response.data);
      
      showSnackbar("Đặt bàn thành công!");
      navigate("/menu?order-type=Dine In");
      
    } catch (e) {
      console.error("Booking error:", e);
      
      if (e.response && e.response.data && e.response.data.message) {
        showSnackbar(e.response.data.message);
      } else if (e.response && e.response.status === 400) {
        showSnackbar("Không có bàn nào sẵn trong thời gian này");
      } else {
        showSnackbar("Đặt bàn thất bại. Vui lòng thử lại!");
      }
    }
    dispatch(closeBackDrop());
  };

  // Lấy ngày hiện tại để set min date
  const today = dayjs().format('YYYY-MM-DD');
  
  // Lấy giờ hiện tại + 5 phút để set min time (nếu chọn ngày hôm nay)
  const minTime = dayjs().add(5, 'minute').format('HH:mm');
  const isToday = formData.bookingDate === today;

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
            <select
              id="numberofSeats"
              name="numberofSeats"
              value={formData.numberofSeats}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.10)',
                color: '#fff',
                fontSize: '16px',
                padding: '12px 15px',
                outline: 'none',
                borderRadius: '8px'
              }}
            >
              <option value={2} style={{color: '#000'}}>2 người</option>
              <option value={4} style={{color: '#000'}}>4 người</option>
              <option value={6} style={{color: '#000'}}>6 người</option>
              <option value={8} style={{color: '#000'}}>8 người</option>
              <option value={10} style={{color: '#000'}}>10 người</option>
            </select>
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
                min={today}
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
                min={isToday ? minTime : "00:00"}
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