import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { fetchProfitSummaryReportData } from "../../../Redux/features/Reports/ProfitSummaryReport/ProfitSummaryReportSlice";
import { useAuthDetails } from "../../../Common/cookiesHelper";
import sortIcon from "../../../Assests/Category/SortingW.svg";
import { Grid } from "@mui/material";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { priceFormate } from "../../../hooks/priceFormate";
import { SkeletonTable } from "../../../reuseableComponents/SkeletonTable";
import { SortTableItemsHelperFun } from "../../../helperFunctions/SortTableItemsHelperFun";
import PasswordShow from "../../../Common/passwordShow";
import NoDataFound from "../../../reuseableComponents/NoDataFound";

const StyledTable = styled(Table)(({ theme }) => ({
  padding: 2, // Adjust padding as needed
}));
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#253338",
    color: theme.palette.common.white,
    fontFamily: "CircularSTDMedium !important",
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
  "&:last-child td, &:last-child th": {},
  "& td, & th": {
    border: "none",
  },
}));

const ProfitSummaryList = (props) => {
  const dispatch = useDispatch();
  const { handleCoockieExpire, getUnAutherisedTokenMessage, getNetworkError } =
    PasswordShow();

  const {
    LoginGetDashBoardRecordJson,
    LoginAllStore,
    userTypeData,
    GetSessionLogin,
  } = useAuthDetails();
  const [ProfitSummaryReportData, setProfitSummaryReportData] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const ProfitSummaryReportDataState = useSelector((state) => state.ProfitSummaryReportList);
  console.log("ProfitSummaryReportDataState",ProfitSummaryReportDataState)
  let merchant_id = LoginGetDashBoardRecordJson?.data?.merchant_id;
  useEffect(() => {
    getProfitSummaryReportData();
  }, [props, dispatch]);
  const getProfitSummaryReportData = async () => {
    if (props && props.selectedDateRange) {
      try {
        const startDateData = props.selectedDateRange.start_date;
        const endDateData = props.selectedDateRange.end_date;
        let data = {
          merchant_id,
          start_date: startDateData,
          end_date: endDateData,
          ...userTypeData,
        };

        if (data) {
          await dispatch(fetchProfitSummaryReportData(data)).unwrap();
        }
      } catch (error) {
        console.log(error);
        if (error.status == 401) {
          getUnAutherisedTokenMessage();
          handleCoockieExpire();
        }
      }
    }
  };

  useEffect(() => {
    if (
      !ProfitSummaryReportDataState.loading &&
      ProfitSummaryReportDataState.ProfitSummaryReportData
    ) {
      const uodatedList = Array.isArray(ProfitSummaryReportDataState?.ProfitSummaryReportData)
        ? ProfitSummaryReportDataState?.ProfitSummaryReportData?.map((item) => {
            return {
              ...item,
            };
          })
        : [];
      setProfitSummaryReportData(uodatedList);
      setTotalUnit(
        ProfitSummaryReportDataState?.ProfitSummaryReportData?.length > 0
          ? ProfitSummaryReportDataState?.ProfitSummaryReportData?.reduce(
              (total, report) => total + parseFloat(report.units_sold ?? 0),
              0
            )
          : 0
      );
      setTotalCost(
        ProfitSummaryReportDataState?.ProfitSummaryReportData?.length > 0
          ? ProfitSummaryReportDataState?.ProfitSummaryReportData?.reduce(
              (total, report) => total + parseFloat(report.product_varient_cost === null ? priceFormate(report.product_cost) : priceFormate(report.product_varient_cost) ?? 0),
              0
            )
          : 0
      );
      setTotalSelling(
        ProfitSummaryReportDataState?.ProfitSummaryReportData?.length > 0
          ? ProfitSummaryReportDataState?.ProfitSummaryReportData?.reduce(
              (total, report) => total  + parseFloat((report.selling_price/report.units_sold)  ?? 0),
              0
            )
          : 0
      );

      // setTotalMargin(
      //   ProfitSummaryReportDataState?.ProfitSummaryReportData?.length > 0
      //     ? ProfitSummaryReportDataState?.ProfitSummaryReportData?.reduce(
      //         (total, report) => total  + parseFloat(((report.selling_price/report.units_sold) - report.product_varient_cost === null ? parseFloat(report.product_cost) : parseFloat(report.product_varient_cost) ) ?? 0),
      //         0
      //       )
      //     : 0
      // );

      setTotalProfit(
        ProfitSummaryReportDataState?.ProfitSummaryReportData?.length > 0
          ? ProfitSummaryReportDataState?.ProfitSummaryReportData?.reduce(
              (total, report) => {
                const costPrice = parseFloat(report.product_varient_cost ?? report.product_cost ?? 0);
                const sellingPricePerUnit = parseFloat(report.selling_price ?? 0) / parseFloat(report.units_sold);
                return total + (sellingPricePerUnit - costPrice);
              },
              0
            )
          : 0
      );

      setTotalMargin(
        ProfitSummaryReportDataState?.ProfitSummaryReportData?.length > 0
          ? ProfitSummaryReportDataState?.ProfitSummaryReportData?.reduce(
              (total, report) => {
                const costPrice = parseFloat(report.product_varient_cost ?? report.product_cost ?? 0);
                const sellingPricePerUnit = parseFloat(report.selling_price ?? 0) / parseFloat(report.units_sold);
                const parmargin = (costPrice*100)/sellingPricePerUnit;
                // const margin = ((sellingPricePerUnit-costPrice)/100);
                return total + (100 - parmargin);
              },
              0
            )
          : 0
      );

    } else {
      setProfitSummaryReportData([]);
    }
  }, [ProfitSummaryReportDataState.loading, ProfitSummaryReportDataState.ProfitSummaryReportData]);

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const dateOptions = { year: "numeric", month: "short", day: "numeric" };
    const timeOptions = { hour: "numeric", minute: "numeric", hour12: true };
    const formattedDate = date.toLocaleDateString("en-US", dateOptions);
    const formattedTime = date.toLocaleTimeString("en-US", timeOptions);
    return `${formattedDate} ${formattedTime}`;
  };
  const tableRow = [
    { type: "str", name: "category_name", label: "Category" },
    { type: "num", name: "units_sold", label: "Units Sold" },
    { type: "num", name: "product_varient_cost", label: "Cost" },
    { type: "num", name: "selling_price", label: "Average Sale Price" },
    { type: "num", name: "amount", label: "Margin" },
    { type: "num", name: "amount", label: "Profit" },
  ];


  const sortByItemName = (type, name) => {
    const { sortedItems, newOrder } = SortTableItemsHelperFun(
      ProfitSummaryReportData,
      type,
      name,
      sortOrder
    );
    setProfitSummaryReportData(sortedItems);
    setSortOrder(newOrder);
  };

  const [totalUnit, setTotalUnit] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalSelling, setTotalSelling] = useState(0);
  const [totalMargin, setTotalMargin] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);

  return (
    <>
      <Grid container className="box_shadow_div">
        <Grid item xs={12}>
          {ProfitSummaryReportDataState.loading ? (
            <SkeletonTable columns={tableRow.map((item) => item.label)} />
          ) : (
            <TableContainer>
              <StyledTable sx={{ minWidth: 500 }} aria-label="customized table">
                <TableHead>
                  {tableRow.map((item, index) => (
                    <StyledTableCell key={index}>
                      <button
                        className="flex items-center"
                        onClick={() => sortByItemName(item.type, item.name)}
                      >
                        <p>{item.label}</p>
                        <img src={sortIcon} alt="" className="pl-1" />
                      </button>
                    </StyledTableCell>
                  ))}
                </TableHead>
                <TableBody>
                {ProfitSummaryReportData.length > 0 ? (
                        <>
                  {ProfitSummaryReportData.length > 0 &&
                    ProfitSummaryReportData.map((data, index) => {
                      const costPrice = data.product_varient_cost === null ? parseFloat(data.product_cost) : parseFloat(data.product_varient_cost);
                      const sellingPrice = parseFloat(data.selling_price)/data.units_sold;
                      const profit = sellingPrice - costPrice;
                      const parmargin = (costPrice*100)/sellingPrice;
                      const netmargin = 100 - parmargin;
                      return(
                      <StyledTableRow>
                        <StyledTableCell>
                          <div>
                            <p>{data.product_name}</p>
                            <p>{data.category_name}</p>
                          </div>
                        </StyledTableCell>
                        <StyledTableCell>
                          <p>{data.units_sold}</p>
                        </StyledTableCell>
                        <StyledTableCell>
                          ${data.product_varient_cost === null ? priceFormate(data.product_cost) : priceFormate(data.product_varient_cost)}
                        </StyledTableCell>
                        <StyledTableCell>
                          <p>${priceFormate(parseFloat(sellingPrice).toFixed(2))}</p>
                        </StyledTableCell>
                        <StyledTableCell>
                        {priceFormate(parseFloat(netmargin).toFixed(2))}%
                        </StyledTableCell>
                        <StyledTableCell>
                          <p className="report-title">
                            ${priceFormate(parseFloat(profit).toFixed(2))}
                          </p>
                        </StyledTableCell>
                      </StyledTableRow>
                      )
                    })}
                    <StyledTableCell className="trBG_Color">
                            <div className="">
                              <div>
                                <p className="report-sort totalReport">Total</p>
                              </div>
                            </div>
                          </StyledTableCell>
                          <StyledTableCell className="trBG_Color">
                            <div className="">
                              <div>
                                <p className="report-title totalReport">
                                  {priceFormate(totalUnit)}
                                  </p>
                              </div>
                            </div>
                          </StyledTableCell>
                          <StyledTableCell className="trBG_Color">
                          <div className="">
                              <div>
                                <p className="report-title totalReport">
                                ${priceFormate(totalCost.toFixed(2))}
                                </p>
                                </div>
                              </div>
                            </StyledTableCell>
                          <StyledTableCell className="trBG_Color">
                          <div className="">
                              <div>
                                <p className="report-title totalReport">
                                ${priceFormate(totalSelling.toFixed(2))}
                                </p>
                              </div>
                            </div>
                          </StyledTableCell>
                          <StyledTableCell className="trBG_Color">
                          <div className="">
                              <div>
                                <p className="report-title totalReport">
                                  {priceFormate(parseFloat(totalMargin).toFixed(2))}%
                                </p>
                              </div>
                            </div>
                          </StyledTableCell>
                          <StyledTableCell  className="trBG_Color">
                            <div className="">
                              <div>
                                <p className="report-title totalReport">
                                  ${priceFormate(totalProfit.toFixed(2))}
                                </p>
                              </div>
                            </div>
                          </StyledTableCell>
                          </>
                      ) : (
                        ""
                      )}
                </TableBody>
              </StyledTable>
              {!ProfitSummaryReportData.length  && <NoDataFound />}
            </TableContainer>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default ProfitSummaryList;
