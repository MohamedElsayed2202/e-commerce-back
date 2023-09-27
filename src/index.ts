import 'dotenv/config'
import express from "express";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import bootstrap from './utils/bootstrap';
import cors from "cors"

const options: cors.CorsOptions = {
    origin: ['http://localhost:3000', 'https://localhost:8080'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}

const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(options));
app.use(cookieParser());
bootstrap(app)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on Port ${process.env.PORT}`);
})