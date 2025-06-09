import { Backdrop, CircularProgress, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import ImageIcon from "../../assets/icon/Vector.svg";
import { closeBackDrop, openBackDrop } from "../../redux/action";
import { useSnackbar } from "../../components/SnackbarContext";

function EditFood() {
  const { slug } = useParams(); // lấy id của food qua tên miền
  const [food, setFood] = useState({
    name: "",
    price: "",
    description: "",
    file: null,
    category: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const open = useSelector((state) => state.backdropAction);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      dispatch(openBackDrop());
      await api.patch(`admin/dish/edit/${slug}`, food);
      navigate("/setting/product-manager");
      showSnackbar("Cập nhật món ăn thành công")
    } catch (e) {
      showSnackbar("Có lỗi xảy ra, vui lòng thử lại sau ít phút");
    }
    dispatch(closeBackDrop());
  }

  useEffect(() => {
    async function getDish() {
      try {
        dispatch(openBackDrop());
        const response = await api.get(`menu/detail/${slug}`);
        setFood(response.data.dish);
      } catch (e) {
        showSnackbar("Có lỗi xảy ra, vui lòng đăng nhập và thử lại sau")
      }
      dispatch(closeBackDrop());
    }

    getDish();
  }, [slug]);

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
                defaultValue={food.name}
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
                defaultValue={food.description}
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
                  defaultValue={food.price}
                  type="number"
                  step="0.01"
                  required
                  onChange={handleChange}
                  placeholder="Nhập giá của thức ăn"
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
                <p>Thêm ảnh</p>
                <label htmlFor="image-and-inp" className="custom-file-label">
                  Duyệt file
                </label>
                <input
                  placeholder=""
                  id="image-and-inp"
                  className="file-input"
                  required
                  name="file"
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

export default EditFood;
