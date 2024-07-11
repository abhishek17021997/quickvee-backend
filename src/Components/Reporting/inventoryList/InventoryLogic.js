import React, { useEffect, useState, useRef } from "react";
import {
  INVENTORY_LIST,
  BASE_URL,
  LIST_ALL_CATEGORIES,
} from "../../../Constants/Config";
import { debounce } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { useAuthDetails } from "../../../Common/cookiesHelper";
import axios from "axios";
import PasswordShow from "../../../Common/passwordShow";
import { getAuthInvalidMessage } from "../../../Redux/features/Authentication/loginSlice";
import { SortTableItemsHelperFun } from "../../../helperFunctions/SortTableItemsHelperFun";
export default function InventoryLogic() {
  const dispatch = useDispatch();
  const { LoginGetDashBoardRecordJson, LoginAllStore, userTypeData } =
    useAuthDetails();
  const { handleCoockieExpire, getUnAutherisedTokenMessage, getNetworkError } =
    PasswordShow();
  const [inventory, setInventory] = useState("");
  const [category, setCategory] = useState([]);
  const [searchProduct, setsearchProduct] = useState([]); // invenotry list display
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectCategoryId, setSelectCategoryId] = useState("");
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [listingType, setListingType] = useState(1);
  const [message, setMessage] = useState(""); // message display

  const [laodMoreData, setLoadMoreData] = useState(false); //load button hide and show

  const [loader, setLoader] = useState(false);

  // ======================
  const handleSearchProduct = useRef(
    debounce(async (value) => {
      try {
        const { token, ...newData } = userTypeData;
        let packet = {
          ...newData,
          name: value,
          merchant_id,
          offset: 0,
          limit,
          format: "json",
          listing_type: listingType,
        };
        setLoader(true);
        let response = await axios.post(BASE_URL + INVENTORY_LIST, packet, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userTypeData?.token}`,
          },
        });
        setLoadMoreData(false);
        if (response?.data.length > 0) {
          setLoader(false);
          setsearchProduct(response?.data);
        } else {
          setLoader(false);
          setsearchProduct([]);
          setMessage("No record found");
        }
      } catch (error) {
        if (error.status == 401 || error.response.status === 401) {
          getUnAutherisedTokenMessage();
          handleCoockieExpire();
        } else if (error.status == "Network Error") {
          getNetworkError();
        }
      }
    }, 500)
  );
  // ======================
  const handleChangeInventory = (e) => {
    setInventory(e.target.value);
    handleSearchProduct.current(e.target.value);
  };
  useEffect(() => {
    getAllCategoryList();
    handleOptionClick();
  }, []);

  let merchant_id = LoginGetDashBoardRecordJson?.data?.merchant_id;
  // search button click function ----
  // const handleBlur = async (name) => {
  //   try {
  //     const { token, ...newData } = userTypeData;
  //     setLoader(true);
  //     let packet = {
  //       ...newData,
  //       name: inventory,
  //       merchant_id,
  //       offset: 0,
  //       limit,
  //       format: "json",
  //       listing_type: listingType,
  //     };
  //     if (name == "product") {
  //       let response = await axios.post(BASE_URL + INVENTORY_LIST, packet, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${userTypeData?.token}`,
  //         },
  //       });
  //       setLoadMoreData(false);
  //       if (response?.data.length > 0) {
  //         setLoader(false);
  //         setsearchProduct(response?.data);
  //       } else {
  //         setLoader(false);
  //         setsearchProduct([]);
  //         setMessage("No record found");
  //       }
  //     }
  //   } catch (error) {
  //     getUnAutherisedTokenMessage();
  //     handleCoockieExpire();
  //   }
  // };
  // search button click function ----

  const getAllCategoryList = async () => {
    try {
      const { token, ...newData } = userTypeData;
      const packet = { merchant_id, ...newData };
      let response = await axios.post(BASE_URL + LIST_ALL_CATEGORIES, packet, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userTypeData?.token}`,
        },
      });
      if (response) {
        setCategory(response?.data?.result);
        //   setSelectedCategory(response?.data?.result[0].title);
        //   setSelectCategoryId(response?.data?.result[0].id);
      }
    } catch (error) {
      if (error.status == 401 || error.response.status === 401) {
        getUnAutherisedTokenMessage();
        handleCoockieExpire();
      } else if (error.status == "Network Error") {
        getNetworkError();
      }
    }
  };
  // category click button function-----------------------
  const handleOptionClick = async (data) => {
    try {
      setLoader(true);
      setSelectedCategory(
        data == "All" || data == undefined ? "All" : data?.title
      );
      let id = data == "All" || data == undefined ? "all" : data?.id;
      const packet = {
        // id: id,
        format: "json",
        cat_id: id,
        offset,
        limit,
        merchant_id,
        listing_type: listingType,
        ...userTypeData,
      };
      setSelectCategoryId(id);
      const { token, ...newData } = packet;
      let response = await axios.post(BASE_URL + INVENTORY_LIST, newData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response?.data.length) {
        setLoader(false);
        setsearchProduct(response?.data);
        if (id == "all" && response?.data.length >= 10) {
          setLoadMoreData(true);
          setOffset(10);
        } else {
          setOffset(0);
          setLoadMoreData(false);
        }
      } else {
        setLoader(false);
        setMessage("No record found");
        setsearchProduct([]);
      }
    } catch (error) {
      if (error.status == 401 || error.response.status === 401) {
        getUnAutherisedTokenMessage();
        handleCoockieExpire();
      } else if (error.status == "Network Error") {
        getNetworkError();
      }
    }
  };
  //   category click button function---------------------
  // button click when loadmore display
  const handleLoadMore = async () => {
    try {
      const packet = {
        // id: selectCategoryId,
        cat_id: selectCategoryId,
        offset,
        limit,
        format: "json",
        merchant_id,
        listing_type: listingType,
        ...userTypeData,
      };
      const { token, ...newData } = packet;
      setLoader(true);
      let response = await axios.post(BASE_URL + INVENTORY_LIST, newData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.data.length) {
        setLoader(false);
        //   console.log(response?.data);
        setsearchProduct([...searchProduct, ...response?.data]);
        if (selectCategoryId == "all" && response?.data.length >= 10) {
          setLoadMoreData(true);
          setOffset(offset + 10);
        } else {
          setOffset(0);
          setLoadMoreData(false);
        }
      } else {
        setLoader(false);
        setLoadMoreData(false);
        setMessage("No record found");
        setsearchProduct([]);
      }
    } catch (error) {
      if (error.status == 401 || error.response.status === 401) {
        getUnAutherisedTokenMessage();
        handleCoockieExpire();
      } else if (error.status == "Network Error") {
        getNetworkError();
      }
    }
  };
  const [sortOrder, setSortOrder] = useState("asc");
  const sortByItemName = (type, name) => {
    const { sortedItems, newOrder } = SortTableItemsHelperFun(
      searchProduct,
      type,
      name,
      sortOrder
    );
    console.log(sortedItems);
    setsearchProduct(sortedItems);
    setSortOrder(newOrder);
  };
  // button click when loadmore display
  return {
    handleChangeInventory,
    inventory,
    // handleBlur,
    category,
    handleOptionClick,
    selectedCategory,
    message,
    searchProduct,
    handleLoadMore,
    laodMoreData,
    loader,
    sortByItemName,
  };
}
