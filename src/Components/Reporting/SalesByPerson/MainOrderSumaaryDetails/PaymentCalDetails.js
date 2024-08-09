// ----------------------------------order Summery start here ---------------------------------
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../../../Styles/summery.css";
import imageLogo from "../../../../Assests/NewImage/imageLogo.svg";
import imageAddress from "../../../../Assests/NewImage/Address.svg";
import imagePhone from "../../../../Assests/NewImage/Phone.svg";
import { useLocation } from "react-router-dom";
import Miles from "../../../../Assests/NewImage/Miles.svg";
import Phone1 from "../../../../Assests/NewImage/Phone1.svg";
import Miles1 from "../../../../Assests/NewImage/Miles1.svg";
import Map1 from "../../../../Assests/NewImage/Map.svg";
import { format } from "date-fns";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { FetchOrderSummeryDetails } from "../../../../Redux/features/orderSummeryHistory/orderSummerySlice";
import OrderSummeryBanner1 from "../../../../Assests/NewImage/OrderSummeryBanner1.png";
import OrderSummeryBanner2 from "../../../../Assests/NewImage/OrderSummeryBanner2.png";
import OrderSummeryBanner3 from "../../../../Assests/NewImage/OrderSummeryBanner3.png";
import OrderSummeryBannerMobile1 from "../../../../Assests/NewImage/OrderSummeryBannerMobile1.jpg";
import OrderSummeryBannerMobile2 from "../../../../Assests/NewImage/OrderSummeryBannerMobile2.jpg";
import OrderSummeryBannerMobile3 from "../../../../Assests/NewImage/OrderSummeryBannerMobile3.jpg";
import ProductDefaultImage from "../../../../Assests/Products/productDefaultIMage.png";
import { Grid, useMediaQuery } from "@mui/material";
import Cookies from "js-cookie";
import Loaderfile from "../../../../Assests/Loader/loaderfile";
import OrderSummery_pickup_delivery_status from "./OrderSummery_pickup_delivery_status";
import { useParams } from "react-router-dom";
import Footer from "../../../../Components/Footer/footer";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));




