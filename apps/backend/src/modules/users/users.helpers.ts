import { ZUserDto, ZUserResponseDto } from "./users.dto";

export const toUserResponseDto = (user: ZUserDto): ZUserResponseDto => {
  const { password, ...userResponse } = user;
  return userResponse;
};
