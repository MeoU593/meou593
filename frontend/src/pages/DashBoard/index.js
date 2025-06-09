import "./DashBoard.css";
import Table from "../../components/Table";
import SortIcon from "../../assets/icon/Filter.svg";
import money from "../../assets/icon/Money.svg";
import people from "../../assets/icon/People.svg";
import dishes from "../../assets/icon/Dishes.svg";
import UpIcon from "../../assets/icon/UpIcon.svg";
import DownIcon from "../../assets/icon/DownIcon.svg";
import { useEffect, useState } from "react";
import api from "../../api";
import { Backdrop, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { closeBackDrop, openBackDrop } from "../../redux/action";
import { useSnackbar } from "../../components/SnackbarContext";

function DashBoard(){
    const open = useSelector(state => state.backdropAction);
    const dispatch = useDispatch();
    const { showSnackbar } = useSnackbar();
    const [data, setData] = useState([
    {
        img: money,
        context: '+32.40%',
        title: 'Tổng doanh thu',
        value: '0đ',
    },
    {
        img: dishes,
        context: '-12.40%',
        title: 'Tổng thức ăn đã đặt',
        value: '0',
    },
    {
        img: people,
        context: '+2.40%',
        title: 'Tổng đơn hàng',
        value: '0',
    },
    ]);
    const [listItem, setListItem] = useState([]);
    const headTableList = ["Tên khách hàng", "Mã đơn hàng", "Các món ăn", "Trạng thái đơn", "Tổng tiền", "Hành động"];

    async function getTotalRevenue(){
        try{
            dispatch(openBackDrop());
            const response = await api.get(`admin/dashboard/total-revenue`);
            data.at(0).value = `${response.data.totalRevenue}đ`;
            setData([...data]);
        }catch(e){
            showSnackbar("Lỗi kết nối");
        }
        dispatch(closeBackDrop());
    }
    async function getTotalDish(){
        try{
            dispatch(openBackDrop());
            const response = await api.get(`admin/dashboard/total-dishes`);
            data.at(1).value = `${response.data.totalDishes}`;
            setData([...data]);
        }catch(e){
            showSnackbar("Lỗi kết nối");
        }
        dispatch(closeBackDrop());
    }
    async function getTotalOrdered(){
        try{
            dispatch(openBackDrop());
            const response = await api.get(`admin/dashboard/total-orders`);
            data.at(2).value = `${response.data.totalOrders}`;
            setData([...data]);
        }catch(e){
            showSnackbar("Lỗi kết nối");
        }
        dispatch(closeBackDrop());
    }

    async function getOrders() {
        try{
            dispatch(openBackDrop());
            const response = await api.get(`admin/dashboard`);
            console.log(response);
            setListItem(Array.from(response.data.orders).map(item => ({
                customer: item.customer,
                orderCode: item.orderCode,
                menuItems: item.menuItems,
                status: item.status === "PAID"? "Đã thanh toán" : "Đang chờ",
                totalPayment: item.totalPayment,
                action: ""
            })))
        }catch(e){
            showSnackbar("Lỗi kết nối");
        }
        dispatch(closeBackDrop());
    }

    useEffect(() => {
        getTotalRevenue();
        getTotalDish();
        getTotalOrdered();
        getOrders();
    }, []);

    return (
        <div className="container_dashboard">
            <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
            <div className="box1">
        {data.map((item, index) => (
          <div className="item" key={index}>
            <div className="box1-1">
              <img className="box1-1-img" src={item.img} alt={item.title} />
              <div className="box1-1-context">
                {item.context}
                <img
                  src={parseFloat(item.context) > 0 ? UpIcon : DownIcon}
                  alt={parseFloat(item.context) > 0 ? 'up' : 'down'}
                  className="percent-icon"
                />
              </div>
            </div>
            <div className="title">{item.title}</div>
            <div className="value">{item.value}</div>
          </div>
        ))}
      </div>
            <div className="box2">
                <div className="container-history">
                    <div className="header-history">
                        <h1 className="title-history">Báo cáo đơn đặt hàng</h1>
                        {/* <button className="sort-btn-history">
                            <img src={SortIcon} alt="SortIcon"/>
                            <h2>Lọc đơn hàng</h2>
                        </button> */}
                    </div>
                    <Table headTableList={headTableList} bodyTableList={listItem} />
                </div>
            </div>
        </div>
    );
}

export default DashBoard;