import { useEffect } from "react";
import "./SuccessPayment.css";
import { useSearchParams } from "react-router-dom";
import api from "../../api";

function SuccessPayment(){
    const [searchParam] = useSearchParams();
    useEffect(() => {
        const status = searchParam.get('status');
        const orderCode = searchParam.get('orderCode');
        console.log(status);
        if(status === "PAID"){
            try{
                api.patch(`order/payment/status/success/${orderCode}`);
                console.log(orderCode);
            }catch(e){
                console.error(e);
            }
        }
    }, []);

    return (
        <>
        <div className="body-container">
            <div class="success-container">
                <div class="success-icon">✔️</div>
                <div class="success-message">Payment Successful!</div>
                <div class="details">
                Thank you for your payment. Your transaction has been completed successfully.
                </div>
                <a href="/" class="btn-home">Go to Home</a>
            </div>
        </div>
        </>
    );
}

export default SuccessPayment;