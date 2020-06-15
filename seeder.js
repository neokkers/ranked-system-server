// import { players } from "./config/mock";

const dotenv = require("dotenv");
const colors = require("colors");
const mongoose = require("mongoose");

dotenv.config({ path: "./config/config.env" });

const User = require("./models/User");
const WerewolfProfile = require("./models/Werewolf/WerewolfProfile");
const WerewolfGame = require("./models/Werewolf/WerewolfGame");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const deleteUsers = async () => {
  try {
    await User.deleteMany();

    console.log("Users destroyed...".red.inverse);
  } catch (error) {
    console.log(error);
  }
};
const createUsers = async () => {
  try {
    await User.insertMany(players);

    console.log("Users added...".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};
const deleteWerewolfProfiles = async () => {
  try {
    await WerewolfProfile.deleteMany();

    console.log("WerewolfProfile destroyed...".red.inverse);
  } catch (error) {
    console.log(error);
  }
};
const deleteAll = async () => {
  try {
    await deleteUsers();
    await deleteWerewolfProfiles();

    console.log("WerewolfProfile destroyed...".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};
const resetElo = async () => {
  try {
    // await User.updateMany(
    //   {},
    //   { $set: { elo: { $sum: ["$elo", 500] } }, $inc: { quantity: 2 } }
    // );
    await User.aggregate([{ $project: { elo: { $add: ["$elo", 1000] } } }]);
    // await WerewolfProfile.updateMany({}, { $set: { elo: $elo * 2 } });

    // const eee = await WerewolfProfile.find();
    // eee.forEach(async (doc) => {
    //   // doc.events.forEach(function (event) {
    //   //   event.elo = event.elo * 2;
    //   // });
    //   // WerewolfProfile.save(doc);
    //   const newElo = doc.elo * 20;
    //   await WerewolfProfile.updateOne({ _id: doc._id }, { $set: { elo: 900 } });
    //   console.log(doc);
    // });

    console.log("resetElo successful...".red.inverse);
  } catch (error) {
    console.log(error);
  }
};

const updateElo = async () => {
  try {
    // await User.updateMany({}, { $set: { elo: 900 }, $inc: { quantity: 2 } });
    const game = await WerewolfGame.findById("5ee6844be4d5391a075c6817");

    console.log(game);
    const wolvesIds = game.wolves.map((el) => el._id);
    const villagersIds = game.villagers.map((el) => el._id);

    const wolvesProfiles = await WerewolfProfile.find({
      userId: { $in: wolvesIds },
    });
    const villagersProfiles = await WerewolfProfile.find({
      userId: { $in: villagersIds },
    });

    const averageWElo =
      wolvesProfiles.reduce((a, b) => a + b.elo, 0) / wolvesProfiles.length;
    const averageVElo =
      villagersProfiles.reduce((a, b) => a + b.elo, 0) /
      villagersProfiles.length;

    console.log(averageWElo, averageVElo);

    const k = game.wolvesWon
      ? (villagersProfiles.length + 1) / (wolvesProfiles.length + 1)
      : (wolvesProfiles.length + 1) / (villagersProfiles.length + 1);

    function getElo(ally, enemy, personal, k = 1) {
      // k - werewolves team diff coef
      const k1 = enemy / ally;
      const k2 = enemy / personal;
      return k1 * k2 * 20 * k;
    }

    // console.log("resetElo successful...".red.inverse);
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "-da") {
  deleteAll();
}
if (process.argv[2] === "-cu") {
  createUsers();
}
if (process.argv[2] === "-re") {
  resetElo();
}
if (process.argv[2] === "-ue") {
  updateElo();
}
