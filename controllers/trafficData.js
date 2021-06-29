import moment from "moment";

export const getRecord = async (date, model) => {
  if (!model) {
    throw new Error(`Model can't be null`);
  }
  console.log(`Need be get ${model.modelName} record date: ${moment(date).format('yyyy-MM-DD')}`);
  try {
    const data = await model.findOne({ date });
    if (data) {
      console.log(`Get ${model.modelName} record successful, ${model.modelName} record info: ${JSON.stringify(data)}`);
    }
    return data;
  } catch (error) {
    const errorMessage = `Get ${model.modelName} record from mongoose failed with error: ${error.message}`;
    console.error(errorMessage);
  }
}

export const createReocrd = async (data, model) => {
  if (!model) {
    throw new Error(`Model can't be null`);
  }
  try {
    console.log(`Need be created ${model.modelName} record date: ${moment(data.date).format('yyyy-MM-DD')}`);
    const newData = new model(data);
    await newData.save();
    console.log(`Save ${model.modelName} record to mongoose successful, ${model.modelName} record: ${JSON.stringify(newData)}`);
  } catch (error) {
    const errorMessage = `Save ${model.modelName} record to mongoose failed with error: ${error.message}`;
    console.error(errorMessage);
  }
}

export const updatReocrd = async (date, data, model) => {
  if (!model) {
    throw new Error(`Model can't be null`);
  }
  console.log(`Need be updated ${model.modelName} record date: ${moment(date).format('yyyy-MM-DD')}`);
  try {
    const newData = await model.findOneAndUpdate(date, data, { new: true });
    console.log(`Update ${model.modelName} record successful, ${model.modelName} record: ${JSON.stringify(newData)}`);
  } catch (error) {
    const errorMessage = `Update ${model.modelName} record failed with error: ${error.message}`;
    console.error(errorMessage);
  }
}
