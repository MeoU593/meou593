const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();
require('dotenv').config();
const database = require('./config/mongoDB.database');

const clientRoute = require('./routes/client/index.route');
const adminRoute = require('./routes/admin/index.route');

const app = express();
const port = process.env.PORT;

// Body-parser middleware nên được gọi trước các tuyến
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin: ['http://localhost:3001' ,'https://da-cnpm-be.vercel.app' ],  
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));
// Cookie-parser middleware
app.use(cookieParser());
// Morgan
app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));
// Conect DB
database.connect();
// Import Document API Swagger
const swaggerUi = require('swagger-ui-express');
const yamljs = require('yamljs');
// Load Swagger file (yaml)
const swaggerDocument = yamljs.load(path.resolve(__dirname, 'swagger.yaml'));

// Sử dụng Swagger UI để hiển thị tài liệu API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



// Import routes 
clientRoute(app);
adminRoute(app);


app.get('/', (req, res) => {
    res.send('Restaurant Management System');
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})
// Đây là code chính
