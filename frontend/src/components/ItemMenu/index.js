import { useDispatch } from "react-redux";
import PlusIcon from "../../assets/icon/PlusIcon.svg";
import "./ItemMenu.css";
import { addFoodOrder, sumAddOrder } from "../../redux/action";
import { useNavigate } from "react-router-dom";

function ItemMenu(props) {
  const { item } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate()

  function handleClick(e) {
    dispatch(addFoodOrder(item));
    dispatch(sumAddOrder(item));
    e.stopPropagation()
  }

  function handleDetails(e){
    navigate(`/detail-food/${item.slug}`)
  }
  return (
    <section className="container-item-menu">
      <div className="item" onClick={handleDetails}>
      <div className="image-item">
        <img className="img-food" src={item.imageUrl} alt="FoodImage" />
        <img className="img-plus" src={PlusIcon} alt="PlusIcon" onClick={handleClick} />
      </div>
      <div className="content-item">
        <h1 className="name">{item.name}</h1>
        <div className="detail-item">
          <p className="price-item">{item.price}đ</p>
          <pre className="store-item">{item.store} Món ăn khả dụng</pre>
        </div>
      </div>
      </div>
    </section>
  );
}

export default ItemMenu;
