const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const questionsData = require('./data/questions.json');

const Client = require('./Objects/Client');
const Session = require('./Objects/Session');
const Question = require('./Objects/Question');

var clients = new Array();
var sessions = new Array();
var questions = new Array();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log("new user : "+socket.id);

  //check if client already exist...
  let count = 0;
  clients.forEach(client => {
    if(client.id === socket.id){
      count++
    }
  });
  //...And add it if it doesn't already exist
  if(count === 0){
    clients.push(new Client(socket.id, "test"));
    io.emit(socket.id, {msg: "username"}); //Send client need to create a username
  }

  //Clients want to set is username
  socket.on('setUsername', (username) => {
    clients.forEach(client => {
      if(client.id === socket.id) client.setUsername(username);
    });
    console.log(clients);
  });

  //On session creation
  socket.on('createSession', () => {
    const session = new Session(socket.id)
    sessions.push(session);
    clients.forEach(client => {
      if(client.id == socket.id) client.gameState = 1;
    });
    io.emit(socket.id, {msg: sessions.id});
    console.log(sessions);
  });

  socket.on('joinSession', (sessionId) => {
    sessions.forEach(session => {
      if(session.id == sessionId){
        session.clients.push(socket.id);
        clients.forEach(client => {
          if(client.id == socket.id){
            client.gameState = 2;
          } 
        });
        io.emit(socket.id, {msg: sessions.id});
      } 
    });
    console.log(sessions);
  });

  //When client disconnect
  socket.on('disconnect', () => {
    console.log(socket.id + 'user disconnected');
    dropUser(socket.id);
  });

  socket.on('play', (msg) => {
    sessions.forEach(session => {
      if(session.id == msg.idSession){
        session.clients.forEach(clientId => {
          if(clientId == socket.id) {
            clients.forEach(client => {
              session.grid.grid[msg.x][msg.y] = client.gameState;
            });
          }
        });
      }
      console.log(session.grid.grid);
      io.emit('grid', session.grid.grid);
    });
  });

  socket.on('question', (sessionId) => {
    
    let good = true;
    const session = getSessionById(sessionId);
    let randQuestion;

    while(good){
      good = true;
      randQuestion = getRandomQuestion();
      session.questionsPassed.forEach(question => {
        if(question === randQuestion.id){
          session.questionsPassed.push(randQuestion.id);
          good = false;
        } 
      });
    }

    io.emit('question', randQuestion);
  });

  socket.on('endGame', (sessionId) => {
    
    dropSession(sessionId);

  });
});

server.listen(5001, () => {
  makeQuestionsArray();
  console.log('listening on *:5001');
});

//drop user when disconnected
function dropUser(id){
  clients.forEach(client => {
    if(client.id === id) clients.pop(client);
  });
}

function dropSession(id){
  sessions.forEach(session => {
    if(session.id === id) sessions.pop(client);
  });
}

function makeQuestionsArray(){
  questionsData.data.forEach(question => {
    questions.push(new Question(question.id, question.Question, question.Reponses, question.Explication));
  });
}

function getRandomQuestion(){
  var rand = Math.floor(Math.random() * questions.length);
  return questions[rand];
}

function getSessionById(sessionId){
  let res;
  sessions.forEach(session => {
    if(sessionId == session.id) res = session;
  });
  return res;
}