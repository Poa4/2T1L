<template>
  <div class="modal">
        <div class="modalContent">
          <form @submit.prevent="joinGame()">
            <label for="playerName">Choose your nickname</label><br>
            <input type="text" id="playerName" placeholder="Name" v-model="playerName" required="required"><br><br>
            <label for="gameCode">Enter the room code:</label><br>
            <input type="text" id="gameCode"  v-model="joinGameCode" required="required"><br><br>
            <label for="avatar">Pick a avatar:</label><br>
            <div class="avatarDiv">
              <span class="avatars" v-for="(emoji,index) in avatars"
                    :key="index">
                <input type="radio" name="avatar" @click="chooseAvatar(emoji)">{{emoji}}


              </span>

            </div>

            <button>Join Game</button>
          </form>
          <button @click="this.debounce(),
                          generateRandomAvatar" class="generateRandomAvatarsButton">CLICK ME FOR NEW EMOJIS!!</button><br>
          <button @click="$router.push('/')">X</button>
        </div>
      </div>



</template>


<script>
import io from "socket.io-client";
const socket = io("http://127.0.0.1:3000");

export default {
  name: "HomePageView",
  data:function() {
  return {
      playerName: "",
      joinGameCode: "",
      avatars: [],
      chosenAvatar: "",
  }

  },
  created: function() {
    this.debounce =  this.debounceGenerateRandomAvatarButton(this.generateRandomAvatar, 1000);
    this.joinGameCode = window.location.href.split("lobby/").pop();
    

  },
  mounted: function() {
    this.generateRandomAvatar();

  },

  methods: {
    joinGame: function () {
      socket.emit("submitUserName", {pollId: this.joinGameCode, name: this.playerName, avatar: this.chosenAvatar});
      this.$router.push("/lobby/" + this.joinGameCode + "/" + this.playerName)
    },
    debounceGenerateRandomAvatarButton: function(func, timeout) {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
      };
    },
    chooseAvatar: function(avatar) {
      if (!this.chosenAvatar === avatar) {
        this.chosenAvatar = avatar;
      }
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
  color:white;
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