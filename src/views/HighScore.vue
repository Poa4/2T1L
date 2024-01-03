<template>
<header class="headline">
        <h1>HighScore</h1>
    </header>

<main class="headline list">
<p>{{addToHighScore({"participant": "Vanja Natvig", "score":0})}}</p> <!-- Exempel på input -->
    <p v-for="(item, index) in sortedHighScore(highScoreList)">
     {{ index + 1}}:a {{ item.participant }} - {{ item.score }} poäng
    </p>
</main>
</template>

<script>
import io from 'socket.io-client'
import { ref } from 'vue'
const socket = io();

export default {
  name: 'HighScore',
  data: function () {
    return {
        highScoreList: {},
        highScoreList: [{"participant": "participant 1", "score": 3}, {"participant": "Participant 2", "score": 5}, {"participant": "Participant 3", "score":4 }]
    }
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
    font-size: 40px;
}

.list {
    color: white;
    text-align: center;
    font-size: 30px;
}

</style>