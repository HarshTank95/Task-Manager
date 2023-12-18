const { MongoClient, ObjectId } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const dbName = "task-manager";

const id = new ObjectId();
console.log(id);
console.log(id.getTimestamp());
console.log(id.id.length);
console.log(id.toHexString().length);

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
  if (error) {
    return console.log("Error connecting to the database:", error);
  } else {
    console.log("Connected to the database");

    const db = client.db(dbName);
    // db.collection("users").insertOne(
    //   {
    //     name: "Harsh Tank",
    //     age: 25,
    //   },
    //   (error, result) => {
    //     if (error) {
    //       console.log("something want wrong");
    //     } else {
    //       console.log(`${result.ops[0].name} is successfully inserted`);
    //     }
    //   }
    // );

    // db.collection("tasks").insertMany(
    //   [
    //     {
    //       description: "office work",
    //       completed: true,
    //     },
    //     {
    //       description: "sleep on time",
    //       completed: false,
    //     },
    //     {
    //       description: "office on time",
    //       completed: true,
    //     },
    //   ],
    //   (error, result) => {
    //     if (error) {
    //       console.log("somethig want wrong");
    //     } else {
    //       console.log(`${JSON.stringify(result.ops)}`);
    //     }
    //   }
    // );
    // Now, you can perform database operations here
  }
});
