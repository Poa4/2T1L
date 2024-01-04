<template>
  <body>
  <h1>{{uiLabels.spotTheLie}}</h1>
  <div v-if="this.roundInfo.questions.length">
  <div class="participantInfoDiv">
    <div class="participantInfoDivProperties">
      {{this.roundInfo.questions[3].avatar}}
      {{this.roundInfo.questions[3].name}}
    </div>
    <div v-if="submittedAnswer">
      <div v-for="(answer, index) in roundInfo.questions.slice(0,3)" :key="index">
        {{answer}} {{roundInfo.participantAnswer[index].join(", ")}}
      </div>
    </div>
    <div v-else>
      </div>
      <div v-if="!(this.roundInfo.questions[3].name === this.userName)">
        <div v-for="(answer, index) in roundInfo.questions.slice(0,3)" :key="index">
          <input type="radio" :id="'answer' + index" v-model="selectedLieIndex" :value="index" />
          <label :for="'answer' + index">{{ answer }}</label>
        </div>
        <button @click="selectLie(); changeSubmittedAnswerBoolean(); ">{{uiLabels.submitButton}}</button>
      </div>
      <div v-else>
        <div v-for="(answer, index) in roundInfo.questions.slice(0,3)" :key="index">
          {{answer}} {{roundInfo.participantAnswer[index].join(", ")}}
        </div>
      </div>
    </div>
  </div>

  </body>

</template>

<script >
import io from "socket.io-client";
const socket = io("http://127.0.0.1:3000");

export default {
  name: "GuessingView",
  data: function() {
    return {
      pollId: "",
      userName: "",
      timeInfo: null,
      currentParticipantIndex: 0,
      selectedLieIndex: "",
      participants: [],
      question: [],
      timer: 0,
      correctAnswer: "",
      questionDone: false,
      submittedAnswer: false,
      roundInfo: {questions: [], participantAnswer: [[],[],[],[]] },
      uiLabels: {},
      lang: localStorage.getItem("lang") || "en",
    }
  },
  created: function() {
    this.pollId = this.$route.params.id;
    this.userName = this.$route.params.uid;
    socket.emit("joinPoll", this.pollId);
    socket.emit("getTime", this.pollId);
    socket.emit("ReadyToGo", this.pollId);
    socket.on("sendTimeInfo", (timeInfo) => {
      this.timeInfo = timeInfo;
    });
    socket.on("startingRounds", (question) => {
      this.clearArrays();
      this.roundInfo.questions = question;
    });
    socket.on("updateRound", () => {
      socket.emit("ReadyToGo", this.pollId)});

    socket.on("endGame", () =>
        this.$router.push("/ScoreBoard/" + this.pollId));
    socket.on("showAnswer", (correctAnswer, allAnswers) => {
      this.correctAnswer = correctAnswer;
      this.placeAnswers(allAnswers);
      this.submittedAnswer = true;
    })
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {this.uiLabels = labels})
  },
  methods: {
    changeSubmittedAnswerBoolean() {
      setTimeout(() =>
      {this.submittedAnswer = true}, 3000);
    },
    startTimer() {
      let t = setInterval( () => {
        this.timer--;
        if(this.timer <= 0){
          this.timer = this.timeInfo;
          clearInterval(t)
        }
      }, 1000);
    },
    selectLie() {
      socket.emit("sendSelectedLie",this.pollId, this.userName ,this.question[this.selectedLieIndex]);
    },
    clearArrays(){
      this.roundInfo.participantAnswer = [[],[],[],[]];
      this.submittedAnswer = false;
    },
    placeAnswers(allAnswers){
      console.log(allAnswers)
      allAnswers.forEach(a => {
        if(a.answer === this.question[0]){
          this.roundInfo.participantAnswer[0].push(a.userName)
        }
        else if(a.answer === this.question[1]){
          this.roundInfo.participantAnswer[1].push(a.userName)
        }
        else if(a.answer === this.question[2]){
          this.roundInfo.participantAnswer[2].push(a.userName)
        }
        else{
          this.roundInfo.participantAnswer[3].push(a.userName)
        }
      });
    }
  },
}
</script>

<style>
body {
  color:white
}

.participantInfoDiv {
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 100%;
}
.participantInfoDivProperties {
  font-size: 2em;
}

.participantName {
}

.participantAvatarDiv {
}
</style>