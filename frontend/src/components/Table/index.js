import { Backdrop, Button, CircularProgress } from "@mui/material";
import "./Table.css";
import { useDispatch, useSelector } from "react-redux";
import { closeBackDrop, dialogRatingClose, dialogRatingOpen, openBackDrop } from "../../redux/action";
import RadioGroupRating from "../RatingModel";
import api from "../../api";
import { useSnackbar } from "../SnackbarContext";
import { useLocation, useNavigate } from "react-router-dom";

function Table(props) {
  const { headTableList, bodyTableList, getOrdered } = props;
  const navigate = useNavigate();
  const open = useSelector(state => state.backdropAction);
  const location = useLocation();
  const { showSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  async function onRating(state, value){
    const orderCode = state.data;
    try{
      dispatch(openBackDrop());
      await api.patch(`order/rate/${orderCode}`, {rating: value});
      showSnackbar("Đánh giá thành công");
      getOrdered();
      dispatch(dialogRatingClose());
    }catch(e){
      if(e.response.data.message){
        showSnackbar(e.response.data.message);
      } else {
        showSnackbar("Đánh giá thất bại");
      }
    }
    dispatch(closeBackDrop());
  }

  return (
    <>
    <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    <RadioGroupRating onRating={onRating}/>
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
        <div className="container-body-table">
          <table>
            <tbody>
              {Array.isArray(bodyTableList) ? (
                <>
                  {Array.from(bodyTableList).map((item, index) => {
                    return (
                      <tr key={index}>
                        {Object.values(item).map((data, id) => {
                          return (
                            <td key={id}>
                              {(id < Object.values(item).length - 1 || location.pathname === '/dashboard') && Object.entries(item).at(id)[0] !== "action" ? (
                                <div
                                  className={`${Object.entries(item).at(id)[0]} ${
                                    data === "Đang chờ" ? "pending" : ""
                                  }`}
                                >
                                  {data}{Object.entries(item).at(id)[0] === "totalPayment"? "đ" : ''}
                                </div>
                              ) : data ? (
                                data + "/5"
                              ) : Object.entries(item).at(
                                  Object.entries(item).length - 2
                                )[1] === "Đã thanh toán" && location.pathname !== "/notification" ? (
                                <Button
                                  sx={{
                                    color: "#fff",
                                    background: "rgba(107, 226, 190, 0.24)",
                                  }}
                                  onClick={() => dispatch(dialogRatingOpen(item["orderCode"]))}
                                >
                                  Đánh giá ngay
                                </Button>
                              ) : location.pathname === "/notification" || location.pathname === "/dashboard"? <Button
                              sx={{
                                color: "#fff",
                                background: "rgba(107, 226, 190, 0.24)",
                              }}
                              onClick={() => item["tableId"]? navigate("/detail-order/" + item["tableId"] + "?order-type=bookingtable") : navigate("/detail-order/" + item["orderCode"] + "?order-type=delivery")}
                            >
                              Xem chi tiết
                            </Button> : (
                                "Hãy thanh toán trước"
                              )}
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
        </div>
      </div>
    </>
  );
}

export default Table;
