import {themesSortedByLevel} from "./themes.js";
import Point from "./Point.js";

/**
 * Определяет тип ячейки на поле
 *
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index, boardSize) {
  let type;
  if (index === 0) {
    type = "top-left";
  } else if (index === boardSize - 1) {
    type = "top-right";
  } else if (index > 0 && index < boardSize - 1) {
    type = "top";
  } else if (index === boardSize * (boardSize - 1)) {
    type = "bottom-left";
  } else if (index === boardSize * boardSize - 1) {
    type = "bottom-right";
  } else if (index > boardSize * (boardSize - 1) && index < boardSize * boardSize - 1) {
    type = "bottom";
  } else if ((index + 1) % boardSize === 0) {
    type = "right";
  } else if (index % boardSize === 0) {
    type = "left";
  } else {
    type = "center";
  }
  return type;
}

/**
 * Определяет степень уровня здоровья
 * @param health жизнь число
 * @returns {string} степень уровня здоровья
 */
export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }
  if (health < 50) {
    return 'normal';
  }
  return 'high';
}

/**
 * Функция tagged template. Формирует текст для всплывающей подсказки.
 *
 * @param strings строки шаблона
 * @param level уровень число
 * @param attack атака число
 * @param defence защита число
 * @param health жизнь число
 * @returns {string} текст
 */
export function tooltip(strings, level, attack, defence, health) {
  return `\u{1F396}${level} \u{2694}${attack} \u{1F6E1}${defence} \u{2764}${health}`;
}

/**
 * Определяет, входит ли персонаж, переданный в первом аргументе, в список типов персонажей, переданный во втором аргументе
 *
 * @param character персонаж
 * @param types список типов персонажей
 * @returns {boolean} true - если да, входит; false - если нет, не входит;
 */
export function isCharacterOneOfType(character, types) {
  return !!types.find(type => character instanceof type);
}

/**
 * Определяет, может ли быть выполнен ход на шаг step
 *
 * @param step объект шаг Step
 * @returns {boolean} true - если да, может; false - если нет, не может;
 */
export function canStep(step) {
  return canAction(step, step.positionedCharacter.character.stepDistance);
}

/**
 * Определяет, может ли быть выполнена атака на шаг step
 *
 * @param step объект шаг Step
 * @returns {boolean} true - если да, может; false - если нет, не может;
 */
export function canAttack(step) {
  return canAction(step, step.positionedCharacter.character.attackDistance);
}

function canAction(step, distance) {
  const toPoint = indexToXY(step.position);
  const fromPoint = indexToXY(step.positionedCharacter.position);
  if (toPoint.x === fromPoint.x) {
    return Math.abs(toPoint.y - fromPoint.y) <= distance;
  } else if (toPoint.y === fromPoint.y) {
    return Math.abs(toPoint.x - fromPoint.x) <= distance;
  } else if (Math.abs(toPoint.x - fromPoint.x) === Math.abs(toPoint.y - fromPoint.y)) {
    return Math.abs(toPoint.x - fromPoint.x) <= distance;
  } else {
    return false;
  }
}

/**
 * Конвертировать индекс ячейки в точку xy
 *
 * @param index индекс ячейки
 * @returns {Point} точка xy
 */
export function indexToXY(index) {
  const y = Math.floor(index / 8);
  const x = index - 8 * y;
  return new Point(x, y);
}

/**
 * Конвертировать точку xy в индекс ячейки
 *
 * @param point точка xy
 * @returns {*} индекс ячейки
 */
export function xyToIndex(point) {
  return point.x + 8*point.y;
}

/**
 * Получить следующую тему игры относительно текущей темы, переданной в аргументе метода
 *
 * @param currentTheme текущая тема игры
 * @returns {string} следующая тема игры
 */
export function nextTheme(currentTheme) {
  const array = themesSortedByLevel;
  const nextIndex = Math.max(0, array.indexOf(currentTheme) + 1) % array.length;
  return array[nextIndex];
}

/**
 * Определяет, является ли последней текущая тема игры, переданная в аргументе метода
 *
 * @param currentTheme текущая тема
 * @returns {boolean} true - если да, последняя; false - если нет, не последняя;
 */
export function isLastTheme(currentTheme) {
  const array = themesSortedByLevel;
  return currentTheme === array[array.length - 1];
}

/**
 * Создать текст заголовка результата игры
 *
 * @param player1Score кол-во очков первого игрока
 * @param player2Score кол-во очков второго игрока
 * @returns {string} текст заголовка результата игры
 */
export function createResultGameText(player1Score, player2Score) {
  if (player1Score === player2Score) {
    return `Ничья! Счёт ${player1Score} : ${player2Score}`;
  } else if (player1Score > player2Score) {
    return `Победил игрок №1 со счётом ${player1Score} : ${player2Score}`;
  } else if (player2Score > player1Score) {
    return `Победил игрок №2 со счётом ${player2Score} : ${player1Score}`;
  }
}
