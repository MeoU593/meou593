import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import api from "../../api";
import Pattern from "../../assets/icon/Active-Pattern.svg";
import GraphOrangeIcon from "../../assets/icon/Graph-Orange.svg";
import GraphWhiteIcon from "../../assets/icon/Graph-White.svg";
import HistoryOrangeIcon from "../../assets/icon/History-Orange.svg";
import HistoryWhiteIcon from "../../assets/icon/History-White.svg";
import HomeOrangeIcon from "../../assets/icon/Home-Orange.png";
import HomeWhiteIcon from "../../assets/icon/Home-White.png";
import LogoutOrangeIcon from "../../assets/icon/Logout-Orange.svg";
import LogoutWhiteIcon from "../../assets/icon/Logout-White.svg";
import NotificationOrangeIcon from "../../assets/icon/Notification-Orange.svg";
import NotificationWhiteIcon from "../../assets/icon/Notification-White.svg";
import Logo from "../../assets/icon/Restaurant.svg";
import SettingOrangeIcon from "../../assets/icon/Setting-Orange.svg";
import SettingWhiteIcon from "../../assets/icon/Setting-White.svg";
import { closeBackDrop, logout, openBackDrop } from "../../redux/action";
import { useSnackbar } from "../SnackbarContext";
import "./SideBar.css";

function SideBar() {
  const location = useLocation();
  const dispatch = useDispatch()
  const { showSnackbar } = useSnackbar();
  const orderType = useSelector(state => state.menuAction);
  const navigate = useNavigate();
  const userData = useSelector(state => state.account);
  let listTab = [
    {
      iconWhite: HomeWhiteIcon,
      iconOrange: HomeOrangeIcon,
      navigate: `/menu/?order-type=${orderType === "DELIVERY"? "Delivery" : "Dine In"}`,
    },
    {
      iconWhite: SettingWhiteIcon,
      iconOrange: SettingOrangeIcon,
      navigate: "/setting/update-information",
    },
    {
      iconWhite: HistoryWhiteIcon,
      iconOrange: HistoryOrangeIcon,
      navigate: "/history",
    },
    {
      iconWhite: LogoutWhiteIcon,
      iconOrange: LogoutOrangeIcon,
      navigate: "/login",
    },
  ];
  if(userData && userData.user && (userData.user.role === 'staff' || userData.user.role === 'admin')){
    listTab.splice(1, 0, {
      iconWhite: GraphWhiteIcon,
      iconOrange: GraphOrangeIcon,
      navigate: "/dashboard",
    });
  }
  if(userData && userData.user && userData.user.role !== 'user'){
    listTab.splice(2, 0, {
      iconWhite: NotificationWhiteIcon,
      iconOrange: NotificationOrangeIcon,
      navigate: "/notification",
    })
  }
  async function logoutApp(){
    try{
      dispatch(openBackDrop());
      await api.get(`users/logout`);
      dispatch(logout());
      showSnackbar("Đăng xuất thành công");
    }catch(e){
      showSnackbar("Đăng xuất thất bại");
    }
    dispatch(closeBackDrop());
  }

  function handleLogout(item){
    if(item.navigate === "/login"){
      logoutApp();
    }
  }
  return (
    <>
      <div className="container-sidebar">
        <div className="logo" onClick={() => navigate("/")}>
          <img src={Logo} alt="Logo" />
        </div>
        {listTab.map((item) => (
          <NavLink to={item.navigate} onClick={() => handleLogout(item)}>
            <div
              className={
                "item-sidebar" +
                (location.pathname.includes(item.navigate.split("/").at(1)) &&
                item.navigate.length > 1
                  ? " item-active"
                  : "")
              }
            >
              <div className={"border-icon"}>
                {location.pathname.includes(item.navigate.split("/").at(1)) &&
                item.navigate.length > 1 ? (
                  <>
                    <img className="pattern" src={Pattern} alt="icon-tab" />
                    <img className="tab" src={item.iconWhite} alt="icon-tab" />
                  </>
                ) : (
                  <img className="tab" src={item.iconOrange} alt="icon-tab" />
                )}
              </div>
            </div>
          </NavLink>
        ))}
      </div>
    </>
  );
}

export default SideBar;
