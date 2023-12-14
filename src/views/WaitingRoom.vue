<template>
    <div>
      {{pollId}}
        <input type="text" v-model="userName">
        <button v-on:click="submitUserName">
        {{ uiLabels.participateInPoll }}
    </button>
    {{ participents }}
    </div>
  </template>
  
  <script>
  // @ is an alias to /src
  import io from 'socket.io-client';
  const socket = io("localhost:3000");
  
  export default {
    name: 'PollView',
    data: function () {
      return {
        pollId: "inactive poll",
        userName: "",
        uiLabels: {},
        lang: localStorage.getItem("lang" || "en"),
        participents: []
      }
    },
    created: function () {
        this.pollId = this.$route.params.id;
        socket.emit("pageLoaded", this.lang);
        socket.on("init", (labels) => {
        this.uiLabels = labels
    });
        socket.on("participentsUpdate", (participents) =>
        this.participents = participents);
        socket.on("startGame", () => this.$router.push("/poll/" + this.pollId + "/" + this.userName));
        socket.emit("joinPoll", this.pollId);
        socket.emit("enterLobby", this.pollId);
    },
    methods: {
      submitUserName: function () {
        socket.emit("submitUserName", {pollId: this.pollId, name: this.userName})
      }
    }
  }
  </script>
  