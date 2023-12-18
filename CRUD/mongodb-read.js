const { MongoClient, ObjectId } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const dbName = "task-manager";

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
  if (error) {
    return console.log("something want wrong that cause the erroe");
  } else {
    const db = client.db(dbName);

    db.collection("users").findOne({ _id: new ObjectId("654148c51d12d80348b55551") }, (error, user) => {
      console.log(user);
    });

    db.collection("users")
      .find({ name: { $regex: "har" } })
      .toArray((error, users) => {
        if (error) {
          console.log("Something want wrong that cause the error");
        } else {
          console.log(users);
        }
      });

    db.collection("users")
      .find({ name: "kohli" })
      .count((error, count) => {
        if (error) {
          console.log("Something want wrong that cause the error");
        } else {
          console.log(count);
        }
      });
  }
});
