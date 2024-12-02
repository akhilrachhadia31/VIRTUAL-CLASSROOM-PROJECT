import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './db/index.js';

dotenv.config({
    path: "./.env"
})

const PORT = process.env.PORT || 4000;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "hello";

const initialize = async () => { 
    await connectDB()
    .then(() => {
        app.listen(8080, () => {
            console.log(`Server running on port ${PORT}! ^^`);
        });
    })
    .catch(err => console.log("mongo db connection error: " + err))
}
initialize();

export default JWT_SECRET_KEY;