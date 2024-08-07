import React, { useState } from "react";
import { Grid } from "@mui/material";
import SelectDropDown from "../../../reuseableComponents/SelectDropDown";
import BasicTextFields from "../../../reuseableComponents/TextInputField";
import ProfitMarginReportLogic from "./profitMarginReportLogic";
import Pagination from "./pagination";
import { SortTableItemsHelperFun } from "../../../helperFunctions/SortTableItemsHelperFun";
import CustomHeader from "../../../reuseableComponents/CustomHeader";
export default function ProfitMarginReport() {
  const {
    handleChangeInventory,
    inventory,

    category,
    handleOptionClick,
    selectedCategory,
    message,
    searchProduct,
    handleLoadMore,
    laodMoreData,
    loader,
    endOfDataList,
    setsearchProduct,
  } = ProfitMarginReportLogic();

  const [sortOrder, setSortOrder] = useState("asc"); // "asc" for ascending, "desc" for descending

  const sortByItemName = (type, name) => {
    const { sortedItems, newOrder } = SortTableItemsHelperFun(
      searchProduct,
      type,
      name,
      sortOrder
    );
    setsearchProduct(sortedItems);
    setSortOrder(newOrder);
  };

  return (
    <>
      <Grid container className="box_shadow_div">
        <CustomHeader>Profit Margin Per Item Listing</CustomHeader>
        <Grid item xs={12}>
          <Grid container spacing={2} sx={{ px: 2.5, py: 2.5 }}>
            <Grid item xs={12} sm={6} md={4}>
              <label
                className="q-details-page-label"
                htmlFor="orderSourceFilter"
              >
                Search Product
              </label>

              <BasicTextFields
                sx={{ pt: 0.5 }}
                type={"text"}
                name="product"
                value={inventory}
                placeholder="Search Product"
                onChangeFun={handleChangeInventory}
                required={"required"}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <label className="q-details-page-label" htmlFor="limitFilter">
                Category
              </label>
              <SelectDropDown
                sx={{ pt: 0.5 }}
                heading={"All"}
                listItem={category}
                title={"title"}
                dropdownFor={"category"}
                selectedOption={selectedCategory}
                onClickHandler={handleOptionClick}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container className="box_shadow_div">
        <Grid item xs={12}>
          <Pagination
            searchProduct={searchProduct}
            message={message}
            handleLoadMore={handleLoadMore}
            laodMoreData={laodMoreData}
            loader={loader}
            sortByItemName={sortByItemName}
            endOfDataList={endOfDataList}
          />
        </Grid>
      </Grid>
    </>
  );
}
