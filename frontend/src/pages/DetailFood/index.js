import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import api from "../../api";
import whiteButton from "../../assets/icon/Cart-White.svg";
import blackStar from "../../assets/image/BlackStar.svg";
import food1 from "../../assets/image/Detail1.svg";
import food2 from "../../assets/image/Detail2.svg";
import food3 from "../../assets/image/Detail3.svg";
import yellowStar from "../../assets/image/YellowStar.svg";
import { addFoodOrder, closeBackDrop, openBackDrop, sumAddOrder } from "../../redux/action";
import "./DetailFood.css";
import { useSnackbar } from "../../components/SnackbarContext";
import { Backdrop, CircularProgress } from "@mui/material";

function DetailFood() {
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const open = useSelector(state => state.backdropAction);

  function handleAddToCart(e) {
    food.quantity = quantity;
    dispatch(addFoodOrder(food));
    dispatch(sumAddOrder(food));
  }

  var rate = 4;
  let Star = [];
  for (var i = 0; i < rate; i++) {
    Star.push(yellowStar);
  }
  for (var j = rate; j < 5; j++) {
    Star.push(blackStar);
  }

  //---------------------------------------- Quý --------------------------------------------
  const param = useParams();
  const [food, setFood] = useState(null);
  async function getDetailFood() {
    try {
      dispatch(openBackDrop());
      const response = await api.get(`menu/detail/${param.slug}`);
      setFood(response.data.dish);
    } catch (e) {
      showSnackbar("Có lỗi xảy ra, vui lòng đăng nhập và thử lại");
    }
    dispatch(closeBackDrop());
  }

  useEffect(() => {
    getDetailFood();
  }, []);

  const [quantity, setQuantity] = useState(0); // State để quản lý số lượng

  // Hàm tăng số lượng
  const increase = () => {
    setQuantity((prev) => prev + 1);
  };

  // Hàm giảm số lượng
  const decrease = () => {
    setQuantity((prev) => (prev > 0 ? prev - 1 : 0)); // Không giảm dưới 0
  };

  // Hàm xử lý khi nhập trực tiếp vào ô input
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      // Chỉ chấp nhận nhập số
      setQuantity(value === "" ? 0 : parseInt(value));
    }
  };

  return (
    <div className="container_webpage">
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="container_detailFood">
        <div className="box1">
          <img
            className="img_main"
            src={food ? food.imageUrl : ""}
            alt="image_detail"
          />
          <div className="sub_img_container">
            <img className="img_sub" src={food ? food1 : <></>} alt="food1" />
            <img className="img_sub" src={food ? food2 : <></>} alt="food2" />
            <img className="img_sub" src={food ? food3 : <></>} alt="food3" />
          </div>
        </div>
        <div className="box2">
          <div className="food">{food ? food.name : <></>}</div>
          <div className="rating">
            {Star.map((item) => (
              <img className="star" src={item} />
            ))}
          </div>
          <div className="price">{food ? food.price : ""}đ</div>
          <div className="description">{food ? food.description : <></>}</div>
          <div className="box-btn-composite">
          <div className="quantity-input">
            {/* Nút giảm */}
            <button onClick={decrease} className="quantity-btn">
              -
            </button>

            {/* Input số lượng */}
            <input
              type="text"
              value={quantity}
              onChange={handleInputChange}
              className="quantity-field"
            />

            {/* Nút tăng */}
            <button onClick={increase} className="quantity-btn">
              +
            </button>
          </div>
          <img
            className="add_to_card_button"
            src={whiteButton}
            alt="add-to-cart" 
            onClick={handleAddToCart}
          ></img>
          </div>
        </div>
      </div>
      <div className="text_box">More Dishes</div>
      <></>
    </div>
  );
}

export default DetailFood;
