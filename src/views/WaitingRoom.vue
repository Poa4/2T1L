<template>
  <main class="background">
      <section class="wrapper"> 
        <div id="first">
            <p>
              {{uiLabels.gameID}} {{pollId}}
              <br/>
                {{uiLabels.joinAt}} <a v-bind:href="website">{{ website }} </a>
            </p>
        </div>
        <div id="second">
          <div>
            <qrcode-vue :value="QRvalue" :size="size" level="H" /> <!--kan sätta in nya variabler på value och size för att ändra -->
          </div>
            <p>
              {{uiLabels.joinQR}}
            </p>
        </div>
      </section>


      <section class="wrapper2">
        <div class="doubleAlign">
          <p class="gameOptions">
            {{ rounds }}
          </p>
          <p class="gameOptions">
            {{ time }}
          </p>
        </div>
      </section>

      <section class="wrapper3">
        <div class="participentArea">
            <p v-for="participent in participents">
              {{participent.name}} {{ participent.avatar}}
            </p>
        </div>

      </section>

      <section>
        <p id="waitingToStart">
          <button v-on:click="leaveLobby()"> {{uiLabels.leaveButton}} </button>
          <!-- Waiting for host to start the game -->
        </p>
      </section>

    

  </main>



</template>
  
<script>
  // @ is an alias to /src
  import io from 'socket.io-client';
  import QrcodeVue from "qrcode.vue";
  const socket = io("localhost:3000");
  
  
  export default {
    name: 'WaitingRoom',
    data: function () {
      return {
        pollId: "",
        userName: "",
        uiLabels: {},
        lang: localStorage.getItem("lang" || "en"),
        participents: [],
        website: "http://localhost:5173/lobby/",
        QRvalue: "",
        rounds: 5,
        time: 30,
      }
    },
    created: function () {
        this.pollId = this.$route.params.id;
        this.userName = this.$route.params.uid;
        this.website = this.website + this.pollId;
        this.QRvalue = this.website;
        socket.emit("pageLoaded", this.lang);
        socket.on("init", (labels) => {
        this.uiLabels = labels
    });
        socket.emit("joinPoll", this.pollId);
        socket.emit("enterLobby", this.pollId);

        socket.on("GOptionsChange", (data) => {
          this.rounds = data.rounds;
          this.time = data.time;
          this.teams = data.teams;
        });
        socket.on("startGame", () => this.$router.push("/InsertTruths/" + this.pollId + "/" + this.userName))
        socket.on("currentRoomStatus", (participents, gameOptions) => {
          this.participents = participents;
          this.rounds = gameOptions.rounds;
          this.time = gameOptions.time;
        });
        socket.on("participentsUpdate", (participents) =>{
          this.participents = participents;
          console.log(this.participents);
        });
        socket.on("hostLeftTheLobby",(() => {
          this.$router.push("/")
      }))
    },
    methods: {
      submitUserName: function () {
        console.log(this.userName)
      },
      leaveLobby: function () {
        this.participents = [];
        socket.emit("leaveLobby", this.pollId, this.userName)
        this.$router.push("/")
      }
    },
    components: {
      QrcodeVue
    }
  }
  </script>
  
  <style>
.background{
  background-color: rgb(39, 3, 63);
  overflow: hidden;
}
p{
  font-size: 1.2em;
  color: white;
}

.wrapper{
  display: flex;
  height: 8em;
  margin-bottom: 0.7em;
}
.wrapper2{
  display: flex;
  height: 5em;
  margin-bottom: 0.5em;
}
.doubleAlign{
  width: 60%;
  display: flex;
  margin: auto;
}
.wrapper3{
  display: flex;
  height: 17em;
  margin-bottom: 0.5em;
}

.gameOptions{
  margin: auto;
  color: rgb(94, 93, 93);
}

#first{
  width: 50%;
  text-align: left;
  padding-inline-start: 6em;
}
br{
  display: block;
  content: "";
  margin-top: 1em;
  text-align: top;
}
#second{
  width: 50%;
  display: flex;
  padding-inline-end: 6em;
}
#second div{
  background-color: white;
  height: 100px;
  width: 100px;
  margin: auto;
}
#second p{
  margin: auto;
  margin-right: 30%;
  margin-top: 1.5em;
}
a {
  font-size: 1em;
  color: white;
}



.participentArea{
  height: 99%;
  width: 60%;
  background-color: rgb(197, 196, 196);
  margin: auto;
  overflow: scroll;
  overflow-x: hidden;
}
.participentArea p{
  font-size: 1em;
  color: rgb(0, 0, 0);
  text-align: left;
  margin-left: 0.5em;
}
#waitingToStart{
  font-size: 1.5em;
  margin-bottom: 1.4em;
}
</style>


