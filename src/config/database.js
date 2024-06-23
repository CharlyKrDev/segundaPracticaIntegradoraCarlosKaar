import mongoose from 'mongoose';
import dotenv from "dotenv";
dotenv.config();
export const mongoServer = process.env.MONGO_URL;
mongoose
  .connect(mongoServer)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});



export default db;
