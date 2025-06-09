import "./CancelPayment.css";

function CancelPayment(){
    return (
        <>
            <div className="body-cancel-payment">
            <div class="cancel-container">
                <div class="cancel-icon">❌</div>
                <div class="cancel-message">Order Cancelled</div>
                <div class="details">
                Your order has been cancelled successfully. If this was a mistake, please place a new order.
                </div>
                <a href="/" class="btn-home">Go to Home</a>
            </div>
            </div>
        </>
    );
}

export default CancelPayment;