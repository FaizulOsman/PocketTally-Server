import { RequestHandler } from 'express';
import sendResponse from '../../../shared/sendResponse';
import catchAsync from '../../../shared/catchAsync';
import httpStatus from 'http-status';
import { AuthService } from './auth.service';
import {
  IRefreshTokenResponse,
  IUserLoginResponse,
  IUserSignupResponse,
} from './auth.interface';
import config from '../../../config';
// import generateRandomUsername from '../../../utils/generateRandomUsername';
// import generateRandomPassword from '../../../utils/generateRandomPassword';
// import { encryptPassword } from '../../../helper/encryptPassword';
// import { getBDTime } from '../../../config/getTime';
// import { googleLoginConfirmationMail } from '../../../utils/verificationEmail';

const sendOTP: RequestHandler = catchAsync(async (req, res) => {
  const { ...userData } = req.body;

  await AuthService.sendOTP(userData);

  sendResponse<IUserSignupResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OTP sent successfully',
  });
});

const createUser: RequestHandler = catchAsync(async (req, res) => {
  const { ...userData } = req.body;

  const { result, refreshToken, accessToken } = await AuthService.createUser(
    userData
  );

  // set refresh token in the browser cookie
  const cookieOptions = {
    secure: config.node_env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<IUserSignupResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user created successfully',
    data: { result, accessToken },
  });
});

const login: RequestHandler = catchAsync(async (req, res) => {
  const { ...loginData } = req.body;

  const result = await AuthService.login(loginData);

  const { refreshToken, ...accessToken } = result;

  // set refresh token in the browser cookie
  const cookieOptions = {
    secure: config.node_env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<IUserLoginResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Logged in successfully',
    data: accessToken,
  });
});

const googleLogin: RequestHandler = catchAsync(async (req, res) => {
  const { ...payload } = req.body;

  try {
    // For Android App Only
    if (req?.body?.androidApp) {
      const { refreshToken, ...userData } = await AuthService.googleLogin(
        payload
      );

      // set refresh token in the browser cookie
      const cookieOptions = {
        secure: config.node_env === 'production',
        httpOnly: true,
      };

      res.cookie('refreshToken', refreshToken, cookieOptions);

      return sendResponse<IUserLoginResponse>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Logged in successfully',
        data: userData,
      });
    }
  } catch (error) {
    console.log({ error });

    return sendResponse<IUserLoginResponse>(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Something went wrong',
    });
  }
});

const refreshToken: RequestHandler = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.refreshToken(refreshToken);

  // set refresh token in the browser cookie
  const cookieOptions = {
    secure: config.node_env === 'production',
    httpOnly: true,
  };
  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'New access token generated successfully !',
    data: result,
  });
});

export const AuthController = {
  sendOTP,
  createUser,
  login,
  googleLogin,
  refreshToken,
};
