function sockets(io, socket, data) {
  socket.emit('init', data.getUILabels());
  
  socket.on('pageLoaded', function (lang) {
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('switchLanguage', function(lang) {
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on("createGame", function(d) {
    console.log("works")
  });

  socket.on('createPoll', function(d) {
    socket.emit('pollCreated', data.createPoll(d.pollId, d.lang));
  });

  socket.on('addQuestion', function(d) {
    data.addQuestion(d.pollId, {q: d.q, a: d.a});
    socket.emit('dataUpdate', data.getAnswers(d.pollId));
  });

  socket.on('editQuestion', function(d) {
    data.editQuestion(d.pollId, d.index, {q: d.q, a: d.a});
    socket.emit('questionEdited', data.getAllQuestions(d.pollId));
  });

  socket.on('joinPoll', function(pollId) {
    socket.join(pollId);
    socket.emit('newQuestion', data.getQuestion(pollId))
    socket.emit('dataUpdate', data.getAnswers(pollId));
  });

  socket.on('runQuestion', function(d) {
    io.to(d.pollId).emit('newQuestion', data.getQuestion(d.pollId, d.questionNumber));
    io.to(d.pollId).emit('dataUpdate', data.getAnswers(d.pollId));
  });

  socket.on('submitAnswer', function(d) {
    data.submitAnswer(d.pollId, d.answer);
    io.to(d.pollId).emit('dataUpdate', data.getAnswers(d.pollId));
  });

  socket.on('resetAll', () => {
    data = new Data();
    data.initializeData();
  })

  socket.on("createGameLobby", (playerName, gameCode,gameSettings, chosenAvatar)=> {
      socket.join(gameCode);
      if (!data.gameLobbies[gameCode]){
        data.gameLobbies[gameCode] = {"players": [], "gameSettings": gameSettings}
        data.gameLobbies[gameCode].players.push({"playerName": playerName, "playerAvatar":chosenAvatar})
      }
    })
    socket.on("joinGame", (playerName, gameCode ,chosenAvatar) => {
      try {
        socket.join(gameCode);
        data.gameLobbies[gameCode].players.push({"playerName": playerName, "playerAvatar": chosenAvatar})
        console.log(data.gameLobbies[gameCode].players);
      }catch (error) {
        console.error(error)
      }
    })
}

export { sockets };