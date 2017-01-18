"use strict";

var Pixel = React.createClass({
  displayName: "Pixel",

  /*  STATE
    - this.state.type
      PROPS
    - this.props.pixelType :
      give type pixel to render
      0 : fog
      1 : black tile
      2 : potion
      3 : wall
      4 : player
      5 : weapon
      6 : enemy
      7 : boss
  */
  getInitialState: function getInitialState() {
    return {
      type: this.props.pixelType
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    this.setState({
      type: nextProps.pixelType
    });
  },
  render: function render() {
    var pixelName = "";
    if (this.state.type === 0) {
      pixelName = "pixel_fog";
    } else if (this.state.type === 1) {
      pixelName = "pixel_black";
    } else if (this.state.type === 4) {
      pixelName = "pixel_player";
    } else if (this.state.type === 3) {
      pixelName = "pixel_blue";
    } else if (this.state.type === 2) {
      pixelName = "pixel_grey";
    } else if (this.state.type === 5) {
      pixelName = "pixel_yellow";
    } else if (this.state.type === 6) {
      pixelName = "pixel_red";
    } else if (this.state.type === 7) {
      pixelName = "pixel_purple";
    }
    return React.createElement("div", {
      className: pixelName
    });
  }
});

var Board = React.createClass({
  displayName: "Board",

  /*  STATE :
      - this.state.player
        player's position on map
      - this.state.listPixel
        array[0] - width of array (screen)
        array[1] - List of array number from map to be rendered in screen 
      - this.state.map  
        array[0] width of array (map)
        array[1] contain representation of map and game object in array
      - this.state.potion
        array of location of potion in map
      - this.state.health
        player's health status
      - this.state.fog
        fog 0: visible, 1: fog of war on
      - this.state.exp
        record the exp needed to level up for player
      - this.state.lvl
        player's level
      - this.state.weapon
        the weapon player use:
        0: wooden stick, 1: rusty blade, 2: longsword, 3: katana
      - this.state.weaponList
        array of weapon location on map. array number shows weapon type
      - this.state.enemy
        list of array of enemy.
        arr[0]: enemy position, arr[1]: enemy health
      - this.state.boss
        arr[0]: boss location, arr[1]: boss' HP
      - this.state.game
        0: game over, 1: playing, 2: win
  
  */
  getInitialState: function getInitialState() {
    //potion
    var pot = [];
    //frame/screen initialization
    var arrN = []; //array frame
    arrN[0] = 50; //width of array
    arrN[1] = [];
    var sizeN = 1000;

    var arrM = [0, 0, 0]; //array container/map
    arrM[0] = 80; //width of array
    arrM[1] = [];
    arrM[1] = [];
    var sizeM = 3200;

    var offsetLeft = 5; //offset from left
    var offsetUp = 1; //offset from up
    var count = 0; //   
    for (var j = 0; j < sizeN / arrN[0]; j++) {
      for (var k = 0; k < arrN[0]; k++) {
        arrN[1][count] = j * (arrM[0] - arrN[0]) + count + offsetLeft + offsetUp * arrM[0];
        count++;
      }
    }
    //init random map
    for (var i = 1; i <= sizeM; i++) {
      var xxx = Math.floor(Math.random() * 5 + 1);
      if (xxx === 1 || xxx === 2 || xxx === 3) {
        arrM[1][i - 1] = 1;
      } else if (xxx === 4) {
        arrM[1][i - 1] = 3;
      } else if (xxx === 5) {
        pot.push(i - 1); //init potion
        arrM[1][i - 1] = 1;
      }
    }
    //init weapon location
    var wTemp = [0, 0, 0, 0];
    for (var w = 0; w < 4; w++) {
      var v = Math.floor(Math.random() * sizeM);
      while (arrM[1][v] !== 1) {
        v = Math.floor(Math.random() * sizeM);
      }
      wTemp[w] = v;
    }
    //init enemy location and health
    var eTemp = [[0, 50], [0, 50], [0, 50], [0, 50], [0, 50], [0, 50], [0, 50], [0, 50], [0, 50], [0, 50]];
    for (var e = 0; e < eTemp.length; e++) {
      var v = Math.floor(Math.random() * sizeM);
      while (arrM[1][v] !== 1) {
        v = Math.floor(Math.random() * sizeM);
      }
      eTemp[e][0] = v; //init enemy location
    }

    console.log("weapon list: " + wTemp);
    //initialized player location
    var pLoc = arrN[1][Math.floor(sizeN / 2) + Math.floor(arrN[0] / 2)];
    //initialized boss
    var bossTemp = [0, 0];
    bossTemp[0] = pLoc - arrM[0];
    bossTemp[1] = 2000;
    //assign normal tile in boss location
    var nnn = bossTemp[0];
    arrM[1][nnn] = 1;

    return {
      listPixel: arrN,
      map: arrM,
      player: pLoc,
      potion: pot,
      health: 100,
      fog: 1,
      weapon: 0,
      weaponList: wTemp,
      exp: 100,
      lvl: 1,
      enemy: eTemp,
      boss: bossTemp,
      game: 1
    };
  },

  toggleFog: function toggleFog() {
    var x = this.state.fog === 0 ? 1 : 0;
    this.setState({
      fog: x
    });
  },

  isLineOfSight: function isLineOfSight(posM, pos, length) {
    /*  return true if position is in line of sight
    */
    return posM >= pos - 6 * length - 3 && posM <= pos - 6 * length + 3 || posM >= pos - 5 * length - 4 && posM <= pos - 5 * length + 4 || posM >= pos - 4 * length - 5 && posM <= pos - 4 * length + 5 || posM >= pos - 3 * length - 6 && posM <= pos - 3 * length + 6 || posM >= pos - 2 * length - 6 && posM <= pos - 2 * length + 6 || posM >= pos - 1 * length - 6 && posM <= pos - 1 * length + 6 || posM >= pos - 6 && posM <= pos + 6 || posM >= pos + 1 * length - 6 && posM <= pos + 1 * length + 6 || posM >= pos + 2 * length - 6 && posM <= pos + 2 * length + 6 || posM >= pos + 3 * length - 6 && posM <= pos + 3 * length + 6 || posM >= pos + 4 * length - 5 && posM <= pos + 4 * length + 5 || posM >= pos + 5 * length - 4 && posM <= pos + 5 * length + 4 || posM >= pos + 6 * length - 3 && posM <= pos + 6 * length + 3;
  },

  handleKeyDown: function handleKeyDown(event) {
    //change listPixel based on input
    console.log(event.keyCode + " pressed");
    var key = event.keyCode;
    var arrPT = this.state.listPixel;
    var arrMT = this.state.map;
    var startPos = this.state.player;
    var newPos = this.state.player;
    var potLoc = this.state.potion; //location of potion
    var weapLoc = this.state.weaponList;
    var weapT = this.state.weapon;

    var arrRes = []; //list to be rendered
    arrRes[0] = arrPT[0];
    arrRes[1] = [];
    if (key === 37) {
      //move to left
      newPos = this.movePlayer(1, startPos, arrMT[1], arrMT[0]);
      //screen movement controller
      if ((newPos - arrPT[1][0]) % arrMT[0] === Math.floor(arrPT[0] / 2) - 1) {
        arrRes[1] = this.moveArray(1, arrPT[1], arrMT[1].length, arrMT[0]);
      } else {
        arrRes[1] = arrPT[1];
      }
    } else if (key === 38) {
      //move to up
      newPos = this.movePlayer(2, startPos, arrMT[1], arrMT[0]);
      var bound = (Math.floor(arrPT[1].length / arrPT[0] / 2) - 1) * arrPT[0];
      //console.log("bound:"+bound);
      if (newPos >= arrPT[1][bound] && newPos < arrPT[1][bound] + arrPT[0]) {
        arrRes[1] = this.moveArray(2, arrPT[1], arrMT[1].length, arrMT[0]);
      } else {
        arrRes[1] = arrPT[1];
      }
    } else if (key === 39) {
      //move to right
      newPos = this.movePlayer(3, startPos, arrMT[1], arrMT[0]);
      if ((newPos - arrPT[1][0]) % arrMT[0] === Math.floor(arrPT[0] / 2) + 1) {
        arrRes[1] = this.moveArray(3, arrPT[1], arrMT[1].length, arrMT[0]);
      } else {
        arrRes[1] = arrPT[1];
      }
    } else if (key === 40) {
      //move to down
      newPos = this.movePlayer(4, startPos, arrMT[1], arrMT[0]);
      var bound = (Math.floor(arrPT[1].length / arrPT[0] / 2) + 1) * arrPT[0];
      if (newPos >= arrPT[1][bound] && newPos < arrPT[1][bound] + arrPT[0]) {
        arrRes[1] = this.moveArray(4, arrPT[1], arrMT[1].length, arrMT[0]);
      } else {
        arrRes[1] = arrPT[1];
      }
    } else {
      arrRes[1] = arrPT[1];
    }

    //check item whereabout
    var healthT = this.state.health;
    if (potLoc.indexOf(newPos) >= 0) {
      //hitting potion
      potLoc[potLoc.indexOf(newPos)] = 1;
      healthT = healthT + 5;
    } else if (weapLoc.indexOf(newPos) >= 0) {
      //hitting weapon
      weapT = weapLoc.indexOf(newPos);
      weapLoc[weapLoc.indexOf(newPos)] = -1;
      console.log("status weapon : " + weapT);
    }
    //for enemy check
    var enTmp = this.state.enemy;
    var enPos = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //array of enemy position
    var enRes = [0, 0, 0];
    var go = 1; //game
    var expT = this.state.exp;
    var lvlT = this.state.lvl;
    for (var y = 0; y < enTmp.length; y++) {
      enPos[y] = enTmp[y][0];
    }
    if (enPos.indexOf(newPos) >= 0) {
      //hitting enemy
      enRes = this.encounterEnemy(enPos.indexOf(newPos));
      if (enRes[0] === 0) {
        //calculate outcome
        newPos = startPos;
        healthT = enRes[1];
      } else if (enRes[0] === 1) {
        expT = expT - 20;
        if (expT <= 0) {
          lvlT++;
          expT = 100;
        }
      } else if (enRes[0] === 2) {
        go = 0;
        this.gameOver(0);
      }
    }
    //for boss check
    var boTmp = this.state.boss;
    var boRes = [0, 0];
    if (newPos === boTmp[0]) {
      boRes = this.encounterBoss();
      if (boRes[0] > 0) {
        //player alive
        if (boRes[1] <= 0) {
          //boss diess
          go = 2;
          this.gameOver(1);
        } else {
          //boss alive
          newPos = startPos;
          healthT = boRes[0];
          boTmp[1] = boRes[1];
        }
      } else {
        //player dies
        go = 0;
        this.gameOver(0);
      }
    }

    if (go === 1) {
      this.setState({
        listPixel: arrRes,
        player: newPos,
        potion: potLoc,
        health: healthT,
        weapon: weapT,
        weaponList: weapLoc,
        //enemy: enRes[2],
        exp: expT,
        lvl: lvlT,
        boss: boTmp,
        game: go
      });
    } else {
      console.log("GAME OVER");
      this.setState(this.getInitialState());
    }
  },

  movePlayer: function movePlayer(dir, pos, arr, length) {
    /*  dir: direction
        pos: starting position player
        arr: array of map
        length: width of map array
    */
    var arrPx = [0]; //target position
    arrPx[0] = pos;
    arrPx = this.moveArray(dir, arrPx, arr.length, length);

    //check for wall
    if (arr[arrPx[0]] === 3) {
      //hitting wall
      arrPx[0] = pos;
    }

    return arrPx[0];
  },

  encounterBoss: function encounterBoss() {
    /*  return array[0]: player health, array[1]
    */
    var pHealth = this.state.health;
    var bossT = this.state.boss;
    var bHealth = bossT[1];
    var bAtt = 50;
    var pAtt = 0;
    var weap = this.state.weapon;
    var res = [0, 0];
    console.log("bHealth-" + bHealth);

    if (weap === 0) {
      pAtt = 20;
    } else if (weap === 1) {
      pAtt = 40;
    } else if (weap === 2) {
      pAtt = 60;
    } else if (weap === 3) {
      pAtt = 100;
    }
    pHealth = pHealth - Math.floor(Math.random() * bAtt + bAtt / 2); //random damage
    bHealth = bHealth - Math.floor(Math.random() * (this.state.lvl * pAtt) + this.state.lvl * pAtt / 2);
    res = [pHealth, bHealth];
    return res;
  },

  encounterEnemy: function encounterEnemy(en) {
    /*  change player's health and enemy's health.
        en: enemy's array number in enemyList
        return array:
        arr[0]: 1 if success eliminating enemy, arr[0]:0 if fail, arr[0]: 2 game over
        arr[1]: health
        arr[2]: array enemy
    */

    var pHealth = this.state.health;
    var enTmp = this.state.enemy;
    var weap = this.state.weapon;
    var enHealth = enTmp[en][1];
    var enAtt = 40; //enemy attack
    var pAtt = 0;
    var res = [0, 0, 0];

    if (weap === 0) {
      pAtt = 20;
    } else if (weap === 1) {
      pAtt = 40;
    } else if (weap === 2) {
      pAtt = 60;
    } else if (weap === 3) {
      pAtt = 100;
    }

    pHealth = pHealth - Math.floor(Math.random() * enAtt + enAtt / 2); //random damage
    console.log("player damaged:" + Math.floor(Math.random() * enAtt + enAtt / 2));
    enHealth = enHealth - Math.floor(Math.random() * (this.state.lvl * pAtt) + this.state.lvl * pAtt / 2);
    console.log("enemy damaged:" + Math.floor(Math.random() * (this.state.lvl * pAtt) + this.state.lvl * pAtt / 2));
    console.log("pHealth: " + pHealth);
    if (pHealth <= 0) {
      //player dies
      res[0] = 2;
    } else if (enHealth >= 0) {
      //enemy still alive
      res[0] = 0;
      enTmp[en][1] = enHealth;
      res[1] = pHealth;
      res[2] = enTmp;
      console.log("enemy remain:" + enHealth);
    } else {
      //enemy dies, remove from map
      res[0] = 1;
      enTmp[en][0] = -1;
      res[1] = pHealth;
      res[2] = enTmp;
    }
    return res;
  },

  moveArray: function moveArray(dir, arrPoint, sizeB, lengthB) {
    /*return arr where arrPoint will mutated based on moving 
      in array Board/map. arrPoint always smaller than array Board
      dir 1: left, 2: up, 3: right, 4: down.
      sizeB: array size of array Board
      lengthB: width of arrBoard
    */
    var arrR = [];
    if (dir === 1) {
      //move left
      console.log("move left");
      if (arrPoint[0] % lengthB !== 0) {
        //not on the most left of arrBoard
        console.log("moved");
        for (var i = 0; i < arrPoint.length; i++) {
          arrR[i] = arrPoint[i] - 1;
        }
      } else {
        arrR = arrPoint;
      }
    } else if (dir === 2) {
      //move up
      console.log("move up");
      if (arrPoint[0] >= lengthB) {
        //not on the most upper of arrBoard
        console.log("moved");
        for (var i = 0; i < arrPoint.length; i++) {
          arrR[i] = arrPoint[i] - lengthB;
        }
      } else {
        arrR = arrPoint;
      }
    } else if (dir === 3) {
      //move right
      console.log("move right");
      if (arrPoint[arrPoint.length - 1] % lengthB - (lengthB - 1) !== 0) {
        //not on the most right of arrBoard
        console.log("moved");
        for (var i = 0; i < arrPoint.length; i++) {
          arrR[i] = arrPoint[i] + 1;
        }
      } else {
        arrR = arrPoint;
      }
    } else if (dir === 4) {
      //move down
      console.log("move down");
      if (arrPoint[arrPoint.length - 1] < sizeB - lengthB) {
        //not on the most bottom of arrBoard
        console.log("moved");
        for (var i = 0; i < arrPoint.length; i++) {
          arrR[i] = arrPoint[i] + lengthB;
        }
      } else {
        arrR = arrPoint;
      }
    }
    return arrR;
  },

  gameOver: function gameOver(num) {
    /* num=0 : lose, num=1 : win
       summon modal
    */
    var mess = num === 0 ? "You Lose!" : "You Win";
    var modal = document.getElementById('myModal');
    modal.style.display = "block";
    document.getElementById("modalMessage").innerHTML = mess;

    var span = document.getElementsByClassName("close")[0];
    span.onclick = function () {
      modal.style.display = "none";
    };
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  },
  render: function render() {
    var arrT = this.state.listPixel;
    var arrMap = this.state.map;
    var arrPixel = [];
    //render the player into map
    var pRend = this.state.player;
    //render potion into map
    var arrPot = this.state.potion;
    //render weapon
    var arrWeapon = this.state.weaponList;
    var weapon = "";
    var attack = "";
    switch (this.state.weapon) {
      case 0:
        weapon = "wooden stick";
        attack = 20;
        break;
      case 1:
        weapon = "rusty blade";
        attack = 40;
        break;
      case 2:
        weapon = "longsword";
        attack = 60;
        break;
      case 3:
        weapon = "katana";
        attack = 100;
        break;
    }
    //render enemy
    var enTemp = this.state.enemy;
    var arrEnemy = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var o = 0; o < enTemp.length; o++) {
      arrEnemy[o] = enTemp[o][0];
    }
    console.log("masuk");
    //render boss
    var arrBoss = this.state.boss;
    //arrMap[1][pRend] = 4;
    console.log("position player: " + this.state.player);
    for (var i = 0; i < arrT[1].length; i++) {
      var type = 0;
      var x = arrT[1][i];
      if (x === pRend) {
        type = 4;
      } else if (this.state.fog === 1) {
        if (this.isLineOfSight(x, pRend, arrMap[0])) {
          if (arrBoss[0] === x) {
            type = 7;
          } else if (arrWeapon.indexOf(x) >= 0) {
            type = 5;
          } else if (arrEnemy.indexOf(x) >= 0) {
            type = 6;
          } else if (arrPot.indexOf(x) >= 0) {
            //potion is located
            type = 2;
          } else {
            type = arrMap[1][x];
          }
        } else {
          type = 0;
        }
      } else {
        if (arrPot.indexOf(x) >= 0) {
          //potion is located
          type = 2;
        } else if (arrWeapon.indexOf(x) >= 0) {
          type = 5;
        } else if (arrEnemy.indexOf(x) >= 0) {
          type = 6;
        } else if (arrBoss[0] === x) {
          type = 7;
        } else {
          type = arrMap[1][x];
        }
      }
      arrPixel.push(React.createElement(Pixel, {
        pixelType: type
      }));
    }
    return React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        { className: "text-center" },
        React.createElement(
          "div",
          { className: "bar" },
          "Level : ",
          this.state.lvl
        ),
        React.createElement(
          "div",
          { className: "bar" },
          React.createElement("div", { className: "pixel_grey" }),
          "Health: ",
          this.state.health
        ),
        React.createElement(
          "div",
          { className: "bar" },
          "Next lvl up : ",
          this.state.exp,
          " XP"
        ),
        React.createElement(
          "div",
          { className: "bar" },
          React.createElement("div", { className: "pixel_yellow" }),
          "Weapon : ",
          weapon
        ),
        React.createElement(
          "div",
          { className: "bar" },
          React.createElement("div", { className: "pixel_red" }),
          "Damage to Enemy : ",
          attack
        ),
        React.createElement(
          "div",
          { className: "bar" },
          React.createElement("div", { className: "pixel_purple" }),
          "Boss' HP : ",
          arrBoss[1]
        ),
        React.createElement(
          "div",
          null,
          "✪ ✣ ✤ ✥ ✦ ✧ ✩ ✫ ✬ Click the Game to Play. Use arrow keys to move. ✬ ✫ ✩ ✧ ✦ ✥ ✤ ✣ ✪"
        ),
        React.createElement(
          "div",
          null,
          React.createElement(
            "button",
            { className: "buttonBlack", onClick: this.toggleFog },
            "toggle view"
          )
        )
      ),
      React.createElement(
        "div",
        { id: "screengame", className: "board", tabIndex: "0", onKeyDown: this.handleKeyDown, contentEditable: false, readOnly: "readonly" },
        arrPixel
      ),
      React.createElement(
        "div",
        { id: "myModal", className: "modal" },
        React.createElement(
          "div",
          { className: "modal-content" },
          React.createElement(
            "span",
            { className: "close" },
            "x"
          ),
          React.createElement("p", { id: "modalMessage" })
        )
      )
    );
  }
});

var Main = React.createClass({
  displayName: "Main",

  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        { className: "container" },
        React.createElement(Board, null)
      )
    );
  }
});

ReactDOM.render(React.createElement(Main, null), document.getElementById('content'));