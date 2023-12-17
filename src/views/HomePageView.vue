<template>
  <body>
  <div class="playGameDiv">
    <h1 class="gameTitle">2 Lies and 1 Truth</h1>
    <button @click="createGame" class="createGameButton">Create Game</button>
    <button @click="showModal = true;generateRandomAvatar" class="joinGameButton">Join Game</button>
    <div>
      <div v-if="showModal" class="modal">
        <div class="joinGameModalContent">
          <form>
            <label for="playerName">Player Name:</label><br>
            <input type="text" id="playerName" v-model="playerName" required="required"><br><br>
            <label for="gameCode">Game Code:</label><br>
            <input type="text" id="gameCode" v-model="gameCode" required="required"><br><br>
            <label for="avatar">Pick a avatar:</label><br>
            <div class="avatarDiv">
              <span class="avatars" v-for="emoji in avatars">
                {{emoji}}</span>
              <button @click="this.debounce() ;generateRandomAvatar" class="generateRandomAvatarsButton">CLICK ME FOR NEW EMOJIS!!</button><br>
            </div>

            <input type="submit" value="Join!">
          </form>
          <button @click="showModal = false">X</button>
        </div>
      </div>
    </div>

  </div>

  </body>
</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");
export default {
  name: "HomePageView",
  data:function() {
  return {
      id: "test",
      showModal: false,
      playerName: "",
      gameCode: "",
      avatars: [],   }
  },
  created: function() {
    this.debounce =  this.debounceGenerateRandomAvatarButton(this.generateRandomAvatar, 1000)
  },
  methods: {
    createGame: function () {
      /*let gameLobbyCode = Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5);
      console.log(gameLobbyCode)*/
      let gameLobbyCode = "test";

      socket.emit("createPoll", {gameLobbyCode: gameLobbyCode, lang: this.lang })
      this.$router.push("/create/" + gameLobbyCode)
    },
    debounceGenerateRandomAvatarButton: function(func, timeout) {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
      };

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
  .joinGameModalContent {
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