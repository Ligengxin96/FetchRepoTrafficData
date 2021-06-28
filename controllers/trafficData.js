export const getRecord = async (date, model) => {
  if (!model) {
    throw new Error(`Model can't be null`);
  }
  console.log(`${new Date()}: Need be get reocrd date: ${date}`);
  try {
    const data = await model.findOne({ date });
    if (data) {
      console.log(`${new Date()}: Get reocrd successful, reocrd info: ${JSON.stringify(data)}`);
    }
    return data;
  } catch (error) {
    const errorMessage = `Get reocrd from mongoose failed with error: ${error.message}`;
    console.log(errorMessage);
  }
}

export const createReocrd = async (data, model) => {
  if (!model) {
    throw new Error(`Model can't be null`);
  }
  try {
    console.log(`${new Date()}: Need be created record date: ${data.date}`);
    const newData = new model(data);
    await newData.save();
    console.log(`${new Date()}: Save record to mongoose successful, record: ${JSON.stringify(newData)}`);
  } catch (error) {
    const errorMessage = `Save record to mongoose failed with error: ${error.message}`;
    console.log(errorMessage);
  }
}

export const updatReocrd = async (date, data, model) => {
  if (!model) {
    throw new Error(`Model can't be null`);
  }
  console.log(`${new Date()}: Need be updated record date: ${date}`);
  try {
    const newData = await model.findOneAndUpdate(date, data, { new: true });
    console.log(`${new Date()}: Update record successful, record: ${JSON.stringify(newData)}`);
  } catch (error) {
    const errorMessage = `Update record failed with error: ${error.message}`;
    console.log(errorMessage);
  }
}
