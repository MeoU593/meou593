export const login = (userData) => {
  return {
    type: "LOGINSUCCESS",
    userData: userData,
  };
};

export const logout = () => {
  return {
    type: "LOGOUT",
  };
};

export const addFoodOrder = (item) => {
  return {
    type: "ADDFOODORDER",
    data: item,
  };
};

export const removeFoodOrder = (item) => {
  return {
    type: "REMOVEFOODORDER",
    data: item,
  };
};

export const sumAddOrder = (item) => {
  return {
    type: "SUMADDORDER",
    data: item,
  };
};

export const sumRemoveOrder = (item) => {
  return {
    type: "SUMREMOVEORDER",
    data: item,
  };
};

export const dialogOpen = (slug) => {
  return{
    type: "OPENDIALOG",
    data: slug,
  }
}

export const dialogClose = () => {
  return{
    type: "CLOSEDIALOG",
    data: null,
  }
}

const dialogState = {
  status: false,
  data: null,
}

export const dialogAction = (state = dialogState, action) => {
  switch (action.type) {
    case "OPENDIALOG":
      return {status: true, data: action.data};
    case "CLOSEDIALOG":
      return {status: false, data: null};
    default:
      return state;
  }
}

export const orderAction = (state = [], action) => {
  switch (action.type) {
    case "ADDFOODORDER": {
      for (let item of state) {
        if (item.slug === action.data.slug) {
          item.quantity += action.data.quantity;
          item.totalPrice = Number(Number(item.totalPrice) + Number(action.data.quantity * item.price));
          return [...state];
        }
      }
      return [...state, {...action.data, totalPrice : Number(action.data.price * action.data.quantity)}];
    }
    case "REMOVEFOODORDER": {
      for (let item of state) {
        if (item.slug === action.data.slug) {
          item.quantity = 1;
          item.totalPrice = item.price;
          return state.filter((item) => item.name !== action.data.name);
        }
      }
      return [...state];
    }
    default:
      return state;
  }
};

export const sumOrderAction = (state = 0, action) => {
  switch (action.type) {
    case "SUMADDORDER": {
      return Number(
        Number(state) + Number(action.data.price * action.data.quantity)
      );
    }
    case "SUMREMOVEORDER": {
      return Number(Number(state) - Number(action.data.totalPrice));
    }
    default:
      return state;
  }
};

export const account = (state = null, action) => {
  switch (action.type) {
    case "LOGINSUCCESS":
      return action.userData;
    case "LOGOUT":
      {
        localStorage.removeItem("userData");
        localStorage.removeItem("token");
        return null;
      }
    default:
      return state;
  }
};

export const openPayment = () => {
  return {
    type: "OPEN",
  };
};

export const closePayment = () => {
  return {
    type: "CLOSE",
  };
};

export const paymentAction = (state = false, action) => {
  switch (action.type) {
    case "OPEN":
      {
        const body = document.querySelector('body');
        body.style.overflow = 'hidden';
        return true;
      }
    case "CLOSE":
      {
        const body = document.querySelector('body');
        body.style.overflow = 'auto';
        return false;
      }
    default:
      return state;
  }
};
export const openConfirmAddress = () => {
  return {
    type: "OPENCONFIRMADDRESS",
  };
};

export const closeConfirmAddress = () => {
  return {
    type: "CLOSECONFIRMADDRESS",
  };
};

export const confirmAddressAction = (state = false, action) => {
  switch (action.type) {
    case "OPENCONFIRMADDRESS":
      return true;
    case "CLOSECONFIRMADDRESS":
      return false;
    default:
      return state;
  }
};

export const openBackDrop = () => {
  return {
    type: 'OPENBACKDROP',
  }
}

export const closeBackDrop = () => {
  return {
    type: 'CLOSEBACKDROP',
  }
}

export const backdropAction = (state = false, action) => {
  switch (action.type) {
    case "OPENBACKDROP":
      return true;
      case "CLOSEBACKDROP":
        return false;
    default:
      return state;
  }
}

export const dineInAction = () => {
  return {
    type: "DINE_IN",
  }
}

export const deliveryAction = () => {
  return {
    type: "DELIVERY",
  }
}

export const menuAction = (state = null, action) => {
  switch(action.type){
    case "DINE_IN":
      return "DINE_IN";
      case "DELIVERY":
        return "DELIVERY";
        default:
          return state;
  }
}

export const search = (keyword) => {
  return {
    type: 'SEARCH',
    data: keyword,
  }
}

export const searchAction = (state = null, action) => {
  switch(action.type){
    case "SEARCH":
      return action.data;
      default:
        return state;
  }
}

export const dialogRatingOpen = (slug) => {
  return{
    type: "OPENRATINGDIALOG",
    data: slug,
  }
}

export const dialogRatingClose = () => {
  return{
    type: "CLOSERATINGDIALOG",
    data: null,
  }
}

const dialogRatingState = {
  status: false,
  data: null,
}

export const dialogRatingAction = (state = dialogRatingState, action) => {
  switch (action.type) {
    case "OPENRATINGDIALOG":
      return {status: true, data: action.data};
    case "CLOSERATINGDIALOG":
      return {status: false, data: null};
    default:
      return state;
  }
}