import "./MostOrderItem.css";

function MostOrderItem(props) {
  const { item } = props;
  return (
    <>
      <section className="container-item-order">
        <div className="header-item-order">
            <div className="left-block-item-order">
                <img src={item.imageUrl} alt="FoodImage"/>
                <div className="detail-item-order">
                    <div className="name-item">{item.name}</div>
                    <div className="quantity-item">{item.rating}/5 sao</div>
                </div>
            </div>
        </div>
      </section>
    </>
  );
}

export default MostOrderItem;