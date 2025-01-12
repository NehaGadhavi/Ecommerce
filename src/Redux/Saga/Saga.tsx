import { call, put, takeLatest } from "redux-saga/effects";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { axiosInstance, axiosInstanceAuth } from "../../Service/Service";
import { RegisterInterface } from "../../Components/Register/Register";
import { LoginInterface } from "../../Components/Login/Login";
import { AddProductInterface } from "../../Components/AddProduct/AddProduct";
import { CheckoutInterface } from "../../Components/Checkout/Checkout";

interface RegisterActionInterface {
  type: string;
  payload: RegisterInterface;
}

interface LoginActionInterface {
  type: string;
  payload: LoginInterface;
}

interface UserActionInterface {
  type: string;
  payload: { page: number; limit: number };
}

interface ActionNumberInterface {
  type: string;
  payload: number;
}

interface ActionProductInterface {
  type: string;
  payload: {
    page: number;
    limit: number;
    category: number;
    sort: string | null;
  };
}
interface ActionAddProductInterface {
  type: string;
  payload: AddProductInterface;
}

interface ActionCheckoutInterface {
  type: string;
  payload: CheckoutInterface;
}

export function* register(action: RegisterActionInterface) {
  const { username, password, email, dob, gender, address } = action.payload;

  const temp = {
    username: username,
    email: email,
    password: password,
    dob: dob,
    gender: gender,
    address: address,
  };
  try {
    const response: AxiosResponse<any> = yield call(
      axiosInstance.post,
      "/auth/register",
      temp
    );

    if (response) {
      toast.success("You have been registered successfully.");
      yield put({ type: "REGISTER_REDUCER" });
    } else {
    }
  } catch (error: any) {}
}

export function* login(action: LoginActionInterface) {
  const temp = action.payload;

  try {
    const response: AxiosResponse<any> = yield call(
      axiosInstance.post,
      "/auth/login",
      temp
    );
    if (response) {
      toast.success(response.data.message);
      localStorage.setItem("token", response.data.data.tokenResponse.token);
      yield put({ type: "LOGIN_REDUCER" });
    }
  } catch (error: any) {}
}

export function* googlelogin(action: any) {
  try {
    const response: AxiosResponse<any> = yield call(
      axiosInstance.get,
      "/auth/google"
    );
  } catch (error) {}
}

export function* getAllProducts(action: ActionProductInterface) {
  try {
    let { page, limit, category, sort } = action.payload;

    const response: AxiosResponse<any> = yield call(() => {
      if (category !== null) {
        if (sort !== null) {
          console.log("data");

          return axiosInstanceAuth.get(
            `/products/all?page=${page}&limit=${limit}&category=${category}&sortOrder=${sort}`
          );
        } else {
          return axiosInstanceAuth.get(
            `/products/all?page=${page}&limit=${limit}&category=${category}`
          );
        }
      } else {
        if (sort !== null) {
          return axiosInstanceAuth.get(
            `/products/all?page=${page}&limit=${limit}&sortOrder=${sort}`
          );
        } else {
          return axiosInstanceAuth.get(
            `/products/all?page=${page}&limit=${limit}`
          );
        }
      }
    });

    if (response) {
      let temp = {
        products: response.data.products,
        count: response.data.totalCount,
      };
      yield put({ type: "SET_ALL_PRODUCTS", payload: temp });
    }
  } catch (error) {}
}
export function* getSingleProduct(action: ActionNumberInterface) {
  const id = action.payload;
  try {
    const response: AxiosResponse<any> = yield call(
      axiosInstance.get,
      `/products/product/${id}`
    );
    yield put({ type: "SET_SINGLE_PRODUCTS", payload: response.data });
  } catch (error) {}
}

export function* addProduct(action: ActionAddProductInterface) {
  try {
    const d = action.payload;

    const formData = new FormData();
    formData.append("product_name", d.name);
    formData.append("price", d.price);
    formData.append("quantity", d.quantity);
    formData.append("category", d.category);
    formData.append("description", d.description);
    formData.append("product_img", d.file);

    const response: AxiosResponse<any> = yield call(
      axiosInstanceAuth.post,
      "/products/add_product",
      formData
    );
    if (response) {
      toast.success("Product added successfully");
    }
  } catch (error) {
    toast.error("Product not added!");
  }
}
export function* updateProducts(action: ActionAddProductInterface) {
  try {
    const d = action.payload;
    const id = d.id;

    const formData: any = new FormData();
    formData.append("product_name", d.name);
    formData.append("price", d.price);
    formData.append("quantity", d.quantity);
    formData.append("category", d.category);
    formData.append("description", d.description);
    formData.append("product_img", d.file);
    const response: AxiosResponse<any> = yield call(
      axiosInstanceAuth.patch,
      `/products/update_product/${id}`,
      formData
    );
    if (response) {
      toast.success("Product updated successfully.");
      yield put({ type: "UPDATE_PRODUCT_REDUCER", payload: response.data });
    }
  } catch (error) {
    toast.error("Product not updated!");
  }
}

export function* deleteProduct(action: ActionNumberInterface) {
  const id = action.payload;
  try {
    const response: AxiosResponse<any> = yield call(
      axiosInstanceAuth.delete,
      `/products/delete_product/${id}`
    );

    if (response) {
      yield put({ type: "DELETE_PRODUCT_REDUCER", payload: id });
    }
  } catch (error: any) {}
}

