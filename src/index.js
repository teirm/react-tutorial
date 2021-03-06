import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import './index.css';


function Square(props) {
    return (
        <button 
            className={props.highlight ? "square square-highlight" : "square"}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

Square.propTypes = {
    highlight: PropTypes.bool,
    onClick: PropTypes.func,
    value: PropTypes.string,
};

class Board extends React.Component {
    renderSquare(i) {
        let highlight = false;
        if (this.props.winning && this.props.winning.includes(i)) {
            highlight = true;
        }
        return ( 
            <Square 
                value={this.props.squares[i]}
                highlight={highlight}   
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        let rows = [];
        for (let i = 0; i < 3; i++) {
            let row = [];
            for (let j = 0; j < 3; j++) {
                        row.push(this.renderSquare(j + (i*3)));
            }
            rows.push(<div>{row}</div>);
        }

        return (
            <div>{rows}</div>
        );
    }
}

Board.propTypes = {
    winning: PropTypes.node,
    squares: PropTypes.node,
    onClick: PropTypes.func,
};

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const winner = calculateWinner(squares)[0];
        if (winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                move: squares[i],
            }]),
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
        const [winner, combo] = calculateWinner(current.squares);
        const moves = history.map((step, move) => {
                const desc = move ?
                'Go to move #' + move + ' (' + indexToPos(move)  + ' => ' + step.move + ')': 
                    'Go to game start';
                return (
                    <li key={move}>
                        <button onClick={() =>
                                this.jumpTo(move)}>{desc}</button>
                    </li>
                );
            });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else if (this.state.stepNumber == 9) {
            status = 'Draw game';
        } else {
            status = 'Next player: ' + 
                (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        winning={combo}
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

// ==============================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

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
    if (squares[a] && 
        squares[a] === squares[b] && 
         squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return [null, null];
}

function indexToPos(index) {
    const mapping = ['(0,0)', '(0, 1)', '(0, 2)',
                     '(1,0)', '(1,1)', '(1,2)',
                     '(2,0)', '(2,1)', '(2,2)'];
    return mapping[index];
}
