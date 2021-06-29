import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Octokit } from "@octokit/rest";

import viewsDataSchema from './models/viewsData.js';
import clonesDataSchema from './models/clonesData.js';
import { getRecord, createReocrd, updatReocrd } from './controllers/trafficData.js'

import repos from './config/repos.js';

dotenv.config();
mongoose.set('useFindAndModify', false);
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const username = process.env.USER_NAME;

const promiseFactory = (pomise) => {
  return new Promise((resolve, _) => {
    resolve(pomise);
  }).catch((error) => {
    console.error(JSON.stringify(error));
    return error;
  });
}

const connectDB = async(repoName) => {
  console.log(`Begin connect MongooDB ${repoName}`);
  try {
    const connectStr = process.env.CONNECT_STRING.replace(/{database}/, repoName);
    const dbConnect = await mongoose.createConnection(connectStr, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`MongooDB ${repoName} connect successful`);
    await fetchRepooTrafficData(repoName, dbConnect);
  } catch (error) {
    console.error(`MongooDB ${repoName} connect faild with error: ${error.message}`);
  }
}

const processData = (existRecord, data, model) => {
  if (existRecord && !existRecord.date) {
    throw new Error(`Unknown error occrrence when process ${JSON.stringify(data)}.`);
  }
  if (existRecord) {
    console.log(`This record with date: ${existRecord.date} is exist, update record.`);
    data.lastUpdateTime = new Date();
    return { operation: 'update', promise: promiseFactory(updatReocrd(data.timestamp, data, model))};
  } else {
    data.date = data.timestamp;
    return { operation: 'create', promise: promiseFactory(createReocrd(data, model))};
  }
}

const fetchRepooTrafficData = async(repoName, dbConnect) => {
  try {
    const [{ data: { views } }, { data: { clones } }] = await Promise.all([
      promiseFactory(octokit.rest.repos.getViews({ owner: username, repo: repoName, per: 'day' })),
      promiseFactory(octokit.rest.repos.getClones({ owner: username, repo: repoName, per: 'day' }))
    ]);

    console.log(`Fetch ${repoName} repo traffic date successful.`);

    const viewsDataModel = dbConnect.model('viewsData', viewsDataSchema);
    const clonesDataModel = dbConnect.model('clonesData', clonesDataSchema);

    const allGetRecordPromise = [];
    const allUpdatePromise = [];
    const allCreatePromise = [];
    const allNewData = [];
    for (let data of views) {
      allNewData.push({ data, model: viewsDataModel });
      allGetRecordPromise.push(promiseFactory(getRecord(data.timestamp, viewsDataModel)));
    }

    for (let data of clones) {
      allNewData.push({ data, model: clonesDataModel });
      allGetRecordPromise.push(promiseFactory(getRecord(data.timestamp, clonesDataModel)));
    }

    const existRecords = await Promise.all(allGetRecordPromise);

    for (let i = 0; i < existRecords.length; i++) {
      const { operation, promise } = processData(existRecords[i], allNewData[i].data, allNewData[i].model);
      if (operation === 'update') {
        allUpdatePromise.push(promise);
      } 
      if (operation === 'create') {
        allCreatePromise.push(promise);
      } 
    }

    try {
      if (allUpdatePromise.length > 0) {
        await Promise.all(allUpdatePromise);
        console.log(`Update all records successful.`);
      }
    } catch (error) {
      console.error(`Update all records failed with error: ${error.message}`);
    }

    try {
      if (allCreatePromise.length > 0) {
        await Promise.all(allCreatePromise);
        console.log(`Create all records successful.`);
      }
    } catch (error) {
      console.error(`Create all records failed with error: ${error.message}`);
    }

  } catch (error) {
    console.error(`Fetch repo traffic data failed with error: ${error.message}`);
  }
}

const main = async() => {
  console.log(`Task begin, current time: ${new Date()}`);
  for await (let repo of repos) {
    await connectDB(repo)
  }
  console.log(`Task finish, current time: ${new Date()}`);
  process.exit(0);
}

main();
