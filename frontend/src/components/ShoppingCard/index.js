import { useDispatch, useSelector } from "react-redux";
import { openPayment } from "../../redux/action";
import OrderItem from "../OrderItem";
import Payment from "../Payment";
import "./ShoppingCard.css";
function ShoppingCard() {
  const listItem = useSelector(state => state.orderAction);
  const totalPrice = useSelector(state => state.sumOrderAction);
  const dispatch = useDispatch();
  function handPayment(){
    dispatch(openPayment());
  }

  return (
    <>
      <div className="container-shopping-card">
        <div className="container-order">
          <div className="header">
            <h1 className="title">Đặt món</h1>
            <div className="title-shopping-card">
              <div className="text-content">Thức ăn</div>
              <div className="block-qty-price">
                <div className="text-content">Số lượng</div>
                <div className="text-content">Giá</div>
              </div>
              <div className="divider"></div>
            </div>
          </div>
          <div className="content-shopping-card">
            {listItem.map((item) => <OrderItem item={item} />)}
          </div>
          <div className="total">
            <div className="title-total">Tổng số tiền</div>
            <div className="price-total"><pre>{Number(totalPrice)}đ</pre></div>
          </div>
        </div>

        <div className="footer">
          <button className="submit-btn-shopping-card" onClick={handPayment}>
            Tiếp tục thanh toán
          </button>
        </div>
      </div>
      <Payment />
    </>
  );
}
export default ShoppingCard;
