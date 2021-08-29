import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={props.winning ? 'winning' : 'square'} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]}
        winning={winHighlight(i, this.props.combo)}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {

    let table = [];
    table.push();

    for (var i = 0; i < 3; i++) {
      let square_row = [];      
      for (var j = 0; j < 3; j++) { 
        square_row.push(this.renderSquare(i*3+j));
      }
      table.push(
      <div className="board-row">
        <div className="label">{i}</div>
        {square_row}               
      </div>);      
  }

    return (
      <div>
        <div className="board-row">
          <div className="label"> </div>
          <div className="label">0</div>
          <div className="label">1</div>
          <div className="label">2</div>
        </div>        
        {table}        
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      moves_pos: [-1],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const moves_pos = this.state.moves_pos.slice(0, this.state.stepNumber + 1);
    const current = history[history.length-1];
    const squares = current.squares.slice();    
    if (calculateWinner(squares)[0] || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      moves_pos: moves_pos.concat(i),
      stepNumber: history.length,     
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const moves_pos = this.state.moves_pos;    
    const [winner, combo] = calculateWinner(current.squares);    

    const moves = history.map((step,move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>            
              {move === this.state.stepNumber ? <b>{desc}</b> : desc}
            </button>
            {move ? indexToCoord(moves_pos[move]) : ''}
          </li>
        )
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;    
    } else if (this.state.stepNumber === 9) {
      status = 'Draw';
    } 
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares ={current.squares}
            combo = {combo}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">          
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

// HELPER FUNCTIONS =======================

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a],lines[i]];
    }
  }
  return [null,null];
}

function indexToCoord(i) {
  const row = Math.floor(i / 3);
  const col = i % 3;
  return '('+col.toString()+','+row.toString()+')';
}

function winHighlight(sqr, combo) {
  console.log('checking win...');
  if (combo != null )
    console.log('We have a win!'+combo.toString());
    console.log(sqr);
  if (combo != null && combo.includes(sqr)) {
    console.log('should highlight now');
  }
  return combo != null && combo.includes(sqr);
}