import { useDispatch } from "react-redux";
import TrashIcon from "../../assets/icon/Trash-orange-black.svg";
import { removeFoodOrder, sumRemoveOrder } from "../../redux/action";
import "./OrderItem.css";

function OrderItem(props) {
  const { item } = props;

  const dispatch = useDispatch();
  function handleRemove(){
    dispatch(sumRemoveOrder(item));
    dispatch(removeFoodOrder(item));
  }
  return (
    <>
      <section className="container-item-order">
        <div className="header-item-order">
            <div className="left-block-item-order">
                <img src={item.imageUrl} alt="FoodImage"/>
                <div className="detail-item-order">
                    <div className="name-item">{item.name}</div>
                    <div className="price-item">{item.price}đ</div>
                </div>
            </div>
            <div className="right-block-item-order">
                <div className="quantity">{item.quantity}</div>
                <pre className="price-item">{Number(item.totalPrice)}đ</pre>
            </div>
        </div>
        <div className="footer-item-order">
            <input className="note-item-order" placeholder={"Ghi chú ..."} />
            <div className="bin-item-order" onClick={handleRemove}>
                <img src={TrashIcon} alt="TrashIcon" />
            </div>
        </div>
      </section>
    </>
  );
}

export default OrderItem;
