// Import necessary modules and functions
import { HttpStatus } from "../constant/constant.js";
import successResponseData from "../helper/successResponseData.js";
import tryCatchWrapper from "./tryCatchWrapper.js";

// Middleware for handling sorting, filtering, and pagination of data
export let sortFilterPagination = tryCatchWrapper(async (req, res) => {
  // Extract the "find" object, "service" function, and "myOwnSelect" from the request
  let find = req.find || {};
  let service = req.service;
  let myOwnSelect = req.myOwnSelect;

  // Sort the data based on the "_sort" query parameter
  let sort = sortingFun(req.query._sort);

  // Configure pagination: "limit" and "skip" based on query parameters
  let { limit, skip } = getExactPageData(
    req.query._brake,
    req.query._page,
    req.query._showAllData
  );

  // Configure field selection based on the "_select" query parameter
  let select = "";
  if (!myOwnSelect) {
    // If no custom field selection is specified, use client-side selection
    select = selectField(req.query._select);
  } else {
    // If custom field selection is provided, use it
    select = myOwnSelect;
  }

  // Retrieve data from the service based on filters, sorting, and pagination
  let results = await service({ find, sort, limit, skip, select });

  // Calculate pagination information
  let totalDataInAPage = results.length;
  let totalResults = await service({
    find: find,
    sort: "",
    limit: "",
    skip: "",
    select: "",
  });
  let totalDataInWholePage = totalResults.length;
  let totalPage = Math.ceil(totalDataInWholePage / limit);
  let currentPage = Number(req.query._page) || 1;
  let hasPreviousPage = currentPage > 1;
  let hasNextPage = currentPage < totalPage;

  // Prepare response data
  let data = {
    results,
    totalDataInAPage,
    totalDataInWholePage,
    currentPage,
    totalPage,
    hasPreviousPage,
    hasNextPage,
  };

  // Send a success response with the paginated data
  successResponseData({
    res,
    message: "Read successfully.",
    statusCode: HttpStatus.OK,
    data,
  });
});
