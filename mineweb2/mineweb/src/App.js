import React, { useState, useRef, useEffect } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "/";

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    let id = setInterval(() => {
      savedCallback.current();
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
}

function App() {
  const [socket, setSocket] = useState(null);
  const [player, setPlayer] = useState([]);
  const [status, setStatus] = useState(null);
  const [meta, setMeta] = useState(null);
  const [timeValue, setTimeValue] = useState(0);

  useEffect(() => {
    const newSocket = socketIOClient(ENDPOINT);
    newSocket.on('player', data => {
      console.log(data);
      setMeta(data.meta);
      setPlayer(data.player);
      setStatus(data.status);
    });
    setSocket(newSocket);
  }, []);

  useInterval(() => {
    const delta = parseInt((Date.now() - meta.startTime) / 1000);
    setTimeValue(delta);
  }, 1000);

  if (!meta || !player) {
    return 'Loading...';
  }

  function reveal(coord) {
    if (status === 'player_playing') {
      socket.emit('reveal', coord);
    }
  }

  function renderStatusButton() {
    if (status === 'player_lose') {
      return (
        <button onClick={() => socket.emit('reset')}>
          Restart
        </button>
      );
    }
    if (status === 'player_win') {
      return (
        <button onClick={() => socket.emit('reset')}>
          Restart_win
        </button>
      );
    }
    return (
      <button onClick={() => socket.emit('reset')}>
        Playing
      </button>
    );
  }

  function renderStatus() {
    return (
      <div class="game-score">
        {`${timeValue}`.padStart(4, '0')}
        {renderStatusButton()}
      </div>
    );

  }

  function renderPlayer() {
    const table = player.map((row, y) => {
      
      const cells = row.map((cell, x) => {
        let text = cell;
        let classes = "";
        if (cell === -2) {
          text = ' ';
          classes ="is-unrevaled";
        } else {
          classes = `is-revealed is-${cell}`;
        }

        if (cell === 0) {
          text = ' ';
        }
        if (cell === -1) {
          text = '*';
          classes += ' is-mine';
          
        }
        return (<td className={classes} onClick={() => reveal({x, y})}>
          {text}
        </td>);
      });
      return (
        <tr>
          {cells}
        </tr>
      );
    });

    return (
      <table class="game-table">
        {table}
      </table>
    );
  }

  return (
    <p>
      {renderStatus()}
      {renderPlayer()}
    </p>
  );
}

export default App;