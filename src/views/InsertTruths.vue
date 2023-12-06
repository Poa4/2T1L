<template>
    <body>
    <div class="timer">
    
    </div>
        <main>
            <form>
            <div class="insert">
            <label for="truth1"></label>
                        <input type="text" id="truth1" name="t1" required="required" placeholder="Truth #1" ><br>
            <label for="truth2"></label>
                        <input type="text" id="truth2" name="t2" required="required" placeholder="Truth #2" ><br>
            <label for="lie"></label>
                        <input type="text" id="lie" name="lie" required="required" placeholder="Lie" ><br>
            </div>             
            </form>
            <button type="submit">
            Lock in answers
            </button>
        </main>
        
    </body>
    </template>
    <script>
    
    
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
    </style>