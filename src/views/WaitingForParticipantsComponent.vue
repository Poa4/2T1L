<template>
  <body>
  <h1>
    Hello, you are waiting
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
    }
  },
  created: function(){
    this.pollId = this.$route.params.id;
    this.userName = this.$route.params.uid;
    socket.emit("joinPoll", this.pollId);
    socket.on("startRound", () => {
      this.$router.push("/GuessingView/" + this.pollId + "/" + this.userName)
    });
  }
}
</script>

<style scoped>

</style>