import { Backdrop, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import api from "../../api";
import { useSnackbar } from "../../components/SnackbarContext";
import "./DetailOrder.css";
import { closeBackDrop, openBackDrop } from "../../redux/action";
import { useEffect, useState } from "react";

function DetailOrder() {
  const userData = useSelector((state) => state.account);
  const { id } = useParams("id");
  const open = useSelector((state) => state.backdropAction);
  const { showSnackbar } = useSnackbar();
  const [searchParam] = useSearchParams();
  const headTableList = ["Tên món ăn", "Số lượng", "Giá"];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [order, setOrder] = useState();
  const [customer, setCustomer] = useState();

  async function getTableBooking() {
    try {
      dispatch(openBackDrop());
      const response = await api.get(`admin/tableBooking/detail/${id}`);
      setCustomer(response.data.customer);
      console.log(response);
      setOrder({
        ...response.data,
        items: response.data.items? Array.from(response.data.items).map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })) : [],
      })
    } catch (e) {
      showSnackbar("Lỗi kết nối");
    }
    dispatch(closeBackDrop());
  }

  async function getDeliveryOrder() {
    try {
      dispatch(openBackDrop());
      const response = await api.get(`admin/delivery/orders/${id}`);
      setOrder({
        ...response.data.order,
        items: Array.from(response.data.order.items).map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      });
      setCustomer(response.data.customer);
      console.log(response);
    } catch (e) {
      showSnackbar("Lỗi kết nối");
    }
    dispatch(closeBackDrop());
  }

  async function getOrderByCode() {
    try {
      dispatch(openBackDrop());
      const response = await api.get(`admin/dashboard/get-order/${id}`);
      setOrder({
        ...response.data.order,
        items: Array.from(response.data.order.items).map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      });
      setCustomer(response.data.customer);
      console.log(response);
    } catch (e) {
      showSnackbar("Lỗi kết nối");
    }
    dispatch(closeBackDrop());
  }

  async function handleComplete() {
    if (!order || !order.orderCode) {
      showSnackbar("Không tìm thấy mã đơn hàng");
      return;
    }

    if (order.status === "PAID") {
      showSnackbar("Đơn hàng đã được hoàn thành");
      return;
    }

    try {
      dispatch(openBackDrop());
      const response = await api.patch(`admin/dashboard/change-status/${order.orderCode}`);
      
      if (response.status === 200) {
        showSnackbar("Đơn hàng đã được hoàn thành thành công!");
        
        // Cập nhật state local
        setOrder(prev => ({
          ...prev,
          status: "PAID"
        }));
        
        // Có thể navigate về trang trước sau một khoảng thời gian
        setTimeout(() => {
          navigate(-1);
        }, 1500);
      }
    } catch (e) {
      console.error(e);
      if (e.response && e.response.data && e.response.data.message) {
        showSnackbar(e.response.data.message);
      } else {
        showSnackbar("Lỗi khi cập nhật trạng thái đơn hàng");
      }
    }
    dispatch(closeBackDrop());
  }

  useEffect(() => {
    if (userData && userData.user && userData.user.role === "delivery") {
      getDeliveryOrder();
    } else if (userData && userData.user && userData.user.role !== "user") {
      const orderType = searchParam.get("order-type");
      if (orderType === "delivery") {
        getDeliveryOrder();
      } else if (orderType === "order") {
        // Nếu là chi tiết đơn hàng từ dashboard
        getOrderByCode();
      } else {
        getTableBooking();
      }
    }
  }, []);

  return (
    <>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="container-detail-order">
        <div className="container-history">
          <div className="main-detail-order">
            <h2>Tên khách hàng: {order && order.bookingId? customer : (customer ? customer.fullname : "")}</h2>
            <h2 className={order
                ? order.status && order.status === "PAID"
                  ? "paid"
                  : "pending"
                : ""}>
              Trạng thái:{" "}
              {order
                ? order.status && order.status === "PAID"
                  ? "Đã thanh toán"
                  : "Đang chờ"
                : ""}
            </h2>
            {order && order.bookingId?
            <>
            <h2 className="booking">Số điện thoại:  {order && order.phone? order.phone : ""}</h2>
            <h2 className="booking">Ngày đặt bàn: {order && order.bookingDate? order.bookingDate : ""}</h2>
            <h2 className="booking">Giờ đặt bàn: {order && order.bookingTime? order.bookingTime : ""}</h2> </>: <></>}
            <div className="container-item-menu">
              <div className="container-table">
                <table>
                  <thead>
                    <tr>
                      {Array.from(headTableList).map((item, index) => (
                        <th key={index} className={"item" + index}>
                          {item}
                        </th>
                      ))}
                    </tr>
                  </thead>
                </table>
                <div className={"container-body-table detail-order" + (order && order.bookingId? " booking-table" : "")}>
                  {order ? (
                    <table>
                      <tbody>
                        {Array.isArray(order.items) ? (
                          <>
                            {Array.from(order.items).map((item, index) => {
                              return (
                                <tr key={index}>
                                  {Object.values(item).map((data, id) => {
                                    return (
                                      <td key={id}>
                                        <div>
                                          {Object.entries(item).at(id)[0] === "price" 
                                            ? `${parseInt(data).toLocaleString()}đ`
                                            : data}
                                        </div>
                                      </td>
                                    );
                                  })}
                                </tr>
                              );
                            })}
                          </>
                        ) : (
                          <></>
                        )}
                      </tbody>
                    </table>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
            {order && order.bookingId? <></> : 
              <div className="total">
                <p>Tổng tiền: </p>
                <p>{order ? `${parseInt(order.totalAmount).toLocaleString()}đ` : "0đ"}</p>
              </div>
            }
            <div className="group-btn">
              <button type="button" onClick={() => navigate(-1)}>Quay lại</button>
              <button 
                type="button" 
                onClick={handleComplete}
                disabled={order && order.status === "PAID"}
                style={{
                  opacity: order && order.status === "PAID" ? 0.5 : 1,
                  cursor: order && order.status === "PAID" ? "not-allowed" : "pointer"
                }}
              >
                {order && order.status === "PAID" ? "Đã hoàn thành" : "Hoàn thành"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DetailOrder;