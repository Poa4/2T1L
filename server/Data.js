'use strict';
const languages = ["en", "se"];
import {readFileSync} from "fs";

// Store data in an object to keep the global namespace clean
function Data() {
  this.polls = {};
  this.polls["test"] = {
    lang: "en",
    questions: [{q: "How old are you?",
                 a: ["1","2","3","4"]
                },
                {q: "what weekday is it today",
                 a: ["monday,tuesday,wednesday"]
                }
                 ],
    answers: [],
    currentQuestion: 0,
    participents: [],
    gameOptions: {time: 5, rounds: 30, teams: false}
    
  };
  this.polls["2"] = {
    lang: "en",
    questions: [{q: "How old are you?",
                 a: ["5","6","7","8"]
                },
                {q: "what weekday is it today",
                 a: ["monday,tuesday,wednesday"]
                }
                 ],
    answers: [],
    currentQuestion: 0,
    participents: []
  }
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
    poll.currentQuestion = 0;
    poll.participents = [];
    poll.gameOptions = {time: 30, rounds: 2, teams: false};
    this.polls[pollId] = poll;
    console.log("poll created", pollId, poll);
  }
}
Data.prototype.getGameInfo = function(pollId){
  if (typeof this.polls[pollId] !== "undefined") {
    return this.polls[pollId]
  }
  return {}

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

Data.prototype.addQuestion = function(pollId, q) {
  const poll = this.polls[pollId];
  console.log("question added to", pollId, q);
  if (typeof poll !== 'undefined') {
    poll.questions.push(q);
  }
}


Data.prototype.addQuestion2 = function(pollId, questionaire){
  const poll = this.polls[pollId];
  console.log("questionaire added", pollId, questionaire);
  if (typeof poll !== 'undefined') {
    poll.questions.push(questionaire);
  }
  console.log("hela " +poll.questions);
  for(let i=0; i<2; i++){
    console.log(poll.questions[i]) //tester bara
  }
}


Data.prototype.submitUserName = function(pollId, name, avatar) {
  const poll = this.polls[pollId];
  console.log("new user added to", pollId, name);
  if (typeof poll !== 'undefined') {
    let participent = {
      name: name,
      avatar: avatar,
      answers: []
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

Data.prototype.getQuestion = function(pollId, qId=null) {
  const poll = this.polls[pollId];
  console.log("question requested for ", pollId, qId);
  if (typeof poll !== 'undefined') {
    if (qId !== null) {
      poll.currentQuestion = qId;
    }
    return poll.questions[poll.currentQuestion];
  }
  return []
}

Data.prototype.submitAnswer = function(pollId, answer) {
  const poll = this.polls[pollId];
  console.log("answer submitted for ", pollId, answer);
  if (typeof poll !== 'undefined') {
    let answers = poll.answers[poll.currentQuestion];
    if (typeof answers !== 'object') {
      answers = {};
      answers[answer] = 1;
      poll.answers.push(answers);
    }
    else if (typeof answers[answer] === 'undefined')
      answers[answer] = 1;
    else
      answers[answer] += 1
    console.log("answers looks like ", answers, typeof answers);
  }
}

Data.prototype.getAnswers = function(pollId) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    const answers = poll.answers[poll.currentQuestion];
    if (typeof poll.questions[poll.currentQuestion] !== 'undefined') {
      return {q: poll.questions[poll.currentQuestion].q, a: answers};
    }
  }
  return {}
}
export { Data };



