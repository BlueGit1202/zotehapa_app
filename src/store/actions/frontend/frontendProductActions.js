import axios from "axios";
import appService from "../../../../services/appService";
import { resetPassword } from "../authActions";

export const fetchProduct = (slug, payload = {}) => async dispatch => {
  try {
    dispatch({ type: "PRODUCT_REQUEST" });
    let url = `frontend/product/show/${slug}`;
    if (payload) url += appService.requestHandler(payload);
    const res = await axios.get(url);
    console.log(res.data.data);
    dispatch({
      type: "FETCH_PRODUCT_SUCCESS",
      payload: {
        product: res.data.data,
        images: res.data.data.images,
        reviews: res.data.data.reviews,
        videos: res.data.data.videos,
        seo: res.data.data.seo,
      },
    });
    return res.data;
  } catch (error) {
    dispatch({ type: "PRODUCT_FAILURE", payload: error.message });
    throw error;
  }
};

export const fetchPopularProducts = (payload = {}) => async dispatch => {
  try {
    dispatch({ type: "PRODUCT_REQUEST" });
    let url = "frontend/product/popular-products";
    if (payload) url += appService.requestHandler(payload);
    const res = await axios.get(url);
    dispatch({
      type: "FETCH_POPULAR_PRODUCTS_SUCCESS",
      payload: {
        products: res.data.data,
        page: res.data.meta,
        pagination: res.data,
      },
    });
    return res.data;
  } catch (error) {
    dispatch({ type: "PRODUCT_FAILURE", payload: error.message });
    throw error;
  }
};

export const fetchFlashSaleProducts = payload => async dispatch => {
  try {
    dispatch({ type: "FETCH_FLASH_SALE_PRODUCTS_REQUEST" });

    let url = "frontend/product/flash-sale-products";
    if (payload) {
      url = url + appService.requestHandler(payload);
    }

    const response = await axios.get(url);

    dispatch({
      type: "FETCH_FLASH_SALE_PRODUCTS_SUCCESS",
      payload: response.data.data,
    });

    return response;
  } catch (error) {
    dispatch({
      type: "FETCH_FLASH_SALE_PRODUCTS_FAILURE",
      payload: error.message,
    });
    throw error;
  }
};

export const fetchOfferProducts = payload => async dispatch => {
  try {
    dispatch({ type: "FETCH_OFFER_PRODUCTS_REQUEST" });

    let url = "frontend/product/offer-products";
    if (payload) {
      url = url + appService.requestHandler(payload);
    }

    const response = await axios.get(url);

    dispatch({
      type: "FETCH_OFFER_PRODUCTS_SUCCESS",
      payload: {
        data: response.data.data,
        meta: response.data.meta,
        links: response.data.links,
      },
    });

    return response;
  } catch (error) {
    dispatch({
      type: "FETCH_OFFER_PRODUCTS_FAILURE",
      payload: error.message,
    });
    throw error;
  }
};

export const fetchCategoryWiseProducts = payload => async dispatch => {
  try {
    dispatch({ type: "FETCH_CATEGORY_WISE_PRODUCTS_REQUEST" });

    const response = await axios.post(
      "frontend/product/category-wise-products",
      payload
    );
    console.log("fetched category_wise_products", response.data.data);

    dispatch({
      type: "FETCH_CATEGORY_WISE_PRODUCTS_SUCCESS",
      payload: {
        products: response.data.data.products,
        brands: response.data.data.brands,
        variations: response.data.data.variations,
        max_price: response.data.data.max_price,
        meta: response.data.meta,
        links: response.data.links,
      },
    });

    return response.data;
  } catch (error) {
    dispatch({
      type: "FETCH_CATEGORY_WISE_PRODUCTS_FAILURE",
      payload: error.message,
    });
    throw error;
  }
};

export const fetchAncestorsAndSelfCategories = categoryId => async dispatch => {
  try {
    dispatch({ type: "FETCH_ANCESTORS_AND_SELF_REQUEST" });

    const response = await axios.get(
      `frontend/product-category/ancestors-and-self/${categoryId}`
    );
    console.log("fectched data", response.data.data);
    dispatch({
      type: "FETCH_ANCESTORS_AND_SELF_SUCCESS",
      payload: response.data.data,
    });

    return response.data;
  } catch (error) {
    dispatch({
      type: "FETCH_ANCESTORS_AND_SELF_FAILURE",
      payload: error.message,
    });
    throw error;
  }
};

export const fetchProductDetails = (
  slug,
  reviewLimit = 3
) => async dispatch => {
  try {
    const url = `frontend/product/show/${slug}?review_limit=${reviewLimit}`;
    const response = await axios.get(url);

    dispatch({
      type: "SET_PRODUCT_DETAILS",
      payload: response.data,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error;
  }
};

export const fetchRelatedProducts = (slug, rand = 8) => async dispatch => {
  try {
    const url = `frontend/product/related-products/${slug}?rand=${rand}`;
    const response = await axios.get(url);

    dispatch({
      type: "SET_RELATED_PRODUCTS",
      payload: response.data,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching related products:", error);
    throw error;
  }
};

export const loadMoreReviews = (slug, reviewLimit) => async (
  dispatch,
  getState
) => {
  try {
    const url = `frontend/product/show/${slug}?review_limit=${reviewLimit}`;
    const response = await axios.get(url);

    const currentReviews = getState().frontendProduct.showReviews;
    const newReviews = response.data.data.reviews || [];

    dispatch({
      type: "UPDATE_PRODUCT_REVIEWS",
      payload: [...currentReviews, ...newReviews],
    });

    return response.data;
  } catch (error) {
    console.error("Error loading more reviews:", error);
    throw error;
  }
};

export const resetProductDetails = () => dispatch => {
  dispatch({ type: "RESET_PRODUCT_DETAILS" });
};
