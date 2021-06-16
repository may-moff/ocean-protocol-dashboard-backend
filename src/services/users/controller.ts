import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../../models/user.model';

export const find = async (req: Request, res: Response, next: NextFunction) => {
  // If a query string ?publicAddress=... is given, then filter results
  const address: any =
    req.query && req.query.publicAddress
      ? { publicAddress: req.query.publicAddress }
      : undefined;

  try {
    const users = await UserModel.find(address);
    res.json(users);
  } catch (error) {
    console.log(error);
    next;
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { publicAddress } = req.body;
  try {
    const newUser = new UserModel({ publicAddress });
    await newUser.save();
    res.json(newUser);
  } catch (error) {
    console.log(error);
    next;
  }
};
