
import { getAllUsersService,updateUserService } from '../services/user.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';


export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsersService( );

  sendSuccess(res, 201, 'Users retrieved successfully.', { users });
});

export const updateUser = asyncHandler(async(req,res)=>{
  const userId = req.params.id;

  const user = await updateUserService(userId, req.body);

  sendSuccess(res, 200, 'User updated successfully.', { user });
})