export function* searchProduct(action: any) {
  const { search, page, limit } = action.payload;
  try {
    const response: AxiosResponse<any> = yield call(
      axiosInstance.get,
      `/products/search_text/?search=${search}&page=${page}&limit=${limit}`
    );
    if (response.status === 200) {
      console.log("search saga", response.data.data);
      yield put({
        type: "SEARCH_PRODUCT_REDUCER",
        payload: response.data.data,
      });
    } else {
    }
  } catch (error: any) {
    yield put({ type: "CLEAR_SEARCH_PRODUCT_REDUCER" });
  }
}

export function* addAdmin(action: any) {
  const temp = action.payload;
  try {
    const response: AxiosResponse<any> = yield call(
      axiosInstanceAuth.post,
      `/auth/add_admin`,
      temp
    );
    if (response) {
      toast.success("Admin added successfully.");
    }
  } catch (error) {}
}

export function* getAllUsers(action: UserActionInterface) {
  const { page, limit } = action.payload;
  try {
    const response: AxiosResponse<any> = yield call(
      axiosInstanceAuth.get,
      `/auth/users/?page=${page}&limit=${limit}`
    );
    if (response) {
      let temp = {
        users: response.data.data,
        totalCount: response.data.totalCount,
      };
      yield put({ type: "ADD_USER_REDUCER", payload: temp });
    }
  } catch (error) {}
}

export function* addToCart(action: any) {
  const id = action.payload.id;
  const quantity = action.payload.quantity;
  let temp = {
    quantity: quantity,
  };

  try {
    const response: AxiosResponse<any> = yield call(
      axiosInstanceAuth.post,
      `/products/add_to_cart/${id}`,
      temp
    );
    if (response) {
      toast.success("Item added to cart.");
    }
  } catch (error) {}
}

export function* getProductsInCarts() {
  try {
    const response: AxiosResponse<any> = yield call(
      axiosInstanceAuth.get,
      `/products/carts`
    );
    if (response) {
      toast.success("Cart items fetched.");
      yield put({
        type: "SET_PRODUCTS_CART_REDUCER",
        payload: response.data.data,
      });
    }
  } catch (error) {}
}

export function* deleteUser(action: ActionNumberInterface) {
  let id = action.payload;
  try {
    const response: AxiosResponse<any> = yield call(
      axiosInstanceAuth.delete,
      `/auth/remove_user/${id}`
    );
    if (response) {
      toast.success("User has been removed successfully.");
      yield put({ type: "DELETE_USER_REDUCER", payload: id });
    }
  } catch (error) {}
}

export function* deleteCartItem(action: ActionNumberInterface) {
  let id = action.payload;
  try {
    const response: AxiosResponse<any> = yield call(
      axiosInstanceAuth.delete,
      `/products/remove_from_cart/${id}`
    );
    if (response) {
      toast.success("Item removed from cart.");
      yield put({ type: "DELETE_CART_ITEM_REDUCER", payload: id });
    }
  } catch (error) {}
}

export function* updateQuantityCart(action: any) {
  let id = action.payload.id;
  let temp = {
    quantity: action.payload.count,
  };

  try {
    const response: AxiosResponse<any> = yield call(
      axiosInstanceAuth.patch,
      `/products/update_quantity/${id}`,
      temp
    );
    if (response) {
      let result = {
        id: action.payload.id,
        quantity: action.payload.count,
      };
      yield put({ type: "UPDATE_QUANTITY_CART", payload: result });
    }
  } catch (error) {}
}

export function* completePurchase(action: any) {
  try {
    let temp = action.payload.values;
    let $isCalledFromCart = action.payload.isCalledFromCart;
    // console.log(isCalledFromCart);

    let url = `/products/shipping_details`;

    const response: AxiosResponse<any> = yield call(
      axiosInstanceAuth.post,
      url,
      {...temp,$isCalledFromCart},
      
    );

    if (response) {
      yield put({ type: "COMPLETE_PURCHASE_SUCCESS" });
    }
  } catch (error) {}
}
export function* buyNow(action:any){
  try{
    console.log("buyNow")
    let id=action.payload.id;
    let quantity=action.payload.quantity;
    const response: AxiosResponse<any> = yield call(
      axiosInstanceAuth.patch,
      `/products/buy_now/${id}` ,
      quantity     
    );
    if(response){
      console.log('success', response)
    }
  }
  catch(error) {}
}

export function* watcher() {
  yield takeLatest("REGISTER", register);

  yield takeLatest("LOGIN", login);

  yield takeLatest("GOOGLE_LOGIN", googlelogin);

  yield takeLatest("GET_ALL_PRODUCTS", getAllProducts);

  yield takeLatest("GET_SINGLE_PRODUCT", getSingleProduct);

  yield takeLatest("ADD_PRODUCT", addProduct);

  yield takeLatest("UPDATE_PRODUCT", updateProducts);

  yield takeLatest("DELETE_PRODUCT", deleteProduct);

  yield takeLatest("ADD_ADMIN", addAdmin);

  yield takeLatest("SEARCH_PRODUCT", searchProduct);

  yield takeLatest("GET_ALL_USERS", getAllUsers);

  yield takeLatest("ADD_TO_CART", addToCart);

  yield takeLatest("GET_PRODUCTS_IN_CART", getProductsInCarts);

  yield takeLatest("DELETE_USER", deleteUser);

  yield takeLatest("DELETE_CART_ITEMS", deleteCartItem);

  yield takeLatest("UPDATE_Quantity_CART", updateQuantityCart);

  yield takeLatest("COMPLETE_PURCHASE", completePurchase);

  yield takeLatest('BUY_NOW',buyNow);
}
