import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const DB_URI = process.env.DB_URI as string

main().catch((err) => console.log(err));

async function main() {
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(DB_URI);
    console.log('Connected to MongoDB successfully');
  } catch (error) { }
}


export default mongoose.connection;
