<template>
  <body>
  <div>
    <h1>Spot the lie!</h1>
    <div v-if="participants[currentParticipantIndex]"></div>
    {{ this.participants[currentParticipantIndex].avatar }}<br>
    {{this.participants[currentParticipantIndex].name}}<br>
    <div v-for="(answer, index) in participants[currentParticipantIndex].answers" :key="index">
      <input type="radio" :id="'answer' + index" v-model="selectedLie" :value="index" />
      <label :for="'answer' + index">{{ answer }}</label>
    </div>
    <button @click="selectLie">Submit</button>
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
      gameInfo: null,
      points: 0,
      currentParticipantIndex: 0,
      selectedLie: "",
      participants: [],

    }
  },
  created: function() {
    this.pollId = this.$route.params.id;
    this.userName = this.$route.params.uid;
    socket.emit("joinPoll", this.pollId);
    socket.emit("getRoundInfo", this.pollId);
    socket.on("sendGameInfo", (gameInfo) => {
      this.gameInfo = gameInfo;
      this.participants = gameInfo.participents;
      this.startTimer();
    })
  },
  methods: {
    startTimer() {
      this.timer = setTimeout(this.checkAnswer, 60000);
    },
    checkAnswer() {
      if (this.selectedLie === this.gameInfo.participents[this.currentParticipantIndex].answer.lie){
        this.points++;
      }
      this.displayNextParticipantQuestions();
      },
    selectLie() {
      clearTimeout(this.timer);
      this.checkAnswer();
    },
    displayNextParticipantQuestions() {
      this.currentParticipantIndex++;
      if (this.currentParticipantIndex >= this.gameInfo.participant.length){
        this.$router.push("/InsertTruths/" + this.pollId + "/" +this.userName);
      }
      this.startTimer()
    }

  }
}
</script>

<style>
body {
  color:white
}
</style>