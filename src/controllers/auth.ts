import { NextFunction, Request, Response } from 'express'
import { UserModel, IUser } from '../models/UserModel'
const { recoverPersonalSignature } = require('eth-sig-util')
const ethereumjsUtil = require('ethereumjs-util')
const { bufferToHex } = ethereumjsUtil
const jwt = require('jsonwebtoken')
const jwtConfig = require('../jwt-config')

module.exports.create = (req: Request, res: Response, next: NextFunction) => {
  const { signature, publicAddress } = req.body
  if (!signature || !publicAddress)
    return res
      .status(400)
      .send({ error: 'Request should have a signature and a publicAddress' })

  return (
    UserModel.findOne({ publicAddress })
      // Get the user with the given publicAddress
      .then((user) => {
        if (!user) {
          res.status(401).send({
            error: `User with publicAddress ${publicAddress} not found in database`
          })

          return null
        }

        return user
      })
      // Verify digital signature
      .then((user) => {
        if (!(user instanceof UserModel)) {
          // Should not happen, we should have already sent the response
          throw new Error('User is not defined in "Verify digital signature".')
        }

        const msg = `I am signing my one-time nonce: ${user.nonce}`

        // We now are in possession of msg, publicAddress and signature. We
        // will use a helper from eth-sig-util to extract the address from the signature
        const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'))
        const address = recoverPersonalSignature({
          data: msgBufferHex,
          sig: signature
        })

        // The signature verification is successful if the address found with
        // sigUtil.recoverPersonalSignature matches the initial publicAddress
        if (address.toLowerCase() === publicAddress.toLowerCase()) {
          return user
        } else {
          res.status(401).send({
            error: 'Signature verification failed'
          })

          return null
        }
      })
      // Generate a new nonce for the user
      .then((user: IUser | null) => {
        if (!(user instanceof UserModel)) {
          // Should not happen, we should have already sent the response

          throw new Error(
            'User is not defined in "Generate a new nonce for the user".'
          )
        }

        user.nonce = Math.floor(Math.random() * 10000)
        return user.save()
      })
      // Create JWT
      .then((user: IUser) => {
        return new Promise<string>((resolve, reject) =>
          jwt.sign(
            {
              payload: {
                id: user._id,
                publicAddress
              }
            },
            jwtConfig.secret,
            {
              algorithm: jwtConfig.algorithms[0]
            },
            (err: any, token: string | PromiseLike<string>) => {
              if (err) {
                return reject(err)
              }
              if (!token) {
                return new Error('Empty token')
              }
              return resolve(token)
            }
          )
        )
      })
      .then((accessToken: string) => res.json({ accessToken }))
      .catch(next)
  )
}
