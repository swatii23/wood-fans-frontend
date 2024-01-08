import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import IconButton from "../Components/Common/IconButton";
import {
  faCartShopping,
  faBolt,
  faStar,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getRandomPrice,
  abailableOffers,
  handleClickOutside,
} from "../Functions/scripts";
import InputFeild from "../Components/Common/InputFeild";
import PopUpSelector from "../Components/Common/PopUpSelector";
import DropDwonSelector from "../Components/Common/DropDwonSelector";
import ImageColumn from "../Components/Common/ImageColumn";
import ClientsReviews from "../Components/Common/ClientsReviews";
import RandomProducts from "../Components/Common/RandomProducts";
import { useEffect } from "react";
import { storeDB, getDoc, auth, doc } from "../Services/firebaseConfig";
import { useState } from "react";
import PopupMessage from "../Components/Common/PopupMessage";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartData } from "../Redux/Products/action";
import axios from "axios";
import { BASE_URI } from "../Redux/api";
const sizeArray = ["Big", "Average", "Small"];
const quantityArray = [1, 2, 3, 4];

const SingleProduct = () => {
  const { id } = useParams();
  const token = useSelector((store) => store.authReducer.token);

  const userId = auth?.currentUser?.uid;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [productData, setProductData] = useState({});
  const [image, setImage] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const productId = id;

  const handleAddToCart = (productId, token, buttonType) => {
    if (token) {
      if (buttonType === "add to cart") {
        dispatch(addToCart(productId, token));
        dispatch(fetchCartData(token));
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 1000);
      } else {
        dispatch(addToCart(productId, token));
        dispatch(fetchCartData(token));
        navigate("/cart");
      }
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const { data } = await axios.get(`${BASE_URI}/products/${productId}`);
        setProductData(data);
        setImage(data?.images);
        setMainImage(data?.images[0]);
      } catch (error) {
        console.log("Error fetching product data:", error);
      }
    };

    fetchProductData();
  }, [productId]);

  const handleImageChange = (img) => {
    setMainImage(img);
  };

  return (
    <div>
      {showPopup && <PopupMessage message={"Product added to cart!"} />}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-5 p-3 md:p-5`}>
        <div className="flex flex-col gap-5 lg:sticky top-4 w-auto h-min p-2">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex flex-row md:flex-col gap-2 flex-shrink">
              {productData?.images?.map((img, idx) => {
                return (
                  <ImageColumn
                    key={idx}
                    img={img}
                    mainImage={mainImage}
                    onClick={() => {
                      handleImageChange(img);
                    }}
                  />
                );
              })}
            </div>

            <div className="flex flex-col gap-5">
              <img src={mainImage} className="h-[80%]" />

              <div className="grid grid-cols-2 gap-4 justify-center">
                <div
                  onClick={() =>
                    handleAddToCart(productId, token, "add to cart")
                  }
                  className="hover:cursor-pointer"
                >
                  <IconButton
                    icon={faCartShopping}
                    text="Add To Cart"
                    className="bg-primary-yellow hover:border-primary-yellow hover:text-primary-yellow"
                  />
                </div>
                <div
                  onClick={() => handleAddToCart(productId, userId, "buy now")}
                  className="hover:cursor-pointer"
                >
                  <IconButton
                    icon={faBolt}
                    text="Buy Now"
                    className="bg-gray-600 hover:border-gray-600 hover:text-gray-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Details Sections */}
        <div className="mt-5 md:mt-0">
          <h1 className="font-semibold text-2xl md:text-4xl">
            {productData?.name}
          </h1>
          <div className="flex text-end items-end gap-2 mt-1">
            <div className="text-[12px] flex items-center bg-green-600 max-w-min rounded-sm text-white px-1">
              {productData?.rating}
              <FontAwesomeIcon icon={faStar} className="ml-1" />
            </div>
            <span className="text-dark-gray font-medium text-xs md:text-base">
              89 Ratings & {productData?.reviews} Reviews
            </span>
          </div>
          <div className="flex mt-5 items-center gap-2">
            <h1 className="text-xl md:text-3xl font-medium">
              &#8377; {productData?.price}
            </h1>
            <h1 className="line-through text-xs md:text-base text-dark-gray font-normal">
              &#8377; {productData?.price * 1.5}
            </h1>
            <p className="text-green-600 text-xs md:text-base">
              45% <span className="font-medium">Off</span>
            </p>
          </div>
          {/* Abailable Offers */}
          <div>
            <h1 className="mb-3 font-semibold mt-5 text-xs">
              Available offers
            </h1>
            {abailableOffers?.map((item) => {
              return (
                <div
                  className="flex place-items-start mb-2 text-xs md:text-base"
                  key={item.id}
                >
                  <FontAwesomeIcon
                    icon={faTag}
                    className="text-green-600 mr-1 text-md"
                  />
                  <p className="md:w-3/4 text-justify">
                    <span className="font-medium">{item.offer}</span>{" "}
                    {item.details}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Filters */}
          <PopUpSelector />
          <div className="grid grid-cols-2 mt-5 gap-2 text-xs sm:text-base">
            <DropDwonSelector data={sizeArray} purpose={"Select Size"} />
            <DropDwonSelector
              data={quantityArray}
              purpose={"Select Quantity"}
            />
          </div>

          <div className="mt-5 text-xs md:text-base">
            <div className="text-justify">
              <p className="font-bold text-lg pb-1">Description</p>
              {productData?.description?.short}
            </div>
            <p className="text-justify mt-5">
              {productData?.description?.long}
            </p>
          </div>
        </div>
      </div>
      <div className="p-5">
        <ClientsReviews />

        <div className="mt-10">
          <h1 className="text-5xl py-5">Look also</h1>
          <RandomProducts selected="SOFAS" />
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
