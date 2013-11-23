//Constants
var xhtmlNS = "http://www.w3.org/1999/xhtml"

//Pointers
var ptrStartTimerAsClock = null;
var ptrContractionStart = null;

//Elements
var duration;
var frequency;
var startDurationTime;
var startDurationDate;
var endDurationTime;
var endDurationDate;
var averageDuration;
var averageFrequency;
var timerStartButton;
var textStart;
var selectStrength;
var tabTimer;
var tabHistory;
var tabInfo;
var layerTimer;
var layerHistory;
var layerInfo;
var rectButtonTimer;
var rectButtonHistory;
var rectButtonInfo;
var historyContainer;

//Variables
var programState;
var contractionStartTime;
var contractionEndTime;
var possibleStopTime;

//Enum
var ProgramState = {
	 NoAction: {value: 0, name: "No Action"}
	,InContraction: {value: 1, name: "Having a contraction"}
	,EndedContraction : {value: 2, name: "Just finished a contraction"}
};

//Functions
function init(svgElem) {
	console.log("init()");
	//Init variables
	duration = document.getElementById("timerDurationDisplay");
	frequency = document.getElementById("timerFrequencyDisplay");
	startDurationTime = document.getElementById("timerStart");
	startDurationDate = document.getElementById("timerStartDate");
	endDurationTime = document.getElementById("timerEnd");
	endDurationDate = document.getElementById("timerEndDate");
	averageDuration = document.getElementById("timerAverageDuration");
	averageFrequency = document.getElementById("timerAverageFrequency");
	timerStartButton = document.getElementById("timerStartButton");
	textStart = document.getElementById("textStart");
	selectStrength = document.getElementById("promptStrength").children[0];
	tabTimer = document.getElementById("timerButton");
	tabHistory = document.getElementById("historyButton");
	tabInfo = document.getElementById("infoButton");
	layerTimer = document.getElementById("timer");
	layerHistory = document.getElementById("history");
	layerInfo = document.getElementById("info");
	rectButtonTimer = document.getElementById("rectButtonTimer");
	rectButtonHistory = document.getElementById("rectButtonHistory");
	rectButtonInfo = document.getElementById("rectButtonInfo");
	historyContainer =  document.getElementById("historyContainer").children[0];
	//Setup NoAction mode
	programState = ProgramState.NoAction;
	updateText(averageDuration, "");
	updateText(averageFrequency, "");
	updateText(endDurationDate, "");
	updateText(endDurationTime, "");
	updateStartTimeWithDateTime();
	//Events
	timerStartButton.onclick = StartClock;
	textStart.onclick = StartClock;
	tabTimer.onclick = selectTimerTab;
	tabHistory.onclick = selectHistoryTab;
	tabInfo.onclick = selectInfoTab;
	//Init database
	if(localStorage["contractionHistory"] == null) {
		localStorage["contractionHistory"] = JSON.stringify([]);
	} else {
		updateHistory();
	}
}
function moveText(id, x, y ) {
	var elem = null;
	if((elem = document.getElementById(id)) != null) {
		console.log(elem);
		if(x != null) {
			elem.setAttribute("x", x);
			var tspan1 = null;
			if((tspan1 = elem.getElementsByTagName("tspan")[0]) != null) {
				tspan1.setAttribute("x", x);
				var tspan2 = null;
				if((tspan2 = tspan1.getElementsByTagName("tspan")[0]) != null) {
					tspan2.setAttribute("x", x);
				}
			}
		}
		if(y != null) {
			elem.setAttribute("y", y);
			var tspan1 = null;
			if((tspan1 = elem.getElementsByTagName("tspan")[0]) != null) {
				tspan1.setAttribute("y", y);
				var tspan2 = null;
				if((tspan2 = tspan1.getElementsByTagName("tspan")[0]) != null) {
					tspan2.setAttribute("y", y);
				}
			}
		}
	} else {
		console.log("MoveText: could not find element");
	}
}
function updateStartTimeWithDateTime() {
	updateText(duration, "00:00:00");
	updateText(startDurationDate, dateToDateString(new Date()));
	updateText(startDurationTime, dateToTimeString(new Date()));
	clearInterval(ptrStartTimerAsClock);
	ptrStartTimerAsClock = setInterval(function() {
		updateText(startDurationDate, dateToDateString(new Date()));
		updateText(startDurationTime, dateToTimeString(new Date()));
	}, 1000);
}
function StartClock(){
	//Depending on state.. assuming NoAction for now...
	console.log("Der clickerson");
	if(programState == ProgramState.NoAction ) {
		console.log(" starting..");
		programState = ProgramState.InContraction;
		clearInterval(ptrStartTimerAsClock);
		contractionStartTime = new Date();
		updateText(startDurationTime, dateToTimeString(contractionStartTime));
		updateText(startDurationDate, dateToDateString(contractionStartTime));
		ptrContractionStart = setInterval(function() {
			updateText(duration, getDuration(contractionStartTime, new Date()));
		}, 1000);
		updateText(textStart, "Stop");
	} else if(programState == ProgramState.InContraction ) {
		console.log(" stopping..");
		possibleStopTime = new Date();
		selectStrength.parentElement.removeAttribute("display");
		selectStrength.onblur = selectStrengthBlur;
		selectStrength.focus();
		selectStrength.parentElement.setAttribute("display", "none");
	}
}
function selectStrengthBlur() {
	switch(selectStrength.value) {
		case "exit":
			//User didn't mean to click Stop
			break;
		case "reset":
			//User didn't mean to click Start
			clearInterval(ptrContractionStart);
			selectStrength.onblur = null;
			programState = ProgramState.NoAction;
			updateText(textStart, "Start");
			updateStartTimeWithDateTime();
			break;
		default:
			clearInterval(ptrContractionStart);
			selectStrength.onblur = null;
			storeContraction(contractionStartTime, possibleStopTime, selectStrength.value);
			programState = ProgramState.NoAction;
			updateText(textStart, "Start");
			updateText(endDurationTime, dateToTimeString(possibleStopTime));
			updateText(endDurationDate, dateToDateString(possibleStopTime));
			updateStartTimeWithDateTime();
			break;
	}
}
function StopClock(stopType){
	clearInterval(ptrStartTimerAsClock);
	//if not cancelled...
	clearInterval(ptrContractionStart);
	updateText(textStart, "Start");
}
function storeContraction(start, end, strength) {
	db = JSON.parse(localStorage["contractionHistory"], dateTimeReviver);
	db.push({
		 Start: start
		,Duration: end.getTime() - start.getTime()
		,Strength: strength
	});
	localStorage["contractionHistory"] = JSON.stringify(db);
	updateHistory();
}
function updateHistory() {
	db = JSON.parse(localStorage["contractionHistory"], dateTimeReviver);
	db = db.sort(sortContractions);
	var totalDuration = 0;
	if(db.length >= 2) {
		var freqText = getDuration(db[db.length - 1].Start, db[db.length - 2].Start);
		updateText(frequency, freqText);
		var oldDiv = historyContainer.getElementsByTagName("div");
		while((oldDiv != undefined) && (oldDiv.length && oldDiv.length > 0)) {
			oldDiv[0].parentNode.removeChild(oldDiv[0]);
			oldDiv = historyContainer.getElementsByTagName("div");
		}
		for(var i=0; i<db.length; i++) {
			totalDuration += db[i].Duration;
			var div = contractionEventToHTML(db[i], ((i+1) < db.length) ? db[i+1].Start : null);
			historyContainer.appendChild(div);
		}
		var avgDurationText = millisecondsToDurationString(totalDuration / db.length);
		updateText(averageDuration, "Dur: " + avgDurationText);
	}
}
function sortContractions(a,b) {
	return b.Start.getTime() - a.Start.getTime();
}
function dateToDateString(d) {
	var month = (d.getMonth() + 1).toString();
	if(month.length == 1) {
		month = "0" + month;
	}
	var day = (d.getDate()).toString();
	if(day.length == 1) {
		day = "0" + day;
	}
	var year = d.getFullYear();
	return month + "/" + day + "/" + year;
}
function dateToTimeString(d) {
	var isPM = false;
	var hour = (d.getHours()).toString();
	isPM = (hour > 12);
	if(isPM) {
		hour -= 12;
	}
	if(hour.length == 1) {
		hour = "0" + hour;
	}
	var min = (d.getMinutes()).toString();
	if(min.length == 1) {
		min = "0" + min;
	}
	return hour + ":" + min + " " + (isPM ? "PM" : "AM");
}
function getDuration(startTime, endTime) {
	var milliseconds = endTime.getTime() - startTime.getTime();
	var seconds = parseInt(milliseconds / 1000, 10);
	return secondsToDuration(seconds);
}
function millisecondsToDurationString(milliseconds) {
	var seconds = parseInt(milliseconds / 1000, 10);
	return secondsToDuration(seconds);
}
function secondsToDuration(seconds) {
	var secondsIn1Hour = 60 * 60;
	var secondsIn1Minute = 60;
	var hours = 0;
	if(seconds >= secondsIn1Hour) {
		hours = parseInt(seconds / secondsIn1Hour, 10);
		seconds = seconds - (hours * secondsIn1Hour);
	}
	var minutes = 0;
	if(seconds >= secondsIn1Minute) {
		minutes = parseInt(seconds / secondsIn1Minute, 10);
		seconds = seconds - (minutes * secondsIn1Minute);
	}
	if(hours.toString().length == 1) {
		hours = "0" + hours.toString();
	} else {
		hours = hours.toString()
	}
	if(minutes.toString().length == 1) {
		minutes = "0" + minutes.toString();
	} else {
		minutes = minutes .toString()
	}
	if(seconds.toString().length == 1) {
		seconds = "0" + seconds.toString();
	} else {
		seconds = seconds.toString()
	}
	return hours + ":" + minutes + ":" + seconds;
}
function updateText(elem, newText) {
	while(elem.getElementsByTagName("tspan").length > 0) {
		elem = elem.getElementsByTagName("tspan")[0];
	}
	if(typeof(elem) == "object") {
		if((elem.childNodes.length == 1) && (elem.childNodes[0].nodeType == 3)) {
			elem.childNodes[0].nodeValue = newText;
		} else {
			console.warn("updateText: failed to update tspan");
		}
	} else {
		console.warn("updateText: failed to find inner most tspan");
	}
}
function dateTimeReviver(key, value) {
	var a;
	if (typeof value === "string") {
		a = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$/.test(value);
		if (a) {
			return new Date(value);
		} else {
			//if( value.indexOf(":") >= 0 ) {
			//	console.log("Possible dateTimeReviver error, value looks like date but failed RegExp value is (${Date}).".replace(/\${Date}/, value));
			//}
			return value;
		}
	} else {
		return value;
	}
}
function selectTimerTab() {
	layerTimer.removeAttribute("display");
	layerHistory.setAttribute("display", "none");
	layerInfo.setAttribute("display", "none");
	rectButtonTimer.classList.remove("active");
	rectButtonHistory.classList.remove("active");
	rectButtonInfo.classList.remove("active");

	rectButtonTimer.style.fill = "url(#linearGradientButtonFadeActive)";
	rectButtonHistory.style.fill = "url(#linearGradientButtonFade)";
	rectButtonInfo.style.fill = "url(#linearGradientButtonFade)";

	rectButtonTimer.classList.add("active");
}
function selectHistoryTab() {
	layerTimer.setAttribute("display", "none");
	layerHistory.removeAttribute("display");
	layerInfo.setAttribute("display", "none");
	rectButtonTimer.classList.remove("active");
	rectButtonHistory.classList.remove("active");
	rectButtonInfo.classList.remove("active");

	rectButtonTimer.style.fill = "url(#linearGradientButtonFade)";
	rectButtonHistory.style.fill = "url(#linearGradientButtonFadeActive)";
	rectButtonInfo.style.fill = "url(#linearGradientButtonFade)";

	rectButtonHistory.classList.add("active");
}
function selectInfoTab() {
	layerTimer.setAttribute("display", "none");
	layerHistory.setAttribute("display", "none");
	layerInfo.removeAttribute("display");
	rectButtonTimer.classList.remove("active");
	rectButtonHistory.classList.remove("active");
	rectButtonInfo.classList.remove("active");
	rectButtonTimer.style.fill = "url(#linearGradientButtonFade)";
	rectButtonHistory.style.fill = "url(#linearGradientButtonFade)";
	rectButtonInfo.style.fill = "url(#linearGradientButtonFadeActive)";
	rectButtonInfo.classList.add("active");
}
function contractionEventToHTML(contractionEvent, lastStartTime) {
	var endedDate = new Date((contractionEvent.Start).getTime() + contractionEvent.Duration);
	var startDateString = dateToDateString(contractionEvent.Start) + " " + dateToTimeString(contractionEvent.Start);
	var endedDateString = dateToDateString(endedDate) + " " + dateToTimeString(endedDate);
	var durationString = millisecondsToDurationString(contractionEvent.Duration);
	var frequencyString = "N/A";
	if(lastStartTime != null) {
		frequencyString = millisecondsToDurationString(contractionEvent.Start.getTime() - lastStartTime.getTime());
	}
	var div = document.createElementNS(xhtmlNS,"div");
	div.className = "historyItem";
	var table = document.createElementNS(xhtmlNS,"table");
	table.style.width = "100%";
	var tr1 = document.createElementNS(xhtmlNS,"tr");
	var tr2 = document.createElementNS(xhtmlNS,"tr");
	var tr3 = document.createElementNS(xhtmlNS,"tr");
	var tr4 = document.createElementNS(xhtmlNS,"tr");
	var td = document.createElementNS(xhtmlNS,"td");
	td.rowSpan = 2;
	td.style.width = "20%";
	td.innerHTML = contractionEvent.Strength;
	tr1.appendChild(td);
	td = document.createElementNS(xhtmlNS,"td");
	td.innerHTML = "Dur: " + durationString
	tr1.appendChild(td);
	td = document.createElementNS(xhtmlNS,"td");
	td.innerHTML = "Freq: " + frequencyString;
	tr2.appendChild(td);
	td = document.createElementNS(xhtmlNS,"td");
	td.rowSpan = 2;
	tr3.appendChild(td);
	td = document.createElementNS(xhtmlNS,"td");
	td.innerHTML = "Start: " + startDateString;
	tr3.appendChild(td);
	td = document.createElementNS(xhtmlNS,"td");
	td.innerHTML = "Ended: " + endedDateString;
	tr4.appendChild(td);
	table.appendChild(tr1);
	table.appendChild(tr2);
	table.appendChild(tr3);
	table.appendChild(tr4);
	div.appendChild(table);
	return div;
}