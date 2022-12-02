class GameGrid {
    constructor(){
        this.grid = [
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
        ]
    }

    setState(x,y, state) {
        this.grid[x][y] = state;
    }
}

module.exports = GameGrid;