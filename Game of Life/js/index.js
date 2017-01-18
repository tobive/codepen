"use strict";

var Tile = React.createClass({
  displayName: "Tile",

  /*  PROPS:
      - this.props.tileID : 
        contain tile's id
      - this.props.tileStatus :
        contain tile's status
      - this.props.sendStatus :
        props to send status state to board
      STATE:
      - this.state.status : 
        contain array with arr[0] - tile id, arr[1] - on/off -- 1/0
  */
  getInitialState: function getInitialState() {
    var arrStat = [this.props.tileID, this.props.tileStatus];
    return {
      status: arrStat
    };
  },
  changeStatus: function changeStatus() {
    //change the status' state and send it to board
    var temp = this.state.status;
    temp[1] = temp[1] === 0 ? 1 : 0;
    this.setState({
      status: temp
    }, function sendStatus() {
      this.props.sendStatus(this.state.status);
    });
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var tmp = [nextProps.tileID, nextProps.tileStatus];
    this.setState({
      status: tmp
    });
  },
  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
    return nextProps.tileStatus !== this.props.tileStatus;
  }, /**/
  render: function render() {
    var tmp = this.state.status;
    var tileType = tmp[1] === 0 ? "tile_black" : "tile_white";
    return React.createElement("div", {
      className: tileType,
      onClick: this.changeStatus
    });
  }
});

var Board = React.createClass({
  displayName: "Board",

  /*  STATE:
    - listTile :
      tile's status
    - play :
      0 - idle, 1 - play board
      PROPS:
    - this.props.play  
  */
  getInitialState: function getInitialState() {
    var arrTile = [];
    for (var i = 0; i < 1500; i++) {
      arrTile[i] = Math.floor(Math.random() * 2 + 1) - 1;
    }
    /*initial seed
    arrTile[705] = 1;
    arrTile[706] = 1;
    arrTile[707] = 1;
    arrTile[708] = 1;
    arrTile[709] = 1;
    arrTile[710] = 1;
    arrTile[711] = 1;
    arrTile[712] = 1;
    arrTile[714] = 1;
    arrTile[715] = 1;
    arrTile[716] = 1;
    arrTile[717] = 1;
    arrTile[718] = 1;
    arrTile[722] = 1;
    arrTile[723] = 1;
    arrTile[724] = 1;
    arrTile[731] = 1;
    arrTile[732] = 1;
    arrTile[733] = 1;
    arrTile[734] = 1;
    arrTile[735] = 1;
    arrTile[736] = 1;
    arrTile[737] = 1;
    arrTile[739] = 1;
    arrTile[740] = 1;
    arrTile[741] = 1;
    arrTile[742] = 1;
    arrTile[743] = 1;
    */
    return {
      listTile: arrTile,
      play: 0
    };
  },
  getStatus: function getStatus(val) {
    //get the status from tile and update state accordingly
    var temp = val[0] - 1;
    var tempState = this.state.listTile;
    tempState[temp] = val[1];
    this.setState({
      listTile: tempState,
      play: 0
    });
  },
  //--------------------GAME OF LIFE ALGORITHM METHODS---------
  processLife: function processLife() {
    //calculate the tile status for the next step
    var arrBoard = this.state.listTile;
    var arrResult = [];
    for (var k = 0; k < arrBoard.length; k++) {
      arrResult[k] = this.calculateTile(k, arrBoard, 50);
    }
    return arrResult;
  },
  calculateTile: function calculateTile(num, arr, length) {
    //num is array position to be checked
    var count = 0;
    if (num === 0) {
      //special case #1
      count += arr[arr.length - 1] === 1 ? 1 : 0;
      count += arr[arr.length - length] === 1 ? 1 : 0;
      count += arr[arr.length - length + 1] === 1 ? 1 : 0;
      count += arr[length - 1] === 1 ? 1 : 0;
      count += arr[num + 1] === 1 ? 1 : 0;
      count += arr[length * 2 - 1] === 1 ? 1 : 0;
      count += arr[num + length] === 1 ? 1 : 0;
      count += arr[num + length + 1] === 1 ? 1 : 0;
    } else if (num === length - 1) {
      //special case #2
      count += arr[arr.length - 2] === 1 ? 1 : 0;
      count += arr[arr.length - 1] === 1 ? 1 : 0;
      count += arr[arr.length - length] === 1 ? 1 : 0;
      count += arr[num - 1] === 1 ? 1 : 0;
      count += arr[0] === 1 ? 1 : 0;
      count += arr[num + (length - 1)] === 1 ? 1 : 0;
      count += arr[num + length] === 1 ? 1 : 0;
      count += arr[num + 1] === 1 ? 1 : 0;
    } else if (num === arr.length - length) {
      //special case #3
      count += arr[num - 1] === 1 ? 1 : 0;
      count += arr[num - length] === 1 ? 1 : 0;
      count += arr[num - length + 1] === 1 ? 1 : 0;
      count += arr[arr.length - 1] === 1 ? 1 : 0;
      count += arr[num + 1] === 1 ? 1 : 0;
      count += arr[length - 1] === 1 ? 1 : 0;
      count += arr[0] === 1 ? 1 : 0;
      count += arr[1] === 1 ? 1 : 0;
    } else if (num === arr.length - 1) {
      //special case #4
      count += arr[num - length - 1] === 1 ? 1 : 0;
      count += arr[num - length] === 1 ? 1 : 0;
      count += arr[num - 2 * length + 1] === 1 ? 1 : 0;
      count += arr[num - 1] === 1 ? 1 : 0;
      count += arr[num - length + 1] === 1 ? 1 : 0;
      count += arr[length - 2] === 1 ? 1 : 0;
      count += arr[length - 1] === 1 ? 1 : 0;
      count += arr[0] === 1 ? 1 : 0;
    } else if (num < length) {
      //on most upper row
      count += arr[arr.length - length + num - 1] === 1 ? 1 : 0;
      count += arr[arr.length - length + num] === 1 ? 1 : 0;
      count += arr[arr.length - length + num + 1] === 1 ? 1 : 0;
      count += arr[num - 1] === 1 ? 1 : 0;
      count += arr[num + 1] === 1 ? 1 : 0;
      count += arr[num + (length - 1)] === 1 ? 1 : 0;
      count += arr[num + length] === 1 ? 1 : 0;
      count += arr[num + (length + 1)] === 1 ? 1 : 0;
    } else if (num % length === 0) {
      //on most left column
      count += arr[num - 1] === 1 ? 1 : 0;
      count += arr[num - length] === 1 ? 1 : 0;
      count += arr[num - (length - 1)] === 1 ? 1 : 0;
      count += arr[num + (length - 1)] === 1 ? 1 : 0;
      count += arr[num + 1] === 1 ? 1 : 0;
      count += arr[num + 2 * length - 1] === 1 ? 1 : 0;
      count += arr[num + length] === 1 ? 1 : 0;
      count += arr[num + (length + 1)] === 1 ? 1 : 0;
    } else if (num % length - (length - 1) === 0) {
      //on most right column
      count += arr[num - (length + 1)] === 1 ? 1 : 0;
      count += arr[num - length] === 1 ? 1 : 0;
      count += arr[num - 2 * length + 1] === 1 ? 1 : 0;
      count += arr[num - 1] === 1 ? 1 : 0;
      count += arr[num - (length - 1)] === 1 ? 1 : 0;
      count += arr[num + (length - 1)] === 1 ? 1 : 0;
      count += arr[num + length] === 1 ? 1 : 0;
      count += arr[num + 1] === 1 ? 1 : 0;
    } else if (num >= arr.length - length) {
      //on bottom row
      count += arr[num - (length + 1)] === 1 ? 1 : 0;
      count += arr[num - length] === 1 ? 1 : 0;
      count += arr[num - (length - 1)] === 1 ? 1 : 0;
      count += arr[num - 1] === 1 ? 1 : 0;
      count += arr[num + 1] === 1 ? 1 : 0;
      count += arr[length - (arr.length - num) - 1] === 1 ? 1 : 0;
      count += arr[length - (arr.length - num)] === 1 ? 1 : 0;
      count += arr[length - (arr.length - num) + 1] === 1 ? 1 : 0;
    } else {
      //on normal row (middle)
      count += arr[num - (length + 1)] === 1 ? 1 : 0;
      count += arr[num - length] === 1 ? 1 : 0;
      count += arr[num - (length - 1)] === 1 ? 1 : 0;
      count += arr[num - 1] === 1 ? 1 : 0;
      count += arr[num + 1] === 1 ? 1 : 0;
      count += arr[num + (length - 1)] === 1 ? 1 : 0;
      count += arr[num + length] === 1 ? 1 : 0;
      count += arr[num + (length + 1)] === 1 ? 1 : 0;
    }

    if (arr[num] === 1) {
      //living cell
      if (count === 2 || count === 3) {
        return 1;
      } else {
        return 0;
      }
    } else {
      //dead cell
      if (count === 3) {
        return 1;
      } else {
        return 0;
      }
    }
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var arrX = this.state.listTile;
    if (nextProps.play === 1) {
      //do calculation on tile
      arrX = this.processLife();
    } else if (nextProps.play === 2) {
      for (var j = 0; j < arrX.length; j++) {
        arrX[j] = 0;
      }
    }
    this.setState({
      play: nextProps.play,
      listTile: arrX
    });
  },
  render: function render() {
    var arrTileTemp = this.state.listTile;
    var arrTile = [];
    for (var i = 0; i < 1500; i++) {
      arrTile.push(React.createElement(Tile, {
        sendStatus: this.getStatus,
        tileID: i + 1,
        tileStatus: arrTileTemp[i]
      }));
    }
    return React.createElement(
      "div",
      { className: "board" },
      arrTile
    );
  }
});

var Main = React.createClass({
  displayName: "Main",

  /*  STATE:
      - this.state.change
        0 for board pause, 1 for board playing, 2 for reset/clear 
      - this.state.generation  
      PROPS:
      
  */
  getInitialState: function getInitialState() {
    return {
      change: 0,
      generation: 0
    };
  },
  componentDidMount: function componentDidMount() {
    this.run();
  },
  run: function run() {
    if (this.state.change === 0 || this.state.change === 2) {
      this.timeout = setInterval(function () {
        this.setState({
          change: 1,
          generation: this.state.generation + 1
        });
      }.bind(this), 300);
    } else {
      clearInterval(this.timeout);
      this.setState({
        change: 0
      });
    }
  },
  clear: function clear() {
    clearInterval(this.timeout);
    this.setState({
      change: 2,
      generation: 0
    });
  },
  componentWillUnmount: function componentWillUnmount() {
    // Clear the timeout when the component unmounts
    clearTimeout(this.timeout);
  },
  render: function render() {
    var button = this.state.change === 0 || this.state.change === 2 ? "Run" : "Pause";
    return React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        { className: "container text-center" },
        React.createElement(
          "button",
          { type: "button", className: "btn btn-primary", onClick: this.run },
          button
        ),
        React.createElement(
          "button",
          { type: "button", className: "btn btn-danger", onClick: this.clear },
          "Clear"
        )
      ),
      React.createElement(
        "div",
        { className: "board-box text-center" },
        React.createElement(
          "div",
          null,
          "Generation : ",
          this.state.generation
        ),
        React.createElement(Board, { play: this.state.change })
      )
    );
  }
});

ReactDOM.render(React.createElement(Main, null), document.getElementById('content'));