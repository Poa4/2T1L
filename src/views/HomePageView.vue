<template>
  <body>
  <div class="playGameDiv">
    <h1 class="gameTitle">2 Truths<br>&<br>1 Lie</h1>
    <div class="frontButtons">
      <button @click="showCreateGameModal = true;
  generateRandomAvatar();
  generateGameCode();" class="createGameButton">{{ uiLabels.createGame }}
      </button>
      <button @click="showJoinGameModal = true;
  generateRandomAvatar();
  " class="joinGameButton">{{ uiLabels.joinGame }}
      </button>
    </div>
    <div>
      <button v-on:click="switchLanguage">{{ uiLabels.changeLanguage }}</button>
    </div>
    <div>
      <div v-if="showCreateGameModal" class="modal">
        <div class="modalContent">
          <form @submit.prevent="createGame()">
            <label for="playerName">{{ uiLabels.nickname }}</label><br>
            <input type="text" id="playerName" v-model="playerName" placeholder="Name" required="required"><br><br>
            <label for="gameCode">{{ uiLabels.roomCode }}</label><br>
            <input type="text" id="gameCode" placeholder="Code" v-model="gameCode" readonly><br><br>
            <label for="avatar">{{ uiLabels.avatar }}</label><br>
            <div class="avatarDiv">
  <span class="avatars" v-for="emoji in avatars">
  <input type="radio" name="avatar" @click="chooseAvatar(emoji)" required="required">{{ emoji }}</span>
            </div>
            <div class="gameSettings">
            </div>
            <button>{{ uiLabels.createGame }}</button>
          </form>


          <button @click="this.debounce(),
  generateRandomAvatar" class="generateRandomAvatarsButton">{{ uiLabels.newEmojis }}
          </button>
          <br>

          <button @click="showCreateGameModal = false" class="exitButton">X</button>
        </div>
      </div>
    </div>


    <div>
      <div v-if="showJoinGameModal" class="modal">
        <div class="modalContent">
          <form @submit.prevent="joinGame()">
            <label for="playerName">{{ uiLabels.nickname }}</label><br>
            <input type="text" id="playerName" placeholder="Name" v-model="playerName" required="required"><br><br>
            <label for="gameCode">{{ uiLabels.roomCode }}:</label><br>
            <input type="text" id="gameCode" placeholder="Code" v-model="joinGameCode" required="required"><br><br>
            <label for="avatar">{{ uiLabels.avatar }}:</label><br>
            <div class="avatarDiv">
  <span class="avatars" v-for="(emoji,index) in avatars"
        :key="index">
  <input type="radio" name="avatar" @click="chooseAvatar(emoji)">{{ emoji }}</span>
            </div>


            <button>{{ uiLabels.joinGame }}</button>
          </form>
          <button @click="this.debounce();
                          generateRandomAvatar();" class="generateRandomAvatarsButton">{{ uiLabels.newEmojis }}
          </button>
          <br>
          <button @click="showJoinGameModal = false" class="exitButton">X</button>
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
  data: function () {
    return {
      debounce: null,
      showCreateGameModal: false,
      showJoinGameModal: false,
      playerName: "",
      gameCode: "",
      joinGameCode: "",
      avatars: [],
      chosenAvatar: "",
      gameSettings: {
        "rounds": 2,
        "time": 60,
        "teams": 1,
      },
      uiLabels: {},
      id: "",
      testCreateId: "test",
      lang: localStorage.getItem("lang") || "en"
    }
  },
  created: function () {
    this.debounce = this.debounceGenerateRandomAvatarButton(this.generateRandomAvatar, 1000);
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
  },
  methods: {
    createGame: function () {
      socket.emit("createGameLobby", {pollId: this.gameCode, name: this.playerName, avatar: this.chosenAvatar});
      this.$router.push("/create/" + this.gameCode + "/" + this.playerName)
    },
    joinGame: function () {
      socket.emit("doesUserExistInLobby", {
            pollId: this.joinGameCode,
            name: this.playerName,},
          (response) => {
            if(response) {
              alert("A user has the same name and/or avatar in the lobby.")
            }
            else{
              socket.emit("submitUserName", {
                pollId: this.joinGameCode,
                name: this.playerName,
                avatar: this.chosenAvatar});
              this.$router.push("/lobby/" + this.joinGameCode + "/" + this.playerName)
            }
          });
    },
    generateGameCode: function () {
      this.gameCode = Math.random().toString().substring(2, 10);
    },
    debounceGenerateRandomAvatarButton: function (func, timeout) {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          func.apply(this, args);
        }, timeout);
      };


    },
    chooseAvatar: function (avatar) {
      this.chosenAvatar = avatar;
    },
    generateRandomAvatar: function () {
      fetch("https://emoji-api.com/emojis?access_key=bd609ab5841ff29f856c7ce1ce62a1492bb00858\n")
          .then(res => res.json())
          .then(data => {
            this.avatars = [];
            for (let i = 0; i < 4; i++) {
              let randomEmoji = data[Math.floor(Math.random() * (data.length + 1))];
              this.avatars.push(randomEmoji.character);
            }
          })
    },
    switchLanguage: function () {
      if (this.lang === "en") {
        this.lang = "sv"
      } else {
        this.lang = "en"
      }
      localStorage.setItem("lang", this.lang);
      socket.emit("switchLanguage", this.lang)
    }
  }
}
</script>


<style>
body {
  overflow: hidden;
  background-color: #1E152A;

}

.playGameDiv {
  display: grid;
  grid-template-rows: 100px 250px 300px;
  grid-template-columns:100px 300px 100px;
  justify-content: center;
  align-items: center;
}

.gameTitle {
  color: white;
  grid-column: 2/3;
  grid-row: 2/2;
  text-align: center;
  text-shadow: 2px 2px 5px #DA4167
}

h1 {
  font-size: 400%;
}

.frontButtons {
  display: grid;
  grid-template-rows: 820px 100px 100px;
  grid-template-columns:500px 200px 100px;
  justify-content: center;
  align-items: center;
  text-align: center;
  column-gap: 20px;
  row-gap: 10px;

}

.createGameButton {
  grid-column: 2/3;
  grid-row: 2/3;
  font-size: x-large;
  width: 100%;
  height: 100%;
}

.joinGameButton {
  grid-column: 2/3;
  grid-row: 3/3;
  font-size: x-large;
  width: 100%;
  height: 100%;
}

.modal {
  display: block;
  position: absolute;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(39, 3, 63);


}

.modalContent {
  background-color: rgb(39, 3, 63);
  margin: 15% auto;
  width: 50%;
  color: white;
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

button {
  background: rgb(237, 40, 135);
  font-size: 120%;
  padding: 1%;
  width: 300px;
  border-radius: 12px;
  margin: 4px 4px;
}

button:hover {
  color: white;
}

.exitButton {
  width: 100px;
}

input[type=text] {
  padding: 12px 20px;
  background-color: lightgrey;
}

input[type=text]:focus {
  background-color: white;
}


</style>
  