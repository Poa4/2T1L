<template>
  <main class="background">
      <section class="wrapper"> 
        <div id="first">
            <p>
              Game ID: {{pollId}}
              <br/>
                Join at: <a v-bind:href="website">{{ website }} </a>
            </p>
        </div>
        <div id="second">
          <div>
            <qrcode-vue :value="QRvalue" :size="size" level="H" /> <!--kan sätta in nya variabler på value och size för att ändra -->
          </div>
            <p>
              Join through your phone
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
          <p class="gameOptions">
              {{ teams }}
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
          <button v-on:click="submitUserName"> submit </button>
          <!-- Waiting for host to start the game -->
        </p>
      </section>

    

  </main>















<!-- <p><textarea name="textarea" id="t1" cols="30" rows="10" maxlength="20"></textarea></p> text area
<div>
Poll link: 
<input type="text" v-model="pollId">
<button v-on:click="createPoll">
  Create poll
</button>
<div>
  {{uiLabels.question}}:
  <input type="text" v-model="question">
  <div>
    Answers:
    <input v-for="(_, i) in answers" 
           v-model="answers[i]" 
           v-bind:key="'answer'+i">
    <button v-on:click="addAnswer">
      Add answer alternative
    </button>
  </div>
</div>
<button v-on:click="addQuestion">
  Add question
</button>
<input type="number" v-model="questionNumber">
<button v-on:click="runQuestion">
  Run question
</button>
{{data}}
<router-link v-bind:to="'/result/'+pollId">Check result</router-link>
</div>-->
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
        teams: false,
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
        socket.on("startGame", () => this.$router.push("/InsertTruths/" + this.userName))
        socket.on("currentRoomStatus", (participents, gameOptions) => {
          this.participents = participents;
          this.rounds = gameOptions.rounds;
          this.time = gameOptions.time;
          this.teams = gameOptions.teams;
        });
        socket.on("participentsUpdate", (participents) =>{
          this.participents = participents;
          console.log(this.participents);
        });
    },
    methods: {
      submitUserName: function () {
        console.log(this.userName)
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


