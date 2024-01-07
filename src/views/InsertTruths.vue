<template>
  
    <body>
    <div class="timer">
    </div>
        <main>
            <div>
            <div class="insert">
            <label for="truth1"></label>
                        <input type="text" id="truth1" v-model="truth1" name="t1" required="required" :placeholder="uiLabels.truth1" ><br>
            <label for="truth2"></label>
                        <input type="text" id="truth2" v-model="truth2" name="t2" required="required" :placeholder="uiLabels.truth2" ><br>
            <label for="lie"></label>
                        <input type="text" id="lie" v-model="lie" name="lie" required="required" :placeholder="uiLabels.lie" ><br>
            </div>
            
            </div>
          <button v-on:click="prev" :disabled="b1Disabled">&laquo; {{uiLabels.prev}}</button>
          <button v-on:click="next" :disabled="b2Disabled">{{uiLabels.next}} &raquo;</button>
          <button v-on:click="submit" :disabled="!b2Disabled">
            {{uiLabels.lockInAnswers}}
            </button>

        </main>
        
    </body>
    </template>
    <script>
import io from "socket.io-client";
const socket = io("http://127.0.0.1:3000");

export default {
  name: "HomePageView",
  data:function() {
  return {
      pollId: "",
      userName: "",
      truth1: "",
      truth2: "",
      lie: "",
      questionaire: [],
      numberOfRounds: 0,
      currentQuestion: 0,
      b1Disabled: true,
      b2Disabled: false,
      uiLabels: {},
          lang: localStorage.getItem("lang") || "en",
  }
  },
  created: function() {
    this.pollId = this.$route.params.id;
    this.userName = this.$route.params.uid;
    socket.emit("joinPoll", this.pollId);
    socket.emit("getRoundInfo", this.pollId);
    socket.on("sendRoundInfo", (roundInfo) => {
      this.numberOfRounds = roundInfo;
    });
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {this.uiLabels = labels})
     },
  methods: {
    submit: function(){
      if(this.checkFields()){
      this.addQuestion();
      socket.emit("sendQuestions", this.pollId, this.questionaire);
      console.log(this.questionaire)
      this.$router.push("/WaitingForParticipantsView/" + this.pollId + "/" +this.userName);
    }
    },

    prev: function(){
      if(this.currentQuestion > 0){ //constraints amount of questions to answer
      if(this.checkFields()){ // check if we have an input, then we add the value
        this.addQuestion();
      }
      //gets previous written question
      this.currentQuestion --;

    //Changes button, depended on what question were at
    this.changeButtons();
      this.getPrevAnswer();
      console.log(this.currentQuestion)
      }
    },

    next: function(){
    //Checks so we have written in all fields before going to next
    if(this.checkFields()){

      //adds the question to list
      if(this.currentQuestion < this.numberOfRounds){
      this.addQuestion();
      this.currentQuestion ++;

    //Changes button, depended on what question were at
    this.changeButtons();

      //sets all to empty again if new, else gets prev written question
      if(typeof this.questionaire[this.currentQuestion] === "undefined"){
      this.truth1 = "";
      this.truth2 = "";
      this.lie = "";
      }
      else{
        this.getPrevAnswer()
      }
      console.log(this.currentQuestion)
      }
    }
  },

  //function to check if all fields have an input
  checkFields: function(){
    if(this.truth1 != "" && this.truth2 != "" && this.lie != ""){
      return true;
    }
    else{
      return false;
    }
  },
  //function to add a question to the questionlist or to change current question
  addQuestion: function(){
    if(typeof this.questionaire[this.currentQuestion] === "undefined" ){
      let question = {
        truth1: this.truth1,
        truth2: this.truth2,
        lie: this.lie,
        username: this.userName
      };
      this.questionaire.push(question);
    }
    else{
      this.editCurrentQuestion();
    }
    

  },
  //edits the current question
  editCurrentQuestion: function(){
    let question = this.questionaire[this.currentQuestion];
      question.truth1 = this.truth1;
      question.truth2 = this.truth2;
      question.lie = this.lie;
  },  
  //gets the question of previously written question
  getPrevAnswer: function(){
      let question = this.questionaire[this.currentQuestion];
      this.truth1 = question.truth1;
      this.truth2 = question.truth2;
      this.lie = question.lie;
  },

  changeButtons: function(){
    console.log("current:", this.currentQuestion);
    console.log("totQ:", this.numberOfRounds);
    if(this.currentQuestion+1 === this.numberOfRounds){ //+2 adjusts so we cant go to next page if this is the last to write in question
    this.b2Disabled = true;
    }
    else{
      this.b2Disabled = false;
    }
    if(this.currentQuestion === 0){
      this.b1Disabled = true;
    }
    else{
      this.b1Disabled = false;
    }
  },
  },


}
    
    
    </script>
    <style scoped>
    body{
     background-color: #27033f;
    }
    input{
    width: 90%;
    height: 33%;
      padding: 12px 20px;
      margin: 8px 0;
      box-sizing: border-box;
    font-size: 300%;
    background: lightgrey; 
    
    }
    ::placeholder {
      color: black;
      opacity: 0.7; 
    }
    .insert{
    background-color: #27033f;
    }
    button{
           width:48%;
           background: #DA4167;
           font-size: 200%;
           margin: 1%;
           height: 4em;
    }
    .timer{
    color:white}

    button[disabled]{
    background: #5f5f5f;
    pointer-events: none;
   }
   

    </style>
