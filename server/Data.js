'use strict';
const languages = ["en", "se"];
import {readFileSync} from "fs";

// Store data in an object to keep the global namespace clean
function Data() {
  this.polls = {};
}

/***********************************************
For performance reasons, methods are added to the
prototype of the Data object/class
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
***********************************************/

Data.prototype.getUILabels = function (lang = "en") {
  const labels = readFileSync("./server/data/labels-" + lang + ".json");
  return JSON.parse(labels);
}

Data.prototype.createPoll = function(pollId, lang="en") {
  if (typeof this.polls[pollId] === "undefined") {
    let poll = {};
    poll.lang = lang; 
    poll.questions = [];
    poll.answers = [];
    poll.currentQuestion = -1;
    poll.participents = [];
    poll.gameOptions = {time: 30, rounds: 2};
    poll.numbOfPlayers = 0;
    this.polls[pollId] = poll;
  }
}
Data.prototype.getRoundsInfo = function(pollId){
  const poll = this.polls[pollId];
  if (typeof poll !== "undefined") {
    return poll.gameOptions.rounds;
  }
  return -1
}

Data.prototype.getGameInfo = function(pollId){
  const poll = this.polls[pollId];
  if (typeof poll !== "undefined") {
    return poll.participents;
  }
  return {}
}

Data.prototype.getTimeInfo = function(pollId){
  const poll = this.polls[pollId];
  if (typeof poll !== "undefined") {
    return poll.gameOptions.time;
  }
  return -1
}

Data.prototype.editGameOptions = function(pollId, data){
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    poll.gameOptions = data
  }
}

Data.prototype.getGameOptions = function(pollId){
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    return poll.gameOptions;
  }
  return {}
}

Data.prototype.addQuestion2 = function(pollId, questionaire){
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    questionaire.forEach(question => {
      poll.questions.push(question);
    });
  }
}


Data.prototype.submitUserName = function(pollId, name, avatar) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    let participent = {
      name: name,
      avatar: avatar,
      score: 0
    }
    poll.participents.push(participent);
  }
}
Data.prototype.getParticipents = function(pollId) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    return poll.participents;
  }
  return []
}
Data.prototype.editQuestion = function(pollId, index, newQuestion) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    poll.questions[index] = newQuestion;
  }
}

Data.prototype.getQuestion = function(pollId) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    if(poll.currentQuestion === -1){
      poll.questions = this.randomizeQuestion(poll.questions);
      poll.currentQuestion++;
      return poll.questions[poll.currentQuestion]
    }
    else{
      poll.currentQuestion++;
      return poll.questions[poll.currentQuestion]
    }
  }
  return null
}


Data.prototype.checkGameOver = function(pollId){
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    if(poll.currentQuestion+1 === poll.questions.length){
      return true
    }
  }
  return false
}


Data.prototype.getParticentInfo = function(pollId, userName){
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    const participant = poll.participents.find(p => p.name === userName);
    return participant;
  }
}

Data.prototype.addAnswer = function(pollId,userName,lie){
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
      let question = poll.questions[poll.currentQuestion];
      const participant = poll.participents.find(p => p.name === userName);
      if(question.lie === lie){
        participant.score++;
      }
      poll.answers.push({userName: userName, answer: lie, avatar: participant.avatar})
  }
}

Data.prototype.checkAnswerStatus = function(pollId){
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    if(poll.answers.length === (poll.participents.length-1)){
      return true;
    }
  }
  return false;
}

Data.prototype.clearAnswers = function(pollId){
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    poll.answers = [];
  }
}


Data.prototype.getAnswers = function(pollId) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    return poll.answers;
  }
  return []
}

Data.prototype.getCorrectAnswer = function(pollId) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    return poll.questions[poll.currentQuestion].lie
  }
  return null
}
Data.prototype.updateParticipants = function(pollId, participants) {
  const poll = this.polls[pollId];
  poll.participents = participants;
}

Data.prototype.checkParticipantStatus = function(pollId) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    if(poll.participents.length*poll.gameOptions.rounds === poll.questions.length){
      return true;
    }
    return false;
  }
}

Data.prototype.waitForAllPlayers = function(pollId){
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    poll.numbOfPlayers++;
    if(poll.numbOfPlayers === poll.participents.length){
      poll.numbOfPlayers = 0;
      return true;
    }
    return false;

  }
}
Data.prototype.randomizeQuestion = function(question){
    let p = 0;
    while(p < question.length-1){
    let numb = Math.floor(Math.random() * (question.length - p) + p);
    [question[p], question[numb]] = [question[numb], question[p]]
    p++;
    }
  return question;
}




Data.prototype.doesUserExistInLobby = function(pollId, username){
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    const participant = poll.participents.find(p => p.name === username);
    return typeof participant !== "undefined";
  }
  return false
}

Data.prototype.doesPollExist = function(pollId){
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    return true;
  }
  return false;
}


Data.prototype.removePoll = function(pollId){
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    delete this.polls[pollId];
  }
}

export { Data };



