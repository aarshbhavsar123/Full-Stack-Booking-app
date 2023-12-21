const mongoose = require("mongoose");
const {Schema} = mongoose;
const bookingSchema = new Schema({
    place:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Place",
        required:true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    checkInDate:{
        type:Date,
        required:true
    },
    checkOutDate:{
        type:Date,
        required:true
    },
    guests:{
        type:Number,
        required:true
    },
    name:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true
    } ,
    totalPrice:{
        type:String,
        required:true,
    }
})
const BookingModel = mongoose.model("Booking",bookingSchema);
module.exports = BookingModel;