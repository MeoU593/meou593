import "./ItemProductManagement.css";
import EditIcon from "../../assets/icon/Edit.svg";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { dialogOpen } from "../../redux/action";

function ItemProductManagement(props){
    const {item} = props;
    const navigate = useNavigate();
    const dispatch = useDispatch()
    function handleEditFood(){
        navigate(`/setting/product-manager/edit-food/${item.slug}`);
    }

    function handleRemoveFood(){
        dispatch(dialogOpen(item.slug));
    }
    return (
        <>
            <div className="container-ipm">
                <div className="image-ipm">
                    <img src={item.imageUrl} alt="Image"/>
                </div>
                <h1 className="title-ipm">{item.name}</h1>
                <div className="detail-ipm">
                    <pre className="price-ipm">{item.price}đ</pre>
                    <p>&bull;</p>
                    <pre className="store-ipm">{item.store} Mỗi Phần</pre>
                </div>
                <div className="box-btn">

                <div className="edit-btn-ipm" onClick={handleRemoveFood}>
                <RiDeleteBin5Line color="#ea7c69" />
                    <p>Xóa</p>
                </div>
                <div className="edit-btn-ipm" onClick={handleEditFood}>
                    <img src={EditIcon} alt="EditIcon"/>
                    <p>Sửa</p>
                </div>
                </div>
            </div>
        </>
    );
}

export default ItemProductManagement;