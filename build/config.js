"use strict";
require('dotenv').config();
const config = {
    algorithms: ['HS256'],
    // used a ! at the end as 'non-null assertion operator'.
    // It tells TypeScript that even though something looks
    // like it could be null, it can trust you that it's not:
    secret: process.env.JWT_SECRET
};
module.exports = config;
