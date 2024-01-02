
function sockets(io, socket, data) {
  socket.emit('init', data.getUILabels());
  
  socket.on('pageLoaded', function (lang) {
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('switchLanguage', function(lang) {
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('getGameInfo', function(pollId) { 
    let gameInfo = data.getGameInfo(pollId);
    socket.emit('pollCreated', gameInfo);   
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

  socket.on('submitUserName', function(d) {
    data.submitUserName(d.pollId, d.name, d.avatar);
    let participents = data.getParticipents(d.pollId);
    io.to(d.pollId).emit('participentsUpdate', participents);
  });
  socket.on('enterLobby', function(pollId){
    let participents = data.getParticipents(pollId);
    let gameOptions = data.getGameOptions(pollId);
    socket.emit('currentRoomStatus', participents, gameOptions);
  });

  socket.on('resetAll', () => {
    data = new Data();
    data.initializeData();
  });

  socket.on("GameOptionsChange", function(d){
    data.editGameOptions(d.pollId, d.data)
    io.to(d.pollId).emit("GOptionsChange", d.data)
  });
  
  socket.on("startGame", function(pollId){
    io.to(pollId).emit("startGame")
  });

  socket.on("createGameLobby", (d)=> {
    if (!data.polls[d.pollId]){
      data.createPoll(d.pollId)
      data.submitUserName(d.pollId,d.name,d.avatar)
    }
  });

  socket.on("sendQuestions", function(pollId,questionaire){
    data.addQuestion2(pollId ,questionaire);
    if (data.checkParticipantStatus(pollId)) {
      console.log("starting round")
      setTimeout(()  => {
        io.to(pollId).emit("startRound");}, 5000);}

  })
  socket.on("leaveLobby", function(pollId,username) {
    let participants = data.getParticipents(pollId);
    participants = participants.filter(participants => participants.name !== username);
    data.updateParticipants(pollId, participants)
    io.to(pollId).emit('participentsUpdate', participants);
  });


  socket.on("getRoundInfo", function(pollId) {
    const roundInfo = data.getRoundsInfo(pollId);
    io.to(pollId).emit("sendRoundInfo", roundInfo)
  })
}

export { sockets };