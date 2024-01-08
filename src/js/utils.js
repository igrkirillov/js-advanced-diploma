/**
 * @todo
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

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}

export function tooltip(strings, level, attack, defence, health) {
  return `\u{1F396}${level} \u{2694}${attack} \u{1F6E1}${defence} \u{2764}${health}`;
}

export function isCharacterOneOfType(character, types) {
  return !!types.find(type => character instanceof type);
}
