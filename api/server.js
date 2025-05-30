require('dotenv').config(); // ALLOWS ENVIRONMENT VARIABLES TO BE SET ON PROCESS.ENV SHOULD BE AT TOP
const https = require('https');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const categoriesRoute = require('./routes/category.route');
const brandsRoute = require('./routes/brand.route');
const unitsRoute = require('./routes/productunit.route');
const supplierRoute = require('./routes/sulppier.route');
const productRoute = require('./routes/product.route');
const usersRoute = require('./routes/UserRoute');
const statusRoute = require('./routes/status.route');
const backupRoute = require('./routes/backup.route');
const userRoleRoute = require('./routes/RoleRoute');
const PaymentTypeRoute = require('./routes/PaymentRoute');
const InvoiceRoute = require('./routes/InvoiceRoute');
const SaleRoute = require('./routes/SaleRoute');
const SaleDetailRoute = require('./routes/SaleDetailRoute');
const customerRoute = require('./routes/CustomerRoute');
const chartRoute = require('./routes/ChartRoute');
const app = express();

// Middleware

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173',
  })
);
app.use(cookieParser());
app.use('/images', express.static(path.join(__dirname, '/images')));
app.use('/audio', express.static(path.join(__dirname, '/audio')));
app.use(express.json()); // parse json bodies in the request object
app.use(userRoleRoute);
app.use(brandsRoute);
app.use(categoriesRoute);
app.use(unitsRoute);
app.use(supplierRoute);
app.use(productRoute);
app.use(usersRoute);
app.use(statusRoute);
app.use(backupRoute);
app.use(PaymentTypeRoute);
app.use(InvoiceRoute);
app.use(SaleRoute);
app.use(SaleDetailRoute);
app.use(customerRoute);
app.use(chartRoute);

app.use(bodyParser.urlencoded({ extended: false }));

// Global Error Handler. IMPORTANT function params MUST start with err
app.use((err, req, res, next) => {
  console.log(err.stack);
  console.log(err.name);
  console.log(err.code);

  res.status(500).json({
    message: 'Something went rely wrong',
  });
});


const options = {
  key: fs.readFileSync('/home/ubuntu/certs/privkey.pem'),
  cert: fs.readFileSync('/home/ubuntu/certs/fullchain.pem')
};


const PORT = process.env.PORT || 3001;
https.createServer(options, app).listen(PORT, () => {
  console.log('HTTPS server running on port 3001');
});

// Listen on pc port

// app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
