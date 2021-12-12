const GRID_SIZE = 30;
const MINE_COUNT = 100;

const MINE = -1;
const UNREVEALED = -2;

function ArrayFill2D(n, value) {
    const arr = Array(n);
    for(let i = 0; i < n; i++) {
        arr[i] = Array(n).fill(value);
    }
    return arr;
}

function printGrid(grid) {
    for (let y = 0; y < GRID_SIZE; y++) {
        console.log(grid[y].map(x => {
            if (x == UNREVEALED)
                return '_';
            else if (x == MINE)
                return '*';
            else
                return x;
        }).join(' '));
    }
}
class Minesweeper {
    constructor() {
        this.reset();
    }
    getState() {
        return {
            player: this.getPlayer(),
            meta: this.getMetadata(),
            status: this.getStatus()
        }
    }
    getMetadata() {
        return {
            gridSize: GRID_SIZE,
            mineCount: MINE_COUNT,
            startTime: this.startTime
        }
    }

    countUnrevealed() {
        let count = 0;
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                if (this.player[y][x] == UNREVEALED)
                    count++;
            }
        }
        return count;
    }
    countMineHits() {
        let count = 0;
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                if (this.player[y][x] == MINE)
                    count++;
            }
        }
        return count;
    }
    getStatus() {
        const unrevealed = this.countUnrevealed();
        if (unrevealed === MINE_COUNT) {
            return 'player_win';
        }
        if (this.countMineHits() > 0) {
            return 'player_lose';
        }
        return 'player_playing';
    }
    getPlayer() {
        return this.player;
    }
    increaseNeighbor(x, y) {
        if (x >= 0 && x <= GRID_SIZE - 1 
            && y >= 0 && y <= GRID_SIZE - 1
            && this.mines[y][x] != MINE) {
            this.mines[y][x]++;
        }
    }
    print() {
        console.log('mines=');
        printGrid(this.mines);
        console.log();
        console.log('player=');
        printGrid(this.player);
    }
    reveal(x, y) {
        const player = this.player;
        const mines = this.mines;
        if (player[y][x] == UNREVEALED) {
            player[y][x] = mines[y][x]

            if (mines[y][x] == 0) {
                for(let i = Math.max(x - 1, 0); i <= Math.min(x+1, GRID_SIZE-1); i++) {
                    for(let j = Math.max(y - 1, 0); j <= Math.min(y+1, GRID_SIZE-1); j++) {
                        this.reveal(i, j);
                    }
                }
            }
        }
    }
    generateGame(mines) {
        for(let k = 0; k < mines; k++) {
            const x = ~~(Math.random() * GRID_SIZE);
            const y = ~~(Math.random() * GRID_SIZE);

            this.mines[y][x] = MINE;

            for(let i = -1; i <= 1; i++) {
                for(let j = -1; j <= 1; j++) {
                    this.increaseNeighbor(x + i, y + j);
                }
            }            
        }
    }

    reset() {
        this.mines = ArrayFill2D(GRID_SIZE, 0);
        this.player = ArrayFill2D(GRID_SIZE, UNREVEALED);
        this.startTime = Date.now();

        this.generateGame(MINE_COUNT);
    }
}

module.exports = Minesweeper;
