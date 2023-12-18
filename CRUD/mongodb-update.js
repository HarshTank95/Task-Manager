const { MongoClient, ObjectId } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const dbName = "task-manager";

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
  if (error) {
    return console.log("something want wrong please try again later");
  } else {
    const db = client.db(dbName);

    const updateDone = db.collection("users").updateMany(
      {
        // _id: new ObjectId("654148c51d12d80348b55551"),
        name: { $in: ["iyer", "Harsh Tank"] },
      },
      {
        $set: {
          name: "harsh",
        },
      }
    );

    updateDone
      .then((result) => {
        console.log(result.modifiedCount);
      })
      .catch((error) => {
        console.log("wow it works");
        console.log(error);
      });
  }
});