export default function PaymentCalDetails() {





  const Navigate = useNavigate();
  const OrderSummeryDetails = useSelector((state) => state.orderSummeryList);
  const [orderSummeryloader, setOrderSummeryloader] = useState(true);
  if (OrderSummeryDetails?.loading == true && orderSummeryloader == true) {
    setOrderSummeryloader(false);
  }
  const [orderSummeryData, setOrderSummeryData] = useState({});
  const [dateFormat, setDateFormat] = useState({});
  const [dateOfBirth, setBateOfBirth] = useState("");
  const [couponDetails, setCouponDetails] = useState("");
  const [productInfo, setProductInfo] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const dispatch = useDispatch();
  const [refund, setRefund] = useState([]);
  const [nonrefund, setNonrefund] = useState([]);
  const [imageLoading, setImageLoading] = useState(true);
  const location = useLocation();



  const isMobile = useMediaQuery("(max-width:480px)");
  const { merchant_id, order_id } = useParams();

  // dynamic required-----------------------------
  const data = {
    merchant_id: merchant_id,
    order_id: order_id,

  };


  // dynamic requierd---------------------
  useEffect(() => {
    if (data) {
      dispatch(FetchOrderSummeryDetails(data));
    }
  }, [data.merchant_id, data.order_id]);
  useEffect(() => {
    if (
      !OrderSummeryDetails.loading &&
      OrderSummeryDetails.orderSummeryDetails
    ) {
      setOrderSummeryData(OrderSummeryDetails.orderSummeryDetails);
      let refund = orderSummeryData.cart_data?.filter((i) => {
        return i.is_refunded === "1" || i.is_refunded === "2";
      });
      let non_refund = orderSummeryData.cart_data?.filter((i) => {
        return i.is_refunded === "0" || i.is_refunded === "2";
      });

      setRefund(refund);
      setNonrefund(non_refund);
      if (OrderSummeryDetails.orderSummeryDetails.id_card_detail) {
        const originalDateString =
          OrderSummeryDetails.orderSummeryDetails.id_card_detail.i_card_ex_date;
        const DateOfBirth =
          OrderSummeryDetails.orderSummeryDetails.id_card_detail.i_card_dob;

        if (originalDateString !== "0000-00-00") {
          const originalDate = new Date(originalDateString);

          const formattedDate = format(originalDate, "yyyy  MMM dd");

          setDateFormat(formattedDate);
          DateOfBirthAccessor(DateOfBirth);
        } else {
          setDateFormat("");
          DateOfBirthAccessor("");
        }

        CouponData(
          OrderSummeryDetails.orderSummeryDetails.order_detail.coupon_code
        );
        setPaymentMethod(
          OrderSummeryDetails.orderSummeryDetails.order_detail.payment_id
        );
      }
    }
  }, [
    OrderSummeryDetails,
    OrderSummeryDetails.loading,
    orderSummeryData,
    OrderSummeryDetails.orderSummeryDetails,
  ]);
  function DateOfBirthAccessor(method) {

    if (method !== "") {
      const originalDate = new Date(method);
      const formattedDate = format(originalDate, "dd MMM yyyy");
      setBateOfBirth(formattedDate);
    }
  }
  // -------------------------------------------------
  function CouponData(data) {
    let cuopondetails = JSON.parse(data);
    console.log(cuopondetails);
    setCouponDetails(cuopondetails);
  }
  useEffect(() => {

  }, []);

  const [testData, setTestData] = useState(false);
  const handleClick = () => {
    setTestData(true);
  };
  const getOtherTaxes = (taxObj) => {
    return Object.keys(taxObj).map((key) => (
      <p key={key}>
        {key}
        <span>${parseFloat(taxObj[key]).toFixed(2)}</span>
      </p>
    ));
  };

  function removeHtmlTags(str) {
    return str.replace(/<[^>]*>/g, "");
  }
  const formatDate = (inputDate) => {
    const parsedTime = new Date(inputDate);
    if (isNaN(parsedTime.getTime())) {
      return <div>Error: Invalid time format</div>;
    }
    const day = parsedTime.getDate();
    const month = parsedTime.toLocaleString("default", { month: "short" });
    const year = parsedTime.getFullYear();
    let hours = parsedTime.getHours();
    const minutes = parsedTime.getMinutes();
    const seconds = parsedTime.getSeconds();
    const meridiem = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedTime = `${day} ${month} ${year} ${hours}:${minutes}:${seconds} ${meridiem}`;
    return formattedTime;
  };
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  // -------------------------------
  const localUserData = Cookies.get("userLoginData");
  const currentPath = window.location.pathname.replace(/\/$/, "");

  const formatCardNumber = (cardNum) => {
    const res = cardNum.slice(-4);
    const temp = `xxxxxxxxx${res}`;
    return temp;
  };

  const setPositionLoader = {
    position: "absolute",
    top: "45%",
    left: "45%",
    transform: "translate(-45%, -45%)",
  };
  return (
    <>

      {OrderSummeryDetails?.loading ? (
        <div style={setPositionLoader}>
          <div className="loaderarea">
            <Loaderfile />
          </div>
        </div>
      ) : (
        <>
          <div className="headerSummery">

          </div>

          <div className="mainSection">
            <div className="MidMainSection">
              <div className="LeftMidMainSection">
                <div className="left-font-header">
                  <h1 className="orderSummery_head">Order Status</h1>
                  <div className="container">
                    <div className="row justify-content-center ">
                      <div className="col-12 order-status-svg">
                        <OrderSummery_pickup_delivery_status
                          orderSummeryData={orderSummeryData}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="deliverySection">
                  {nonrefund && nonrefund.length > 0 && (
                    <>
                      <h1 className="orderSummery_head">
                        {orderSummeryData &&
                          orderSummeryData.order_detail &&
                          orderSummeryData.order_detail.order_method.toLowerCase() ===
                          "pickup"
                          ? "Pickup"
                          : "Delivery"}
                        {orderSummeryData.future_order_data &&
                          orderSummeryData.future_order_data !== "NOW" ? (
                          <>
                            <div
                              style={{ marginTop: "0px" }}
                              className="OrderSummeryItemDiv"
                            >
                              <p>
                                Future Order -{" "}
                                {formatDate(orderSummeryData.future_order_data)}
                              </p>
                            </div>
                          </>
                        ) : null}
                      </h1>
                      <div className="OrderSummeryProductArea">
                        {nonrefund?.length
                          ? nonrefund?.map((result) => {
                            return (
                              <div
                                className="OrderSummeryProductDiv"
                                key={result?.line_item_id}
                              >
                                <div className="OrderSummeryProductR">
                                  <div className="OrderSummeryProductL">
                                    <img
                                      onError={(e) => {
                                        e.target.src = ProductDefaultImage;
                                      }}
                                      alt=""
                                      src={
                                        result?.img
                                          ? result.img.split(",")[0]
                                          : ProductDefaultImage
                                      }
                                      className="deliveryImageSize"
                                      onLoad={() => setImageLoading(false)}
                                    ></img>
                                  </div>
                                  <div className="OrderSummeryProductRTop">
                                    <h4>{result?.name}</h4>
                                  </div>
                                  <div className="OrderSummeryProductRBottom">
                                    <div className="OrderSummeryProductRBottomL">
                                      <span>
                                        $
                                        {parseFloat(result?.price).toFixed(2)}
                                      </span>
                                    </div>
                                    <div className="OrderSummeryProductRBottomM">
                                      {result?.is_refunded === "1"
                                        ? `X${result?.refund_qty}`
                                        : `X${result?.qty}`}
                                    </div>
                                    <div className="OrderSummeryProductRBottomR">
                                      <span>
                                        $
                                        {result?.is_refunded === "1"
                                          ? parseFloat(
                                            result?.refund_qty *
                                            result?.price
                                          ).toFixed(2)
                                          : parseFloat(
                                            result?.qty * result?.price
                                          ).toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                          : ""}
                      </div>
                    </>
                  )}
                  {refund && refund.length > 0 && (
                    <>
                      <div className="refund-orderSummeryPage">
                        <h5 style={{ margin: "0px" }}>Refunded Products</h5>
                        <span style={{ fontSize: "14px" }}>
                          (Amount will be refunded within 48 hours)
                        </span>
                      </div>
                      <div className="OrderSummeryProductArea">
                        {refund?.length
                          ? refund?.map((result) => {
                            return (
                              <div
                                className="OrderSummeryProductDiv"
                                key={result?.line_item_id}
                              >
                                <div className="OrderSummeryProductR">
                                  <div className="OrderSummeryProductL">
                                    <img
                                      alt=""
                                      onError={(e) => {
                                        e.target.src = ProductDefaultImage;
                                      }}
                                      src={
                                        result?.img
                                          ? result.img.split(",")[0]
                                          : ProductDefaultImage
                                      }
                                      className="deliveryImageSize"
                                    ></img>
                                  </div>
                                  <div className="OrderSummeryProductRTop">
                                    <h4>{result?.name}</h4>
                                  </div>
                                  <div className="OrderSummeryProductRBottom">
                                    <div className="OrderSummeryProductRBottomL">
                                      <span>
                                        $
                                        {parseFloat(result?.price).toFixed(2)}
                                      </span>
                                    </div>
                                    <div className="OrderSummeryProductRBottomM">
                                      {/* {result?.is_refunded === '1'
                                          ? `X${result?.refund_qty}`
                                          : `X${result?.qty}`} */}
                                      {`X${result?.refund_qty}`}
                                    </div>
                                    <div className="OrderSummeryProductRBottomR">
                                      <span>
                                        $
                                        {/* {result?.is_refunded === '1'
                                            ? parseFloat(
                                                result?.refund_qty *
                                                  result?.price,
                                              ).toFixed(2)
                                            : parseFloat(
                                                result?.qty * result?.price,
                                              ).toFixed(2)} */}
                                        {parseFloat(
                                          result?.refund_qty * result?.price
                                        ).toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                {/* <div className="OrderSummeryProductRBottomM">
                                    {result?.is_refunded === '1'
                                      ? `X${result?.refund_qty}`
                                      : `X${result?.qty}`}
                                  </div>
                                  <div className="OrderSummeryProductRBottomR">
                                    <span>
                                      $
                                      {result?.is_refunded === '1'
                                        ? parseFloat(
                                            result?.refund_qty * result?.price,
                                          ).toFixed(2)
                                        : parseFloat(
                                            result?.qty * result?.price,
                                          ).toFixed(2)}
                                    </span>
                                  </div> */}
                              </div>
                            );
                          })
                          : ""}
                      </div>
                    </>
                  )}
                  <div className="OrderSummeryItemArea">
                    <h1 className="orderSummery_head">
                      Order Summary
                      <span>
                        (
                        {orderSummeryData &&
                          orderSummeryData.order_detail &&
                          orderSummeryData.cart_data.length}{" "}
                        Items)
                      </span>
                    </h1>
                    <div className="OrderSummeryItemDiv">
                      <p>
                        Subtotal
                        <span>
                          $
                          {orderSummeryData &&
                            orderSummeryData.order_detail &&
                            parseFloat(
                              orderSummeryData.order_detail.subtotal
                            ).toFixed(2)}
                        </span>
                      </p>
                      {orderSummeryData?.order_detail?.del_fee ||
                        parseFloat(orderSummeryData?.order_detail?.del_fee) >
                        0 ? (
                        " "
                      ) : (
                        <p>
                          Delivery Fee
                          <span>
                            $
                            {parseFloat(
                              orderSummeryData &&
                              orderSummeryData.order_detail &&
                              orderSummeryData.order_detail.del_fee
                            ).toFixed(2)}
                          </span>
                        </p>
                      )}orderSummeryData?.order_detail.cash_discounting
                      {couponDetails.coupon_code !== "" &&
                        !!couponDetails.coupon_code_amt ? (
                        <p>
                          Coupon ({couponDetails.coupon_code})
                          <span>
                            $
                            {parseFloat(couponDetails.coupon_code_amt).toFixed(
                              2
                            )}
                          </span>
                        </p>
                      ) : (
                        ""
                      )}
                      {orderSummeryData &&
                        orderSummeryData.order_detail &&
                        orderSummeryData.order_detail.con_fee &&
                        parseFloat(orderSummeryData.order_detail.con_fee) >
                        0 && (
                          <p>
                            Convenience Fee
                            <span>
                              $
                              {parseFloat(
                                orderSummeryData.order_detail.con_fee
                              ).toFixed(2)}
                            </span>
                          </p>
                        )}
                      <p>
                        Sales Tax (
                        {orderSummeryData &&
                          orderSummeryData.order_detail &&
                          orderSummeryData.order_detail.tax_rate}
                        %)
                        <span>
                          $
                          {orderSummeryData &&
                            orderSummeryData?.order_detail &&
                            orderSummeryData?.order_detail?.tax &&
                            parseFloat(
                              orderSummeryData?.order_detail?.tax
                            ).toFixed(2)}
                        </span>
                      </p>
                      {orderSummeryData?.order_detail?.tip &&
                        parseFloat(orderSummeryData?.order_detail?.tip) > 0 ? (
                        <p>
                          Tip{" "}
                          <span>
                            $
                            {parseFloat(
                              orderSummeryData?.order_detail?.tip
                            ).toFixed(2)}
                          </span>
                        </p>
                      ) : (
                        ""
                      )}
                      {orderSummeryData?.order_detail?.other_taxes_desc
                        ? getOtherTaxes(
                          JSON.parse(
                            orderSummeryData?.order_detail?.other_taxes_desc
                          )
                        )
                        : ""}
                      {orderSummeryData &&
                        orderSummeryData.order_detail &&
                        orderSummeryData.order_detail.is_refunded == "1" ? (
                        <p className="yellowclr">
                          Refunded Amount
                          <span>
                            - $
                            {orderSummeryData &&
                              orderSummeryData.order_detail &&
                              parseFloat(
                                orderSummeryData.order_detail.refund_amount
                              ).toFixed(2)}
                          </span>
                        </p>
                      ) : (
                        ""
                      )}
                      {orderSummeryData && orderSummeryData.order_detail ? (
                        <p className="blackclr">
                          Grand Total
                          <span>
                            {(() => {
                              let grandTotal = parseFloat(
                                orderSummeryData.order_detail.amt
                              );
                              // Assuming $coupon_desc is also part of your orderSummeryData
                              if (couponDetails.loyalty_point_spent > 0) {
                                grandTotal += parseFloat(
                                  couponDetails.loyalty_point_amt_spent
                                );
                              }
                              // Adjust for refund if applicable
                              if (
                                orderSummeryData.order_detail.is_refunded ===
                                "1"
                              ) {
                                grandTotal -= parseFloat(
                                  orderSummeryData.order_detail.refund_amount
                                );
                              }
                              return `$${parseFloat(grandTotal) <= 0.02 &&
                                  orderSummeryData?.order_detail?.m_status === "7"
                                  ? "0.00"
                                  : grandTotal.toFixed(2)
                                }`;
                            })()}
                          </span>
                        </p>
                      ) : (
                        ""
                      )}
                      <style>
                        {`
                    .MuiAccordion-root:before {
                      background-color: unset;
                    }
                      .moreordersummary{
                        box-shadow: none !important;
                        margin:0px !important;
                      }
                      .moreordersummary-container, .dropOrdersummary{
                        margin:0px !important;
                        padding:0px ;
                      }
                      .moreordersummary-container div:first-child{
                        margin:0px !important;
                      }
                      .moreordersummary div:first-child{
                        min-height: unset !important;
                      }
                      .moreordersummary-container .MuiButtonBase-root.MuiIconButton-root.MuiAccordionSummary-expandIcon.Mui-expanded.MuiIconButton-edgeEnd, .moreordersummary-container .MuiButtonBase-root.MuiIconButton-root.MuiAccordionSummary-expandIcon.MuiIconButton-edgeEnd{
                        margin:0px !important;
                        padding:0px !important;
                      }
                      .dropOrdersummary{
                        flex-direction:column;
                      }
                      .dropOrdersummary p{
                        width:100%;
                      }
                      .moreordersummary-container .MuiIconButton-label{
                        color: #000;
                      }
                      `}
                      </style>
                      {(couponDetails.loyalty_point_spent > 0 ||
                        couponDetails.store_credit_amt_spent > 0 ||
                        orderSummeryData?.order_detail ||
                        couponDetails.loyalty_point_earned > 0) && (
                          <Accordion
                            // style={{}}
                            className="moreordersummary"
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              className="moreordersummary-container ps-0"
                            >
                              <p className="blackclr pb-0"> View Details</p>
                            </AccordionSummary>
                            <AccordionDetails className="dropOrdersummary">
                              {couponDetails.loyalty_point_spent > 0 ? (
                                <p className="">
                                  Points Applied (
                                  {parseFloat(
                                    couponDetails.loyalty_point_spent
                                  ).toFixed(2)}
                                  )
                                  <span>
                                    - $
                                    {parseFloat(
                                      couponDetails.loyalty_point_amt_spent
                                    ).toFixed(2)}
                                  </span>
                                </p>
                              ) : (
                                ""
                              )}
                              {couponDetails.store_credit_amt_spent > 0 ? (
                                <p className="">
                                  Paid via Store Credit{" "}
                                  <span>
                                    $
                                    {parseFloat(
                                      couponDetails.store_credit_amt_spent
                                    ).toFixed(2)}
                                  </span>
                                </p>
                              ) : (
                                ""
                              )}
                              {orderSummeryData &&
                                orderSummeryData.order_detail ? (
                                <p className="">
                                  {paymentMethod &&
                                    paymentMethod.toLowerCase() === "cash"
                                    ? "Paid via Cash"
                                    : "Paid via Card"}
                                  <span>
                                    {(() => {
                                      let payment = parseFloat(
                                        orderSummeryData.order_detail.amt
                                      );
                                      // if (couponDetails.loyalty_point_spent > 0) {
                                      //   payment += parseFloat(
                                      //     couponDetails.loyalty_point_amt_spent,
                                      //   );
                                      // }
                                      // if (
                                      //   orderSummeryData.order_detail
                                      //     .is_refunded === '1' ||
                                      //   orderSummeryData.order_detail
                                      //     .is_refunded === '2'
                                      // ) {
                                      //   payment -= parseFloat(
                                      //     orderSummeryData.order_detail
                                      //       .refund_amount,
                                      //   );
                                      // }
                                      // if (couponDetails.loyalty_point_spent > 0) {
                                      //   payment -= parseFloat(
                                      //     couponDetails.loyalty_point_amt_spent,
                                      //   );
                                      // }
                                      if (
                                        couponDetails.store_credit_amt_spent > 0
                                      ) {
                                        payment -= parseFloat(
                                          couponDetails.store_credit_amt_spent
                                        );
                                      }
                                      return `$${payment.toFixed(2)}`;
                                    })()}
                                  </span>
                                </p>
                              ) : (
                                ""
                              )}
                              {couponDetails.loyalty_point_earned > 0 ? (
                                <p className="yellowclr">
                                  {" "}
                                  Points Awarded{" "}
                                  <span>
                                    {parseFloat(
                                      couponDetails.loyalty_point_earned
                                    ).toFixed(2)}
                                  </span>
                                </p>
                              ) : (
                                ""
                              )}
                            </AccordionDetails>
                          </Accordion>
                        )}
                    </div>
                  </div>
                </div>
                <div className="orderStatus">
                  {/* <h5>Order Summery (3 -items)</h5> */}
                  <div className="orderSummeryList">
                    <div className="orderSummeryLeftList">
                      {/* {
                        orderSummeryData && orderSummeryData.order_detail && orderSummeryData.order_detail.del_fee !=='0'? <p className='orderSumeryText'>Delivery fee</p>:''
                      } */}
                      <p className="orderSumeryText-number"></p>
                      {/* {
                      couponDetails.coupon_code_amt !== "" ? <p className='orderSumeryText-number'>${couponDetails.coupon_code_amt}</p> : ''
                    } */}
                      {/* <p className='orderSumeryText-number'>${orderSummeryData?.order_detail?.con_fee}</p> */}
                      <p className="orderSumeryText-number"></p>
                      <h6 className="order-summery-grand-total"></h6>
                    </div>
                  </div>
                </div>
              </div>
              <div className="RightMidMainSection">
                <div className="orderSummeryRightTop">
                  <div className="orderSummeryRightTopL">
                    <h1 className="orderSummery_head">Payment Details</h1>
                  </div>
                  <div className="orderSummeryRightTopR">
                    <span className="successbtn">SUCCESS</span>
                  </div>
                </div>
                <div className="orderSummeryRightTopC">
                  <p>
                    Order Id
                    <span>
                      {orderSummeryData &&
                        orderSummeryData.order_detail &&
                        orderSummeryData.order_detail.order_id}
                    </span>
                  </p>
                  <p>
                    Payment Date
                    <span>
                      {orderSummeryData &&
                        orderSummeryData.order_detail &&
                        formatDate(orderSummeryData.order_detail.date_time)}
                    </span>
                  </p>
                  <p>
                    Order Number
                    <span>
                      {orderSummeryData &&
                        orderSummeryData.order_detail &&
                        orderSummeryData.order_detail.order_number}
                    </span>
                  </p>
                  <p>
                    Payment Id
                    <span>
                      {orderSummeryData &&
                        orderSummeryData.order_detail &&
                        orderSummeryData.order_detail.payment_id}
                    </span>
                  </p>
                  {orderSummeryData &&
                    orderSummeryData.order_detail &&
                    orderSummeryData.order_detail?.card_num ? (
                    <p>
                      Card Number (Last 4 Digit)
                      <span>
                        {orderSummeryData &&
                          orderSummeryData.order_detail &&
                          orderSummeryData.order_detail?.card_num &&
                          formatCardNumber(
                            orderSummeryData.order_detail?.card_num,
                          )}
                      </span>
                    </p>
                  ) : null}
                  {orderSummeryData && orderSummeryData.order_detail ? (
                    <p className="amountrow">
                      Amount
                      <span>
                        {(() => {
                          let grandTotal = parseFloat(
                            orderSummeryData.order_detail.amt
                          );
                          // Assuming $coupon_desc is also part of your orderSummeryData
                          if (couponDetails.loyalty_point_spent > 0) {
                            grandTotal += parseFloat(
                              couponDetails.loyalty_point_amt_spent
                            );
                          }
                          // Adjust for refund if applicable
                          if (
                            orderSummeryData.order_detail.is_refunded === "1"
                          ) {
                            grandTotal -= parseFloat(
                              orderSummeryData.order_detail.refund_amount
                            );
                          }
                          return `$${parseFloat(grandTotal) <= 0.02 &&
                              orderSummeryData?.order_detail?.m_status === "7"
                              ? "0.00"
                              : parseFloat(grandTotal).toFixed(2)
                            }`;
                        })()}
                      </span>
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                <div className="orderSummeryCustomerDetailsArea">
                  <h1 className="orderSummery_head">Customer Details</h1>
                  {orderSummeryData &&
                    orderSummeryData.order_detail &&
                    orderSummeryData.order_detail.order_method.toLowerCase() ===
                    "pickup" && (
                      <div className="orderSummeryCustomerDetailsInner">
                        <h5>
                          {orderSummeryData &&
                            orderSummeryData.order_detail &&
                            orderSummeryData.order_detail?.billing_name}{" "}
                        </h5>
                        <p className="flex items-center">
                          {orderSummeryData.order_detail &&
                            !!orderSummeryData.order_detail.delivery_phn ? (
                            <div className="pe-1">
                              <img src={imagePhone} alt="Pickup phone" />
                            </div>
                          ) : (
                            ""
                          )}
                          <div>
                            {orderSummeryData &&
                              orderSummeryData.order_detail &&
                              orderSummeryData.order_detail.delivery_phn}
                          </div>


                        </p>
                      </div>
                    )}
                  {orderSummeryData &&
                    orderSummeryData.order_detail &&
                    orderSummeryData.order_detail.order_method.toLowerCase() ===
                    "delivery" && (
                      <div className="orderSummeryCustomerDetailsInner">
                        <h5>
                          {orderSummeryData &&
                            orderSummeryData.order_detail &&
                            orderSummeryData.order_detail.deliver_name}{" "}
                          <span className="btngreen_orderSummery">
                            Delivery Address
                          </span>
                        </h5>
                        <p>
                          {orderSummeryData &&
                            orderSummeryData.order_detail &&
                            orderSummeryData.order_detail.delivery_addr ? (
                            <img src={imageAddress} alt="delivery address" />
                          ) : (
                            ""
                          )}{" "}
                          {""}
                          {orderSummeryData && orderSummeryData.order_detail
                            ? removeHtmlTags(
                              orderSummeryData.order_detail.delivery_addr
                            )
                            : ""}
                        </p>
                        <p>
                          <img src={imagePhone} alt="Pickup phone" />
                          {"  "}
                          {orderSummeryData &&
                            orderSummeryData.order_detail &&
                            orderSummeryData.order_detail.delivery_phn}
                        </p>
                      </div>
                    )}
                </div>
                <div className="orderSummeryIdentification">
                  <h1 className="orderSummery_head">Identification Card</h1>
                  <div className="orderSummeryRightTopC">
                    {orderSummeryData.id_card_detail &&
                      orderSummeryData.id_card_detail.i_card_number ? (
                      <p>
                        ID Number
                        <span>
                          {orderSummeryData &&
                            orderSummeryData.id_card_detail &&
                            orderSummeryData.id_card_detail.i_card_number}
                        </span>
                      </p>
                    ) : (
                      ""
                    )}
                    {orderSummeryData.id_card_detail && dateFormat ? (
                      <p>
                        Expiration Date
                        <span>
                          {orderSummeryData &&
                            orderSummeryData.id_card_detail &&
                            dateFormat}
                        </span>
                      </p>
                    ) : (
                      ""
                    )}
                    {/* {console.log('dobhhh', orderSummeryData.id_card_detail)} */}
                    {/* {orderSummeryData &&
                orderSummeryData.id_card_detail &&
                dateOfBirth ? (
                  <p className="orderSumeryText">
                    Date Of Birth{' '}
                    <span>
                      {orderSummeryData &&
                      orderSummeryData.id_card_detail &&
                      dateOfBirth !== '31 Dec 1969'
                        ? // Render the content if dateOfBirth is not "31 Dec 1969"
                          dateOfBirth
                        : // Render null if dateOfBirth is "31 Dec 1969"
                          null}
                    </span>
                  </p>
                ) : (
                  ''
                )} */}
                    {orderSummeryData &&
                      orderSummeryData.id_card_detail &&
                      dateOfBirth &&
                      dateOfBirth !== "31 Dec 1969" && ( // Add a condition here to check if dateOfBirth is not '31 Dec 1969'
                        <p className="orderSumeryText">
                          Date Of Birth <span>{dateOfBirth}</span>
                        </p>
                      )}
                  </div>
                  <div className="ordersummaryR_div_file">
                    <label className="photo_area">
                      <div
                        id="img_container"
                        data-toggle="modal"
                        data-target="#id_cart_popup_front_side"
                        onClick={handleClickOpen}
                      >
                        {/* {console.log('orderSummeryData: ', orderSummeryData)} */}
                        {/* `https://sandbox.quickvee.com/upload/customer/id_proof/${orderSummeryData.id_card_detail.i_card_front_img}` */}
                        <img
                          src={
                            orderSummeryData &&
                              orderSummeryData.id_card_detail &&
                              orderSummeryData.id_card_detail.image_url
                              ? orderSummeryData.id_card_detail?.image_url
                              : ""
                          }
                          alt=""
                          className="id-cart-image"
                        ></img>
                      </div>
                    </label>
                    <div className="photo_area_text">
                      <span>Front Side</span>
                      <div className="custom-file"></div>
                    </div>
                  </div>
                </div>
                <br></br>
                <br></br>
                {/* <div className='order-summery-right-header'>
              <div className='font-header-right'>
                <h5>Payment Details</h5>
              </div>
              <button className='order-summery-success'><span>Success</span></button>
            </div>
            <div className='hrLine'></div>
            <div className='orderSummeryList'>
              <div className='orderSummeryLeftList'>
                <p className='orderSumeryText'>OrderId</p>
                <p className='orderSumeryText'>Payment Date</p>
                <p className='orderSumeryText'>Order Number</p>
                <p className='orderSumeryText'>Payment Id</p>
                <h5 className='order-Sumery-Text-amount'>Amount</h5>
              </div>
              <div className='orderSummeryRightList'>
                <p className='order-Sumery-text-right'>{orderSummeryData && orderSummeryData.order_detail && orderSummeryData.order_detail.order_id}</p>
                <p className='order-Sumery-text-right'>{orderSummeryData && orderSummeryData.order_detail && formatDate(orderSummeryData.order_detail.date_time)}</p>
                <p className='order-Sumery-text-right'>{orderSummeryData && orderSummeryData.order_detail && orderSummeryData.order_detail.order_number}</p>
                <p className='order-Sumery-text-right'>{orderSummeryData && orderSummeryData.order_detail && orderSummeryData.order_detail.payment_id}</p>
                <h5 className='order-Sumery-Text-amount'>${orderSummeryData && orderSummeryData.order_detail && orderSummeryData.order_detail.amt}</h5>
              </div>
            </div>
            <div className='hrLine'></div>
            <div className="order-summery-customer-detail">
              {
                orderSummeryData && orderSummeryData.order_detail &&
                  orderSummeryData.order_detail.delivery_addr ?
                  <>
                    <div className='font-header-right'>
                      <h5>Customer Details</h5>
                    </div>
                    <div className="order-address-customer-delivery">
                      <div className='order-summery-right-header-section'>
                        <p className='order-Sumery-payment-Text'>{orderSummeryData && orderSummeryData.order_detail && orderSummeryData.order_detail.deliver_name}</p>
                        <span className='order-summery-text-success'><span>Delivery Address</span></span>
                      </div>
                      <div className='order-summery-address'>
                        <div>
                          {
                            orderSummeryData && orderSummeryData.order_detail && orderSummeryData.order_detail.delivery_addr ? <span className='order-address-image'><img src={imageAddress}></img></span> : ""
                          }
                          {
                            orderSummeryData && orderSummeryData.order_detail ? removeHtmlTags(orderSummeryData.order_detail.delivery_addr) : ''
                          }
                        </div>
                        <div>
                          <span className='order-address-image'><img src={imagePhone}></img></span>
                          <span className='order-summery-customer-details' style={{
                            paddingRight: '25px'
                          }}>{orderSummeryData && orderSummeryData.order_detail && orderSummeryData.order_detail.delivery_phn}</span>
                        </div>
                      </div>
                    </div></>
                  : ''
              }
              
              <div className="order-address-dive">
                <div className='order-address-customer-delivery'>
                  <div className='billing-top-div'>
                    <p className='order-Sumery-payment-Text'>{orderSummeryData && orderSummeryData.order_detail && orderSummeryData.order_detail.billing_name}</p>
                    <span className='order-summery-text-success-billing'><span>Billing Address</span></span>
                  </div>
                </div>
                <div className='order-summery-address'>
                  {
                    orderSummeryData && orderSummeryData.order_detail && orderSummeryData.order_detail.billing_add ? (
                      <div>
                        <span className='order-address-image'><img src={adderssImage}></img></span>
                        {
                          orderSummeryData && orderSummeryData.order_detail ?
                            removeHtmlTags(orderSummeryData.order_detail.billing_add) : ''
                        }
                      </div>
                    ) : ""
                  }
                </div>
              </div>
            </div>
            <div className='hrLine'></div>
            <div className='order-summery-identification'>
              <div className='font-header-right'>
                <h5>Identification Card</h5>
              </div>
              <div className='orderSummeryList'>
                <div className='orderSummeryLeftList'>
                  <p className='orderSumeryText'>ID Number</p>
                  <p className='orderSumeryText'>Expiration Date</p>
                  {
                    orderSummeryData && orderSummeryData.id_card_detail && dateOfBirth ?
                      <p className='orderSumeryText'>Date Of Birth</p> : ''
                  }

                </div>
                <div className='orderSummeryRightList'>
                  <p className='order-Sumery-text-right'>
                    {orderSummeryData && orderSummeryData.id_card_detail && orderSummeryData.id_card_detail.i_card_number}
                  </p>
                  <p className='order-Sumery-text-right'>{orderSummeryData && orderSummeryData.id_card_detail && dateFormat}</p>
                  <p className='order-Sumery-text-right'>{orderSummeryData && orderSummeryData.id_card_detail && dateOfBirth}</p>
                </div>
              </div>
              <div className='order-summry-id-cart-details'>
               
                <img
                  src={orderSummeryData && orderSummeryData.id_card_detail ? `https://sandbox.quickvee.com/upload/customer/id_proof/${orderSummeryData.id_card_detail.i_card_front_img}` : ''}
                  className='id-cart-image'
                 
                >
                 
                </img>
              </div>

            </div> */}
                {/* <BootstrapDialog
              onClose={handleClose}
              aria-labelledby="customized-dialog-title"
              open={open}
            >
              <DialogContent dividers>
                <DialogTitle
                  sx={{ m: 0, p: 1 }}
                  id="customized-dialog-title"
                  className="mb-1 "
                  style={{ paddingLeft: '2rem' }}
                >
                  Identification Card
                </DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={handleClose}
                  sx={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '1rem',
                    color: (theme) => theme.palette.grey[800],
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <div>
                  <div
                    data-toggle="modal"
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginBottom: '1rem',
                    }}
                  >
                    <img
                      src={
                        orderSummeryData &&
                        orderSummeryData.id_card_detail &&
                        orderSummeryData.id_card_detail.image_url
                          ? orderSummeryData.id_card_detail?.image_url
                          : ''
                      }
                      // src={
                      //   orderSummeryData && orderSummeryData.id_card_detail
                      //     ? `https://sandbox.quickvee.com/upload/customer/id_proof/${orderSummeryData.id_card_detail.i_card_front_img}`
                      //     : ''
                      // }
                      onError={(e) => {
                        e.target.src = ProductDefaultImage;
                      }}
                      className="id-cart-image"
                    />
                  </div>
                </div>
              </DialogContent>
            </BootstrapDialog> */}
                <Modal
                  className="for-scroll"
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <div className="basic-modal">
                    <div id="modal-modal-title">
                      <span>Identification Card</span>
                      <CloseIcon
                        onClick={handleClose}
                        className="modal-close-icon"
                      />
                    </div>
                    <div
                      data-toggle="modal"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        margin: "1rem",
                      }}
                    >
                      <img
                        src={
                          orderSummeryData &&
                            orderSummeryData.id_card_detail &&
                            orderSummeryData.id_card_detail.image_url
                            ? orderSummeryData.id_card_detail?.image_url
                            : ""
                        }
                        // src={
                        //   orderSummeryData && orderSummeryData.id_card_detail
                        //     ? `https://sandbox.quickvee.com/upload/customer/id_proof/${orderSummeryData.id_card_detail.i_card_front_img}`
                        //     : ''
                        // }
                        onError={(e) => {
                          e.target.src = ProductDefaultImage;
                        }}
                        className="id-cart-image"
                      />
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}
      {/* )} */}
      {/* --------------------------- */}
    </>
  );
}
// ----------------------------------order Summery end  here ----------------------------------
