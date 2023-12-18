const { MongoClient, ObjectId } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const dbName = "practice";

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
  if (error) {
    return console.log("something want wrong");
  } else {
    const db = client.db(dbName);

    const test = db
      .collection("account")
      .find({
        limit: { $eq: 9000 },
      })
      .toArray();

    test
      .then((result) => {
        console.log(result.length);
      })
      .catch((error) => {
        console.log(error);
      });
  }
});
