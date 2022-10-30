import "./SnakeGame.css"
import React, { Fragment } from 'react';


function GameContent(props) {
  switch (props.state) {
    case "Intro":
      return (
        <Fragment>
          <text className="message" x={props.width / 2} y={props.height / 2} textAnchor="middle"
            dominantBaseline="middle"
            fontSize={props.width / 15}>Press any key to start</text>
        </Fragment>
      )
    case "Playing":
      return (
        <Fragment>
          <polyline className="snakeBody" points={(props.paths).map((pt) => [pt[0] + 0.5, pt[1] + 0.5])} />
          <circle className="target" cx={props.targetX + 0.5} cy={props.targetY + 0.5} r="0.5" ></circle>
        </Fragment>
      )
    case "GameOver":
      return (
        <Fragment>
          <text className="message" x={props.width / 2} y={props.height / 2} textAnchor="middle"
            dominantBaseline="middle"
            font-size={props.width / 20}>Game Over!, press any key to restart</text>
        </Fragment>
      )
    default:
      break;
  }

}




class SnakeGame extends React.Component {

  constructor(props) {
    super(props);
    // use focusRef to focus after loading
    this.focusRef = React.createRef();
    const width = props.width ?? 30
    const height = props.height ?? 20
    this.state = {
      width: width,
      height: height,
      targetX: width / 2,
      targetY: height / 2,
      paths: [[width / 5, height / 5]],
      length: 10,
      score: 0,
      state: "Intro"
    };

    this.directions = {
      "ArrowUp": [0, -1],
      "ArrowDown": [0, 1],
      "ArrowLeft": [-1, 0],
      "ArrowRight": [1, 0],
    }
  }

  componentDidMount() {
    this.focusRef.current.focus();
  }


  ticks = () => {
    let head = [...this.state.paths].pop()
    let paths = [...this.state.paths]
    let newPoint = this.move(head,this.state.direction??[0,0])
    paths.push(newPoint)
    while (paths.length > this.state.length) {
      paths.shift()
    }
    this.setState(
      {
        paths: paths
      }
    )
    setTimeout(this.ticks, 100)
  }

  startGame = () => {
    this.setState(
      {
        state: "Playing",
        score: 0,
        direction: [1, 0]
      }
      ,
      this.ticks()
    )
  }

  move = (org, dir) => {
    return [org[0] + dir[0], org[1] + dir[1]]
  }

  onKeyPress = (event) => {

    let state = this.state.state
    if (state == 'Intro' || state == "GameOver") {
      this.startGame()
      return
    }

    //states are immutable, crate a copy of them for update 
    let head = [...this.state.paths].pop()
    let paths = [...this.state.paths]
    let length = this.state.length
    let key = event.key
    if (Object.keys(this.directions).includes(key)) {

      this.setState(
        {
          paths: paths,
          score: this.state.score + 1,
          direction:this.directions[key]
        }
      )
    }


  }

  render() {
    return (
      <div ref={this.focusRef} className="SnakeGame" onLoad={() => this.focus()} tabIndex={"-1"} onKeyDown={this.onKeyPress}>
        <div className="Score">
          Score: {this.state.score}
        </div>
        <svg viewBox={`0 0 ${this.state.width}  ${this.state.height}`}
          preserveAspectRatio="xMidYMid meet">
          <rect className="background" x="0" y={"0"} width={this.state.width} height={this.state.height} />
          <GameContent {...this.state} />
        </svg>
      </div>

    );
  }
}

export default SnakeGame;