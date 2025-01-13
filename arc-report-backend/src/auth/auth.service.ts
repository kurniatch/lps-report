import { Injectable } from '@nestjs/common';
import { UserService } from './user/user.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async authenticate(email: string, password: string) {
    console.log("auth process")
    try {
      const user = await this.userService.validateUser(email, password);

      const token = jwt.sign(
        {
          uid: user.id,
        },
        "kerupuk asin",
        {
          expiresIn: '7d',
        },
      );
      if (user.admin === "true") {
        user.fullname = "admin";
      }
      const key = user.fullname;
      console.log(user.id);
      return { token, key };
    } catch (err) {
      throw err;
    }
  }
}
