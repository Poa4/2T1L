<template>
  <body>
  <div v-if="this.question.length">
    <h1>Spot the lie!</h1>
    <div class="participantAvatarDiv">
      {{question[3].avatar}}<br>
    </div>
    {{this.question.name}}<br>
    <div v-for="(answer, index) in question.slice(0,3)" :key="index">
      <input type="radio" :id="'answer' + index" v-model="selectedLie" :value="index" />
      <label :for="'answer' + index">{{ answer }}</label>
    </div>
    <button @click="selectLie">Submit</button>
  </div>
  <div>
    {{ question }}
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
      selectedLie: "",
      participants: [],
      question: [],
    }
  },
  created: function() {
    this.pollId = this.$route.params.id;
    this.userName = this.$route.params.uid;
    socket.emit("joinPoll", this.pollId);
    socket.emit("getTime", this.pollId);
    socket.emit("JoinedGuessingPage", this.pollId);
    socket.on("sendTimeInfo", (timeInfo) => {
      this.timeInfo = timeInfo;
    });
    socket.on("startingRounds", (question) => {
      this.question = question;
    });

  },
  methods: {
    startTimer() {
      this.timer = setTimeout(this.checkAnswer, 60000);
    },
    checkAnswer() {
      if (this.selectedLie === this.gameInfo.participents[this.currentParticipantIndex].answers.lie){
        console.log(this.points, this.gameInfo.participents[this.currentParticipantIndex].answers.lie)
        this.points++;
        console.log(this.points)
      }
      this.displayNextParticipantQuestions();
      },
    selectLie() {
      clearTimeout(this.timer);
      this.checkAnswer();
    },
    displayNextParticipantQuestions() {
      if (!(this.currentParticipantIndex >= (this.gameInfo.participents.length-1))){
        this.currentParticipantIndex++;
      }
      else {
        this.$router.push("/InsertTruths/" + this.pollId + "/" + this.userName);
      }
    }

  }
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