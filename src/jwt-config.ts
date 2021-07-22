require('dotenv').config()

const jwtConfig = {
  algorithms: ['HS256' as const],
  // used a ! at the end as 'non-null assertion operator'.
  // It tells TypeScript that even though something looks
  // like it could be null, it can trust you that it's not:
  secret: process.env.JWT_SECRET!
}

module.exports = jwtConfig
