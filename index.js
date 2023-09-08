const Koa = require('koa');
const dotenv = require('dotenv');
dotenv.config();

const app = new Koa();

// add method to ctx
app.context.date = Date();
// add property to ctx
app.context.userData = {
  first: 'Andrew',
  last: 'Tite',
};

app.use(ctx => {
  // use state (like React)
  ctx.state.user = 'Andrew Tite';
  // request object usage
  const from = ctx.request.origin || ctx.request.ip;
  const method = ctx.request.method;
  // use body (like Express)
  // ctx.response.body = `Hello ${ctx.state.user}, it's ${ctx.date}!`;
  // Output to console
  console.log(from);
  console.log(method);
  // Send user data
  // ctx.response.body = ctx.userData;
  ctx.response.body = `Hello ${ctx.userData.first} ${ctx.userData.last}!`;
});

app.listen(process.env.PORT);
