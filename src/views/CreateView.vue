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
              <div class="gameOptions">
              <button v-if="!showRoundsForm" v-on:click="showRoundsForm = !showRoundsForm">{{rounds}} rounds</button>
              <form id="gameSelectionsOptionForm" v-if="showRoundsForm">
                <label class="customRadio"> <span class="labelText">5</span>
                <input type="radio" id="rounds_amount1" v-model="rounds" value="5" v-on:change="roundsButtonChange($event)">
                </label>
                <label class="customRadio"><span class="labelText">10</span>
                <input type="radio" id="rounds_amount2" v-model="rounds" value="10" v-on:change="roundsButtonChange($event)">
                </label>
                <label class="customRadio"><span class="labelText">15</span>
                <input type="radio" id="rounds_amount3" v-model="rounds" value="15" v-on:change="roundsButtonChange($event)">
                </label>
              </form>
              </div>


              <div class="gameOptions">
              <button v-if="!showTimeForm" v-on:click="showTimeForm = !showTimeForm">{{time}} sec</button>
              <form id="gameSelectionsOptionForm" v-if="showTimeForm">
                <label class="customRadio"> <span class="labelText">30</span>
                <input type="radio" id="time_amount1" v-model="time" value="30" v-on:change="timeButtonChange($event)">
                </label>
                <label class="customRadio"><span class="labelText">45</span>
                <input type="radio" id="time_amount2" v-model="time" value="45" v-on:change="timeButtonChange($event)">
                </label>
                <label class="customRadio"><span class="labelText">60</span>
                <input type="radio" id="time_amount3" v-model="time" value="60" v-on:change="timeButtonChange($event)">
                </label>
              </form>
              </div>

              <div class="gameOptions">
                <button v-if="!showTeamForm" v-on:click="showTeamForm = !showTeamForm">{{teamText}}</button>
                <form id="gameSelectionsOptionForm" v-if="showTeamForm">
                <label class="customRadio"> <span class="labelText">No team</span>
                <input type="radio" id="team" v-model="teams" value="false" v-on:change="teamButtonChange($event)">
                </label>
                <label class="customRadio"><span class="labelText">Team</span>
                <input type="radio" id="noTeam" v-model="teams" value="true" v-on:change="teamButtonChange($event)">
                </label>
              </form>
              </div>
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
            <button v-on:click="start" id="startgame">
              Start game
            </button>
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
import io from 'socket.io-client';
const socket = io("localhost:3000");
import QrcodeVue from "qrcode.vue";

export default {
  name: 'CreateView',
  data: function () {
    return {
      pollId: "",
      userName: "",
      lang: localStorage.getItem("lang") || "en",
      question: "",
      answers: ["", ""],
      questionNumber: 0,
      data: {},
      uiLabels: {},
      website: "http://localhost:5173/lobby/",
      QRvalue: "",
      showRoundsForm: false,
      showTimeForm: false,
      showTeamForm: false,
      rounds: 5,
      time: 30,
      teams: false,
      teamText: "No Team",
      participents: []
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    this.userName = this.$route.params.uid;
    this.website = this.website + this.pollId;
    this.QRvalue = this.website;
    socket.emit("pageLoaded", this.lang);
    socket.emit("joinPoll", this.pollId);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });
    socket.emit("getGameInfo", this.pollId);
    socket.on("dataUpdate", (data) =>
      this.data = data
    );
    socket.on("pollCreated", (data) =>{
      this.data = data;
      this.participents = data.participents;
    });
    socket.on("participentsUpdate", (participents) => {
      this.participents = participents;
      console.log(participents)
    })

  },
  components: {
      QrcodeVue
  },
  methods: {
    createPoll: function () {
      socket.emit("createPoll", {pollId: this.pollId, lang: this.lang })
    },
    addQuestion: function () {
      socket.emit("addQuestion", {pollId: this.pollId, q: this.question, a: this.answers } )
    },
    addAnswer: function () {
      this.answers.push("");
    },
    runQuestion: function () {
      socket.emit("runQuestion", {pollId: this.pollId, questionNumber: this.questionNumber})
    },
    roundsButtonChange: function(){
      this.showRoundsForm = !this.showRoundsForm;
      this.sendUpdatedGameOptions();
    },
    timeButtonChange: function(){
      this.showTimeForm = !this.showTimeForm;
      this.sendUpdatedGameOptions();
    },
    teamButtonChange: function(){
      if(this.teams){
        this.teamText = "Team"
      }
      else{
        this.teamText = "No team"
      }
      this.showTeamForm = !this.showTeamForm;
      this.sendUpdatedGameOptions();
    },
    start: function() {
      socket.emit("startGame", this.pollId)
      this.$router.push("/InsertTruths/" + this.pollId + "/" + this.userName)
    },
    sendUpdatedGameOptions: function(){
      socket.emit("GameOptionsChange", {pollId: this.pollId, data: {rounds: this.rounds, time: this.time, teams: this.teams}})
    }
  }
}
</script>


<style>
.background{
  background-color: rgb(39, 3, 63);
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
button{
  background-color: rgb(237, 40, 135);
  height: 4em;
  width: 10em;
  margin: auto;
}
.gameOptions{
  margin: auto;
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
.gameSelectionsOptionForm{
  text-align: left;
  margin: 0 10px 6px 10px;
  font-size: 11px;
  line-height:11px;
}
.customRadio input{
  visibility: hidden;
  margin: 0;
  padding: 0;
  border: 0;
}
.customRadio{
box-sizing: border-box;
width: 80%;
border: solid #000000 3px;
padding: 10px;
padding-top: 12px;
padding-bottom: 12px;
align-items: left;
background-color: rgb(237, 40, 135);
font-size: 0.8;
}
.labelText{
  margin-left: 0.7em;
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
#startgame{
  margin-bottom: 1.8em;
}








</style>


