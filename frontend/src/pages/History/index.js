import { useEffect, useState } from "react";
import SortIcon from "../../assets/icon/Filter.svg";
import Table from "../../components/Table";
import "./History.css";
import api from "../../api";
import { useSelector } from "react-redux";

function History(){

    // const [listItem, setListItem] = useState();
    const userData = useSelector(state => state.account);
    const [listItem, setListItem] = useState([]); 

    async function getHistoryOrdered(){
        try{
            const response = await api.get(`users/orders`);
            console.log(response.data.data);
            setListItem(Array.from(response.data.data).map(item => ({
                orderCode: item.orderCode,
                items: Array.from(item.items).map(it => it.name).join(", "),
                totalAmount: item.totalAmount + "đ",
                orderType: item.orderType === 'Delivery'? "Giao tận nơi" : "Ăn tại quán",
                status: item.status === 'PAID'? "Đã thanh toán" : "Đang chờ",
                rating: item.rating
            })))
        }catch(e){

        }
    }

    useEffect(() => {
        getHistoryOrdered()
    }, []);

    let headTableList = [];
        headTableList.push("Mã đơn hàng", "Món đã đặt", "Giá đơn hàng", "Loại đơn hàng", "Trạng thái", "Đánh giá");

    return (
        <>
            <div className="container-history">
                <div className="header-history">
                    <h1 className="title-history">Lịch sử đặt món</h1>
                    {/* <button className="sort-btn-history">
                        <img src={SortIcon} alt="SortIcon"/>
                        <h2>Lọc đơn hàng</h2>
                    </button> */}
                </div>
                <Table headTableList={headTableList} getOrdered={getHistoryOrdered} bodyTableList={listItem}/>
            </div>
        </>
    );
}

export default History;