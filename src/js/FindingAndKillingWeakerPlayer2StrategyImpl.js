import Player2Strategy from "./Player2Strategy.js";
import {canAttack, indexToXY, isCharacterOneOfType, xyToIndex} from "./utils.js";
import Step from "./Step.js";
import Point from "./Point.js";

/**
 * Стратегия компьютера "Поиск и Убиение самого слабого персонажа противника"
 */
export default class FindingAndKillingWeakerPlayer2StrategyImpl extends Player2Strategy {
  constructor(player2Types, player1Types) {
    super(player2Types);
    this.player1Types = player1Types;
  }

  getStep(positionedCharacters) {
    const positionedCharacters2 = positionedCharacters.filter(el => isCharacterOneOfType(el.character, this.player2Types));
    // самый слабый персонаж игрока1
    const weakerPositionedCharacter1 = positionedCharacters
      .filter(el => isCharacterOneOfType(el.character, this.player1Types))
      .sort((el1, el2) => el1.character.health - el2.character.health)[0];
    // наиболее близкий к этому персонажу персонаж игрока2
    const closestPositionedCharacter2 = this.findClosestPositionedCharacter(weakerPositionedCharacter1, positionedCharacters2);
    let step;
    // если игрок2 может сразу ударить по самому слабому персонажу игрока1, то создаём ход-удар по нему
    // иначе делаем ход
    if (canAttack(new Step(closestPositionedCharacter2, weakerPositionedCharacter1.position))) {
      step = new Step(closestPositionedCharacter2, weakerPositionedCharacter1.position);
    } else {
      // наиболее близкая доступная для хода позиция
      const closestStepPosition =
        this.findClosestStepIndex(weakerPositionedCharacter1, closestPositionedCharacter2, positionedCharacters);
      step = new Step(closestPositionedCharacter2, closestStepPosition);
    }
    console.log(step.toString());
    return step;
  }

  findClosestPositionedCharacter(targetPositionedCharacter, positionedCharacters) {
    return positionedCharacters.sort((el1, el2) => {
      const p1 = indexToXY(el1.position);
      const p2 = indexToXY(el2.position);
      const pt = indexToXY(targetPositionedCharacter.position);
      const d1 = this.calcClosestDistance(p1, pt);
      const d2 = this.calcClosestDistance(p2, pt);
      const countSteps1 = Math.ceil(d1 / el1.character.stepDistance);
      const countSteps2 = Math.ceil(d2 / el2.character.stepDistance);
      return countSteps1 - countSteps2;
    })[0];
  }

  /**
   * Вычислить кратчайшее расстояние между двумя точками по гипотенузе
   * @param point1 точка1
   * @param point2 точка2
   * @returns {number} расстояние в number
   */
  calcClosestDistance(point1, point2) {
    return Math.sqrt(Math.pow(Math.abs(point1.x - point2.x), 2) + Math.pow(Math.abs(point1.y - point2.y), 2));
  }

  /**
   * Найти наиболее близкую ячейку к персонажу closestPositionedCharacter, к которой можно ходить
   *
   * @param targetPositionedCharacter персонаж, который ходит
   * @param closestPositionedCharacter персонаж, к которому нужно ходить
   * @param allPositionedCharacters все спозиционнированные персонажи игры
   * @returns {*} номер ячейки (position)
   */
  findClosestStepIndex(targetPositionedCharacter, closestPositionedCharacter, allPositionedCharacters) {
    const pt = indexToXY(targetPositionedCharacter.position);
    let closestPoint = null;
    let lastDistance = 1000;
    for (let step = 1; step <= closestPositionedCharacter.character.stepDistance; ++step) {
      for (const [dx, dy] of this.generateOneCellXYDiffs()) {
        const p = indexToXY(closestPositionedCharacter.position);
        const newp = new Point(p.x + step * dx, p.y + step * dy);
        if (allPositionedCharacters.filter(el => el.position === xyToIndex(newp)).length > 0) {
          // если на пути стоит персонаж, то мы не можем ходить через него, поэтому пропускаем такой вариант шага
          continue;
        }
        const distance = this.calcClosestDistance(pt, newp);
        // новая дистанция не должна быть равна 0, потому что персонаж не может ходить на другого игрока,
        // в этом случае он должен атаковать, а не ходить
        if (distance !== 0 && distance < lastDistance) {
          lastDistance = distance;
          closestPoint = newp;
        }
      }
    }
    return xyToIndex(closestPoint);
  }

  generateOneCellXYDiffs() {
    const array = [];
    for (const dx of [-1, 0, 1]) {
      for (const dy of [-1, 0, 1]) {
        array.push([dx, dy]);
      }
    }
    return array;
  }
}
