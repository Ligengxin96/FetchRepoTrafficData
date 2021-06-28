import mongoose from 'mongoose';

const viewsDataSchema = mongoose.Schema({
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


export default viewsDataSchema;