import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import MostOrderItem from "../MostOrderItem";
import Payment from "../Payment";
import "./MostOrdered.css";
import { useEffect, useState } from "react";
import { closeBackDrop, openBackDrop } from "../../redux/action";
import { useSnackbar } from "../SnackbarContext";
import api from "../../api";
import { Backdrop, CircularProgress } from "@mui/material";
function MostOrdered() {
  const location = useLocation();
  //const listItem = useSelector(state => state.orderAction);
  const totalPrice = useSelector(state => state.sumOrderAction);
  const open = useSelector(state => state.backdropAction);
  const { showSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  
  const [listItem, setListItem] = useState([]);
  
  useEffect(() => {
    async function getListOrderHot(){
      try{
          dispatch(openBackDrop());
          const response = await api.patch(`menu/top-rated`);
          setListItem(response.data.data);
      }catch(e){
          showSnackbar("Lỗi kết nối");
      }
      dispatch(closeBackDrop());
  }

  getListOrderHot();
  }, []);

  return (
    <>
    <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="container-order-item">
        <div className="container-order">
          <div className="header">
            <h1 className="title">Các món ăn hot nhất</h1>
            <div className="title-order-item">
              <div className="divider"></div>
            </div>
          </div>
          <div className="content-order-item content-hot">
            {listItem.map((item) => <MostOrderItem item={item} />)}
          </div>
        </div>
      </div>
      <Payment />
    </>
  );
}
export default MostOrdered;
