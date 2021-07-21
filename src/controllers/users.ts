import { NextFunction, Request, Response } from 'express'
import { UserModel, IUser } from '../models/UserModel'

module.exports.find = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // If a query string ?publicAddress=... is given, then filter results
  const address: any =
    req.query && req.query.publicAddress
      ? { publicAddress: req.query.publicAddress }
      : undefined
  try {
    if (!address) throw new Error('Invalid Address')
    const users = await UserModel.find(address)
    if (!users) throw new Error()
    res.status(200).json(users)
  } catch (error) {
    if (error === 'Invalid Address') {
      res.status(400).send({ message: 'Invalid Address' })
    } else {
      res.status(404).send({ message: 'User not found', error })
    }
    next()
  }
}

module.exports.create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { publicAddress } = req.body
  try {
    const newUser = new UserModel({ publicAddress })
    await newUser.save()
    res.status(200).json(newUser)
  } catch (error) {
    console.log(error)
    next()
  }
}

module.exports.get = (req: Request, res: Response, next: NextFunction) => {
  // AccessToken payload is in req.user.payload, especially its `id` field
  // UserId is the param in /users/:userId
  // We only allow user accessing herself, i.e. require payload.id==userId
  if ((req as any).user.payload.id !== +req.params.userId) {
    return res.status(401).send({ error: 'You can can only access yourself' })
  }
  return UserModel.findById(req.params.userId)
    .then((user: IUser | null) => res.json(user))
    .catch(next)
}

module.exports.patch = (req: Request, res: Response, next: NextFunction) => {
  // Only allow to fetch current user
  if ((req as any).user.payload.id !== +req.params.userId) {
    return res.status(401).send({ error: 'You can can only access yourself' })
  }
  return UserModel.findById(req.params.userId)
    .then((user: IUser | null) => {
      if (!user) {
        return user
      }

      Object.assign(user, req.body)
      return user.save()
    })
    .then((user: IUser | null) => {
      return user
        ? res.json(user)
        : res.status(401).send({
            error: `User with publicAddress ${req.params.userId} is not found in database`
          })
    })
    .catch(next)
}
