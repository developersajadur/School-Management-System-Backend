import status from 'http-status';
import config from '../../config';
import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../helpers/sendResponse';
import { AuthServices } from '../Auth/auth.service';

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req?.body);
  const { token } = result;
  res.cookie('token', token, {
    secure: config.node_env === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Logged in successfully!',
    data: { token },
  });
});

export const AuthControllers = {
  loginUser,
};
