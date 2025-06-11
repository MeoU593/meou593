import { Backdrop, CircularProgress, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import ImageIcon from "../../assets/icon/Vector.svg";
import { closeBackDrop, openBackDrop } from "../../redux/action";
import { useSnackbar } from "../../components/SnackbarContext";

function EditFood() {
  const { slug } = useParams();
  const [food, setFood] = useState({
    name: "",
    price: "",
    description: "",
    file: null,
    category: "",
  });
  const [currentImage, setCurrentImage] = useState(""); // Để hiển thị ảnh hiện tại
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const open = useSelector((state) => state.backdropAction);

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      dispatch(openBackDrop());
      
      // Tạo FormData object để gửi file
      const formData = new FormData();
      formData.append('name', food.name);
      formData.append('price', food.price);
      formData.append('description', food.description);
      formData.append('category', food.category);
      
      // Chỉ append file nếu user đã chọn file mới
      if (food.file) {
        formData.append('file', food.file);
      }

      // Gửi FormData thay vì JSON object
      await api.patch(`admin/dish/edit/${slug}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      navigate("/setting/product-manager");
      showSnackbar("Cập nhật món ăn thành công");
    } catch (error) {
      console.error('Update error:', error);
      showSnackbar("Có lỗi xảy ra, vui lòng thử lại sau ít phút");
    }
    dispatch(closeBackDrop());
  }

  useEffect(() => {
    async function getDish() {
      try {
        dispatch(openBackDrop());
        const response = await api.get(`menu/detail/${slug}`);
        const dishData = response.data.dish;
        
        setFood({
          name: dishData.name || "",
          price: dishData.price || "",
          description: dishData.description || "",
          category: dishData.category || "",
          file: null, // File luôn bắt đầu là null
        });
        
        setCurrentImage(dishData.imageUrl || "");
      } catch (error) {
        console.error('Get dish error:', error);
        showSnackbar("Có lỗi xảy ra, vui lòng đăng nhập và thử lại sau");
      }
      dispatch(closeBackDrop());
    }

    getDish();
  }, [slug, dispatch, showSnackbar]);

  function handleChange(e) {
    const { name, value } = e.target;
    if (name !== "file") {
      setFood((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setFood((prev) => ({
        ...prev,
        [name]: e.target.files[0],
      }));
    }
  }

  return (
    <>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="container-product-management">
        <h1 className="title-product-management">Chỉnh sửa thức ăn</h1>
        <div className="main-form-ui">
          <form onSubmit={handleSubmit}>
            <div className="box-inp">
              <label htmlFor="name-and-inp">Tên thức ăn</label>
              <input
                id="name-and-inp"
                className="ui-inp"
                name="name"
                value={food.name} // Thay đổi từ defaultValue thành value
                type="text"
                onChange={handleChange}
                placeholder="Nhập tên thức ăn"
                required
              />
            </div>
            <div className="box-inp">
              <label htmlFor="description-and-inp" className="after-inp">
                Mô tả chi tiết
              </label>
              <textarea
                id="description-and-inp"
                className="ui-inp"
                name="description"
                value={food.description} // Thay đổi từ defaultValue thành value
                onChange={handleChange}
                placeholder="Nhập mô tả cho thức ăn"
                required
              />
            </div>
            <div className="grid-2-col box-grid-and">
              <div className="box-inp">
                <label htmlFor="price-and-inp">Giá</label>
                <input
                  id="price-and-inp"
                  className="ui-inp"
                  name="price"
                  value={food.price} // Thay đổi từ defaultValue thành value
                  type="number"
                  step="0.01"
                  required
                  onChange={handleChange}
                  placeholder="Nhập giá của thức ăn"
                />
              </div>
              <div className="box-inp">
                <InputLabel id="amount-and-inp" sx={{height: '18px', color: "white"}}>
                  <Typography fontFamily='Barlow' fontSize='14px' fontWeight='500'>
                    Loại thức ăn
                  </Typography>
                </InputLabel>
                <Select
                  labelId="amount-and-inp"
                  id="amount-and-inp"
                  className="ui-inp"
                  sx={{height: '49.59px'}}
                  name="category"
                  value={food.category}
                  onChange={handleChange}
                  displayEmpty
                  required
                >
                  <MenuItem value="">-- Chọn Loại Thức Ăn --</MenuItem>
                  <MenuItem value={"Main Course"}>Món chính</MenuItem>
                  <MenuItem value={"Dessert"}>Món tráng miệng</MenuItem>
                  <MenuItem value={"Drink"}>Thức uống</MenuItem>
                  <MenuItem value={"Appetizer"}>Món khai vị</MenuItem>
                </Select>
              </div>
            </div>
            <div className="box-inp">
              <div className="ui-inp image-inp">
                <img src={ImageIcon} alt="Image" />
                <p>Thêm ảnh {currentImage && "(Ảnh hiện tại đã có)"}</p>
                <label htmlFor="image-and-inp" className="custom-file-label">
                  {food.file ? food.file.name : "Duyệt file"}
                </label>
                <input
                  placeholder=""
                  id="image-and-inp"
                  className="file-input"
                  name="file"
                  onChange={handleChange}
                  type="file"
                  accept="image/*" // Chỉ cho phép chọn file ảnh
                />
              </div>
              {/* Hiển thị ảnh hiện tại nếu có */}
              {currentImage && (
                <div style={{ marginTop: '10px' }}>
                  <img 
                    src={currentImage} 
                    alt="Current dish" 
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <p style={{ fontSize: '12px', color: '#abbbc2' }}>Ảnh hiện tại</p>
                </div>
              )}
            </div>
            <div className="group-btn group-btn-ui">
              <button
                className="discard-changes btn-pro"
                type="button"
                onClick={() => navigate("/setting/product-manager")}
              >
                Hủy bỏ
              </button>
              <button className="save-changes btn-pro" type="submit">
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditFood;