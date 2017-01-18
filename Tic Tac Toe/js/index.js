var Tictactoe = function () {
  var playerSide = "x";
  var aiSide = "o";
  var arrBoardP = [];
  var arrBoardA = [];
  var game = 0;//1 is on. 0 is over
  
  //---------------------method for interface--------------------
  function showOption() {
    $("#board1").css("display","none");
    $("#optionbox").css("display","block");
  };
  
  function showBoard() {
    $("#optionbox").css("display","none");
    $("#board1").css("display","block");    
  };
  
  function markTile(num,mark) {
    var id = "#tile" + num;
    $(id).text(mark);
  };
  
  this.put = function (num) {//when player choose tile
    if(game===1) {
      if((arrBoardA.indexOf(num)===-1)&&(arrBoardP.indexOf(num)===-1)) {
        arrBoardP.push(num);
        markTile(num,playerSide);
        console.log("--player put "+num);
        
        if((winCheck(arrBoardP)===true)||(arrBoardP.length===5)){
          gameOver();
        } else {
          moveAi();
        }
      } else {

      }
      
    } else {
      gameOver();
    }      
  };
  
  this.restart = function() {
    arrBoardP = [];
    arrBoardA = [];
    $("#tile1").html("&nbsp;");
    $("#tile2").html("&nbsp;");
    $("#tile3").html("&nbsp;");
    $("#tile4").html("&nbsp;");
    $("#tile5").html("&nbsp;");
    $("#tile6").html("&nbsp;");
    $("#tile7").html("&nbsp;");
    $("#tile8").html("&nbsp;");
    $("#tile9").html("&nbsp;");
    
    $("#overmodal").modal("hide");
    showOption();
  }
  
  //---------------------method for processing-----------------
  function setSide(side) {
    if(side==="o"){
      playerSide = "o";
      aiSide = "x";
    } else if(side==="x") {
      playerSide = "x";
      aiSide = "o";
    }
  };
  
  function winCheck(arr) {//check if the arr contained winning combination
    var arrVic = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]];
    var found = false;
    
    var i=0;
    while((found===false)&&(i<arrVic.length)) {
      if((arr.indexOf(arrVic[i][0])!==-1)&&(arr.indexOf(arrVic[i][1])!==-1)&&(arr.indexOf(arrVic[i][2])!==-1)){
        found = true;
      }
      i++;
    }
    return found;
  };
  
  this.gameStart = function (status) { 
    setSide(status);
    game = 1;
    showBoard();
    
  };
  
  function gameOver() {
    game = 0;
    $("#overmodal").modal();
  };
  
  //---------------------method for AI--------------------------
   function randomFill () {//fill random from available tiles. return tile number
    var res = 0;
    for(var k=1;k<10;k++) {
      //console.log("i = "+k);
      if((arrBoardA.indexOf(k)===-1)&&(arrBoardP.indexOf(k)===-1)) {
        res = k;
      }
      
    }
    return res;
  };  
  
  function winningTile (arr,arr2) {//return winning tile from arr
    var res=0;
    for(var i=0;i<arr.length;i++) {
      if((arr[i]!==arr2[0])&&(arr[i]!==arr2[1])) {
        res = arr[i];
      }
    }
    return res;
  };
  
  function findDangerousTile (arr) {//return 0 if not exist
    var res = 0;
    var arrVic = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]];
    
    for(var i=1;i<=9;i++) {
      if((arrBoardA.indexOf(i)===-1)&&(arrBoardP.indexOf(i)===-1)) {
        for(var j=0;j<arrVic.length;j++) {
          for(var k=0;k<arr.length;k++) {
            if((arrVic[j].indexOf(i)!==-1)&&(arrVic[j].indexOf(arr[k])!==-1)) {
              var tres = winningTile(arrVic[j],[i,arr[k]]);
              if(arr.indexOf(tres)!==-1) {
                res = i;
              }
            }
          }
          
        }
      }
    }
    return res;
  }
  
  function moveAi() {//check the array and mark the tile
    var tileA = findDangerousTile(arrBoardA);
    var tile = 0;//final chosen tile
    
    if(tileA!==0) {//there's winning tile
      tile = tileA;
    } else {
      var tileP = findDangerousTile(arrBoardP);
        if(tileP!==0) {//occupy soon
          tile = tileP;
        } else {
          if((arrBoardA.indexOf(5)===-1)&&(arrBoardP.indexOf(5)===-1)) {
            tile = 5;
          } else {
            var corner = (arrBoardP.indexOf(1)!==-1)||(arrBoardP.indexOf(3)!==-1)||(arrBoardP.indexOf(7)!==-1)||(arrBoardP.indexOf(9)!==-1);
            if((arrBoardP.indexOf(5)!==-1)&&(corner===true)) {//special case to prevent special combination
              //find empty corner
              if((arrBoardP.indexOf(1)===-1)&&(arrBoardA.indexOf(1)===-1)) {
                tile = 1;
              } else if((arrBoardP.indexOf(3)===-1)&&(arrBoardA.indexOf(3)===-1)) {
                tile = 3;
              } else if((arrBoardP.indexOf(7)===-1)&&(arrBoardA.indexOf(7)===-1)) {
                tile = 7;
              } else if((arrBoardP.indexOf(9)===-1)&&(arrBoardA.indexOf(9)===-1)) {
                tile = 9;
              } else {
                tile = randomFill();
              }
            } else {
              tile = randomFill();
            }           
          }
        }
    }
    
    //mark the tile if it's empty
    arrBoardA.push(tile);
    markTile(tile,aiSide);
    if(winCheck(arrBoardA)===true){
      gameOver();
    }
  };
  
  
};

var Tic = new Tictactoe();