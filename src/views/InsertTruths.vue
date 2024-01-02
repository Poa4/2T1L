<template>
  
    <body>
    <div class="timer">
    </div>
        <main>
          <form @submit.prevent="lockInAnswers()">
            <div v-if="editWindow">
            <div class="insert">
            <label for="truth1"></label>
                        <input type="text" id="truth1" v-model="truth1" name="t1" required="required" placeholder="Truth 1" ><br>
            <label for="truth2"></label>
                        <input type="text" id="truth2" v-model="truth2" name="t2" required="required" placeholder="Truth 2" ><br>
            <label for="lie"></label>
                        <input type="text" id="lie" v-model="lie" name="lie" required="required" placeholder="Lie" ><br>
            </div>
            <button>
            Lock in answers
            </button>
            </div>
          </form>
          <button v-on:click="prev" :disabled="b1Disabled">Prev</button>
          <button v-on:click="next" :disabled="b2Disabled">Next</button>

            <div v-if="!editWindow">
            <button v-on:click="t"> test till nästa </button>
            </div>


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
      numberOfRounds: 3,
      currentQuestion: 0,
      b1Disabled: true,
      b2Disabled: false,
      editWindow: true

  }
  },
  created: function() {
    this.pollId = this.$route.params.id;
    this.userName = this.$route.params.uid;
    socket.emit("joinPoll", this.pollId);
  },
  methods: {
    submit: function(){
      console.log(this.questionaire)
      if(this.questionaire.length === this.numberOfRounds){
        socket.emit("sendQuestions", this.pollId, {questionaire: this.questionaire});
        this.editWindow = false;
      }
    },
    lockInAnswers: function(){
      if ( this.truth1 !== "" && this.truth2 !== "" && this.lie !== "") {
        socket.emit("lockInAnswers", this.pollId, this.userName, this.truth1, this.truth2, this.lie)
        this.$router.push("/WaitingForParticipantsComponent/" + this.pollId + "/" +this.userName);
      }
    },

    prev: function(){
      if(this.currentQuestion > 0){ //constraints amount of questions to answer
      if(this.checkFields()){ // check if we have an input, then we add the value
        this.addQuestion();
      }
      //gets previous written question
      this.currentQuestion --;
      this.changeButtons();
      this.getPrevAnswer();
      console.log(this.currentQuestion)
      }
    },

    next: function(){
    if(this.checkFields()){ //Checks so we have written in all fields before going to next
      //adds the question to list
      if(this.currentQuestion < this.numberOfRounds){
      this.addQuestion();
      this.currentQuestion ++;
      this.changeButtons();
      //sets all to empty again if new
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
    if(this.currentQuestion+1 === this.numberOfRounds){
    this.b2Disabled = true;
    }
    else if(this.currentQuestion === 0){
      this.b1Disabled = true;
    }
    else{
      this.b1Disabled = false;
      this.b2Disabled = false;
    }
    

  },
  t: function(){
    this.$router.push("/spotTheLie/" + this.pollId  + "/" + this.userName); // får man ändra så den körs när alla är klara, eller
  }
  },


}
    
    
    </script>
    <style>
    body{
     background-color: #1E152A;
    }
    input{
    width: 100%;
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
    background-color: white;
    }
    button{
           width:100%;
           background: #DA4167;
           font-size: 200%;
    }
    .timer{
    color:white}

    button[disabled]{
    background: #5f5f5f;
   }


    </style>
