<template>
      <main class="background">
          <section class="wrapper"> 
            <div id="first">
                <p>
                  Game ID: {{game_id}}
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
              <button id="roundsButton">
              X rounds
            </button>
            <button id="timeButton">
              Y time
            </button>
            <button id="teamsButton">
              Z Teams
            </button>
            </div>

          </section>

          <section class="wrapper3">
            <div class="participentArea">
                <p v-for="participent in participents">
                  {{participent}}
                </p>
            </div>

          </section>

          <section>
            <button id="startgame">
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
      lang: localStorage.getItem("lang") || "en",
      pollId: "",
      question: "",
      answers: ["", ""],
      questionNumber: 0,
      data: {},
      uiLabels: {},
      game_id: "",
      website: "http://google.se",
      QRvalue: "http://google.se",
      participents: ["Participent 1","Participent 2"]

      
    }
  },
  created: function () {
    this.id = this.$route.params.id;
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
    socket.on("dataUpdate", (data) =>
      this.data = data
    )
    socket.on("pollCreated", (data) =>
      this.data = data)
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
}
.participentArea p{
  font-size: 1em;
  color: rgb(0, 0, 0);
  text-align: left;
  margin-left: 0.5em;
}
#startgame{
  margin-bottom: 1em;
}





</style>
