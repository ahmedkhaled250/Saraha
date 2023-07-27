import mongoose from "mongoose";
const connectDB = async()=>{
    return await mongoose.connect(process.env.DBURL)
    .then(()=>console.log('connected DB'))
    .catch((err)=>console.log('Fail to connect DB'))
}
export default connectDB