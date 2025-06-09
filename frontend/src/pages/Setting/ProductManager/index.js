import { Backdrop, CircularProgress } from "@mui/material";
import { debounce } from "lodash";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import PlusIcon from "../../../assets/icon/Plus 24px.svg";
import ItemProductManagement from "../../../components/ItemProductManagement";
import AlertDialogSlide from "../../../components/RemoveModel";
import { closeBackDrop, dialogClose, openBackDrop } from "../../../redux/action";
import "./ProductManager.css";
import { useSnackbar } from "../../../components/SnackbarContext";

function ProductManager(){

    const listNav = ["Món Chính", "Món Khai Vị", "Món Tráng Miệng", "Thức Uống"]; // Danh sách các danh mục
    const listNavPath = ["main-course", "appetizer", 'dessert', 'drink']; // Danh sách các slug theo danh mục
    const [listFood, setListFood] = useState([]);
    const [slugStorage, setSlugStorage] = useState(listNavPath.at(0));
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const componentRef = useRef(null);
    const [hasMore, setHasMore] = useState(true);
    const dispatch = useDispatch()
    const { showSnackbar } = useSnackbar();
    const open = useSelector(state => state.backdropAction);

    // Call api lấy thức ăn theo slug
    async function getFoodByCategory(slug, pageReq = page){
        try{
            dispatch(openBackDrop());
            const url = `menu/${slug}?keyword=&sortKey=&sortValue=&page=${pageReq}`;
            console.log(url);
            const response = await api.get(url);
                const {data} = response.data;
            if(Array.isArray(data) && Array.from(data).length > 0){
                setListFood(prev => [
                    ...prev,
                    ...data
                ])
            }else {
                setHasMore(false); // Không còn dữ liệu mới
              }
            }catch(e){
                showSnackbar("Lỗi kết nối");
                setHasMore(false);
            }
            dispatch(closeBackDrop());
    }
    // Action của navbar khi nhấn vào
    function handleActive(e){
        const listTag = document.querySelectorAll(".nav-bar-product-management div");
        Array.from(listTag).map((item) => (
            item.className = ""
        ))
        e.target.className = "active-nav-pro-mana";
        console.log(e);
        const category = e.target.innerHTML;
        const index = listNav.indexOf(category);
        if(index || index === 0){
            setSlugStorage(listNavPath.at(index));
        }
        if(listNavPath.at(index) !== slugStorage){
            setListFood([]);
            setHasMore(true); // Reset trạng thái tải thêm dữ liệu
        }
        setPage(1);
    }

    // khi mà slug thay đổi thì lấy danh sách thức ăn mới
    useEffect(() => {
        getFoodByCategory(slugStorage);
    }, [slugStorage])

    function handleAddNewFood(){
        navigate("/setting/product-manager/add-new-food");
    }

    // Mới vào trang thì tự load navbar đầu tiên
    useEffect(() => {
        const item1 = document.querySelector(".item0");
        if(item1)
            item1.className = "active-nav-pro-mana";
    }, [])

    // Kiểm tra nếu mà người dùng kéo xuống thì sẽ load thêm trang
    useEffect(() => {
        if (!hasMore) return;
        const currentSlug = slugStorage;
        const handleScroll = debounce(() => {
            if (componentRef.current) {
              const { scrollTop, scrollHeight, clientHeight } = componentRef.current;
        
              if (scrollTop + clientHeight >= scrollHeight - 100) {
                const newPage = page + 1;
                getFoodByCategory(currentSlug, newPage);
                setPage(newPage);
              }
            }
          }, 300); // Chỉ gọi sau mỗi 300ms
        

        const refCurrent = componentRef.current;
        if (refCurrent) {
            refCurrent.addEventListener('scroll', handleScroll);
        }

        // Cleanup sự kiện khi component bị hủy
        return () => {
            if (refCurrent) {
                refCurrent.removeEventListener('scroll', handleScroll);
            }
        };
    }, [hasMore, page, slugStorage]);

    async function handleRemove(state){
        try{
            dispatch(openBackDrop());
            await api.delete(`admin/dish/delete/${state.data}`);
            dispatch(dialogClose());
            setListFood((prev) => {
                return prev.filter((item) => item.slug !== state.data);
            })
            showSnackbar("Xóa món ăn thành công");
        }catch(e){
            showSnackbar("Xóa món ăn thất bại");
        }
        dispatch(closeBackDrop());
      }

    return(
        <>
        <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
        <AlertDialogSlide onRemove={handleRemove}/>
            <div className="container-product-management">
                <h1 className="title-product-management">Quản lý thức ăn</h1>
                <div className="nav-bar-product-management">
                    {listNav.map((item, index) => <div className={"item" + index} onClick={handleActive}>{item}</div>)}
                </div>
                <div ref={componentRef} className="content-product-management">
                <div className="add-frame" onClick={handleAddNewFood}>
                        <img src={PlusIcon} alt="PlusIcon"/>
                        <h2 className="placeholder-btn">Thêm thức ăn mới</h2>
                    </div>
                    {listFood.length > 0? 
                    <>
                    {listFood.map((item) => <ItemProductManagement item={item} />)}
                    </> : <></>
                }
                </div>
            </div>
        </>
    );
}

export default ProductManager;