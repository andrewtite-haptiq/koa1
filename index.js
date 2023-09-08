const Koa = require('koa');
const dotenv = require('dotenv');
dotenv.config();

const constantErrors = require('./constants/error-handling');
const { ERROR: _ERRORS } = require('./constants/error-handling');

const app = new Koa();

// add method to ctx
app.context.date = Date();
// add property to ctx
app.context.userData = {
  first: 'Andrew',
  last: 'Tite',
};

app.use(async (ctx) => {
  try {
    return ctx.response.body = await ctx.userData;
  } catch (err) {
    return ctx.throw(_ERRORS.INVALID_REQUEST.code, err);
  }
});

app.listen(process.env.PORT);
