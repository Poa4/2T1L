<template>
  <body>
  <div v-if="this.question.length">
    <h1>Spot the lie!</h1>
    <div class="participantAvatarDiv">
      {{question[3].avatar}}<br>
    </div>
    {{this.question.name}}<br>
    <div v-for="(answer, index) in question.slice(0,3)" :key="index">
      <input type="radio" :id="'answer' + index" v-model="selectedLieIndex" :value="index" />
      <label :for="'answer' + index">{{ answer }}</label>
    </div>
    <button @click="selectLie">Submit</button>
  </div>
  <section v-if="questionDone">
    <div v-for="particpent in answerArray1"> Första{{ particpent  }}</div>
    <div v-for="particpent in answerArray2"> Andra{{ particpent  }}</div>
    <div v-for="particpent in answerArray3"> Tredje{{ particpent  }}</div>
    <div v-for="particpent in shameArray"> Fjärde{{ particpent  }}</div>
  </section>
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
      answerArray1: [],
      answerArray2: [],
      answerArray3: [],
      shameArray: []

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
      this.timer = this.timeInfo;
    });
    socket.on("startingRounds", (question) => {
      this.clearArrays();
      this.question = question;
    });
    socket.on("updateRound", () => {
    socket.emit("ReadyToGo", this.pollId)});

    socket.on("endGame", () => this.$router.push("/ScoreBoard/" + this.pollId));
    socket.on("showAnswer", (correctAnswer, allAnswers) => {
      this.correctAnswer = correctAnswer;
      this.placeAnswers(allAnswers);
      this.questionDone = true;
      

    })
  },
  methods: {
    startTimer() {
        var t = setInterval( () => {
        this.timer--;
        if(this.timer <= 0){
          this.timer = this.timeInfo;
          clearInterval(t)
        }
        }, 1000);
      },
      checkAnswer() {
      console.log("hej")
      },
    selectLie() {
      socket.emit("sendSelectedLie",this.pollId, this.userName ,this.question[this.selectedLieIndex]);
    },
    clearArrays(){
      this.answerArray1 = [];
      this.answerArray2 = [];
      this.answerArray3 = [];
      this.shameArray = [];
      this.questionDone = false;
    },
    placeAnswers(allAnswers){
      allAnswers.forEach(a => {
        if(a.answer === this.question[0]){
          this.answerArray1.push(a.userName);
        }
        else if(a.answer === this.question[1]){
          this.answerArray2.push(a.userName)
        }
        else if(a.answer === this.question[2]){
          this.answerArray3.push(a.userName);
        }
        else{
          this.shameArray.push(a.userName);
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

.participantAvatarDiv {
  width: 100%;
  height: auto;
}
</style>