import {
  expiryIn,
  resetExpiryIn,
  secretKey,
  tokenTypes,
} from "../config/config.js";
import { generateToken } from "../utils/token.js";
import { HttpStatus } from "../constant/constant.js";
import successResponseData from "../helper/successResponseData.js";
import { throwError } from "../utils/throwError.js";
import tryCatchWrapper from "../middleware/tryCatchWrapper.js";
import { authService, tokenService } from "../services/index.js";

export const AddAuthUser = tryCatchWrapper(async (req, res) => {
  const body = { ...req.body };
  let email = body.email;

  let user = await authService.detailSpecificAuthUserByAny({ email });

  if (user) {
    throwError({
      message: "Duplicate Email",
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  } else {
    const data = await authService.AddAuthUserService({ body });

    let infoObj = { userId: data._id };
    let token = await generateToken(infoObj, secretKey);
    console.log(token);

    let tokenData = {
      token: token,
      userId: data._id,
      type: tokenTypes.ACCESS,
    };

    await tokenService.createTokenService({ data: tokenData });

    successResponseData({
      res,
      message: "User created successfully.",
      statusCode: HttpStatus.CREATED,
      data,
      token,
    });
  }
});
