<template>
<header class="headline">
        <h1>Game ID:</h1>
        <h1>Join at *website*</h1>
     <div class="wrapper">
     <div>
     Rounds
     </div>

     <div>
    Time
     </div>
     <div>
     Teams
     </div>

     </div>
    </header>
      <main>
<div class="square">
    <p> test </p>
</div>

    </main>
</template>

<script>

import io from 'socket.io-client'



const socket = io();


  methods: {

  }

</script>

<style>
body, html {
   font-family: black;
   Background-color: black;
   margin: 100px;
}


.headline {
    color: white;
    text-align: left;

}

.square {
  width: 100%;
  height: 300px;
  background-color: white;
  padding: 10px;


  text-align: left;
}

.wrapper {
     display: grid;
     grid-gap: 10px;
     grid-template-columns: 33% 33% 33%;
}

</style>