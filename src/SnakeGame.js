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
          <polyline className="snakeBodyGameOver" points={(props.paths).map((pt) => [pt[0] + 0.5, pt[1] + 0.5])} />
          <circle className="target" cx={props.targetX + 0.5} cy={props.targetY + 0.5} r="0.5" ></circle>
          <text className="message" x={props.width / 2} y={props.height / 2} textAnchor="middle"
            dominantBaseline="middle"
            fontSize={props.width / 20}>Game Over!, press any key to restart</text>
        </Fragment>
      )
    case "Win":
      return (
        <Fragment>
          <polyline className="snakeBody" points={(props.paths).map((pt) => [pt[0] + 0.5, pt[1] + 0.5])} />
          <text className="message" x={props.width / 2} y={props.height / 2} textAnchor="middle"
            dominantBaseline="middle"
            fontSize={props.width / 20}>You win!, press any key to restart</text>
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
    const width = props.width ?? 15
    const height = props.height ?? 10
    const speed = props.speed ?? 5
    this.state = {
      width: width,
      height: height,
      length: 10,
      speed: speed,
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

  pointIncluded = (paths, pt) => {
    for (const i in paths) {
      if (paths[i][0] == pt[0] && paths[i][1] == pt[1]) {
        return true
      }
    }
    return false
  }
  getNewTarget = () => {
    if (this.state.paths.length >= this.state.width * this.state.width) {
      return null
    }
    let x, y
    do {
      x = Math.floor(Math.random() * this.state.width)
      y = Math.floor(Math.random() * this.state.height)
    }
    while (this.pointIncluded(this.state.paths, [x, y]))
    return [x, y]
  }

  ticks = () => {
    //states are immutable, crate a copy of them for update 
    let head = [...this.state.paths].pop()
    let paths = [...this.state.paths]

    let direction = this.state.targetDirection ?? this.state.direction

    let newPoint = this.move(head, direction)
    let isGameOver = false
    let isTarget = false
    while (paths.length > this.state.length - 1) {
      paths.shift()
    }

    isGameOver = (newPoint[0] < 0 || newPoint[1] < 0 ||
      newPoint[0] >= this.state.width || newPoint[1] >= this.state.height ||
      this.pointIncluded(paths, newPoint)
    )
    isTarget = (newPoint[0] == this.state.targetX) && newPoint[1] == this.state.targetY

    paths.push(newPoint)

    this.setState(
      {
        paths: paths,
        direction: direction
      },
      () => {
        if (isGameOver) {
          this.setState(
            {
              state: "GameOver"
            }
          )
        } else {
          // Target eaten 
          if (isTarget) {
            let newTarget = this.getNewTarget()
            let score = this.state.score + 10
            if (!newTarget) {
              this.setState({
                score: score,
                state: "Win"
              }
              )
              return
            }
            this.setState({
              score: score,
              targetX: newTarget[0],
              targetY: newTarget[1],
              length: this.state.length += 1
            }
            )
          }
          setTimeout(this.ticks, 1000 / this.state.speed)
        }
      }
    )

  }

  startGame = () => {
    let width = this.state.width
    let height = this.state.height
    let targetX = Math.floor(width / 2)
    let targetY = Math.floor(height / 2)

    this.setState(
      {
        state: "Playing",
        score: 0,
        direction: [1, 0],
        targetDirection:null,
        paths: [[Math.floor(width / 4), Math.floor(height / 4)]],
        targetX: targetX,
        targetY: targetY
      }
      ,
      () => this.ticks()
    )
  }

  move = (org, dir) => {
    return [org[0] + dir[0], org[1] + dir[1]]
  }

  onKeyPress = (event) => {
    let state = this.state.state
    if (state != "Playing") {
      this.startGame()
      return
    }
    let key = event.key
    if (Object.keys(this.directions).includes(key)) {
      let originalDirection = this.state.direction
      let newDirection = this.directions[key]
      if ((originalDirection[0] || newDirection[0]) &&
        (originalDirection[1] || newDirection[1])) {
        this.setState(
          {
            targetDirection: this.directions[key]
          }
        )
      }
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