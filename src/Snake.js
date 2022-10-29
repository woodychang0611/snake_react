import "./Snake.css"
import React from 'react';

class Snake extends React.Component {
  constructor(props) {
    super(props);
    const width = 30
    const height = 20
    this.state = {
      width: width,
      height: height,
      targetX: width / 2,
      targetY: height / 2,
      paths:[[width/5,height/5]],
      length:10,
      score: 0
    };
  }

  componentDidMount() {
    this.setState(
      {
        score: 123
      }
    )
    this.ticks()
  }


  ticks = ()=>{
    let head =  [...this.state.paths].pop() 
    let paths = [...this.state.paths]
    let x = head[0]
    let y = head[1]
    let length = this.state.length
    x=x+1
    paths.push([x,y])
    while (paths.length>length){
      paths.shift()
    }    
    this.setState(
      {
        pathsQ: paths
      }
    )
    setTimeout(this.ticks, 100)
  }

  onKeyPress = (event) => {
    let head =  [...this.state.paths].pop() 
    let paths = [...this.state.paths]
    let x = head[0]
    let y = head[1]
    let length = this.state.length
    this.setState({
      score: this.state.score + 1
    } 
    )
    switch (event.key) {
      case "ArrowUp":
        y-=1
        break
      case "ArrowDown":
        y+=1
        break
      case "ArrowLeft":
        x-=1
        break
      case "ArrowRight":
        x+=1
        break
      default:
        break
    }
    paths.push([x,y])

    while (paths.length>length){
      paths.shift()
    }
      
    this.setState(
      {
        paths: paths
      }
    )
  }

  render() {
    return (
      <div className="MainFrame" onLoad={() => this.focus()} tabIndex={0} onKeyDown={this.onKeyPress}>
        <div className="Score">
          Score: {this.state.score}
        </div>
        <svg viewBox={`0 0 ${this.state.width}  ${this.state.height}`}
          preserveAspectRatio="xMidYMid meet">
          <rect className="background" x="0" y={"0"} width={this.state.width} height={this.state.height} />
          <polyline className="body" points={this.state.paths} />
          <circle className="target" cx={this.state.targetX} cy={this.state.targetY} r="0.5" ></circle>
        </svg>
      </div>
    );
  }
}

export default Snake;