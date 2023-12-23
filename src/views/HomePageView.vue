<template>
  <body>
  <div class="playGameDiv">
    <h1 class="gameTitle">2 Lies and 1 Truth</h1>
    <button @click="showCreateGameModal = true;
                    generateRandomAvatar();
                    generateGameCode();" class="createGameButton">Create Game</button>
    <button @click="showJoinGameModal = true;
                    generateRandomAvatar();
                    " class="joinGameButton">Join Game</button>
    <div>
      <div v-if="showCreateGameModal" class="modal">
        <div class="modalContent">
          <form @submit.prevent="createGame()">
          <label for="playerName">Player Name:</label><br>
          <input type="text" id="playerName" v-model="playerName" required="required"><br><br>
          <label for="gameCode">Game Code:</label><br>
          <input type="text" id="gameCode" v-model="gameCode" readonly><br><br>
          <label for="avatar">Pick a avatar:</label><br>
          <div class="avatarDiv">
              <span class="avatars" v-for="emoji in avatars">
                <input type="radio" name="avatar"  @click="chooseAvatar(emoji)" required="required">{{emoji}}</span>
          </div>
          <div class="gameSettings">
            <label for="rounds">Number of rounds:</label><br>
            <input type="number" id="rounds" v-model="gameSettings.rounds" required="required" :min="1"><br><br>
            <label for="time">Time per round:</label><br>
            <input type="number" id="rounds" v-model="gameSettings.time" required="required" :min="60"><br><br>
            <label for="teams">Number of teams:</label><br>
            <input type="number" id="rounds" v-model="gameSettings.teams" required="required" :min="1"><br><br>
          </div>
            <button>Create Game</button>
          </form>

          <button @click="this.debounce(),
                          generateRandomAvatar" class="generateRandomAvatarsButton">CLICK ME FOR NEW EMOJIS!!</button><br>
        </div>
        <button @click="showCreateGameModal = false">X</button>
      </div>
    </div>

    <div>
      <div v-if="showJoinGameModal" class="modal">
        <div class="modalContent">
          <form @submit.prevent="joinGame()">
            <label for="playerName">Player Name:</label><br>
            <input type="text" id="playerName" v-model="playerName" required="required"><br><br>
            <label for="gameCode">Game Code:</label><br>
            <input type="text" id="gameCode" v-model="joinGameCode" required="required"><br><br>
            <label for="avatar">Pick a avatar:</label><br>
            <div class="avatarDiv">
              <span class="avatars" v-for="(emoji,index) in avatars"
                    :key="index">
                <input type="radio" name="avatar" @click="chooseAvatar(emoji)">{{emoji}}</span>
            </div>

            <button>Join Game</button>
          </form>
          <button @click="this.debounce(),
                          generateRandomAvatar" class="generateRandomAvatarsButton">CLICK ME FOR NEW EMOJIS!!</button><br>
          <button @click="showJoinGameModal = false">X</button>
        </div>
      </div>
    </div>

  </div>

  </body>
</template>

<script>
import io from "socket.io-client";
const socket = io("http://127.0.0.1:3000");

export default {
  name: "HomePageView",
  data:function() {
  return {
    showCreateGameModal: false,
    showJoinGameModal: false,
      playerName: "",
      gameCode: "",
      joinGameCode: "",
      avatars: [],
      chosenAvatar: "",
      gameSettings: {"rounds": 2,
                      "time": 60,
                      "teams": 1,}
  }
  },
  created: function() {
    this.debounce =  this.debounceGenerateRandomAvatarButton(this.generateRandomAvatar, 1000)
  },
  methods: {
    createGame: function (){
      socket.emit("createGameLobby",{pollId: this.gameCode, name: this.playerName, avatar: this.chosenAvatar});
      this.$router.push("/create/" + this.gameCode + "/" +this.playerName)
    },
    joinGame: function () {
      socket.emit("submitUserName", {pollId: this.joinGameCode, name: this.playerName, avatar: this.chosenAvatar});
      this.$router.push("/lobby/" + this.joinGameCode + "/" + this.playerName)
    },
    generateGameCode: function () {
      this.gameCode = Math.random().toString().substring(2, 10);
    },
    debounceGenerateRandomAvatarButton: function(func, timeout) {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
      };

    },
    chooseAvatar: function(avatar) {
        this.chosenAvatar = avatar;
        console.log(this.chosenAvatar);
    },
    generateRandomAvatar: function() {
      fetch("https://emoji-api.com/emojis?access_key=bd609ab5841ff29f856c7ce1ce62a1492bb00858\n")
        .then(res => res.json())
        .then(data => {
          this.avatars = [];
          for (let i = 0; i < 4; i++) {
            let randomEmoji = data[Math.floor(Math.random() * (data.length + 1))];
            this.avatars.push(randomEmoji.character);
          }
        })
    }
  }
}
</script>

<style>
  body {
  }
  .playGameDiv {
    display: grid;
    grid-template-rows: 100px 100px 100px;
    grid-template-columns:100px 100px 100px;
    justify-content: center;
    align-items: center;
  }
  .gameTitle {
    grid-column: 1/3;
    grid-row: 1/3;
  }
  .createGameButton {
    grid-column: 1/2;
    grid-row: 2/2;
  }
  .joinGameButton {
    grid-column: 2/2;
    grid-row: 2/2;
  }
  .modal {
    display: block;
    position: absolute;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.9);
  }
  .modalContent {
    background-color: white;
    margin: 15% auto;
    width: 50%;
  }
  .avatarDiv {
    display: grid;
    grid-template-columns: 50px 50px 50px 50px;
    justify-content: center;
    align-items: center;

  }
  .generateRandomAvatarsButton {
    grid-column: 1/5;
  }

</style>