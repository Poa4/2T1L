<template>
<header class="headline">
        <h1>{{uiLabels.highScore}}</h1>
    </header>

<main class="headline">
    <p v-for="(item, index) in sortedHighScore(scoreList)">
     {{ index + 1}}:a {{ item.name }} {{ item.avatar }} - {{ item.score }} {{uiLabels.points}}
    </p>
</main>
</template>

<script>
import io from 'socket.io-client'
import { ref } from 'vue'
const socket = io("http://127.0.0.1:3000");

export default {
  name: 'HighScore',
  data: function () {
    return {
        highScoreList: [{"participant": "participant 1", "score": 3}, {"participant": "Participant 2", "score": 5}, {"participant": "Participant 3", "score":4 }],
        scoreList: [],
		uiLabels: {},
            lang: localStorage.getItem("lang") || "en",
    }
  },
  created: function(){
    this.pollId = this.$route.params.id;
    socket.emit("joinPoll", this.pollId);
    socket.emit("GetScore", this.pollId);
    socket.on("sendScore", (particpentsList) => {
      this.scoreList = particpentsList
    });
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {this.uiLabels = labels})
  },
  methods: {
    sortedHighScore: function (arr) {
          // Set slice() to avoid to generate an infinite loop!
          return arr.slice().sort(function(a, b) {
            return b.score - a.score;
          });
    },
    addToHighScore: function (event) {
          this.highScoreList.push(event);
    }
  }
}

</script>

<style>
body, html {
   font-family: black;
   Background-color: black;
   margin: 100px;
}


.headline {
    color: white;
    text-align: center;

}

</style>


[{username: a, avatar: b, score: c},{username: a2, avatar: b2, score: c2}...]