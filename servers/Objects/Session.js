const GameGrid = require('./GameGrid.js');

class Session {
    static numberId = 0;

    constructor(client) {
        this.id = Session.numberId;
        Session.numberId = Session.numberId + 1;
        this.clients = new Array();
        this.clients.push(client);

        this.grid = new GameGrid();
        this.questionsPasssed = new Array(); // Array of questions
    }

    stop() {
    }
}

module.exports = Session;