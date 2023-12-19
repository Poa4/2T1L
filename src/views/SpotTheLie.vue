<template>

	<body>
<div class="firstPart">
	<h1>
Spot the lie!
</h1>
<br>
<img src="https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png?f=webp">
<br>
<h2>
{{Participant}}
</h2>
</div>

<div >
	<h1 class="questions" style="background-color:cyan">{{playerAnswers.a1}} </h1>
	<h1 class="questions" style="background-color:lime">{{playerAnswers.a2}} </h1>
	<h1 class="questions" style="background-color:magenta">{{playerAnswers.a3}} </h1>



	

</div>



</body>


</template>

<script>


export default {
	data: function () {
		return {
			Participant: "Participant 1",
			playerAnswers: {
				a1: "Statement 1",
				a2: "Statement 2",
				a3: "Statement 3"

			}
		}

	}
}
</script>
<style scoped>

body {
	background-color: purple;

}

h1 {
	margin: 0px;
}


.firstPart {
	color: white;

}

.questions {
	color: black;
	margin: 30px;
	padding: 15px;
	background-color: black;

}


</style>
