import { Request } from "express";
import { User } from "./users/user.entity";

export interface UserRequest extends Request {
  user: User;
}
