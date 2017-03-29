var db = firebase.database().ref('/authId');
var storageRef = firebase.storage().ref();
var dataToShow = [];
var data;

//Obtaining the whole database in data
db.on('value', function(snapshot){
	if(snapshot.val()){
		data = Object.values(snapshot.val());
	}
});

function search(){
	dataToShow = [];
	var keyword = $(".input").val();
	for(var doc in data){
		if(isPresent(data[doc].Name, keyword) || isPresent(data[doc].PenName, keyword)){
			dataToShow.push(data[doc]);
			console.log(dataToShow);
		}
	}
	showData(dataToShow);
}

function isPresent(string, keyword){
	if(string.toLowerCase().indexOf(keyword.toLowerCase())!=(-1)){
		return true;
	}
	else{
		return false;
	}
}

function filterResults(e){
	var filter = e.target.id;
	if(filter == "all"){
		showData(dataToShow);
		return;
	}
	else if(filter == "doc"){
		filter = "word";
	}
	else if(filter == "image"){
		filter = "image";
	}
	console.log(filter);
	var filtereddataToShow = dataToShow.filter(function(res){
		return isPresent(res.ftype, filter);
	});
	showData(filtereddataToShow);
}

function showData(dataToShow){
	$(".ans").html("");
	if(!dataToShow.length){
		$(".ans").html("No results returned!");
	}

	for(var result in dataToShow){
		var childDiv = document.createElement("div");
		childDiv.innerHTML = `
			<div id=${result} class="columns box inner">
				<div class="column is-three-quarters">
					<strong>${dataToShow[result].Name}</strong>
					<small> ${dataToShow[result].PenName}</small>
					<p>Description: ${dataToShow[result].description}</p>
				</div>
				<div class="column">
					<a href=${dataToShow[result].file} class="button is-primary is-outlined">Download</a>
					<a class="button is-danger is-outlined" onclick="deleteFile('${dataToShow[result].file}', '${result}')">Delete file</a>
				</div>
			</div>
		`
		resultsDiv.appendChild(childDiv);
	}
}

function deleteFile(filename, key){
	var divToDelete = document.getElementById(key);
	console.log(divToDelete)
	var desertRef = storageRef.child(filename);
	desertRef.delete().then(function() {
	  // File deleted successfully
	  console.log("deleted successfully");
	}).catch(function(error) {
	  // Uh-oh, an error occurred!
	  console.log(error);
	});

	db.child(key).remove();
}
var searchBtn = document.getElementById("sbutton");
var resultsDiv = document.getElementById("anbox");
var radioBtns = document.querySelectorAll(".radio");

searchBtn.addEventListener("click", search);
[...radioBtns].forEach(radioBtns => radioBtns.addEventListener('click', filterResults));

/*$(document).ready(function(){
				$(".box").mouseenter(function(){
					$(this).css({"background-color": "#A9BCF5"})
				});
				$(".box").mouseleave(function(){
					$(this).css({"background-color": "white"})
				});

				var keyword = $(".input").text();

				$(".button").click(function(){

					//Obtaining the array length
					var aLength;
					firebase.database().ref('/authId').once('value').then(function(snapshot) {
						aLength = snapshot.val().length;

						//Searching for the Keyword
						for(i = 0; i < aLength; i++){
							firebase.database().ref('/authId/'+ i + '/Name/'
								).once('value').then(function(snapshot) {
								$(".ans").html("<div class></div>");
								$(this).text(snapshot.val());
								console.log(snapshot.val());
								// firebase.database().ref('/authId/'+ i + '/Pen Name/' + keyword).once('value').then(function(snapshot) {
								// 	$(".ans").text(snapshot.val());
								// 	console.log(snapshot.val());
							});
						};
					});
				});
			});


*/