import { connect } from "mongoose";
const connectDB = async () => {
  return await connect(process.env.DBURI)
    .then(() => console.log("connected db"))
    .catch(err => console.log("connection error"));
};
export default connectDB