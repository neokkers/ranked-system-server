// import { players } from "./config/mock";

const dotenv = require("dotenv");
const colors = require("colors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

dotenv.config({ path: "./config/config.env" });

const User = require("./models/User");
const WerewolfProfile = require("./models/Werewolf/WerewolfProfile");
const WerewolfGame = require("./models/Werewolf/WerewolfGame");

const { updateElo } = require("./utils/updateElo");

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
    // await WerewolfProfile.updateMany({}, { $inc: { elo: -6 } });
    await WerewolfProfile.updateMany({}, { $set: { elo: 1000 } });
    // await WerewolfProfile.aggregate([
    //   { $project: { elo: { $add: ["$elo", 1000] } } },
    // ]);
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
    return;
  } catch (error) {
    console.log(error);
  }
};

const reconcileElo = async () => {
  try {
    const games = await WerewolfGame.find();
    games.forEach(async (doc) => {
      // doc.events.forEach(function (event) {
      //   event.elo = event.elo * 2;
      // });
      // WerewolfProfile.save(doc);
      await updateElo(doc);
    });
  } catch (err) {
    console.log(err);
  }
};

// const updateElo = async () => {
//   try {
//     // await User.updateMany({}, { $set: { elo: 900 }, $inc: { quantity: 2 } });
//     const game = await WerewolfGame.findById("5ee6844be4d5391a075c6817");
//
//     console.log(game);
//     const wolvesIds = game.wolves.map((el) => el._id);
//     const villagersIds = game.villagers.map((el) => el._id);
//
//     const wolvesProfiles = await WerewolfProfile.find({
//       userId: { $in: wolvesIds },
//     });
//     const villagersProfiles = await WerewolfProfile.find({
//       userId: { $in: villagersIds },
//     });
//
//     const averageWElo =
//       wolvesProfiles.reduce((a, b) => a + b.elo, 0) / wolvesProfiles.length;
//     const averageVElo =
//       villagersProfiles.reduce((a, b) => a + b.elo, 0) /
//       villagersProfiles.length;
//
//     console.log(averageWElo, averageVElo);
//
//     // 3 wolves , 1 villager,
//     // wolves won,
//     // wolves k = 2/4; vill k = 2/4
//     // wolves lost
//     // wk = 4/2; vk = 4/2
//
//     // const getK = (role) => {
//     //   if (game.wolvesWon) {
//     //     if (role === "wolf") return;
//     //   }
//     // };
//     // const k = game.wolvesWon
//     //   ? (villagersProfiles.length + 1) / (wolvesProfiles.length + 1)
//     //   : (wolvesProfiles.length + 1) / (villagersProfiles.length + 1);
//
//     function getElo(role, wolvesWon, ally, enemy, personal, k = 1) {
//       // k - werewolves team diff coef
//       const k1 = enemy / ally;
//       if ((role === "wolf" && wolvesWon) || (role === "villager" && !wolvesWon))
//         return k1 * 20;
//       if ((role === "villager" && wolvesWon) || (role === "wolf" && !wolvesWon))
//         return -(20 / k1);
//     }
//
//     await WerewolfProfile.updateMany(
//       { userId: { $in: wolvesIds } },
//       {
//         $inc: { elo: getElo("wolf", game.wolvesWon, averageWElo, averageVElo) },
//       }
//     );
//     await WerewolfProfile.updateMany(
//       { userId: { $in: villagersIds } },
//       {
//         $inc: {
//           elo: getElo("villager", game.wolvesWon, averageVElo, averageWElo),
//         },
//       }
//     );
//     console.log("UPDATE_ELO successful...".red.inverse);
//
//     // console.log("resetElo successful...".red.inverse);
//   } catch (error) {
//     console.log(error);
//   }
// };

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
  reconcileElo();
}
if (process.argv[2] === "-xx") {
  (async () => {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash("sirbennylies", salt);
    const admin = await User.findByIdAndUpdate("5ee6769feaf215191943c4eb", {
      password: password,
    });
    console.log("reset admin pass successful...".red.inverse);
  })();
}
