import { useDispatch } from "react-redux";
import PlusIcon from "../../assets/icon/PlusIcon.svg";
import "./ItemMenu.css";
import { addFoodOrder, sumAddOrder } from "../../redux/action";
import { useNavigate } from "react-router-dom";

function ItemMenu(props) {
  const { item, loading = false } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle add to cart
  function handleClick(e) {
    e.stopPropagation();
    if (item.stock === 0 || loading) return;
    
    dispatch(addFoodOrder(item));
    dispatch(sumAddOrder(item));
  }

  // Handle view details
  function handleDetails(e) {
    if (loading) return;
    navigate(`/detail-food/${item.slug}`);
  }

  // Render rating stars
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="star">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="star">☆</span>);
      } else {
        stars.push(<span key={i} className="star empty">☆</span>);
      }
    }
    return stars;
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  // Get category display name
  const getCategoryName = (category) => {
    const categoryMap = {
      'appetizer': 'Món Khai Vị',
      'main-course': 'Món Chính', 
      'dessert': 'Món Tráng Miệng',
      'drink': 'Thức Uống'
    };
    return categoryMap[category] || category;
  };

  // Loading skeleton
  if (loading) {
    return (
      <section className="container-item-menu loading">
        <div className="item">
          <div className="image-item">
            <div className="img-food"></div>
          </div>
          <div className="content-item">
            <div style={{height: '20px', background: '#252836', borderRadius: '4px', marginBottom: '8px'}}></div>
            <div style={{height: '16px', background: '#252836', borderRadius: '4px', width: '60%', margin: '0 auto'}}></div>
          </div>
        </div>
      </section>
    );
  }

  // Check if out of stock
  const isOutOfStock = item.stock === 0;

  return (
    <section className={`container-item-menu ${isOutOfStock ? 'out-of-stock' : ''}`}>
      <div className="item" onClick={handleDetails}>
        
        {/* Category Badge */}
        {item.category && (
          <div className="category-badge">
            {getCategoryName(item.category)}
          </div>
        )}

        {/* Image Section */}
        <div className="image-item">
          <img 
            className="img-food" 
            src={item.imageUrl || '/default-food.jpg'} 
            alt={item.name}
            onError={(e) => {
              e.target.src = '/default-food.jpg';
            }}
          />
          {!isOutOfStock && (
            <img 
              className="img-plus" 
              src={PlusIcon} 
              alt="Add to cart"
              onClick={handleClick}
              title="Thêm vào giỏ hàng"
            />
          )}
        </div>

        {/* Content Section */}
        <div className="content-item">
          <h1 className="name" title={item.name}>
            {item.name}
          </h1>
          
          {/* Rating */}
          {item.rating && (
            <div className="rating">
              {renderRating(item.rating)}
            </div>
          )}
          
          <div className="detail-item">
            <p className="price-item">
              {formatPrice(item.price)}đ
            </p>
            <p className="store-item">
              {isOutOfStock 
                ? 'Hết hàng' 
                : item.stock 
                  ? `${item.stock} món có sẵn`
                  : 'Có sẵn'
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ItemMenu;