class Client{
    constructor(id, username){
        this.username = username;
        this.id = id;
        this.gameState = 0;
    }

    setUsername(username){
        this.username = username;
    }
}

module.exports = Client;