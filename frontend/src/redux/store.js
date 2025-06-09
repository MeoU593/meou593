import { combineReducers, createStore } from "redux";
import { account, backdropAction, confirmAddressAction, dialogAction, dialogRatingAction, menuAction, orderAction, paymentAction, searchAction, sumOrderAction } from "./action";


const allReducers = combineReducers({
     account,
     orderAction,
     sumOrderAction,
     paymentAction,
     confirmAddressAction,
     dialogAction,
     backdropAction,
     menuAction,
     searchAction,
     dialogRatingAction,
})

// hàm lưu người dùng lên localstorage
function saveUserData(state) {
    try {
        if (state.account) {
            localStorage.setItem("userData", JSON.stringify(state.account));
        } else {
            localStorage.removeItem("userData"); // Xóa dữ liệu nếu logout
        }
    } catch (e) {
        console.error(e);
    }
}

// hàm tải người dùng về từ localStorage
function loadUserData() {
    try {
        const userData = localStorage.getItem("userData");
        if (userData) {
            return { account: JSON.parse(userData) }; // Đảm bảo trả về đúng cấu trúc
        }
        return undefined;
    } catch (e) {
        console.log(e);
        return undefined;
    }
}


const prevState = loadUserData();

const store = createStore(allReducers, prevState);
store.subscribe(() => saveUserData(store.getState()))
export default store;