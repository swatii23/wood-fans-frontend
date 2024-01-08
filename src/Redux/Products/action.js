import axios from 'axios';
import { storeDB, query, collection, getDoc, getDocs, doc, updateDoc, arrayUnion, arrayRemove, writeBatch } from '../../Services/firebaseConfig'
import { DATA_GET_REQUEST, DATA_GET_SUCCESS, DATA_GET_FAILURE, CART_GET_REQUEST, CART_GET_SUCCESS, CART_GET_FAILURE, WISHLIST_GET_REQUEST, WISHLIST_GET_SUCCESS, WISHLIST_GET_FAILURE } from './actionTypes';
import { BASE_URI } from '../api'

export const getDataRequest = () => ({ type: DATA_GET_REQUEST });
export const getDataSuccess = (data) => ({ type: DATA_GET_SUCCESS, payload: data });
export const getDataFailure = (error) => ({ type: DATA_GET_FAILURE, payload: error });


export const fetchData = () => async (dispatch) => {
    dispatch(getDataRequest());
    try {
        const res = await axios.get(`${BASE_URI}/products`);

        dispatch(getDataSuccess(res.data));
    } catch (error) {
        dispatch(getDataFailure(error));
    }
};



// Do not use in cart page.
export const addToCart = (productId, token) => async (dispatch) => {
    try {
        console.log(token, productId)
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        const { data } = await axios.post(`${BASE_URI}/products/cart/${productId}`, {}, config)
        console.log(data)
        dispatch(fetchCartData());
    } catch (error) {
        console.log(error);
    }
};


export const getCartDataRequest = () => ({ type: CART_GET_REQUEST });
export const getCartDataSuccess = (data) => ({ type: CART_GET_SUCCESS, payload: data });
export const getCartDataFailure = (error) => ({ type: CART_GET_FAILURE, payload: error });

export const fetchCartData = (token) => async (dispatch) => {
    dispatch(getCartDataRequest());

    try {
        const config = {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
        const res = await axios.get(`${BASE_URI}/products/cart`, config); // Fix here
        console.log(res)
        dispatch(getCartDataSuccess(res.data));
    } catch (error) {
        console.log(error);
        dispatch(getCartDataFailure(error));
    }
};




// Do not use in cart page.
export const addToWishlist = (productId, userId) => async (dispatch) => {
    try {
        const userRef = doc(storeDB, 'users', userId);
        await updateDoc(userRef, {
            wishlist: arrayUnion(productId)
        });
    } catch (error) {
        console.log(error);
    }
};

export const removeFromWishlist = (productId, userId, moveToCart) => async (dispatch) => {
    try {
        const userRef = doc(storeDB, 'users', userId);
        const batch = writeBatch(storeDB);

        // Remove from wishlist
        batch.update(userRef, {
            wishlist: arrayRemove(productId)
        });

        // Conditionally add to cart
        if (moveToCart) {
            batch.update(userRef, {
                cart: arrayUnion({ productId, quantity: 1 })
            });
        }

        await batch.commit();
        // Optionally, dispatch actions to update the state in your Redux store
        dispatch(fetchWishlistData(userId));
        if (moveToCart) {
            dispatch(fetchCartData(userId));
        }
    } catch (error) {
        console.log(error);
    }
};
export const adjustQuantityInCart = (productId, token, adjustment) => async (dispatch) => {
    try {
      const config = {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
      const { data } = await axios.get(`${BASE_URI}/products/cart`, config);
      const cart = data.map(item => {
        if (item.productId === productId) {
          if (adjustment < 0 && item.quantity === 1) {
            return item;
          }
          return { ...item, quantity: Math.max(0, item.quantity + adjustment) };
        }
        return item;
      });
      console.log(cart)
    //   await axios.put(`${BASE_URI}/products/cart`, { cart }, config); // Update the cart on the server
      dispatch(fetchCartData(token));
    } catch (error) {
      console.log(error);
    }
  };
  

export const removeFromCart = (productId, token, wishlist) => async (dispatch) => {
    try {
        console.log(token)
        const config = {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
        const res = await axios.delete(`${BASE_URI}/products/cart/${productId}`, config); // Fix here
        console.log(res)

        dispatch(fetchCartData(token));
    } catch (error) {
        console.log(error);
    }
};



export const getWishlistDataRequest = () => ({ type: WISHLIST_GET_REQUEST });
export const getWishlistDataSuccess = (data) => ({ type: WISHLIST_GET_SUCCESS, payload: data });
export const getWishlistDataFailure = (error) => ({ type: WISHLIST_GET_FAILURE, payload: error });

export const fetchWishlistData = (userId) => async (dispatch) => {
    dispatch(getWishlistDataRequest());
    try {
        const userRef = doc(storeDB, 'users', userId);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        const wishlistData = userData.wishlist;
        dispatch(getWishlistDataSuccess(wishlistData));
    } catch (error) {
        console.log(error);
        dispatch(getWishlistDataFailure(error));
    }
};


export const postData = (dataArray) => async (dispatch) => {
    try {
        const batch = writeBatch(storeDB);
        dataArray.forEach((data) => {
            const docRef = doc(collection(storeDB, "products"));
            batch.set(docRef, data);
        });
        await batch.commit();
    } catch (error) {
        console.log(error);
    }
};
