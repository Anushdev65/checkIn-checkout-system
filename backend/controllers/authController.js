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
import { comparePassword, hashPassword } from "../utils/hashFunction.js";
import { authService, tokenService } from "../services/index.js";
import getTokenExpiryTime from "../utils/getTokenExpiryTime.js";

export const addAuthUser = tryCatchWrapper(async (req, res) => {
  const body = { ...req.body };
  let email = body.email;

  let passHashedPassword = await hashPassword(req.body.password);

  let user = await authService.detailSpecificAuthUserByAny({ email });

  if (user) {
    throwError({
      message: "Duplicate Email",
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  } else {
    const data = await authService.AddAuthUserService({
      body: {
        email: body.email,
        password: passHashedPassword,
        firstName: body.firstName,
        lastName: body.lastName,
        phoneNumber: body.phoneNumber,
      },
    });

    let infoObj = { userId: data._id };
    let token = await generateToken(infoObj, secretKey, expiryIn);
    console.log(user);
    console.log(token);

    let tokenData = {
      token: token,
      userId: data._id,
      type: tokenTypes.ACCESS,
      expiration: getTokenExpiryTime(token).toLocaleString(),
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

export let loginUser = tryCatchWrapper(async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let user = await authService.detailSpecificAuthUserByAny({ email });
  if (user === null) {
    throwError({
      message: "Please enter valid email or password.",
      statusCode: 401,
    });
  } else {
    let isValidPassword = await comparePassword(password, user.password);
    if (isValidPassword) {
      let infoObj = { userId: user._id };
      let token = await generateToken(infoObj, secretKey, expiryIn);

      console.log(token);

      let data = {
        token: token,
        userId: user._id,
        type: tokenTypes.ACCESS,
        expiration: getTokenExpiryTime(token).toLocaleString(),
      };

      await tokenService.createTokenService({ data });

      console.log(data, "tokenn oken");

      successResponseData({
        res,
        message: "Login Successfully.",
        statusCode: HttpStatus.OK,
        data: {
          token: token,
          user: user,
        },
      });
    } else {
      throwError({
        message: "Please enter valid email or password.",
        statusCode: 401,
      });
    }
  }
});

export let logoutUser = tryCatchWrapper(async (req, res) => {
  await tokenService.deleteSpecificTokenService({ id: req.token.tokenId });

  successResponseData({
    res,
    message: "Logout Successfully.",
    statusCode: HttpStatus.OK,
  });
});

export const authMyProfile = tryCatchWrapper(async (req, res) => {
  let id = req.info.userId;
  let data = await authService.detailSpecificAuthUserService({ id });
  console.log(data);
  successResponseData({
    res,
    message: "Profile read sucessfully.",
    statusCode: HttpStatus.OK,
    data,
  });
  console.log(data, "user user suer");
});

export let updateAuthPassword = tryCatchWrapper(async (req, res) => {
  let id = req.info.userId;
  let oldPassword = req.body.oldPassword;
  let password = req.body.password;

  let user = await authService.detailSpecificAuthUserService({ id });

  let isOldPasswordMatches = await comparePassword(oldPassword, user.password);

  if (!isOldPasswordMatches) {
    throwError({ message: "Password does not matches.", statusCode: 401 });
  }

  let isPreviousCurrentPasswordSame = await comparePassword(
    password,
    user.password
  );

  if (isPreviousCurrentPasswordSame) {
    throwError({
      message: "Previous and current password are same.",
      statusCode: 401,
    });
  }

  let body = {
    password: await hashPassword(password),
  };

  let data = await authService.editSpecificAuthUserService({ id, body });
  delete data._doc.password;
  await tokenService.deleteAllTokenOfAUser({ userId: id });

  successResponseData({
    res,
    message: "User password updated successfully.",
    statusCode: HttpStatus.CREATED,
    data,
  });
});

export let readSpecificAuthUser = tryCatchWrapper(async (req, res) => {
  let id = req.params.id;
  let data = await authService.detailSpecificAuthUserService({ id });
  if (data) {
    delete data._doc.password;
    successResponseData({
      res,
      message: "Read user successfully.",
      statusCode: HttpStatus.OK,
      data,
    });
  } else {
    throwError({
      message: "Could'nt found user.",
      statusCode: HttpStatus.NOT_FOUND,
    });
  }
});

export let updateAuthUser = (profile) =>
  tryCatchWrapper(async (req, res) => {
    let body = { ...req.body };
    delete body.password;
    delete body.email;

    //if user is other than admin lets not allow him to change the role
    // if (!req.info.roles.includes("admin")) {
    //   delete body.roles;
    // }

    let id = profile === "myProfile" ? req.info.userId : req.params.id;
    let user = await authService.detailSpecificAuthUserService({ id });
    if (user) {
      let data = await authService.editSpecificAuthUserService({ id, body });
      successResponseData({
        res,
        message: "User updated successfully.",
        statusCode: HttpStatus.CREATED,
        data,
      });
    } else {
      throwError({
        message: "Could not found user.",
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
  });
