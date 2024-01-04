<template>
  <body>
  <h1>
    {{uiLabels.waitingForParticipants}}
  </h1>
  </body>
</template>


<script>
import io from 'socket.io-client';
const socket = io("http://127.0.0.1:3000");

export default  {
  name: "WaitingForParticipantsComponent",
  data:function () {
    return {
      pollId: "",
      userName: "",
      uiLabels: {},
         lang: localStorage.getItem("lang") || "en",
    }
  },
  created: function(){
    this.pollId = this.$route.params.id;
    this.userName = this.$route.params.uid;
    socket.emit("joinPoll", this.pollId);
    socket.on("startRound", () => {
      this.$router.push("/GuessingView/" + this.pollId + "/" + this.userName)
    });
        socket.emit("pageLoaded", this.lang);
        socket.on("init", (labels) => {this.uiLabels = labels})
  }
}
</script>

<style scoped>

</style>