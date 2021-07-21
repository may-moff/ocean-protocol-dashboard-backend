import { Request, Response, NextFunction } from 'express'
const jwt = require('jsonwebtoken')

module.exports = function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.header('ocean-auth-token')
    if (!token) throw new Error('Access denied')

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded) throw new Error('Invalid token')

    req.user = decoded
    if (decoded.payload.id !== req.params.userId) {
      throw new Error('Access denied')
    }

    next()
  } catch (error) {
    if (error === 'Access denied') {
      return res.status(403).send('Access denied')
    }
    if (error === 'Invalid token') {
      return res.status(400).send('Invalid token')
    }
  }
}
