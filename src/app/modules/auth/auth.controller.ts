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
import { User } from '../user/user.model';
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
    message: 'user logged in successfully',
    data: accessToken,
  });
});

// const googleLogin: RequestHandler = catchAsync(async (req, res) => {
//   const { ...loginData } = req.body;

//   try {
//     // For Android App Only
//     if (req?.body?.androidApp) {
//       const userExists = await User.findOne({ email: req?.body?.email });

//       if (userExists) {
//         const { refreshToken, ...userData } = await AuthService.googleLogin(
//           loginData
//         );

//         // set refresh token in the browser cookie
//         const cookieOptions = {
//           secure: config.node_env === 'production',
//           httpOnly: true,
//         };

//         res.cookie('refreshToken', refreshToken, cookieOptions);

//         return sendResponse<IUserLoginResponse>(res, {
//           statusCode: httpStatus.OK,
//           success: true,
//           message: 'Logged in successfully',
//           data: userData,
//         });
//       } else {
//         // User not found
//         return sendResponse<IUserLoginResponse>(res, {
//           statusCode: httpStatus.BAD_REQUEST,
//           success: false,
//           message: 'User not found. Please register first!',
//         });
//       }
//     }
//   } catch (error) {
//     console.log({ error });

//     return sendResponse<IUserLoginResponse>(res, {
//       statusCode: httpStatus.BAD_REQUEST,
//       success: false,
//       message: 'Something went wrong',
//     });
//   }
// });

const googleLogin: RequestHandler = catchAsync(async (req, res) => {
  const { ...loginData } = req.body;

  try {
    // For Android App Only
    if (req?.body?.androidApp) {
      const userExists = await User.findOne({ email: req?.body?.email });

      if (userExists) {
        const { refreshToken, ...userData } = await AuthService.googleLogin(
          loginData
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
      } else {
        // User not found
        return sendResponse<IUserLoginResponse>(res, {
          statusCode: httpStatus.BAD_REQUEST,
          success: false,
          message: 'User not found. Please register first!',
        });
      }
    }
    // const { tokenId } = req.body;
    // const ticket = await client.verifyIdToken({
    //   idToken: tokenId,
    //   audience: secretToken,
    // });
    // const { payload } = ticket;

    // if (req.body.sponsorid) {
    //   const checkSponsorid = await Users.findOne({
    //     username: req.body.sponsorid,
    //   });
    //   if (!checkSponsorid) {
    //     return r.rest(res, false, 'Invalid sponsor id');
    //   }
    // }
    // // const checkMobile = await Users.findOne({
    // //   mobile: req.body.mobile,
    // // });
    // // if (checkMobile) {
    // //   return r.rest(res, false, "Already exist mobile");
    // // }

    // if (payload) {
    //   const { picture, given_name, family_name, email, email_verified } =
    //     payload;

    //   if (email_verified) {
    //     const userExists = await Users.findOne({ email: email });

    //     if (userExists) {
    //       // generate token only
    //       const token = createJWT({
    //         email: userExists.email,
    //         username: userExists.username,
    //         id: userExists._id,
    //       });

    //       return res.status(200).json({
    //         username: userExists.username,
    //         first_name: userExists.first_name,
    //         token: token,
    //         full_name: `${userExists.first_name} ${userExists.last_name}`,
    //         message: 'Login success',
    //         isLoggedIn: true,
    //       });
    //     } else {
    //       // Create account and generate token
    //       let username;
    //       let password;
    //       let isUsernameUnique = false;
    //       let isMobileUnique = false;
    //       while (!isUsernameUnique && !isMobileUnique) {
    //         username = generateRandomUsername(given_name, family_name);
    //         const isUserExists = await Users.findOne({ username: username });
    //         const isMobileExists = await Users.findOne({
    //           mobile: req.body.mobile,
    //         });

    //         if (!isUserExists) {
    //           isUsernameUnique = true;
    //         }

    //         if (!isMobileExists) {
    //           isMobileUnique = true;
    //         }
    //       }
    //       password = generateRandomPassword();
    //       const user = await Users.create({
    //         sponsorid: req?.body?.sponsorid || 'taskplanet',
    //         username: username,
    //         first_name: req.body.first_name,
    //         last_name: req.body.last_name,
    //         password: encryptPassword(password),
    //         email: email,
    //         mobile: req.body.mobile,
    //         verified: true,
    //         profile_pic: picture,
    //         registerVia: 'website-google',
    //         join_date: new Date(getBDTime().date).getTime(),
    //         date: new Date(getBDTime().date).toDateString(),
    //         join_time: getBDTime().time,
    //       });
    //       await giveRegisterReferralPoint(user.username);
    //       await DistributePoints(user.username, 10, 'Register');
    //       if (user) {
    //         // generate token only
    //         const token = createJWT({
    //           email: user.email,
    //           username: user.username,
    //           id: user._id,
    //         });

    //         await Wallet.create({
    //           username: user.username,
    //         });

    //         googleLoginConfirmationMail(user, password);
    //         await Users.findOneAndUpdate(
    //           { username: user.username },
    //           { $set: { isEmailVerified: true } }
    //         );
    //         return res.status(200).json({
    //           username: user.username,
    //           first_name: user.first_name,
    //           token: token,
    //           full_name: `${user.first_name} ${user.last_name}`,
    //           message: 'Account created successfully',
    //         });
    //       }
    //     }
    //   } else {
    //     return r.rest(res, false, 'Email not verified');
    //   }
    //   return res.status(200).json(payload);
    // }
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
