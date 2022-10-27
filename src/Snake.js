import "./Snake.css"

function Snake() {

    return (
      <div className="MainFrame">
        <div className="Score">
            Score
        </div>
        <svg viewBox={"0 0 100 100"}
                    preserveAspectRatio="xMidYMid meet">
                    <rect className="background" x="0" y="0" width="100" height="100" />
                    <polyline className="body" points='5,5 10,10 10,5' />
                    <circle  className="target" cx="50" cy="50" r="3" ></circle>
        </svg>
      </div>
    );
  }
  
export default Snake;