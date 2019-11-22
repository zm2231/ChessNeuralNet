let start = require("./main.js");
const verboseLogging = true;
const MINIMAX = 4;
// const numTrials = 20;
const evaluationFunctions = [
  { white: 1, black: 1 },
  { white: 1, black: 2 },
  { white: 2, black: 1 },
  { white: 2, black: 2 }
];
const gameSets = [
  {
    name: "White Depth 1 versus Black Depth 1",
    settings: {
      whiteAlgo: MINIMAX,
      blackAlgo: MINIMAX,
      whiteDepth: 1,
      blackDepth: 1
    },
    numGames: 35
  },
  {
    name: "White Depth 2 versus Black Depth 1",
    settings: {
      whiteAlgo: MINIMAX,
      blackAlgo: MINIMAX,
      whiteDepth: 2,
      blackDepth: 1
    },
    numGames: 15
  },
  {
    name: "White Depth 3 versus Black Depth 1",
    settings: {
      whiteAlgo: MINIMAX,
      blackAlgo: MINIMAX,
      whiteDepth: 3,
      blackDepth: 1
    },
    numGames: 3
  },
  {
    name: "White Depth 2 versus Black Depth 2",
    settings: {
      whiteAlgo: MINIMAX,
      blackAlgo: MINIMAX,
      whiteDepth: 2,
      blackDepth: 2
    },
    numGames: 7
  },
  {
    name: "White Depth 3 versus Black Depth 2",
    settings: {
      whiteAlgo: MINIMAX,
      blackAlgo: MINIMAX,
      whiteDepth: 3,
      blackDepth: 2
    },
    numGames: 2
  }
];
let agents = [
  {
    algo: MINIMAX,
    depth: 1,
    eval: 1,
    wins: 0
  },
  {
    algo: MINIMAX,
    depth: 1,
    eval: 2,
    wins: 0
  },
  {
    algo: MINIMAX,
    depth: 2,
    eval: 1,
    wins: 0
  },
  {
    algo: MINIMAX,
    depth: 2,
    eval: 2,
    wins: 0
  },
  {
    algo: MINIMAX,
    depth: 3,
    eval: 1,
    wins: 0
  },
  {
    algo: MINIMAX,
    depth: 3,
    eval: 2,
    wins: 0
  }
];

agents.forEach((agent1, i) => {
  console.log(
    "\nStarting trials for agent: depth=" +
      agent1.depth +
      " eval=" +
      agent1.eval
  );
  for (let j = i + 1; j < agents.length; j++) {
    let agent2 = agents[j];
    if (verboseLogging) {
      console.log(
        "\n\tPlaying against agent: depth=" +
          agent2.depth +
          " eval=" +
          agent2.eval
      );
    }
    let startTime = new Date().getTime();
    let winner = start.playGame(
      agent1.algo,
      agent2.algo,
      agent1.depth,
      agent2.depth,
      agent1.eval,
      agent2.eval
    );
    let gameTime = (new Date().getTime() - startTime) / 1000;
    let winningAgent;
    if (winner === "White") {
      winningAgent = "Agent1";
      agent1.wins++;
    } else {
      winningAgent = "Agent2";
      agent2.wins++;
    }
    if (verboseLogging) {
      console.log("\tGame Over " + winningAgent + " wins!");
      console.log("\t  Game took " + gameTime + " seconds.");
    }
  }
});

agents.forEach((agent) => {
  console.log(
    "Agent with depth=" +
      agent.depth +
      ", eval=" +
      agent.eval +
      " won " +
      agent.wins +
      " times!"
  );
});

// gameSets.forEach((gameSet) => {
//   console.log(
//     "Running " +
//       gameSet.numGames +
//       " trials for the following game set:\n'" +
//       gameSet.name +
//       "'\n"
//   );
//   evaluationFunctions.forEach((evaluationFunction) => {
//     console.log("   Running tests for white ");
//     let whiteWins = 0;
//     let totalGameLengths = 0;
//     for (i = 0; i < gameSet.numGames; i++) {
//       let startTime = new Date().getTime();
//       let winner = start.playGame(
//         gameSet.settings.whiteAlgo,
//         gameSet.settings.blackAlgo,
//         gameSet.settings.whiteDepth,
//         gameSet.settings.blackDepth,
//         1,
//         evaluationFunction
//       );
//       let gameTime = (new Date().getTime() - startTime) / 1000;
//       if (verboseLogging) {
//         console.log("\tGame Over " + winner + " wins!");
//         console.log("\t  Game took " + gameTime + " seconds.");
//       }
//       if (winner === "White") whiteWins++;
//       totalGameLengths += gameTime;
//     }
//     console.log(
//       "\n     White won " +
//         whiteWins +
//         " out of " +
//         gameSet.numGames +
//         " times."
//     );
//     if (verboseLogging) {
//       console.log(
//         "     Games took an average of " +
//           totalGameLengths / gameSet.numGames +
//           " seconds.\n"
//       );
//     }
//   });
// });
