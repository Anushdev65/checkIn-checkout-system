import { HttpStatus } from "../constant/constant.js";
import successResponseData from "../helper/successResponseData.js";

import tryCatchWrapper from "../middleware/tryCatchWrapper.js";
import { authService } from "../services/index.js";

export const AddAuthUser = tryCatchWrapper(async (req, res) => {
  const body = { ...req.body };

  // Create the new user
  const data = await authService.AddAuthUserService({ body });

  // Return the userId of the newly created user
  const userId = data._id;

  successResponseData({
    res,
    message: "User created successfully.",
    statusCode: HttpStatus.CREATED,
    data: { userId },
  });
});
