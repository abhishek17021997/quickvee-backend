import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchVendorListData,
  getVendorListCount,
} from "../../../Redux/features/Reports/VendorList/VendorListSlice";
import { useAuthDetails } from "../../../Common/cookiesHelper";

import { Grid } from "@mui/material";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import sortIcon from "../../../Assests/Category/SortingW.svg";
import { SortTableItemsHelperFun } from "../../../helperFunctions/SortTableItemsHelperFun";
import InputTextSearch from "../../../reuseableComponents/InputTextSearch";
import Pagination from "../../../AllUserComponents/Users/UnverifeDetails/Pagination";
import useDebounce from "../../../hooks/useDebouncs";
import { SkeletonTable } from "../../../reuseableComponents/SkeletonTable";
import CustomHeader from "../../../reuseableComponents/CustomHeader";
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

const VendorReportList = (props) => {
  const dispatch = useDispatch();
  const {
    LoginGetDashBoardRecordJson,
    LoginAllStore,
    userTypeData,
    GetSessionLogin,
  } = useAuthDetails();
  const [allVendorData, setallVendorData] = useState("");
  const AllVendorDataState = useSelector((state) => state.VendorList);
  let merchant_id = LoginGetDashBoardRecordJson?.data?.merchant_id;

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchRecord, setSearchRecord] = useState("");
  const debouncedValue = useDebounce(searchRecord);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    let data = {
      merchant_id,
      page: currentPage,
      perpage: rowsPerPage,
      search_by: Boolean(debouncedValue.trim()) ? debouncedValue : null,
      ...userTypeData,
    };

    if (data) {
      dispatch(fetchVendorListData(data));
    }
  }, [currentPage, debouncedValue, rowsPerPage]);

  useEffect(() => {
    const data = {
      merchant_id: merchant_id,
      search_by: Boolean(debouncedValue.trim()) ? debouncedValue : null,
      ...userTypeData,
    };
    dispatch(getVendorListCount(data));
  }, [debouncedValue]);
  useEffect(() => {
    setTotalCount(AllVendorDataState.VendorListCount);
  }, [AllVendorDataState.VendorListCount]);

  useEffect(() => {
    if (!AllVendorDataState.loading && AllVendorDataState.VendorListData) {
      const { sortedItems, newOrder } = SortTableItemsHelperFun(
        AllVendorDataState.VendorListData,
        "str",
        "name",
        sortOrder
      );
      setallVendorData(sortedItems);
      setSortOrder(newOrder);
    } else {
      setallVendorData("");
    }
  }, [
    AllVendorDataState,
    AllVendorDataState.loading,
    AllVendorDataState.VendorListData,
  ]);

  const [sortOrder, setSortOrder] = useState("asc"); // "asc" for ascending, "desc" for descending

  const sortByItemName = (type, name) => {
    const { sortedItems, newOrder } = SortTableItemsHelperFun(
      allVendorData,
      type,
      name,
      sortOrder
    );
    setallVendorData(sortedItems);
    setSortOrder(newOrder);
  };

  const handleSearchInputChange = (value) => {
    setSearchRecord(value);
    setCurrentPage(1);
  };

  const columns = ["Vendor Name", "Contact", "Email", "Address"];
  return (
    <>
      <Grid container className="box_shadow_div">
        <CustomHeader>Vendors List Report</CustomHeader>
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
              data={allVendorData}
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {AllVendorDataState.loading ? (
            <SkeletonTable columns={columns} />
          ) : (
            <>
              {allVendorData && allVendorData.length >= 1 ? (
                <TableContainer>
                  <StyledTable
                    sx={{ minWidth: 500 }}
                    aria-label="customized table"
                  >
                    <TableHead>
                      <StyledTableRow>
                        <StyledTableCell>
                          <button
                            className="flex items-center"
                            onClick={() => sortByItemName("str", "name")}
                          >
                            <p className="whitespace-nowrap">Vendor Name</p>
                            <img src={sortIcon} alt="" className="pl-1" />
                          </button>
                        </StyledTableCell>
                        <StyledTableCell>
                          <button
                            className="flex items-center"
                            onClick={() => sortByItemName("num", "phone")}
                          >
                            <p className="whitespace-nowrap">Contact</p>
                            <img src={sortIcon} alt="" className="pl-1" />
                          </button>
                        </StyledTableCell>
                        <StyledTableCell>
                          <button
                            className="flex items-center"
                            onClick={() => sortByItemName("str", "email")}
                          >
                            <p className="whitespace-nowrap">Email</p>
                            <img src={sortIcon} alt="" className="pl-1" />
                          </button>
                        </StyledTableCell>
                        <StyledTableCell>Address</StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      {allVendorData.map((CheckData, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell>
                            <p>{CheckData.name}</p>
                          </StyledTableCell>
                          <StyledTableCell>
                            <p>{CheckData.phone}</p>
                          </StyledTableCell>
                          <StyledTableCell>
                            <p>{CheckData.email ? CheckData.email : "" }</p>
                          </StyledTableCell>
                          <StyledTableCell>
                            <p>
                              {[
                                CheckData.full_address,
                                CheckData.city,
                                CheckData.state,
                                CheckData.zip_code,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </StyledTable>
                </TableContainer>
              ) : (
                <>

                 <NoDataFound table={true}/>
              </>
              )}
            </>
          )}
        </Grid>

        <Grid item sx={{ m: 2.5 }} xs={12}>
          <Pagination
            currentPage={currentPage}
            totalItems={totalCount}
            itemsPerPage={rowsPerPage}
            onPageChange={paginate}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            setCurrentPage={setCurrentPage}
            showEntries={false}
            data={allVendorData}
          />
        </Grid>
      </Grid>
   
    </>
  );
};

export default VendorReportList;
