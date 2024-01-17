export default class StepResult {
  constructor(playerName, stepDoneFlag, roundOverFlag, winnerName) {
    this.playerName = playerName;
    this.stepDoneFlag = stepDoneFlag;
    this.roundOverFlag = roundOverFlag;
    this.winnerName = winnerName;
  }
}
