import { NextFunction, Request, Response } from 'express';
import { User } from '../../models/user.model';

export const find = async (req: Request, res: Response, next: NextFunction) => {
  // If a query string ?publicAddress=... is given, then filter results
  const address =
    req.query && req.query.publicAddress
      ? { publicAddress: req.query.publicAddress }
      : undefined;
  try {
    const user = await User.findOne(address);
    res.json(user);
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
    const newUser = new User({ publicAddress });
    await newUser.save();
    res.json(newUser);
  } catch (error) {
    console.log(error);
    next;
  }
};
