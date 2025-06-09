import { Backdrop, CircularProgress } from "@mui/material";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api";
import ItemMenu from "../../components/ItemMenu";
import { useSnackbar } from "../../components/SnackbarContext";
import { closeBackDrop, openBackDrop } from "../../redux/action";
import "./Menu.css";

function Menu() {
  const listNav = [
    "Tất cả",
    "Món Chính",
    "Món Khai Vị",
    "Món Tráng Miệng",
    "Thức Uống",
  ]; // Danh sách các danh mục
  const listNavPath = ["all", "main-course", "appetizer", "dessert", "drink"]; // Danh sách các slug theo danh mục
  const [slugStorage, setSlugStorage] = useState(listNavPath.at(0));
  const [listItem, setListItem] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const keyword = useSelector((state) => state.searchAction);
  const open = useSelector((state) => state.backdropAction);

  // Call api lấy thức ăn theo slug
  const getFoodByCategory = useCallback( async (slug, pageReq = page) => {
    try {
      dispatch(openBackDrop());
      let url = `menu/${slug}?sortKey=&sortValue=&page=${pageReq}${
        keyword ? "&keyword=" + keyword : ""
      }`;
      console.log(url);
      if (slug === "all") {
        url = `menu?sortKey=&sortValue=&page=${pageReq}${
          keyword ? "&keyword=" + keyword : ""
        }`;
      }
      const response = await api.get(url);
      const { data } = response.data;
      if (Array.isArray(data) && Array.from(data).length > 0) {
        data.forEach((item) => {
          item.quantity = 1;
          item.totalPrice = item.price;
        });
        if (keyword) {
          setListItem(data);
        } else {
          if (pageReq === 1) {
            setListItem(data);
          } else {
            setListItem((prev) => [...prev, ...data]);
          }
        }
      } else {
        if (keyword) {
          setListItem([]);
        }
        setHasMore(false); // Không còn dữ liệu mới
      }
    } catch (e) {
      showSnackbar("Lỗi kết nối");
      setHasMore(false);
    }
    dispatch(closeBackDrop());
  }, [dispatch, keyword, page]);

  // Action của navbar khi nhấn vào
  function handleActive(e) {
    const listTag = document.querySelectorAll(".nav-bar-menu div");
    Array.from(listTag).map((item) => (item.className = ""));
    e.target.className = "active-nav-pro-mana";
    const category = e.target.innerHTML;
    const index = listNav.indexOf(category);
    if (index || index === 0) {
      setSlugStorage(listNavPath.at(index));
    }
    if (listNavPath.at(index) !== slugStorage) {
      setListItem([]);
      setHasMore(true); // Reset trạng thái tải thêm dữ liệu
    }
    setPage(1);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    debounce(() => {
      getFoodByCategory(slugStorage, 1); // Luôn gọi với `page = 1` khi tìm kiếm mới.
    }, 300),
    [slugStorage, keyword] // Thêm `keyword` và `getFoodByCategory` vào dependencies.
  );

  // khi mà slug thay đổi thì lấy danh sách thức ăn mới
  useEffect(() => {
    handleSearch();
  
    return () => {
      handleSearch.cancel();
    };
  }, [slugStorage, keyword, handleSearch]);
  
  // Lắng nghe sự kiện scroll của window
  useEffect(() => {
    if (!hasMore) return;
    const currentSlug = slugStorage;
    const handleScroll = debounce(() => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      // Kiểm tra nếu người dùng cuộn xuống cách đáy màn hình chính <= 100px
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        setPage((prevPage) => {
          const newPage = prevPage + 1;
          getFoodByCategory(currentSlug, newPage);
          return newPage;
        });
      }
    }, 300);

    // Thêm sự kiện scroll vào window
    window.addEventListener("scroll", handleScroll);

    // Cleanup sự kiện khi component bị hủy
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore, page, keyword ,slugStorage]);

  // Mới vào trang thì tự load navbar đầu tiên
  useEffect(() => {
    const item1 = document.querySelector(".item0");
    if (item1) item1.className = "active-nav-pro-mana";
  }, []);

  return (
    <>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <section className="container-menu">
        <div className="container-nav">
          <div className="nav-bar-menu">
            {listNav.map((item, index) => (
              <div className={"item" + index} onClick={handleActive}>
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="title-menu">Chọn thức ăn</div>
        {listItem.length > 0 ? (
          <div className="content-menu">
            {listItem.map((item, index) => (
              <ItemMenu key={index} item={item} />
            ))}
          </div>
        ) : (
          <div className="not-found">Món ăn không tồn tại</div>
        )}
      </section>
    </>
  );
}

export default Menu;
