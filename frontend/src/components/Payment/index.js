import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api";
import BackIcon from "../../assets/icon/Back.svg";
import { closeBackDrop, closePayment, openBackDrop } from "../../redux/action";
import OrderItem from "../OrderItem";
import { useSnackbar } from "../SnackbarContext";
import "./Payment.css";

function Payment() {
  const listItem = useSelector((state) => state.orderAction);
  const totalPrice = useSelector((state) => state.sumOrderAction);
  const isActive = useSelector((state) => state.paymentAction);
  const isOpenConfirmAddress = useSelector((state) => state.confirmAddressAction);
  const orderList = useSelector(state => state.orderAction);
  const sumPrice = useSelector(state => state.sumOrderAction);
  const [phone, setPhone] = useState();
  const navigate = useNavigate();
  const [searchParam] = useSearchParams();
  const orderType = searchParam.get("order-type");
  const [deliveryTime, setDeliveryTime] = useState();
  const [address, setAddress] = useState();
  const { showSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  function handleClose() {
    dispatch(closePayment());
  }
  async function payment(order){
    try{
      dispatch(openBackDrop());
      const response = await api.post(`order/payment`, order);
      // console.log(response);
      if(order.orderType === 'Delivery'){
        window.location.href = response.data.paymentLinkRes.checkoutUrl;
        showSnackbar("Tạo QR thanh toán thành công, hãy quét mã để thanh toán đơn hàng");
      } else {
        showSnackbar("Đặt món thành công");
      }
      getInformation();
    }catch(e){
      if(e.response.status === 400 && e.response.data.error === "Invalid input data"){
        showSnackbar("Vui lòng chọn món ăn trước khi tiến hành thanh toán");
      } else if(e.response.status === 400 && e.response.data.message){
        showSnackbar("Vui lòng chọn địa chỉ và thời gian giao món hợp lệ");
      } else if(e.response.status === 404){
        showSnackbar("Vui lòng chọn bàn ăn trước");
        navigate("/book-table");
      } else if(e.response.status === 500){
        showSnackbar("Tạo QR thanh toán thất bại, vui lòng thử lại sau");
      } else {
        showSnackbar("Có lỗi xảy ra, vui lòng thử lại sau ít phút");
      }
    }
    dispatch(closeBackDrop());
  }

  async function getInformation() {
    try {
        dispatch(openBackDrop());
      const response = await api.get(`users/detail`);
      setAddress(response.data.user.address);
      setPhone(response.data.user.phone);
    } catch (e) {
      if(e.response.status === 404){
        showSnackbar("Tài khoản hiện tại không khả dụng");
      } else if(e.response.status === 400) {
        showSnackbar("Vui lòng thử lại sau ít phút");
      } else {
        showSnackbar("Lỗi kết nối");
      }
    }
    dispatch(closeBackDrop());
  }

  useEffect(() => {
    getInformation();
  }, [])

  function handlePayment(e){
    e.preventDefault();
    const listItem = Array.from(orderList).map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      imageUrl: item.imageUrl,
      dish_id: item._id,
    }));
    const order = {
      amount: Number(Number(sumPrice).toFixed(0)),
      items: listItem,
      orderType: orderType,
      deliveryTime: deliveryTime,
      address: address,
      phone: phone,
    }
    payment(order);
  }

  return (
    <>
      {isActive ? <div className="background-shadow"></div> : <></>}
      <div className={"container-payment" + (isActive ? " active" : "") + (isOpenConfirmAddress? " confirm-active" : "")}>
        <div className="transition-payment">
        <div className="trans-1">
          <div className="confirmation-payment">
            <button className="back-up-payment" onClick={handleClose}>
              <img src={BackIcon} alt="BackIcon" />
            </button>
            <div className="main-form-payment">
              <div className="header-payment">
                <div className="box-title-payment">
                  <h1 className="title-payment">Xác nhận</h1>
                  <h2 className="title-payment-small">Đơn hàng</h2>
                </div>
              </div>
              <div className="content-payment">
                {Array.from(listItem).map((item) => (
                  <OrderItem item={item} />
                ))}
              </div>
              <div className="footer-payment">
                <h3>Tổng số tiền</h3>
                <p>{Number(totalPrice)}đ</p>
              </div>
            </div>
          </div>
          <div className="payment-frame">
            <div className="main-form-payment">
              <div className="header-payment">
                <div className="box-title-payment">
                  <h1 className="title-payment">Thanh toán</h1>
                  <h2 className="title-payment-small">
                    xác nhận thông tin
                  </h2>
                </div>
              </div>
              <div className="content-payment">
                <form onSubmit={handlePayment}>
                  <div className="top-form-payment">
                  <div className="card-name-payment">
                      <label htmlFor="">Số điện thoại</label>
                      <input
                        type="text"
                        name="confirm-phone"
                        placeholder="Nhập số điện thoại"
                        defaultValue={phone}
                        required
                        onChange={(e) => setPhone(e.target.value)}
                        />
                        </div>
                        <div className="card-name-payment">
                      <label htmlFor="">Địa chỉ</label>
                      <input
                        type="text"
                        name="confirm-address"
                        placeholder="Nhập địa chỉ"
                        required
                        defaultValue={address}
                        onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                  </div>
                  {orderType === 'Delivery'? 
                  <div className="bot-form-payment">
                    <div className="box-double-input">
                    <div className="card-name-payment">
                      <label htmlFor="">Chọn thời gian giao</label>
                      <input
                        type="datetime-local"
                        name="confirm-time"
                        required
                        onChange={(e) => setDeliveryTime(e.target.value)}
                        />
                    </div>
                    </div>
                  </div> : <></>
                      }
                  <div className="box-btn-payment">
                    <button className="cancel-btn" type="button" onClick={handleClose}>
                      Hủy bỏ
                    </button>
                    <button className="confirm-btn" type="submit">{orderType === 'Delivery'? 'Thanh Toán' : "Đặt món"}</button>
                  </div>
                </form>
              </div>
              <div className="container-confirm-address"></div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}

export default Payment;
