import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.DATABASE_URL}`);
    console.log(`\nDatabase connected Successfully`);
  } catch (error) {
    console.log("Mongodb connection error: ", error);
    process.exit(1);
  }
};

export default connectDB;
