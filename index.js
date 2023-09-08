const Koa = require('koa');
const dotenv = require('dotenv');
dotenv.config();

const constantErrors = require('./constants/error-handling');
const { ERROR: _ERRORS } = require('./constants/error-handling');

const app = new Koa();

// add method to ctx
app.context.date = Date();
// add property to ctx
// app.context.userData = {
//   first: 'Andrew',
//   last: 'Tite',
// };

app.use(ctx => {
  if (ctx.userData) {
    return (ctx.body = `Hello ${ctx.userData.first} ${ctx.userData.last}`);
  } else {
    return ctx.throw(_ERRORS.UNAUTHORIZED.code, 'data required');
  }
});

app.listen(process.env.PORT);
