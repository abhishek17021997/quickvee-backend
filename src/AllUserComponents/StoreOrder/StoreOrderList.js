import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchStoreOrderData,
  getStoreOrderCount,
} from "../../Redux/features/StoreOrder/StoreOrderSlice";
import "../../Styles/StoreOrder.css";
import { useAuthDetails } from "./../../Common/cookiesHelper";
import { Grid } from "@mui/material";
import InputTextSearch from "../../reuseableComponents/InputTextSearch";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Pagination from "../Users/UnverifeDetails/Pagination";
import useDebounce from "../../hooks/useDebouncs";
import { SkeletonTable } from "../../reuseableComponents/SkeletonTable";
import PasswordShow from "./../../Common/passwordShow";

import { SortTableItemsHelperFun } from "../../helperFunctions/SortTableItemsHelperFun";
import sortIcon from "../../Assests/Category/SortingW.svg";
import NoDataFound from "../../reuseableComponents/NoDataFound";
const StyledTable = styled(Table)(({ theme }) => ({
  padding: 2, // Adjust padding as needed
}));
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#253338",
    color: theme.palette.common.white,
    fontFamily: "CircularSTDMedium",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    fontFamily: "CircularSTDBook !important",
  },
  [`&.${tableCellClasses.table}`]: {
    fontSize: 14,
    fontFamily: "CircularSTDBook !important",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  "& td, & th": {
    border: "none",
  },
}));
const orderType = (type) => {
  if (type === "Online Order") {
    return "Online";
  }
  if (type === "Store Order") {
    return "Offline";
  } else {
    return type;
  }
};
const StoreOrderList = (props) => {
  const dispatch = useDispatch();

  const AllStoreOrderDataState = useSelector((state) => state.StoreOrderList);
  console.log("AllStoreOrderDataState: ", AllStoreOrderDataState);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchRecord, setSearchRecord] = useState("");
  const [storeOrderTableList, setStoreOrderTableList] = useState([]);
  const debouncedValue = useDebounce(searchRecord);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const [sortOrder, setSortOrder] = useState("asc");
  const { userTypeData } = useAuthDetails();
  const { handleCoockieExpire, getUnAutherisedTokenMessage, getNetworkError } =
    PasswordShow();

  useEffect(() => {
    // if (props && props.OrderStatusData && props.OrderTypeData) {
    //   let data = {
    //     pay_status: props.OrderStatusData,
    //     order_env: props.OrderTypeData,
    //     page: currentPage,
    //     perpage: rowsPerPage,
    //     search_by: Boolean(debouncedValue.trim()) ? debouncedValue : null,
    //     ...userTypeData,
    //   };
    //   // console.log("data: ", data);
    //   if (data) {
    //     dispatch(fetchStoreOrderData(data));
    //   }
    // }
    getfetchStoreOrderData();
  }, [
    props.OrderStatusData,
    props.OrderTypeData,
    currentPage,
    debouncedValue,
    rowsPerPage,
  ]);

  const getfetchStoreOrderData = async () => {
    try {
      if (props && props.OrderStatusData && props.OrderTypeData) {
        let data = {
          pay_status: props.OrderStatusData,
          order_env: orderType(props.OrderTypeData),
          page: currentPage,
          perpage: rowsPerPage,
          search_by: Boolean(debouncedValue.trim()) ? debouncedValue : null,
          ...userTypeData,
        };
        if (data) {
          await dispatch(fetchStoreOrderData(data)).unwrap();
        }
      }
    } catch (error) {
      if (error?.status == 401 || error?.response?.status === 401) {
        getUnAutherisedTokenMessage();
        handleCoockieExpire();
      } else if (error.status == "Network Error") {
        getNetworkError();
      }
    }
  };

  // only when user searches
  useEffect(() => {
    // const data = {
    //   pay_status: props.OrderStatusData,
    //   order_env: props.OrderTypeData,
    //   search_by: Boolean(debouncedValue.trim()) ? debouncedValue : null,
    //   ...userTypeData,
    // };

    // dispatch(getStoreOrderCount(data));
    getStoreOrderCountFun();
  }, [debouncedValue, props.OrderTypeData, rowsPerPage,props.OrderStatusData]);

  const getStoreOrderCountFun = async () => {
    try {
      if (props && props.OrderStatusData && props.OrderTypeData) {
        const data = {
          pay_status: props.OrderStatusData,
          order_env: orderType(props.OrderTypeData),
          search_by: Boolean(debouncedValue.trim()) ? debouncedValue : null,
          ...userTypeData,
        };
        if (data) {
          await dispatch(getStoreOrderCount(data)).unwrap();
        }
      }
    } catch (error) {
      if (error?.status == 401 || error?.response?.status === 401) {
        getUnAutherisedTokenMessage();
        handleCoockieExpire();
      } else if (error.status == "Network Error") {
        getNetworkError();
      }
    }
  };

  // on load setting count of Verified Merchant list & on every change...
  useEffect(() => {
    if (!AllStoreOrderDataState.loading && AllStoreOrderDataState) {
      setTotalCount(AllStoreOrderDataState?.storeOrderCount);
      setStoreOrderTableList(AllStoreOrderDataState?.StoreOrderData);
    }
  }, [
    AllStoreOrderDataState?.storeOrderCount,
    AllStoreOrderDataState?.StoreOrderData,
  ]);

  const handleSearchInputChange = (value) => {
    setSearchRecord(value);
    setCurrentPage(1);
  };

  const columns = [
    "Store Order Info",
    "Date",
    "Order ID",
    "Order Status",
    "Order Status",
    "Merchant",
  ];

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const dateOptions = { year: "numeric", month: "short", day: "numeric" };
    const timeOptions = { hour: "numeric", minute: "numeric", hour12: true };
    const formattedDate = date.toLocaleDateString("en-US", dateOptions);
    const formattedTime = date.toLocaleTimeString("en-US", timeOptions);
    return `${formattedDate} ${formattedTime}`;
  };

  const sortByItemName = (type, name) => {
    const { sortedItems, newOrder } = SortTableItemsHelperFun(
      storeOrderTableList,
      type,
      name,
      sortOrder
    );
    setStoreOrderTableList(sortedItems);
    setSortOrder(newOrder);
  };

  return (
    <>
      <Grid container className="box_shadow_div">
        <Grid item xs={12}>
          <Grid container sx={{ padding: 2.5 }}>
            <Grid item xs={12}>
              <InputTextSearch
                className=""
                type="text"
                value={searchRecord}
                handleChange={handleSearchInputChange}
                placeholder="Search..."
                autoComplete="off"
              />
            </Grid>
          </Grid>

          <Grid container sx={{ padding: 2.5 }}>
            <Grid item xs={12}>
              <Pagination
                currentPage={currentPage}
                totalItems={totalCount}
                itemsPerPage={rowsPerPage}
                onPageChange={paginate}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                setCurrentPage={setCurrentPage}
                showEntries={true}
                data={storeOrderTableList}
              />
            </Grid>
          </Grid>

          <Grid container>
            {AllStoreOrderDataState.loading ? (
              <>
                <SkeletonTable columns={columns} />
              </>
            ) : (
              <>
                {AllStoreOrderDataState.StoreOrderData &&
                storeOrderTableList?.length >= 1 &&
                Array.isArray(storeOrderTableList) ? (
                  <TableContainer>
                    <StyledTable
                      sx={{ minWidth: 500 }}
                      aria-label="customized table"
                    >
                      <TableHead>
                        <StyledTableCell>
                          <button
                            className="flex items-center"
                            onClick={() => sortByItemName("str", "cname")}
                          >
                            <p>Store Order Info</p>
                            <img src={sortIcon} alt="" className="pl-1" />
                          </button>
                        </StyledTableCell>
                        <StyledTableCell>
                          <button
                            className="flex items-center"
                            onClick={() => sortByItemName("date", "date_time")}
                          >
                            <p>Date</p>
                            <img src={sortIcon} alt="" className="pl-1" />
                          </button>
                        </StyledTableCell>
                        <StyledTableCell>
                          <button
                            className="flex items-center"
                            onClick={() => sortByItemName("str", "order_id")}
                          >
                            <p>Order ID</p>
                            <img src={sortIcon} alt="" className="pl-1" />
                          </button>
                        </StyledTableCell>
                        <StyledTableCell>
                          <button
                            className="flex items-center"
                            onClick={() =>
                              sortByItemName("str", "order_status")
                            }
                          >
                            <p>Order Status</p>
                            <img src={sortIcon} alt="" className="pl-1" />
                          </button>
                        </StyledTableCell>
                        <StyledTableCell>
                          <button
                            className="flex items-center"
                            onClick={() => sortByItemName("str", "failResult")}
                          >
                            <p>Fail Result</p>
                            <img src={sortIcon} alt="" className="pl-1" />
                          </button>
                        </StyledTableCell>
                        <StyledTableCell>
                          <button
                            className="flex items-center"
                            onClick={() =>
                              sortByItemName("str", "merchant_name")
                            }
                          >
                            <p>Merchant</p>
                            <img src={sortIcon} alt="" className="pl-1" />
                          </button>
                        </StyledTableCell>
                      </TableHead>
                      <TableBody>
                        {/* {console.log(
                          "AllStoreOrderDataState.StoreOrderData: ",
                          AllStoreOrderDataState?.StoreOrderData
                        )} */}
                        {storeOrderTableList.map((StoreData, index) => (
                          <StyledTableRow key={StoreData.id}>
                            {StoreData.cname ||
                            StoreData.email ||
                            StoreData.delivery_phn ? (
                              <StyledTableCell>
                                <div className="flex">
                                  <div className="text-[#000000] order_method capitalize">
                                    {StoreData?.cname?.length < 18
                                      ? StoreData.cname
                                      : StoreData.cname.slice(0, 18) + `...` ||
                                        ""}
                                  </div>
                                </div>
                                <div className="text-[#818181] lowercase">
                                  {StoreData.email || ""}
                                </div>
                                <div className="text-[#818181]">
                                  {StoreData.delivery_phn || ""}
                                </div>
                              </StyledTableCell>
                            ) : (
                              <StyledTableCell>-</StyledTableCell>
                            )}
                            {/* <StyledTableCell>
                                <div className="flex">
                                  <div className="text-[#000000] order_method capitalize">
                                    {StoreData.cname.length < 18
                                      ? StoreData.cname
                                      : StoreData.cname.slice(0, 18) + `...` ||
                                        ""}
                                  </div>
                                </div>
                                <div className="text-[#818181] lowercase">
                                  {StoreData.email || ""}
                                </div>
                                <div className="text-[#818181]">
                                  {StoreData.delivery_phn || ""}
                                </div>
                              </StyledTableCell> */}
                            <StyledTableCell>
                              <div className="text-[#000000] order_method capitalize">
                                {formatDateTime(StoreData.date_time)}
                              </div>
                            </StyledTableCell>
                            <StyledTableCell>
                              {/* <Link  to={`/store-reporting/order-summary/${StoreData.merchant_id}/${StoreData.order_id}`} target="_blank" > */}
                              <div className="text-[#000000] capitalize">
                                {StoreData.order_id}
                              </div>
                              {/* </Link> */}
                            </StyledTableCell>
                            <StyledTableCell>
                              <div className="text-[#000000] order_method capitalize">
                                {StoreData.order_status}
                              </div>
                            </StyledTableCell>
                            <StyledTableCell>
                              <div className="text-[#000000] order_method capitalize">
                                {StoreData.failResult}
                              </div>
                            </StyledTableCell>
                            <StyledTableCell>
                              <div className="text-[#000000] order_method capitalize">
                                {StoreData.merchant_name}
                              </div>
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </StyledTable>
                  </TableContainer>
                ) : (
                 <NoDataFound table={true} />
                )}
              </>
            )}
          </Grid>
          <Grid container sx={{ padding: 2.5 }}>
            <Grid item xs={12}>
              <Pagination
                currentPage={currentPage}
                totalItems={totalCount}
                itemsPerPage={rowsPerPage}
                onPageChange={paginate}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                setCurrentPage={setCurrentPage}
                showEntries={false}
                data={storeOrderTableList}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default StoreOrderList;
