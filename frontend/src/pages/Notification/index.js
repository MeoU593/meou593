import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api";
import { useSnackbar } from "../../components/SnackbarContext";
import Table from "../../components/Table";
import { closeBackDrop, openBackDrop } from "../../redux/action";
import "./Notification.css";

function Notification(){

    // const [listItem, setListItem] = useState();
    const userData = useSelector(state => state.account);
    const [date, setDate] = useState(null);
    const dispatch = useDispatch();
    const { showSnackbar } = useSnackbar();
    const [listItem, setListItem] = useState([]);

    async function getListOrderTable(){
        try{
            dispatch(openBackDrop());
            let url = (`admin/tableBooking/list` + (date? ("?date=" + date) : ""));
            if(userData.user.role === 'delivery'){
                url = `admin/delivery/orders`;
            }
            const response = await api.get(url);
            if(userData.user.role === 'delivery'){
                setListItem(Array.from(response.data.formattedOrders).map(item => ({
                    orderCode: item.orderCode,
                    customer: item.customer,
                    address: item.deliveryDetails.address,
                    deliveryTime: item.deliveryDetails.deliveryTime,
                    phone: item.deliveryDetails.phone,
                    status: item.status === "PAID"? "Đã thanh toán" : "Đang chờ",
                    action: ""
                })))
            } else {
                console.log(response)
            setListItem(Array.from(response.data).map(item => ({
                tableId: item._id,
                bookingDate: item.bookingDate,
                bookingTime: item.bookingTime,
                numberofSeats: item.numberofSeats,
                action: ""
            })));
        }
            console.log(response);
        }catch(e){
            showSnackbar("Lỗi kết nối");
        }
        dispatch(closeBackDrop());
    }

    useEffect(() => {
        getListOrderTable();
    }, [date])
    
    let headTableList = ["Mã số bàn", "Ngày đặt bàn", "Giờ đặt bàn", "Số chỗ trống", "Hành động"];
    if(userData.user.role === 'delivery'){
        headTableList = ["Mã đơn hàng", "Tên khách hàng", "Địa chỉ", "Thời gian giao", "Số điện thoại", "Trạng thái", "Hành động"]
    }

    return(
        <>
            <div className="container-history">
                <div className="header-history">
                    <h1 className="title-history">{userData && userData.user && userData.user.role === 'delivery'? "Đơn giao hàng" : "Thống kê đặt bàn"}</h1>

                    {userData.user.role !== 'delivery'? <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker format="DD/MM/YYYY" sx={{
                            "& .MuiInputBase-input": {
                                color: "white", // Màu chữ của text
                            },
                            "& .MuiSvgIcon-root": {
                                color: "white", // Màu của icon lịch
                            },
                            }} onChange={(e) => setDate(e.format("DD/MM/YYYY"))} />
                        </LocalizationProvider> : <></>}
                </div>
                <Table headTableList={headTableList} bodyTableList={listItem}/>
            </div>
        </>
    );
}

export default Notification;