var express   = require('express'),
    proxy     = require('express-http-proxy'),
    app       = express();

app.use(express.static(process.cwd() + "/build"));
app.use('/proxy', proxy(process.env.BACKEND_URL));

app.listen(process.env.PORT, function () {
  console.log('Swap Web listening on ' + process.env.PORT + '!')
});
