import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import SearchIcon from "../../assets/icon/Mask.svg";
import { search } from "../../redux/action";
import "./Header.css";

function Header() {
  const location = useLocation();
  const dispatch = useDispatch();
  const listHeader = [
    {
      path: "/menu",
      title: "Thực đơn",
    },
    {
      path: "/dashboard",
      title: "Trang chủ",
    },
    {
      path: "/notification",
      title: "Thông báo",
    },
    {
      path: "/detail-order",
      title: "Chi tiết đơn hàng",
    },
    {
      path: "/setting",
      title: "Cài đặt",
    },
    {
      path: "/history",
      title: "Lịch sử",
    },
  ];

  const date = new Date();
  const listDay = [
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
    "Chủ Nhật",
  ];
  const listMonth = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];
  return (
    <>
      <div className="container-header">
        <div className="left-header">
          <h2 className="title-header">
            {listHeader.map((it) =>
               location.pathname.includes(it.path)? it.title : ""
            )}
          </h2>
          <p className="date-now">
            {`${listDay[date.getDay() - 1]}, ${date.getDate()} ${
              listMonth[date.getMonth()]
            } ${date.getFullYear()}`}
          </p>
        </div>
        <div
          className={
            "right-header" +
            (location.pathname.includes("/setting") ||
            location.pathname.includes("/dashboard") ||
            location.pathname.includes("/history") ||
            location.pathname.includes("/notification")
              ? " hidden"
              : "")
          }
        >
          <input
            type="text"
            className="search-bar"
            onChange={(e) => dispatch(search(e.target.value))}
            placeholder="Tìm kiếm thức ăn, ..."
          />
          <img src={SearchIcon} alt="Search Icon" />
        </div>
      </div>
    </>
  );
}

export default Header;
