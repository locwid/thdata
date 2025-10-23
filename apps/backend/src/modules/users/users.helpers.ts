import { TUserDto, TUserResponseDto } from "./users.dto";

export const toUserResponseDto = ({
  password,
  createdAt,
  updatedAt,
  ...user
}: TUserDto): TUserResponseDto => {
  return {
    ...user,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  };
};
