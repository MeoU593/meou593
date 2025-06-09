import { Backdrop, CircularProgress, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import ImageIcon from "../../assets/icon/Vector.svg";
import { closeBackDrop, openBackDrop } from "../../redux/action";
import "./AddFood.css";
import { useSnackbar } from "../../components/SnackbarContext";

function AddFood() {
  const navigate = useNavigate();
  const [formAddFood, setFormAddFood] = useState({
    file: null,
    name: "",
    description: "",
    price: "",
    category: "",
    rating: 4,
  });
  const open = useSelector((state) => state.backdropAction);
  const dispatch = useDispatch();

  const { showSnackbar } = useSnackbar()

  async function addNewFoodApi() {
    try {
      dispatch(openBackDrop());
      await api.post("admin/dish/create", formAddFood, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      showSnackbar("Thêm món ăn thành công");
      navigate("/setting/product-manager");
    } catch (e) {
      if(e.response.status === 400){
        showSnackbar("Món ăn đã tồn tại");
      } else if(e.response.status === 500){
        showSnackbar("Thêm món ăn thất bại");
      } else {
        showSnackbar("Có lỗi xảy ra, vui lòng thử lại sau");
      }
    }
    dispatch(closeBackDrop());
  }

  function handleSubmit(e) {
    e.preventDefault();
    addNewFoodApi();
  }

  function handleChange(e) {
    const { name, value } = e.target;
    if (name !== "file") {
      setFormAddFood((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setFormAddFood((prevState) => ({
        ...prevState,
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
        <h1 className="title-product-management">Thêm thức ăn mới</h1>
        <div className="main-form-ui">
          <form onSubmit={handleSubmit}>
            <div className="box-inp">
              <label htmlFor="name-and-inp">Tên thức ăn</label>
              <input
                id="name-and-inp"
                className="ui-inp"
                name="name"
                type="text"
                onChange={handleChange}
                required
                placeholder="Nhập tên món ăn"
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
                onChange={handleChange}
                required
                placeholder="Nhập mô tả về món ăn đó"
              />
            </div>
            <div className="grid-2-col box-grid-and">
              <div className="box-inp">
                <label htmlFor="price-and-inp">Giá</label>
                <input
                  id="price-and-inp"
                  className="ui-inp"
                  name="price"
                  type="number"
                  required
                  step="0.01"
                  onChange={handleChange}
                  placeholder="Nhập giá của món ăn"
                />
              </div>
              <div className="box-inp">
              <InputLabel id="amount-and-inp" sx={{height: '18px', color: "white"}} ><Typography fontFamily='Barlow' fontSize='14px' fontWeight='500'>Loại thức ăn</Typography></InputLabel>
              <Select
                labelId="amount-and-inp"
                id="amount-and-inp"
                className="ui-inp"
                sx={{height: '49.59px'}}
                name="category"
                value={formAddFood.category}
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
                <p>Thêm ảnh</p>
                <label htmlFor="image-and-inp" className="custom-file-label">
                  Duyệt file
                </label>
                <input
                  placeholder=""
                  id="image-and-inp"
                  className="file-input"
                  name="file"
                  required
                  onChange={handleChange}
                  type="file"
                />
              </div>
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

export default AddFood;
