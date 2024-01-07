<template>
  <body>
  <div class="gridContainer">
    <h1 class="spotTheLieH1">{{ uiLabels.spotTheLie }}</h1>
    <div v-if="this.roundInfo.questions.length">
      <div class="participantInfoDiv">
        <div class="participantInfoDivProperties">
          {{ this.roundInfo.questions[3].avatar }}
          {{ this.roundInfo.questions[3].name }}
        </div>
        <div>
          <div v-if="submittedAnswer" class="buttonAndAnswerContainer">
            <div>
              <div class="buttonsContainer">
                <button :disabled="isDisabled" v-for="(answer, index) in roundInfo.questions.slice(0,3)" :key="index"
                        :class="'button' + index"
                        @click="selectLie(index); submitAnswerView();">
                  {{ answer }}{{ this.roundInfo.participantAnswer[index].join(", ") }}
                </button>
              </div>
            </div>
          </div>
          <div v-else class="buttonAndAnswerContainer">
            <div>
              <div v-if="!(this.roundInfo.questions[3].name === this.userName)" class="buttonsContainer">
                <button v-for="(answer, index) in roundInfo.questions.slice(0,3)" :key="index" :class="'button' + index"
                        @click="this.lieIndex = index; submitAnswerView();selectLie(index); ">{{ answer }}
                </button>
              </div>
              <div v-else>
                <div class="buttonsContainer">
                  <button v-for="(answer, index) in roundInfo.questions.slice(0,3)" :key="index"
                          :class="'button' + index"
                          :disabled="isDisabled">
                    {{answer}}
                    <span>{{ this.roundInfo.participantAnswer[index].join(", ") }} </span>
                  </button>
                </div>
              </div>

            </div>
          </div>
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
  name: "GuessingView",
  data: function () {
    return {
      pollId: "",
      userName: "",
      timeInfo: null,
      lieIndex: 0,
      participants: [],
      question: [],
      timer: null,
      correctAnswer: "",
      isDisabled: true,
      questionDone: false,
      submittedAnswer: false,
      roundInfo: {questions: [], participantAnswer: [[], [], [], []]},
      selfSentBoolean: false,
      uiLabels: {},
      lang: localStorage.getItem("lang") || "en",
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    this.userName = this.$route.params.uid;
    socket.emit("joinPoll", this.pollId);
    socket.emit("getTime", this.pollId);
    socket.emit("ReadyToGo", this.pollId);
    socket.on("sendTimeInfo", (timeInfo) => {
      this.timeInfo = timeInfo;
    });
    socket.on("startingRounds", (question) => {
      this.clearArrays();
      this.roundInfo.questions = question;
      this.timer = setTimeout(() => {
        this.selectLie(this.lieIndex)
      }, this.timeInfo * 1000);
    });
    socket.on("updateRound", () => {
      socket.emit("ReadyToGo", this.pollId)
    });

    socket.on("endGame", () =>
        this.$router.push("/ScoreBoard/" + this.pollId));
    socket.on("showAnswer", (correctAnswer) => {
      this.correctAnswer = correctAnswer;
    })
    socket.on("showParticipantAnswersDuringRound", (participantAnswers) => {
      this.placeAnswers(participantAnswers);
    })
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })

  },
  methods: {
    submitAnswerView() {
      this.selfSentBoolean = true;
      this.submittedAnswer = true
    },
    selectLie(lieIndex) {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      if (this.selfSentBoolean) {
        socket.emit("sendSelectedLie", this.pollId, this.userName, this.roundInfo.questions[lieIndex]);
      } else {
        socket.emit("sendSelectedLie", this.pollId, this.userName, "loser");
      }
    },
    clearArrays() {
      this.lieIndex = null;
      this.roundInfo.participantAnswer = [[], [], [], []];
      this.submittedAnswer = false;
    },
    placeAnswers(allAnswers) {
      allAnswers.forEach(a => {
        if (a.answer === this.roundInfo.questions[0] && (this.roundInfo.participantAnswer[0].indexOf(a.avatar) === -1)) {
          console.log("pushed to place 0")
          this.roundInfo.participantAnswer[0].push(a.avatar)
        }
        else if (a.answer === this.roundInfo.questions[1] && (this.roundInfo.participantAnswer[1].indexOf(a.avatar) === -1)) {
          console.log("pushed to place 1")
          this.roundInfo.participantAnswer[1].push(a.avatar)
        }
        else if (a.answer === this.roundInfo.questions[2]&& (this.roundInfo.participantAnswer[2].indexOf(a.avatar) === -1)) {
          console.log("pushed to place 2")
          this.roundInfo.participantAnswer[2].push(a.avatar)
        }
        else if(this.roundInfo.participantAnswer[3].indexOf(a.avatar) === -1){
          console.log("pushed to place 3")
          this.roundInfo.participantAnswer[3].push(a.avatar)
        }
      });
    }
  },
}
</script>

<style scoped>
body {
  color: white;
  display: grid;
}

.gridContainer {
  display: flex;
  flex-direction: column;
}

.spotTheLieH1 {

}

.participantInfoDiv {
  font-size: 2em;
}

.buttonAndAnswerContainer {
  display: flex;
  justify-content: center;
}

.buttonsContainer {
  display: flex;
  flex-direction: column;


}


.participantAnswerDiv {
  display: flex;
  flex-direction: column;

  gap: 19%;

}
</style>