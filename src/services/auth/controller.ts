import { recoverPersonalSignature } from 'eth-sig-util';
const ethereumjsUtil = require('ethereumjs-util');
const { bufferToHex } = ethereumjsUtil;
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
const crypto = require('crypto');

import { config } from '../../config';
import { UserModel, IUser } from '../../models/user.model';

export const create = (req: Request, res: Response, next: NextFunction) => {
  const { signature, publicAddress } = req.body;
  if (!signature || !publicAddress)
    return res
      .status(400)
      .send({ error: 'Request should have signature and publicAddress' });

  return (
    UserModel.findOne({ publicAddress })
      ////////////////////////////////////////////////////
      // Step 1: Get the user with the given publicAddress
      ////////////////////////////////////////////////////
      .then((user) => {
        if (!user) {
          res.status(401).send({
            error: `User with publicAddress ${publicAddress} is not found in database`,
          });

          return null;
        }

        return user;
      })
      ////////////////////////////////////////////////////
      // Step 2: Verify digital signature
      ////////////////////////////////////////////////////
      .then((user) => {
        if (!(user instanceof UserModel)) {
          // Should not happen, we should have already sent the response
          throw new Error('User is not defined in "Verify digital signature".');
        }

        const msg = `I am signing my one-time nonce: ${user.nonce}`;

        // We now are in possession of msg, publicAddress and signature. We
        // will use a helper from eth-sig-util to extract the address from the signature
        const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
        const address = recoverPersonalSignature({
          data: msgBufferHex,
          sig: signature,
        });

        // The signature verification is successful if the address found with
        // sigUtil.recoverPersonalSignature matches the initial publicAddress
        if (address.toLowerCase() === publicAddress.toLowerCase()) {
          return user;
        } else {
          res.status(401).send({
            error: 'Signature verification failed',
          });

          return null;
        }
      })
      ////////////////////////////////////////////////////
      // Step 3: Generate a new nonce for the user
      ////////////////////////////////////////////////////
      .then((user: IUser | null) => {
        if (!(user instanceof UserModel)) {
          // Should not happen, we should have already sent the response

          throw new Error(
            'User is not defined in "Generate a new nonce for the user".'
          );
        }

        user.nonce = crypto.randomInt(10000, 100000000);
        return user.save();
      })
      ////////////////////////////////////////////////////
      // Step 4: Create JWT
      ////////////////////////////////////////////////////
      .then((user: IUser) => {
        return new Promise<string>((resolve, reject) =>
          // https://github.com/auth0/node-jsonwebtoken
          jwt.sign(
            {
              payload: {
                id: user._id,
                publicAddress,
              },
            },
            config.secret,
            {
              algorithm: config.algorithms[0],
            },
            (err, token) => {
              if (err) {
                return reject(err);
              }
              if (!token) {
                return new Error('Empty token');
              }
              return resolve(token);
            }
          )
        );
      })
      .then((accessToken: string) => res.json({ accessToken }))
      .catch(next)
  );
};
