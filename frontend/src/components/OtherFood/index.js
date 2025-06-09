import "./OtherFood.css";
import blackButton from "../../assets/icon/Cart-Black.svg"
function OtherFood(food) {
    function formatPrice(price) {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD' 
  }).format(price);
  }
    return (
    <div className="container_food">
        <div className="food_name">{food.name}</div>
        <div className="food_price">{formatPrice(food.price)}</div>
        <img className="food_button" src={blackButton} alt="add-to-cart" /*onclick={handleAddToCart}*/></img>
    </div>
    );
    }

export default OtherFood;