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
    message: 'Successfully registered',
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

// Send Email OTP
const sendEmailOtp = catchAsync(async (req, res) => {
  const otpData = await AuthService.sendEmailOtp(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OTP sent successfully',
    data: otpData,
  });
});

// Verify Email OTP
const verifyEmailOtp = catchAsync(async (req, res) => {
  const { code } = req.body;

  const response = await AuthService.verifyEmailOtp({
    userId: req.user,
    code,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    ...response,
  });
});

export const AuthController = {
  sendOTP,
  createUser,
  login,
  googleLogin,
  refreshToken,
  sendEmailOtp,
  verifyEmailOtp,
};
