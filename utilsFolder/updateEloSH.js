const SHProfile = require("../models/SH/SHProfile");
exports.updateEloSH = async (game) => {
  try {
    const villainIds = game.villains.map((el) => el._id);
    const liberalIds = game.liberals.map((el) => el._id);
    const mainVillainId = game.mainVillain;

    const villainProfiles = await SHProfile.find({
      userId: { $in: villainIds },
    });
    const liberalProfiles = await SHProfile.find({
      userId: { $in: liberalIds },
    });

    const averageVElo =
      villainProfiles.reduce((a, b) => a + b.elo, 0) / villainProfiles.length;
    const averageLElo =
      liberalProfiles.reduce((a, b) => a + b.elo, 0) / liberalProfiles.length;

    function getElo(role, villainsWon, ally, enemy, personal, k = 1) {
      const k1 = enemy / ally;
      if (
        (role === "villain" && villainsWon) ||
        (role === "liberal" && !villainsWon)
      )
        return k1 * 20;
      if (
        (role === "liberal" && villainsWon) ||
        (role === "villain" && !villainsWon)
      )
        return -(20 / k1);
    }

    const updateWonLost = (type, role, villainsWon) => {
      if (type === "won") {
        if (role === "villain") return villainsWon ? 1 : 0;
        else if (role === "liberal") return villainsWon ? 0 : 1;
      } else if (type === "lost") {
        if (role === "villain") return villainsWon ? 0 : 1;
        else if (role === "liberal") return villainsWon ? 1 : 0;
      }
    };

    await SHProfile.updateMany(
      { userId: { $in: villainIds } },
      {
        $inc: {
          elo: getElo("villain", game.villainsWon, averageVElo, averageLElo),
          won: updateWonLost("won", "villain", game.villainsWon),
          lost: updateWonLost("lost", "villain", game.villainsWon),
          villain: 1,
        },
      }
    );
    await SHProfile.updateMany(
      { userId: { $in: liberalIds } },
      {
        $inc: {
          elo: getElo("liberal", game.villainsWon, averageLElo, averageVElo),
          won: updateWonLost("won", "liberal", game.villainsWon),
          lost: updateWonLost("lost", "liberal", game.villainsWon),
          liberal: 1,
        },
      }
    );
    await SHProfile.updateMany(
      { userId: mainVillainId },
      {
        $inc: {
          mainVillain: 1,
        },
      }
    );
    console.log("UPDATE_ELO SH successful...".green.inverse);
  } catch (error) {
    console.log(error);
  }
};
