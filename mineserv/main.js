const io = require('socket.io')();
const Minesweeper = require('./minesweeper');

const game = new Minesweeper();

io.on('connection', socket => { 
    console.log('client connected');
    socket.emit('player', game.getState());
    
    socket.on('reveal', coord => {
        console.log('reveal', coord);
        game.reveal(coord.x, coord.y);
        socket.broadcast.emit('player', game.getState());
        //socket.emit('player', game.getState());
    });

    socket.on('reset', () => {
        console.log('reset');
        game.reset();
        socket.broadcast.emit('player', game.getState());
        socket.emit('player', game.getState());
    });
});


io.on('error', err => {
    console.log('error', err);
})
io.listen(3001);