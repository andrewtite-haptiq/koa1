const Koa = require('koa');
const dotenv = require('dotenv');
dotenv.config();

const constantErrors = require('./constants/error-handling');
const { ERROR: _ERRORS } = require('./constants/error-handling');

const app = new Koa();

/*
  Explanation of the following code:
  1. The code adds a property called "userData" to the "ctx" object in the application context.
     This property contains the first and last name of a user.
  2. The first middleware function is executed when a request is made to the application.
     It uses the "next" function to pass control to the next middleware function.
  3. The second middleware function is executed from where the last one executed `await next()`.
     The previous middleware will continue from that same point when this one finishes.
     We are getting a date and storing it in `start` variable.
  4. The second middleware function uses the "next" function to pass control to the next middleware function.
     Because we are waiting for the next middleware to finish, we are using `await` and will be able to determine
     how long it took for the next middleware to finish in milliseconds.
  5. The third middleware function is executed.
     It sets the response body to the "userData" property in the context and returns it.
  6. Control is passed back here from the next middleware function.
     We are getting the current date and subtracting the date we stored in `start` variable before the next
     middleware function was executed.
     This will give us the time it took for the request to pass through the previous middleware functions.
     We are setting the "X-Response-Time" header in the response context with the calculated time.
  7. The response is sent back to the client with the "userData" property in the response body.
     We are getting the "X-Response-Time" header from the response context, which we set in the previous middleware,
     and logging it to the console.
 */

// Add property to ctx
// 1. The code adds a property called "userData" to the "ctx" object in the application context.
//    This property contains the first and last name of a user.
app.context.userData = {
  first: 'Andrew',
  last: 'Tite',
};

// logger
app.use(async (ctx, next) => {
  // 2. The first middleware function is executed when a request is made to the application.
  //    It uses the "next" function to pass control to the next middleware function.
  await next();
  // 7. The response is sent back to the client with the "userData" property in the response body.
  //    We are getting the "X-Response-Time" header from the response context, which we set in the previous middleware,
  //    and logging it to the console.
  const responseTime = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${responseTime}`);
})

app.use(async (ctx, next) => {
  // 3. The second middleware function is executed from where the last one executed `await next()`.
  //    The previous middleware will continue from that same point when this one finishes.
  //    We are getting a date and storing it in `start` variable.
  const start = Date.now();
  // 4. The second middleware function uses the "next" function to pass control to the next middleware function.
  //    Because we are waiting for the next middleware to finish, we are using `await` and will be able to determine
  //    how long it took for the next middleware to finish in milliseconds.
  await next();
  // 6. Control is passed back here from the next middleware function.
  //    We are getting the current date and subtracting the date we stored in `start` variable before the next
  //    middleware function was executed.
  //    This will give us the time it took for the request to pass through the previous middleware functions.
  //    We are setting the "X-Response-Time" header in the response context with the calculated time.
  const millisecond = Date.now() - start;
  ctx.set('X-Response-Time', `${millisecond}ms`);
});

// response
app.use(async (ctx) => {
  // 5. The third middleware function is executed.
  //    It sets the response body to the "userData" property in the context and returns it.
  return ctx.response.body = ctx.userData;
});


app.listen(process.env.PORT);
