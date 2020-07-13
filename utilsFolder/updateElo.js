// const User = require("../models/User");
const WerewolfProfile = require("../models/Werewolf/WerewolfProfile");
const WerewolfGame = require("../models/Werewolf/WerewolfGame");
exports.updateElo = async (game) => {
  try {
    // await User.updateMany({}, { $set: { elo: 900 }, $inc: { quantity: 2 } });

    // const game = await WerewolfGame.findById(gameId);

    // console.log(game);
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

    // console.log(averageWElo, averageVElo);

    // 3 wolves , 1 villager,
    // wolves won,
    // wolves k = 2/4; vill k = 2/4
    // wolves lost
    // wk = 4/2; vk = 4/2

    // const getK = (role) => {
    //   if (game.wolvesWon) {
    //     if (role === "wolf") return;
    //   }
    // };
    // const k = game.wolvesWon
    //   ? (villagersProfiles.length + 1) / (wolvesProfiles.length + 1)
    //   : (wolvesProfiles.length + 1) / (villagersProfiles.length + 1);

    function getElo(role, wolvesWon, ally, enemy, personal, k = 1) {
      // k - werewolves team diff coef
      const k1 = enemy / ally;
      if ((role === "wolf" && wolvesWon) || (role === "villager" && !wolvesWon))
        return k1 * 20;
      if ((role === "villager" && wolvesWon) || (role === "wolf" && !wolvesWon))
        return -(20 / k1);
    }

    await WerewolfProfile.updateMany(
      { userId: { $in: wolvesIds } },
      {
        $inc: { elo: getElo("wolf", game.wolvesWon, averageWElo, averageVElo) },
      }
    );
    await WerewolfProfile.updateMany(
      { userId: { $in: villagersIds } },
      {
        $inc: {
          elo: getElo("villager", game.wolvesWon, averageVElo, averageWElo),
        },
      }
    );
    console.log("UPDATE_ELO successful...".red.inverse);

    // console.log("resetElo successful...".red.inverse);
  } catch (error) {
    console.log(error);
  }
};
