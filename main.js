(()=>{"use strict";const e={prairie:"prairie",desert:"desert",arctic:"arctic",mountain:"mountain"},t=[e.prairie,e.desert,e.arctic,e.mountain],a=e;function s(e,t){let a;return a=0===e?"top-left":e===t-1?"top-right":e>0&&e<t-1?"top":e===t*(t-1)?"bottom-left":e===t*t-1?"bottom-right":e>t*(t-1)&&e<t*t-1?"bottom":(e+1)%t==0?"right":e%t==0?"left":"center",a}function i(e,t,a,s,i){return`🎖${t} ⚔${a} 🛡${s} ❤${i}`}function r(e,t){return!!t.find((t=>e instanceof t))}function n(e){const t=o(e.position),a=o(e.positionedCharacter.position);return t.x===a.x?Math.abs(t.y-a.y)<=e.positionedCharacter.character.stepDistance:(t.y===a.y||Math.abs(t.x-a.x)===Math.abs(t.y-a.y))&&Math.abs(t.x-a.x)<=e.positionedCharacter.character.stepDistance}function o(e){const t=Math.floor(e/8);return{x:e-8*t,y:t}}class l{constructor(){this.boardSize=8,this.container=null,this.boardEl=null,this.cells=[],this.cellClickListeners=[],this.cellEnterListeners=[],this.cellLeaveListeners=[],this.newGameListeners=[],this.saveGameListeners=[],this.loadGameListeners=[]}bindToDOM(e){if(!(e instanceof HTMLElement))throw new Error("container is not HTMLElement");this.container=e}drawUi(e){this.checkBinding(),this.container.innerHTML='\n      <div class="controls">\n        <button data-id="action-restart" class="btn">New Game</button>\n        <button data-id="action-save" class="btn">Save Game</button>\n        <button data-id="action-load" class="btn">Load Game</button>\n      </div>\n      <div class="board-container">\n        <div data-id="board" class="board"></div>\n      </div>\n    ',this.newGameEl=this.container.querySelector("[data-id=action-restart]"),this.saveGameEl=this.container.querySelector("[data-id=action-save]"),this.loadGameEl=this.container.querySelector("[data-id=action-load]"),this.newGameEl.addEventListener("click",(e=>this.onNewGameClick(e))),this.saveGameEl.addEventListener("click",(e=>this.onSaveGameClick(e))),this.loadGameEl.addEventListener("click",(e=>this.onLoadGameClick(e))),this.boardEl=this.container.querySelector("[data-id=board]"),this.boardEl.classList.add(e);for(let e=0;e<this.boardSize**2;e+=1){const t=document.createElement("div");t.classList.add("cell","map-tile",`map-tile-${s(e,this.boardSize)}`),t.addEventListener("mouseenter",(e=>this.onCellEnter(e))),t.addEventListener("mouseleave",(e=>this.onCellLeave(e))),t.addEventListener("click",(e=>this.onCellClick(e))),this.boardEl.appendChild(t)}this.cells=Array.from(this.boardEl.children)}redrawPositions(e){for(const e of this.cells)e.innerHTML="";for(const a of e){const e=this.boardEl.children[a.position],s=document.createElement("div");s.classList.add("character",a.character.type);const i=document.createElement("div");i.classList.add("health-level");const r=document.createElement("div");r.classList.add("health-level-indicator","health-level-indicator-"+((t=a.character.health)<15?"critical":t<50?"normal":"high")),r.style.width=`${a.character.health}%`,i.appendChild(r),s.appendChild(i),e.appendChild(s)}var t}addCellEnterListener(e){this.cellEnterListeners.push(e)}addCellLeaveListener(e){this.cellLeaveListeners.push(e)}addCellClickListener(e){this.cellClickListeners.push(e)}addNewGameListener(e){this.newGameListeners.push(e)}addSaveGameListener(e){this.saveGameListeners.push(e)}addLoadGameListener(e){this.loadGameListeners.push(e)}onCellEnter(e){e.preventDefault();const t=this.cells.indexOf(e.currentTarget);this.cellEnterListeners.forEach((e=>e.call(null,t)))}onCellLeave(e){e.preventDefault();const t=this.cells.indexOf(e.currentTarget);this.cellLeaveListeners.forEach((e=>e.call(null,t)))}onCellClick(e){const t=this.cells.indexOf(e.currentTarget);this.cellClickListeners.forEach((e=>e.call(null,t)))}onNewGameClick(e){e.preventDefault(),this.newGameListeners.forEach((e=>e.call(null)))}onSaveGameClick(e){e.preventDefault(),this.saveGameListeners.forEach((e=>e.call(null)))}onLoadGameClick(e){e.preventDefault(),this.loadGameListeners.forEach((e=>e.call(null)))}static showError(e){alert(e)}static showMessage(e){alert(e)}selectCell(e,t="yellow"){this.deselectCell(e),this.cells[e].classList.add("selected",`selected-${t}`)}deselectCell(e){const t=this.cells[e];t.classList.remove(...Array.from(t.classList).filter((e=>e.startsWith("selected"))))}showCellTooltip(e,t){this.cells[t].title=e}hideCellTooltip(e){this.cells[e].title=""}showDamage(e,t){return new Promise((a=>{const s=this.cells[e],i=document.createElement("span");i.textContent=t,i.classList.add("damage"),s.appendChild(i),i.addEventListener("animationend",(()=>{s.removeChild(i),a()}))}))}setCursor(e){this.boardEl.style.cursor=e}checkBinding(){if(null===this.container)throw new Error("GamePlay not bind to DOM")}}class h{constructor(e){this.characters=e}}function c(e,t,a){const s=function*(e,t){for(;;){const a=Math.floor(Math.random()*(e.length-1)),s=1+Math.floor(Math.random()*(t-1));yield new e[a](s)}}(e,t),i=Array.from(Array(a),(()=>s.next().value));return new h(i)}class d{constructor(e,t="generic"){if(this.level=e,this.attack=0,this.defence=0,this.health=50,this.type=t,this.stepDistance=0,new.target===d)throw"new Character() is forbidden"}applyDamage(e){this.health-=e}incrementLevel(){const e=Math.min(100,this.health+80),t=Math.max(this.attack,this.attack*(80+this.health)/100);this.health=e,this.attack=t,this.level+=1}}class m{constructor(e,t){if(!(e instanceof d))throw new Error("character must be instance of Character or its children");if("number"!=typeof t)throw new Error("position must be a number");this.character=e,this.position=t}}class p extends d{constructor(e){super(1,"bowman"),this.attack=25,this.defence=25,this.stepDistance=4;for(let t=1;t<e;++t)this.incrementLevel()}}class u extends d{constructor(e){super(1,"swordsman"),this.attack=40,this.defence=10,this.stepDistance=2;for(let t=1;t<e;++t)this.incrementLevel()}}class g extends d{constructor(e){super(1,"magician"),this.attack=10,this.defence=40,this.stepDistance=1;for(let t=1;t<e;++t)this.incrementLevel()}}class y extends d{constructor(e){super(1,"daemon"),this.attack=10,this.defence=10,this.stepDistance=1;for(let t=1;t<e;++t)this.incrementLevel()}}class C extends d{constructor(e){super(1,"undead"),this.attack=40,this.defence=10,this.stepDistance=4;for(let t=1;t<e;++t)this.incrementLevel()}}class S extends d{constructor(e){super(1,"vampire"),this.attack=25,this.defence=25,this.stepDistance=2;for(let t=1;t<e;++t)this.incrementLevel()}}class f{constructor(){this.positionedCharacters=[],this.selectedPositionedCharacter=null,this.underAttackPositionedCharacter=null,this.currentTheme=null,this.gameFinishedFlag=!1,this.player1Score=0,this.player2Score=0,this.player1Types=[p,u,g],this.player2Types=[y,C,S],this.player2CharactersQuantity=1}static from(e){return null}}const w="pointer",v="crosshair",P="not-allowed";class L{constructor(e,t){this.positionedCharacter=e,this.position=t}toString(){const e=o(this.positionedCharacter.position),t=o(this.position);return`Step: ${this.positionedCharacter.character.constructor.name} with position ${e.x}:${e.y} to position ${t.x}:${t.y}`}}class E{constructor(e){this.player2Types=e}getStep(e){const t=e.filter((e=>r(e.character,this.player2Types)))[0];return new L(t,t.position)}}class T extends E{constructor(e,t){super(e),this.player1Types=t}getStep(e){const t=e.filter((e=>r(e.character,this.player2Types))),a=e.filter((e=>r(e.character,this.player1Types))).sort(((e,t)=>e.character.health-t.character.health))[0],s=this.findClosestPositionedCharacter(a,t),i=this.findClosestStepIndex(a,s),n=new L(s,i);return console.log(n.toString()),n}findClosestPositionedCharacter(e,t){return t.sort(((t,a)=>{const s=o(t.position),i=o(a.position),r=o(e.position),n=this.calcClosestDistance(s,r),l=this.calcClosestDistance(i,r);return Math.ceil(n/t.character.stepDistance)-Math.ceil(l/a.character.stepDistance)}))[0]}calcClosestDistance(e,t){return Math.sqrt(Math.pow(Math.abs(e.x-t.x),2)+Math.pow(Math.abs(e.y-t.y),2))}findClosestStepIndex(e,t){const a=o(e.position);let s=null,i=1e3;for(let e=1;e<=t.character.stepDistance;++e)for(const r of[-1,0,1])for(const n of[-1,0,1]){const l=o(t.position),h={x:l.x+e*r,y:l.y+e*n},c=this.calcClosestDistance(a,h);c<i&&(i=c,s=h)}return(r=s).x+8*r.y;var r}}class b{constructor(e,t,a,s){this.playerName=e,this.stepDoneFlag=t,this.roundFinishedFlag=a,this.winnerName=s}}const k="player1",G="player2",M=new l;M.bindToDOM(document.querySelector("#game-container"));const x=new class{constructor(e){this.storage=e}save(e){this.storage.setItem("state",JSON.stringify(e))}load(){try{return JSON.parse(this.storage.getItem("state"))}catch(e){throw new Error("Invalid state")}}}(localStorage),D=new class{constructor(e,t){this.gamePlay=e,this.stateService=t,this.gameState=new f,this.player2Strategy=new T(this.gameState.player2Types,this.gameState.player1Types)}init(){this.gamePlay.addCellEnterListener((e=>this.onCellEnter(e))),this.gamePlay.addCellLeaveListener((e=>this.onCellLeave(e))),this.gamePlay.addCellClickListener((e=>this.onCellClick(e))),this.gamePlay.addNewGameListener((()=>this.resetGame())),this.gamePlay.addSaveGameListener((()=>this.saveGame())),this.gamePlay.addLoadGameListener((()=>this.loadGame())),this.resetGame()}resetGame(){this.gameState.gameFinishedFlag=!1,this.gameState.player1Score=0,this.gameState.player2Score=0,this.resetTheme(),this.resetPlayersCharacters(),this.redrawPlayingField()}saveGame(){try{this.stateService.save(this.gameState)}catch(e){return void l.showError(`Упс! Не удалось сохранить игру в память! Причина: ${e.message}`)}l.showMessage("Успех! Игра сохранена в память!")}loadGame(){try{this.gameState=this.stateService.load()}catch(e){return void l.showError(`Упс! Не удалось загрузить игру из памяти! Причина: ${e.message}`)}this.redrawPlayingField()}locateTeamPlayers(e,t){const a=[],s=[];for(const i of e.characters){let e=t(s);a.push(new m(i,e)),s.push(e)}return a}getNextPlayer1Position(e){let t=null;for(;null===t||e.includes(t);)t=Math.floor(9*Math.random())%2+8*Math.floor(7*Math.random());return t}getNextPlayer2Position(e){let t=null;for(;null===t||e.includes(t);)t=7-Math.floor(9*Math.random())%2+8*Math.floor(7*Math.random());return t}async onCellClick(e){if(this.gameState.gameFinishedFlag)return;let t=null;const a=this.findCharacter(e);a&&r(a,this.gameState.player1Types)?(this.gameState.selectedPositionedCharacter&&this.gamePlay.deselectCell(this.gameState.selectedPositionedCharacter.position),this.gamePlay.selectCell(e),this.gameState.selectedPositionedCharacter=new m(a,e)):a&&r(a,this.gameState.player2Types)?this.gameState.selectedPositionedCharacter?t=await this.doStep(k,new L(this.gameState.selectedPositionedCharacter,e)):l.showError("Не выбран персонаж!"):!a&&this.gameState.selectedPositionedCharacter?(t=await this.doStep(k,new L(this.gameState.selectedPositionedCharacter,e)),t&&t.stepDoneFlag&&(this.gameState.selectedPositionedCharacter=null)):l.showError("Действие не определено!"),t&&t.stepDoneFlag&&await this.processStepResult(t)}async processStepResult(e){if(e.roundFinishedFlag&&this.gameState.currentTheme===t[t.length-1])this.gameState.gameFinishedFlag=!0,l.showMessage("Игра окончена! "+((a=this.gameState.player1Score)===(s=this.gameState.player2Score)?`Ничья! Счёт ${a} : ${s}`:a>s?`Победил игрок №1 со счётом ${a} : ${s}`:s>a?`Победил игрок №2 со счётом ${s} : ${a}`:void 0));else if(e.roundFinishedFlag&&e.winnerName===k)this.gameState.positionedCharacters.forEach((e=>{e.character.incrementLevel()})),this.gameState.currentTheme=function(e){const a=t,s=Math.max(0,a.indexOf(e)+1)%a.length;return a[s]}(this.gameState.currentTheme),this.gamePlay.drawUi(this.gameState.currentTheme),this.addNewPlayer2Characters(),this.gamePlay.redrawPositions(this.gameState.positionedCharacters);else if(e.roundFinishedFlag&&e.winnerName===G)l.showMessage("Game over!!!"),this.resetGame();else if(e.playerName===k){const e=await this.doPlayer2Step();e&&e.stepDoneFlag&&await this.processStepResult(e)}var a,s}redrawPlayingField(){this.gamePlay.drawUi(this.gameState.currentTheme),this.gamePlay.redrawPositions(this.gameState.positionedCharacters)}resetTheme(){this.gameState.currentTheme=a.prairie}resetPlayersCharacters(){this.gameState.positionedCharacters=[],this.addNewPlayer1Characters(),this.addNewPlayer2Characters()}addNewPlayer1Characters(){const e=c(this.gameState.player1Types,3,4);this.gameState.positionedCharacters=[...this.gameState.positionedCharacters,...this.locateTeamPlayers(e,this.getNextPlayer1Position)]}addNewPlayer2Characters(){const e=c(this.gameState.player2Types,3,this.gameState.player2CharactersQuantity);this.gameState.positionedCharacters=[...this.gameState.positionedCharacters,...this.locateTeamPlayers(e,this.getNextPlayer2Position)]}async doStep(e,t){let a;const s=this.findCharacter(t.position);if(s&&n(t)){const i=t.positionedCharacter.character;if(i!==s){const r=Math.max(i.attack-s.defence,.1*i.attack);s.applyDamage(r),await this.gamePlay.showDamage(t.position,r),this.findAndDeleteZeroHealthyCharacters(),this.isPlayer1HaveEmptyCharacters()?(a=new b(e,!0,!0,G),this.gameState.player2Score+=1):this.isPlayer2HaveEmptyCharacters()?(a=new b(e,!0,!0,k),this.gameState.player1Score+=1):a=new b(e,!0,!1),this.gamePlay.redrawPositions(this.gameState.positionedCharacters)}else a=new b(e,!0)}else!s&&n(t)?(this.gameState.positionedCharacters.filter((e=>e.position===t.positionedCharacter.position&&e.character===t.positionedCharacter.character)).forEach((e=>e.position=t.position)),this.gamePlay.redrawPositions(this.gameState.positionedCharacters),this.gamePlay.deselectCell(t.positionedCharacter.position),a=new b(e,!0)):(l.showError(`${e}, нельзя ходить ${t.positionedCharacter.character.constructor.name} на ячейку ${t.position}!`),a=new b(e,!1));return a}async doPlayer2Step(){const e=this.player2Strategy.getStep(this.gameState.positionedCharacters);return await this.doStep(G,e)}findAndDeleteZeroHealthyCharacters(){this.gameState.positionedCharacters.filter((e=>e.character.health<=0)).forEach((e=>{const t=this.gameState.positionedCharacters.indexOf(e);this.gameState.positionedCharacters.splice(t,1)}))}isPlayer2HaveEmptyCharacters(){return 0===this.gameState.positionedCharacters.filter((e=>r(e.character,this.gameState.player2Types))).length}isPlayer1HaveEmptyCharacters(){return 0===this.gameState.positionedCharacters.filter((e=>r(e.character,this.gameState.player1Types))).length}onCellEnter(e){if(this.gameState.gameFinishedFlag)return;const t=this.findCharacter(e);if(t){const a=i`${t.level} ${t.attack} ${t.defence} ${t.health}`;this.gamePlay.showCellTooltip(a,e)}this.updateCursor(e)}onCellLeave(e){this.gameState.gameFinishedFlag||(this.findCharacter(e)&&this.gamePlay.hideCellTooltip(e),this.gameState.underAttackPositionedCharacter&&this.gameState.underAttackPositionedCharacter.position===e&&(this.gamePlay.deselectCell(this.gameState.underAttackPositionedCharacter.position),this.gameState.underAttackPositionedCharacter=null))}updateCursor(e){this.gameState.selectedPositionedCharacter?this.updateCursorBySelectedCharacterStrategy(e,this.gameState.selectedPositionedCharacter):this.updateCursorByNotSelectedCharacterStrategy(e)}updateCursorBySelectedCharacterStrategy(e,t){const a=this.findCharacter(e);a?r(a,this.gameState.player1Types)?this.gamePlay.setCursor(w):n(new L(t,e))?(this.gamePlay.setCursor(v),this.gamePlay.selectCell(e,"red"),this.gameState.underAttackPositionedCharacter=new m(a,e)):this.gamePlay.setCursor(P):n(new L(t,e))?this.gamePlay.setCursor(w):this.gamePlay.setCursor(P)}updateCursorByNotSelectedCharacterStrategy(e){const t=this.findCharacter(e);t&&r(t,this.gameState.player1Types)?this.gamePlay.setCursor(w):this.gamePlay.setCursor(P)}findCharacter(e){const t=this.gameState.positionedCharacters.find((t=>t.position===e));return t?t.character:void 0}}(M,x);D.init()})();