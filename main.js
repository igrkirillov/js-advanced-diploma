(()=>{"use strict";const e={prairie:"prairie",desert:"desert",arctic:"arctic",mountain:"mountain"},t=[e.prairie,e.desert,e.arctic,e.mountain],a=e;class s{constructor(e,t){this.x=e,this.y=t}toDebugText(){return`x: ${this.x} y: ${this.y}`}}function i(e,t){let a;return a=0===e?"top-left":e===t-1?"top-right":e>0&&e<t-1?"top":e===t*(t-1)?"bottom-left":e===t*t-1?"bottom-right":e>t*(t-1)&&e<t*t-1?"bottom":(e+1)%t==0?"right":e%t==0?"left":"center",a}function r(e,t,a,s,i){return`🎖${t} ⚔${a} 🛡${s} ❤${i}`}function n(e,t){return!!t.find((t=>e instanceof t))}function o(e){return l(e,e.positionedCharacter.character.stepDistance)}function h(e){return l(e,e.positionedCharacter.character.attackDistance)}function l(e,t){const a=c(e.position),s=c(e.positionedCharacter.position);return a.x===s.x?Math.abs(a.y-s.y)<=t:(a.y===s.y||Math.abs(a.x-s.x)===Math.abs(a.y-s.y))&&Math.abs(a.x-s.x)<=t}function c(e){const t=Math.floor(e/8);return new s(e-8*t,t)}function d(e){return e.x+8*e.y}function m(e,t){return e.filter((e=>n(e.character,t)))}function p(e,t){t.has(e.character.id)&&(e.position=t.get(e.character.id))}class g{constructor(){this.boardSize=8,this.container=null,this.boardEl=null,this.cells=[],this.cellClickListeners=[],this.cellEnterListeners=[],this.cellLeaveListeners=[],this.newGameListeners=[],this.saveGameListeners=[],this.loadGameListeners=[]}bindToDOM(e){if(!(e instanceof HTMLElement))throw new Error("container is not HTMLElement");this.container=e}drawUi(e){this.checkBinding(),this.container.innerHTML='\n      <div class="controls">\n        <button data-id="action-restart" class="btn">New Game</button>\n        <button data-id="action-save" class="btn">Save Game</button>\n        <button data-id="action-load" class="btn">Load Game</button>\n      </div>\n      <div class="board-container">\n        <div data-id="board" class="board"></div>\n      </div>\n    ',this.newGameEl=this.container.querySelector("[data-id=action-restart]"),this.saveGameEl=this.container.querySelector("[data-id=action-save]"),this.loadGameEl=this.container.querySelector("[data-id=action-load]"),this.newGameEl.addEventListener("click",(e=>this.onNewGameClick(e))),this.saveGameEl.addEventListener("click",(e=>this.onSaveGameClick(e))),this.loadGameEl.addEventListener("click",(e=>this.onLoadGameClick(e))),this.boardEl=this.container.querySelector("[data-id=board]"),this.boardEl.classList.add(e);for(let e=0;e<this.boardSize**2;e+=1){const t=document.createElement("div");t.classList.add("cell","map-tile",`map-tile-${i(e,this.boardSize)}`),t.addEventListener("mouseenter",(e=>this.onCellEnter(e))),t.addEventListener("mouseleave",(e=>this.onCellLeave(e))),t.addEventListener("click",(e=>this.onCellClick(e))),this.boardEl.appendChild(t)}this.cells=Array.from(this.boardEl.children)}redrawPositions(e){for(const e of this.cells)e.innerHTML="";for(const a of e){const e=this.boardEl.children[a.position],s=document.createElement("div");s.classList.add("character",a.character.type);const i=document.createElement("div");i.classList.add("health-level");const r=document.createElement("div");r.classList.add("health-level-indicator","health-level-indicator-"+((t=a.character.health)<15?"critical":t<50?"normal":"high")),r.style.width=`${a.character.health}%`,i.appendChild(r),s.appendChild(i),e.appendChild(s)}var t}addCellEnterListener(e){this.cellEnterListeners.push(e)}addCellLeaveListener(e){this.cellLeaveListeners.push(e)}addCellClickListener(e){this.cellClickListeners.push(e)}addNewGameListener(e){this.newGameListeners.push(e)}addSaveGameListener(e){this.saveGameListeners.push(e)}addLoadGameListener(e){this.loadGameListeners.push(e)}onCellEnter(e){e.preventDefault();const t=this.cells.indexOf(e.currentTarget);this.cellEnterListeners.forEach((e=>e.call(null,t)))}onCellLeave(e){e.preventDefault();const t=this.cells.indexOf(e.currentTarget);this.cellLeaveListeners.forEach((e=>e.call(null,t)))}onCellClick(e){const t=this.cells.indexOf(e.currentTarget);this.cellClickListeners.forEach((e=>e.call(null,t)))}onNewGameClick(e){e.preventDefault(),this.newGameListeners.forEach((e=>e.call(null)))}onSaveGameClick(e){e.preventDefault(),this.saveGameListeners.forEach((e=>e.call(null)))}onLoadGameClick(e){e.preventDefault(),this.loadGameListeners.forEach((e=>e.call(null)))}static showError(e){alert(e)}static showMessage(e){alert(e)}selectCell(e,t="yellow"){this.deselectCell(e),this.cells[e].classList.add("selected",`selected-${t}`)}deselectCell(e){const t=this.cells[e];t.classList.remove(...Array.from(t.classList).filter((e=>e.startsWith("selected"))))}showCellTooltip(e,t){this.cells[t].title=e}hideCellTooltip(e){this.cells[e].title=""}showDamage(e,t){return new Promise((a=>{const s=this.cells[e],i=document.createElement("span");i.textContent=t,i.classList.add("damage"),s.appendChild(i),i.addEventListener("animationend",(()=>{s.removeChild(i),a()}))}))}setCursor(e){this.boardEl.style.cursor=e}checkBinding(){if(null===this.container)throw new Error("GamePlay not bind to DOM")}}class u{constructor(e){this.characters=e}}function C(e,t,a){const s=function*(e,t){for(;;){const a=Math.floor(Math.random()*(e.length-1)),s=1+Math.floor(Math.random()*(t-1));yield new e[a](s)}}(e,t),i=Array.from(Array(a),(()=>s.next().value));return new u(i)}let y=0;class f{constructor(e,t="generic"){if(this.id=++y,this.level=e,this.attack=0,this.defence=0,this.health=50,this.type=t,this.stepDistance=0,this.attackDistance=0,new.target===f)throw"new Character() is forbidden"}applyDamage(e){this.health-=e}incrementLevel(){const e=+Math.min(100,this.health+80).toFixed(),t=+Math.max(this.attack,this.attack*(80+this.health)/100).toFixed();this.health=e,this.attack=t,this.level+=1}}class S{constructor(e,t){if(!(e instanceof f))throw new Error("character must be instance of Character or its children");if("number"!=typeof t)throw new Error("position must be a number");this.character=e,this.position=t}}const w="bowman",P="daemon",v="magician",L="swordsman",E="undead",T="vampire";class k extends f{constructor(e){super(1,w),this.attack=25,this.defence=25,this.stepDistance=2,this.attackDistance=2;for(let t=1;t<e;++t)this.incrementLevel()}}class D extends f{constructor(e){super(1,L),this.attack=40,this.defence=10,this.stepDistance=4,this.attackDistance=1;for(let t=1;t<e;++t)this.incrementLevel()}}class b extends f{constructor(e){super(1,v),this.attack=10,this.defence=40,this.stepDistance=1,this.attackDistance=1;for(let t=1;t<e;++t)this.incrementLevel()}}class M extends f{constructor(e){super(1,P),this.attack=10,this.defence=10,this.stepDistance=1,this.attackDistance=4;for(let t=1;t<e;++t)this.incrementLevel()}}class x extends f{constructor(e){super(1,E),this.attack=40,this.defence=10,this.stepDistance=4,this.attackDistance=1;for(let t=1;t<e;++t)this.incrementLevel()}}class G extends f{constructor(e){super(1,T),this.attack=25,this.defence=25,this.stepDistance=2,this.attackDistance=2;for(let t=1;t<e;++t)this.incrementLevel()}}class F{constructor(){this.positionedCharacters=[],this.initialCharactersLocationsMap=new Map,this.selectedPositionedCharacter=null,this.highlightedPosition=null,this.currentTheme=null,this.gameFinishedFlag=!1,this.player1Score=0,this.player2Score=0,this.player1Types=[k,D,b],this.player2Types=[M,x,G],this.playerCharactersQuantity=2}static from(e){return null}}const $="pointer",N="crosshair",O="not-allowed";class I{constructor(e,t){this.positionedCharacter=e,this.position=t}toString(){const e=c(this.positionedCharacter.position),t=c(this.position);return`Step: ${this.positionedCharacter.character.constructor.name} with position ${e.toDebugText()} to position ${t.toDebugText()}`}}class H{constructor(e){this.player2Types=e}getStep(e){const t=e.filter((e=>n(e.character,this.player2Types)))[0];return new I(t,t.position)}}class q extends H{constructor(e,t){super(e),this.player1Types=t}getStep(e){const t=e.filter((e=>n(e.character,this.player2Types))),a=e.filter((e=>n(e.character,this.player1Types))).sort(((e,t)=>e.character.health-t.character.health))[0],s=this.findClosestPositionedCharacter(a,t);let i;if(h(new I(s,a.position)))i=new I(s,a.position);else{const t=this.findClosestStepIndex(a,s,e);i=new I(s,t)}return console.log(i.toString()),i}findClosestPositionedCharacter(e,t){return t.sort(((t,a)=>{const s=c(t.position),i=c(a.position),r=c(e.position),n=this.calcClosestDistance(s,r),o=this.calcClosestDistance(i,r);return Math.ceil(n/t.character.stepDistance)-Math.ceil(o/a.character.stepDistance)}))[0]}calcClosestDistance(e,t){return Math.sqrt(Math.pow(Math.abs(e.x-t.x),2)+Math.pow(Math.abs(e.y-t.y),2))}findClosestStepIndex(e,t,a){const i=c(e.position);let r=null,n=1e3;for(let e=1;e<=t.character.stepDistance;++e)for(const[o,h]of this.generateOneCellXYDiffs()){const l=c(t.position),m=new s(l.x+e*o,l.y+e*h);if(a.filter((e=>e.position===d(m))).length>0)continue;const p=this.calcClosestDistance(i,m);0!==p&&p<n&&(n=p,r=m)}return d(r)}generateOneCellXYDiffs(){const e=[];for(const t of[-1,0,1])for(const a of[-1,0,1])e.push([t,a]);return e}}class z{constructor(e,t,a,s){this.playerName=e,this.stepDoneFlag=t,this.roundFinishedFlag=a,this.winnerName=s}}const A="player1",B="player2",Q=[k,M,b,D,x,G];function R(e){const t=Q.filter((t=>t.name===e));return t.length>0?t[0]:null}const U=new g;U.bindToDOM(document.querySelector("#game-container"));const J=new class{constructor(e){this.storage=e}save(e){this.storage.setItem("state",JSON.stringify(e,((e,t)=>"player1Types"===e||"player2Types"===e?t.map((e=>e.name)):t)))}load(){try{return JSON.parse(this.storage.getItem("state"),((e,t)=>"player1Types"===e||"player2Types"===e?t.map(R):"positionedCharacters"===e?t.map(this.mapSerializedPositionCharacterToPositionCharacter):"selectedPositionedCharacter"===e?this.mapSerializedPositionCharacterToPositionCharacter(t):t))}catch(e){throw new Error("Invalid state")}}mapSerializedPositionCharacterToPositionCharacter(e){const t=e.character;let a;switch(t.type){case w:a=new k(t.level);break;case P:a=new M(t.level);break;case v:a=new b(t.level);break;case L:a=new D(t.level);break;case E:a=new x(t.level);break;case T:a=new G(t.level)}return a.id=t.id,a.level=t.level,a.attack=t.attack,a.defence=t.defence,a.health=t.health,a.type=t.type,a.stepDistance=t.stepDistance,a.attackDistance=t.attackDistance,new S(a,e.position)}}(localStorage),X=new class{constructor(e,t){this.gamePlay=e,this.stateService=t,this.gameState=new F,this.player2Strategy=new q(this.gameState.player2Types,this.gameState.player1Types)}init(){this.gamePlay.addCellEnterListener((e=>this.onCellEnter(e))),this.gamePlay.addCellLeaveListener((e=>this.onCellLeave(e))),this.gamePlay.addCellClickListener((e=>this.onCellClick(e))),this.gamePlay.addNewGameListener((()=>this.resetGame())),this.gamePlay.addSaveGameListener((()=>this.saveGame())),this.gamePlay.addLoadGameListener((()=>this.loadGame())),this.resetGame()}resetGame(){this.gameState.gameFinishedFlag=!1,this.gameState.player1Score=0,this.gameState.player2Score=0,this.gameState.selectedPositionedCharacter=null,this.resetTheme(),this.resetPlayersCharacters(),this.redrawPlayingField()}saveGame(){try{this.stateService.save(this.gameState)}catch(e){return void g.showError(`Упс! Не удалось сохранить игру в память! Причина: ${e.message}`)}g.showMessage("Успех! Игра сохранена в память!")}loadGame(){try{this.gameState=this.stateService.load()}catch(e){return void g.showError(`Упс! Не удалось загрузить игру из памяти! Причина: ${e.message}`)}this.redrawPlayingField()}locateTeamPlayers(e,t){const a=[],s=[];for(const i of e.characters){let e=t(s);a.push(new S(i,e)),s.push(e)}return a}getNextPlayer1Position(e){let t=null;for(;null===t||e.includes(t);)t=Math.floor(9*Math.random())%2+8*Math.floor(7*Math.random());return t}getNextPlayer2Position(e){let t=null;for(;null===t||e.includes(t);)t=7-Math.floor(9*Math.random())%2+8*Math.floor(7*Math.random());return t}async onCellClick(e){if(this.gameState.gameFinishedFlag)return;let t=null;const a=this.findCharacter(e);a&&n(a,this.gameState.player1Types)?(this.gameState.selectedPositionedCharacter&&this.gamePlay.deselectCell(this.gameState.selectedPositionedCharacter.position),this.gamePlay.selectCell(e),this.gameState.selectedPositionedCharacter=new S(a,e)):a&&n(a,this.gameState.player2Types)?this.gameState.selectedPositionedCharacter?t=await this.doStep(A,new I(this.gameState.selectedPositionedCharacter,e)):g.showError("Не выбран персонаж!"):!a&&this.gameState.selectedPositionedCharacter?(t=await this.doStep(A,new I(this.gameState.selectedPositionedCharacter,e)),t&&t.stepDoneFlag):g.showError("Действие не определено!"),t&&t.stepDoneFlag&&await this.processStepResult(t)}async processStepResult(e){if(e.roundFinishedFlag&&this.gameState.currentTheme===t[t.length-1])this.gameState.gameFinishedFlag=!0,g.showMessage("Игра окончена! "+((a=this.gameState.player1Score)===(s=this.gameState.player2Score)?`Ничья! Счёт ${a} : ${s}`:a>s?`Победил игрок №1 со счётом ${a} : ${s}`:s>a?`Победил игрок №2 со счётом ${s} : ${a}`:void 0));else if(e.roundFinishedFlag&&e.winnerName===A)this.gameState.positionedCharacters.forEach((e=>{e.character.incrementLevel()})),this.gameState.currentTheme=function(e){const a=t,s=Math.max(0,a.indexOf(e)+1)%a.length;return a[s]}(this.gameState.currentTheme),this.gamePlay.drawUi(this.gameState.currentTheme),this.addNewPlayer2Characters(),this.addNewPlayer1Characters(),this.relocatePlayer1CharactersToInitialPositions(),this.redrawPositions();else if(e.roundFinishedFlag&&e.winnerName===B)g.showMessage("Game over!!!"),this.resetGame();else if(e.playerName===A){const e=await this.doPlayer2Step();e&&e.stepDoneFlag&&await this.processStepResult(e)}var a,s}relocatePlayer1CharactersToInitialPositions(){this.gameState.positionedCharacters.filter((e=>n(e.character,this.gameState.player1Types))).forEach((e=>p(e,this.gameState.initialCharactersLocationsMap))),this.gameState.selectedPositionedCharacter&&p(this.gameState.selectedPositionedCharacter,this.gameState.initialCharactersLocationsMap)}redrawPlayingField(){this.gamePlay.drawUi(this.gameState.currentTheme),this.redrawPositions()}redrawPositions(){this.gamePlay.redrawPositions(this.gameState.positionedCharacters),this.gameState.selectedPositionedCharacter&&this.gamePlay.selectCell(this.gameState.selectedPositionedCharacter.position)}resetTheme(){this.gameState.currentTheme=a.prairie}resetPlayersCharacters(){this.gameState.positionedCharacters=[],this.addNewPlayer1Characters(),this.addNewPlayer2Characters(),this.refillInitialCharactersLocationsMap()}refillInitialCharactersLocationsMap(){this.gameState.initialCharactersLocationsMap.clear(),this.gameState.positionedCharacters.forEach((e=>{this.gameState.initialCharactersLocationsMap.set(e.character.id,e.position)}))}addNewPlayer1Characters(){const e=this.gameState.playerCharactersQuantity-m(this.gameState.positionedCharacters,this.gameState.player1Types).length;if(e>0){const t=C(this.gameState.player1Types,3,e);this.gameState.positionedCharacters=[...this.gameState.positionedCharacters,...this.locateTeamPlayers(t,this.getNextPlayer1Position)],this.refillInitialCharactersLocationsMap()}}addNewPlayer2Characters(){const e=this.gameState.playerCharactersQuantity-m(this.gameState.positionedCharacters,this.gameState.player2Types).length;if(e>0){const t=C(this.gameState.player2Types,3,e);this.gameState.positionedCharacters=[...this.gameState.positionedCharacters,...this.locateTeamPlayers(t,this.getNextPlayer2Position)],this.refillInitialCharactersLocationsMap()}}async doStep(e,t){let a;const s=this.findCharacter(t.position);if(s&&h(t)){const i=t.positionedCharacter.character;if(i!==s){const r=+Math.max(i.attack-s.defence,.1*i.attack).toFixed();s.applyDamage(r),await this.gamePlay.showDamage(t.position,r),this.findAndDeleteZeroHealthyCharacters(),this.isPlayer1HaveEmptyCharacters()?(a=new z(e,!0,!0,B),this.gameState.player2Score+=1):this.isPlayer2HaveEmptyCharacters()?(a=new z(e,!0,!0,A),this.gameState.player1Score+=1):a=new z(e,!0,!1),this.redrawPositions()}else a=new z(e,!0)}else!s&&o(t)?(this.gameState.positionedCharacters.filter((e=>e.position===t.positionedCharacter.position&&e.character.id===t.positionedCharacter.character.id)).forEach((e=>e.position=t.position)),this.redrawPositions(),e===A&&(this.gamePlay.deselectCell(t.positionedCharacter.position),this.gamePlay.selectCell(t.position),this.gameState.selectedPositionedCharacter=new S(t.positionedCharacter.character,t.position)),a=new z(e,!0)):(g.showError(`${e}, нельзя ходить ${t.positionedCharacter.character.constructor.name} на ячейку ${c(t.position).toDebugText()}!`),a=new z(e,!1));return a}async doPlayer2Step(){const e=this.player2Strategy.getStep(this.gameState.positionedCharacters);return await this.doStep(B,e)}findAndDeleteZeroHealthyCharacters(){this.gameState.positionedCharacters.filter((e=>e.character.health<=0)).forEach((e=>{const t=this.gameState.positionedCharacters.indexOf(e);this.gameState.positionedCharacters.splice(t,1),this.gameState.selectedPositionedCharacter&&this.gameState.selectedPositionedCharacter.position===t&&(this.gameState.selectedPositionedCharacter=null,this.gamePlay.deselectCell(t))}))}isPlayer2HaveEmptyCharacters(){return 0===this.gameState.positionedCharacters.filter((e=>n(e.character,this.gameState.player2Types))).length}isPlayer1HaveEmptyCharacters(){return 0===this.gameState.positionedCharacters.filter((e=>n(e.character,this.gameState.player1Types))).length}onCellEnter(e){if(this.gameState.gameFinishedFlag)return;const t=this.findCharacter(e);if(t){const a=r`${t.level} ${t.attack} ${t.defence} ${t.health}`;this.gamePlay.showCellTooltip(a,e)}this.updateCursor(e)}onCellLeave(e){this.gameState.gameFinishedFlag||(this.findCharacter(e)&&this.gamePlay.hideCellTooltip(e),this.gameState.highlightedPosition&&this.gameState.highlightedPosition===e&&(this.gamePlay.deselectCell(this.gameState.highlightedPosition),this.gameState.highlightedPosition=null,this.gameState.selectedPositionedCharacter&&this.gamePlay.selectCell(this.gameState.selectedPositionedCharacter.position)))}updateCursor(e){this.gameState.selectedPositionedCharacter?this.updateCursorBySelectedCharacterStrategy(e,this.gameState.selectedPositionedCharacter):this.updateCursorByNotSelectedCharacterStrategy(e)}updateCursorBySelectedCharacterStrategy(e,t){const a=this.findCharacter(e);a?n(a,this.gameState.player1Types)?this.gamePlay.setCursor($):h(new I(t,e))?(this.gamePlay.setCursor(N),this.gamePlay.selectCell(e,"red"),this.gameState.highlightedPosition=e):this.gamePlay.setCursor(O):o(new I(t,e))?(this.gamePlay.setCursor($),this.gamePlay.selectCell(e,"green"),this.gameState.highlightedPosition=e):this.gamePlay.setCursor(O)}updateCursorByNotSelectedCharacterStrategy(e){const t=this.findCharacter(e);t&&n(t,this.gameState.player1Types)?this.gamePlay.setCursor($):this.gamePlay.setCursor(O)}findCharacter(e){const t=this.gameState.positionedCharacters.find((t=>t.position===e));return t?t.character:void 0}}(U,J);X.init()})();