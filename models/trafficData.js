import mongoose from 'mongoose';

const trafficDataSchema = mongoose.Schema({
    count: Number,
    uniques: Number,
    date: Date,
    createdTime: {
        type: Date,
        default: new Date(),
    },
    lastUpdateTime: {
      type: Date,
      default: new Date(),
  }
})


export default trafficDataSchema;