const MongoClient = require('mongodb').MongoClient;
const dbConfig = require('./dbConfig.json');
const { seedFunc } = require('./seed');
const { createPaypalProduct } = require('./utils/paypal');

const sourceUrl = dbConfig.SOURCE_DB_URL;
const sourceDbName = dbConfig.SOURCE_DB_NAME;
const targetDbName = dbConfig.TARGET_DB_NAME;
const targetUrl = dbConfig.TARGET_DB_URL;
const collections = dbConfig.COLLECTIONS;

MongoClient.connect(sourceUrl)
  .then((sourceClient) => {
    const sourceDb = sourceClient.db(sourceDbName);

    MongoClient.connect(targetUrl)
      .then(async (targetClient) => {
        const targetDb = targetClient.db(targetDbName);
        for (const collection of collections) {
          const sourceCollection = sourceDb.collection(collection);
          const targetCollection = targetDb.collection(collection);
          if (collection == 'products')
            await seedFunc(targetCollection, 'products');
          if (collection == 'packages')
            await seedFunc(targetCollection, 'packages', targetDb);
          else {
            const docs = await sourceCollection.find({}).toArray();
            const promises = docs.map((doc) =>
              targetCollection.updateOne(
                { _id: doc._id },
                { $set: doc },
                { upsert: true }
              )
            );
            await Promise.all(promises);
          }
          console.log(`Migration done for ${collection} collection...`);
        }
        targetClient.close();
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        sourceClient.close();
      });
  })
  .catch((err) => {
    throw err;
  });
