
const express = require('express');
const app = express();
const errorMiddleware=require('./middlewares/error');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const xss = require('xss-clean');
const path = require('path');
const cookieParser=require('cookie-parser');
const compression=require('compression')
const cors=require('cors')
app.enable('trust proxy')
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(cors())
app.options('*',cors)


const authRouter=require('./Routers/authRoutes');
const roleRoutes=require('./Routers/roleRoutes');
const communityRoutes=require('./Routers/communityRoutes');
const memberRoutes=require('./Routers/memberRoutes');
 



app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser())


/// for post the json file
// data senitize from nosql query
app.use(mongoSanitize());

//  protect gata from html code
app.use(xss());

// to control parameter pollution
app.use(hpp({
    whitelist: ["difficulty", 'ratingsAverage', "duration", "maxGroupSize", "price"]
}))

app.use(compression())

const limit = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'you attemp so many request from this IP plaese do it agian after one hour'
})
app.use('/api', limit);


// API End points

app.use('/v1/role',roleRoutes)
app.use('/v1/auth',authRouter)
app.use('/v1/community',communityRoutes)
app.use('/v1/member',memberRoutes)

app.use(errorMiddleware)
module.exports = app;