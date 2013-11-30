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
var infoResetButton;
var infoDurationEndedAMPM;
var infoDurationEndedSecond;
var infoDurationEndedMinute;
var infoDurationEndedHour;
var infoDurationEndedDay;
var infoDurationEndedMonth;
var infoDurationEndedYear;
var infoDurationStartAMPM;
var infoDurationStartSecond;
var infoDurationStartMinute;
var infoDurationStartHour;
var infoDurationStartDay;
var infoDurationStartMonth;
var infoDurationStartYear;
var infoNewStop;
var infoNewStopCheckBox;
var infoDurationStrength;
var infoDurationDurationHour;
var infoDurationDurationMinute;
var infoDurationDurationSecond;
var infoDeleteRecord;

var promptMonth;
var promptDay;
var promptHour;
var promptYear;
var promptMinute;
var promptSecond;
var promptAMPM;
var promptStrengthChange;

//Variables
var programState;
var contractionStartTime;
var contractionEndTime;
var possibleStopTime;
var editingDatabaseIndex = null;

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
	historyContainer = document.getElementById("historyContainer").children[0];
	infoResetButton = document.getElementById("infoResetButton");
	infoDurationEndedAMPM = document.getElementById("infoDurationEndedAMPM");
	infoDurationEndedSecond = document.getElementById("infoDurationEndedSecond");
	infoDurationEndedMinute = document.getElementById("infoDurationEndedMinute");
	infoDurationEndedHour = document.getElementById("infoDurationEndedHour");
	infoDurationEndedDay = document.getElementById("infoDurationEndedDay");
	infoDurationEndedMonth = document.getElementById("infoDurationEndedMonth");
	infoDurationEndedYear = document.getElementById("infoDurationEndedYear");
	infoDurationStartAMPM = document.getElementById("infoDurationStartAMPM");
	infoDurationStartSecond = document.getElementById("infoDurationStartSecond");
	infoDurationStartMinute = document.getElementById("infoDurationStartMinute");
	infoDurationStartHour = document.getElementById("infoDurationStartHour");
	infoDurationStartDay = document.getElementById("infoDurationStartDay");
	infoDurationStartMonth = document.getElementById("infoDurationStartMonth");
	infoDurationStartYear = document.getElementById("infoDurationStartYear");
	promptMonth = document.getElementById("promptMonth").children[0];
	promptDay = document.getElementById("promptDay").children[0];
	promptHour = document.getElementById("promptHour").children[0];
	promptYear = document.getElementById("promptYear").children[0];
	promptMinute = document.getElementById("promptMinute").children[0];
	promptSecond = document.getElementById("promptSecond").children[0];
	promptAMPM = document.getElementById("promptAMPM").children[0];
	promptStrengthChange = document.getElementById("promptStrengthChange").children[0];
	infoNewStop = document.getElementById("infoNewStop");
	infoNewStopCheckBox = document.getElementById("infoNewStopCheckBox");
	infoDurationStrength = document.getElementById("infoDurationStrength");
	infoDurationDurationHour = document.getElementById("infoDurationDurationHour");
	infoDurationDurationMinute = document.getElementById("infoDurationDurationMinute");
	infoDurationDurationSecond = document.getElementById("infoDurationDurationSecond");
	infoDeleteRecord = document.getElementById("infoDeleteRecord");
	//Setup NoAction mode
	programState = ProgramState.NoAction;
	updateText(averageDuration, "");
	updateText(averageFrequency, "");
	updateText(endDurationDate, "");
	updateText(endDurationTime, "");
	//updateStartTimeWithDateTime();
	//Events
	timerStartButton.onclick = StartClock;
	textStart.onclick = StartClock;
	tabTimer.onclick = selectTimerTab;
	tabHistory.onclick = selectHistoryTab;
	tabInfo.onclick = selectInfoTab;
	infoResetButton.onclick = resetHistory;
	infoNewStop.onclick = function() { toggleCheckBox(infoNewStopCheckBox); };
	infoDurationEndedAMPM.onclick = function() { updateContraction(this, "Ended", "AMPM"); };
	infoDurationEndedSecond.onclick = function() { updateContraction(this, "Ended", "Second"); };
	infoDurationEndedMinute.onclick = function() { updateContraction(this, "Ended", "Minute"); };
	infoDurationEndedHour.onclick = function() { updateContraction(this, "Ended", "Hour"); };
	infoDurationEndedDay.onclick = function() { updateContraction(this, "Ended", "Day"); };
	infoDurationEndedMonth.onclick = function() { updateContraction(this, "Ended", "Month"); };
	infoDurationEndedYear.onclick = function() { updateContraction(this, "Ended", "Year"); };
	infoDurationStartAMPM.onclick = function() { updateContraction(this, "Start", "AMPM"); };
	infoDurationStartSecond.onclick = function() { updateContraction(this, "Start", "Second"); };
	infoDurationStartMinute.onclick = function() { updateContraction(this, "Start", "Minute"); };
	infoDurationStartHour.onclick = function() { updateContraction(this, "Start", "Hour"); };
	infoDurationStartDay.onclick = function() { updateContraction(this, "Start", "Day"); };
	infoDurationStartMonth.onclick = function() { updateContraction(this, "Start", "Month"); };
	infoDurationStartYear.onclick = function() { updateContraction(this, "Start", "Year"); };
	infoDurationStrength.onclick = function() { updateContraction(this, null, "Strength"); };
	infoDurationDurationHour.onclick = function() { updateContraction(this, "Duration", "Hour"); };
	infoDurationDurationMinute.onclick = function() { updateContraction(this, "Duration", "Minute"); };
	infoDurationDurationSecond.onclick = function() { updateContraction(this, "Duration", "Second"); };
	infoDeleteRecord.onclick = deleteCurrentRecord;
	//Init database
	if(localStorage["contractionHistory"] == null /*#DEBUG START*/|| true /*#DEBUG END*/) {
		localStorage["contractionHistory"] = JSON.stringify([]);
		//#DEBUG START
		localStorage["contractionHistory"] = JSON.stringify([{
			 Start: "2013-11-26T00:00:00.000Z"
			,Duration: (1000 * 60 * 2)
			,Strength: "mild"
			,NewStart: true
		},{
			 Start: "2013-11-26T01:00:00.000Z"
			,Duration: (1000 * 60 * 2)
			,Strength: "mild"
			,NewStart: false
		},{
			 Start: "2013-11-26T02:00:00.000Z"
			,Duration: (1000 * 60 * 2)
			,Strength: "mild"
			,NewStart: false
		},{
			 Start: "2013-11-24T02:00:00.000Z"
			,Duration: (1000 * 60 * 5)
			,Strength: "mild"
			,NewStart: true
		}]);
		console.log("will update history");
		updateHistory();
		//#DEBUG END
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
	var db = JSON.parse(localStorage["contractionHistory"], dateTimeReviver);
	db = db.sort(sortContractions);
	var lastFrequencyText = "";
	var lastContractionEndedTimeText = "";
	var lastContractionEndedDateText = "";
	if(db.length >= 2) {
		lastFrequencyText = millisecondsToDurationString( db[0].Start.getTime() - db[1].Start.getTime() );
	}
	if(db.length >= 1) {
		var lastContractionEnded = new Date(db[0].Start.getTime() + db[0].Duration);
		lastContractionEndedTimeText = dateToTimeString(lastContractionEnded, false);
		lastContractionEndedDateText = dateToDateString(lastContractionEnded);
	}
	updateText(duration, "00:00:00");
	updateText(frequency, lastFrequencyText);
	updateText(startDurationDate, dateToDateString(new Date()));
	updateText(startDurationTime, dateToTimeString(new Date()), false);
	updateText(endDurationTime, lastContractionEndedTimeText);
	updateText(endDurationDate, lastContractionEndedDateText);
	clearInterval(ptrStartTimerAsClock);
	ptrStartTimerAsClock = setInterval(function() {
		updateText(startDurationDate, dateToDateString(new Date()));
		updateText(startDurationTime, dateToTimeString(new Date()), false);
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
		updateText(startDurationTime, dateToTimeString(contractionStartTime, false));
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
			updateText(endDurationTime, dateToTimeString(possibleStopTime, false));
			updateText(endDurationDate, dateToDateString(possibleStopTime, false));
			updateStartTimeWithDateTime();
			break;
	}
}
function resetHistory() {
	if(confirm("Erase contraction history.\nAre you sure?")) {
		localStorage["contractionHistory"] = JSON.stringify([]);
		updateHistory();
	}
}
function StopClock(stopType){
	clearInterval(ptrStartTimerAsClock);
	//if not cancelled...
	clearInterval(ptrContractionStart);
	updateText(textStart, "Start");
}
function storeContraction(start, end, strength) {
	var db = JSON.parse(localStorage["contractionHistory"], dateTimeReviver);
	db.push({
		 Start: start
		,Duration: end.getTime() - start.getTime()
		,Strength: strength
		,NewStart: false
	});
	localStorage["contractionHistory"] = JSON.stringify(db);
	updateHistory();
}
function updateHistory() {
	var db = JSON.parse(localStorage["contractionHistory"], dateTimeReviver);
	db = db.sort(sortContractions);
	var oldDiv = historyContainer.getElementsByTagName("div");
	while((oldDiv != undefined) && (oldDiv.length && oldDiv.length > 0)) {
		oldDiv[0].parentNode.removeChild(oldDiv[0]);
		oldDiv = historyContainer.getElementsByTagName("div");
	}
	if(db.length >= 2) {
		if(!db[0].NewStart && !db[1].NewStart) {
			var freqText = getDuration(db[1].Start, db[0].Start);
			updateText(frequency, freqText);
		}
	}
	var durationDivisor = 0;
	var frequencyDivisor = 0;
	var totalDuration = 0;
	var totalFrequency = 0;
	var foundNewStart = false;
	for(var i=0; (!foundNewStart) && i<db.length; i++) {
		totalDuration += db[i].Duration;
		durationDivisor++;
		foundNewStart = db[i].NewStart;
		if( !foundNewStart ) {
			if( (i+1) < db.length ) {
				totalFrequency += db[i].Start.getTime() - db[i+1].Start.getTime();
				frequencyDivisor++;
			}
		}
	}
	var avgDurationText = "";
	var avgFrequencyText = "";
	if(frequencyDivisor >0) {
		avgFrequencyText = "Freq: " + millisecondsToDurationString(totalFrequency / frequencyDivisor);
	}
	if(durationDivisor >0) {
		avgDurationText = "Dur: " + millisecondsToDurationString(totalDuration / durationDivisor);
	}
	updateText(averageDuration, avgDurationText);
	updateText(averageFrequency, avgFrequencyText);
	for(var i=0; i<db.length; i++) {
		var div = contractionEventToHTML(db[i], ((i+1) < db.length) ? db[i+1].Start : null, i);
		historyContainer.appendChild(div);
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
function dateToTimeString(d, includeSeconds) {
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
	var seconds = (d.getSeconds()).toString();
	if(seconds.length == 1) {
		seconds = "0" + seconds;
	}
	if(includeSeconds) {
		return hour + ":" + min + "." + seconds + " " + (isPM ? "PM" : "AM");
	} else {
		return hour + ":" + min + " " + (isPM ? "PM" : "AM");
	}
}
function timeStringToArray(d) {
	var a = new Array();
	d = d.split(":");
	a.push(d[0]);
	var d2 = d[1].split(".");
	a.push(d2[0]);
	var d3 = d2[1].split(" ");
	a.push(d3[0]);
	a.push(d3[1]);
	return a;
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
			console.log("!! updateText: failed to update tspan");
		}
	} else {
		console.log("!! updateText: failed to find inner most tspan");
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
	repairCheckBoxUI();
}
function deleteCurrentRecord() {
	if(editingDatabaseIndex != null) {
		var db = JSON.parse(localStorage["contractionHistory"], dateTimeReviver);
		db = db.sort(sortContractions);
		db.splice(editingDatabaseIndex, 1);
		localStorage["contractionHistory"] = JSON.stringify(db);
		updateHistory();
		editingDatabaseIndex = null;
		var hiddenTextItems = layerInfo.getElementsByClassName("textInfoEdit");
		for(var i=0; i<hiddenTextItems.length; i++) {
			hiddenTextItems[i].setAttribute("display", "none");
		}
		infoDurationStrength.setAttribute("display", "none");
		infoDurationStartYear.setAttribute("display", "none");
		infoDurationStartMonth.setAttribute("display", "none");
		infoDurationStartDay.setAttribute("display", "none");
		infoDurationStartHour.setAttribute("display", "none");
		infoDurationStartMinute.setAttribute("display", "none");
		infoDurationStartSecond.setAttribute("display", "none");
		infoDurationStartAMPM.setAttribute("display", "none");
		infoDurationEndedYear.setAttribute("display", "none");
		infoDurationEndedMonth.setAttribute("display", "none");
		infoDurationEndedDay.setAttribute("display", "none");
		infoDurationEndedHour.setAttribute("display", "none");
		infoDurationEndedMinute.setAttribute("display", "none");
		infoDurationEndedSecond.setAttribute("display", "none");
		infoDurationEndedAMPM.setAttribute("display", "none");
		infoDurationDurationHour.setAttribute("display", "none");
		infoDurationDurationMinute.setAttribute("display", "none");
		infoDurationDurationSecond.setAttribute("display", "none");
		infoNewStop.setAttribute("display", "none");
		infoDeleteRecord.setAttribute("display", "none");
		selectTimerTab();
	}
}
function loadInfoItem(contractionEvent, index) {
	editingDatabaseIndex = index;
	var startDateData = dateToDateString(contractionEvent.Start).split("/");
	var startTimeData = timeStringToArray(dateToTimeString(contractionEvent.Start, true));
	var endedDate = new Date(contractionEvent.Start.getTime() + contractionEvent.Duration);
	var endedDateData = dateToDateString(endedDate).split("/");
	var endedTimeData = timeStringToArray(dateToTimeString(endedDate, true));
	var durationData = millisecondsToDurationString(contractionEvent.Duration).split(":");
	updateText(infoDurationStartAMPM, startTimeData[3]);
	updateText(infoDurationStartSecond, startTimeData[2]);
	updateText(infoDurationStartMinute, startTimeData[1]);
	updateText(infoDurationStartHour, startTimeData[0]);
	updateText(infoDurationStartDay, startDateData[1]);
	updateText(infoDurationStartYear, startDateData[2]);
	updateText(infoDurationStartMonth, startDateData[0]);
	updateText(infoDurationEndedAMPM, endedTimeData[3]);
	updateText(infoDurationEndedSecond, endedTimeData[2]);
	updateText(infoDurationEndedMinute, endedTimeData[1]);
	updateText(infoDurationEndedHour, endedTimeData[0]);
	updateText(infoDurationEndedDay, endedDateData[1]);
	updateText(infoDurationEndedYear, endedDateData[2]);
	updateText(infoDurationEndedMonth, endedDateData[0]);
	updateText(infoDurationStrength, contractionEvent.Strength);
	updateText(infoDurationDurationHour, durationData[0]);
	updateText(infoDurationDurationMinute, durationData[1]);
	updateText(infoDurationDurationSecond, durationData[2]);
	if(contractionEvent.NewStart) {
		infoNewStopCheckBox.removeAttribute("display");
	} else {
		infoNewStopCheckBox.setAttribute("display", "none");
	}
	var hiddenTextItems = layerInfo.getElementsByClassName("textInfoEdit");
	for(var i=0; i<hiddenTextItems.length; i++) {
		hiddenTextItems[i].removeAttribute("display");
	}
	infoDurationStrength.removeAttribute("display");
	infoDurationStartYear.removeAttribute("display");
	infoDurationStartMonth.removeAttribute("display");
	infoDurationStartDay.removeAttribute("display");
	infoDurationStartHour.removeAttribute("display");
	infoDurationStartMinute.removeAttribute("display");
	infoDurationStartSecond.removeAttribute("display");
	infoDurationStartAMPM.removeAttribute("display");
	infoDurationEndedYear.removeAttribute("display");
	infoDurationEndedMonth.removeAttribute("display");
	infoDurationEndedDay.removeAttribute("display");
	infoDurationEndedHour.removeAttribute("display");
	infoDurationEndedMinute.removeAttribute("display");
	infoDurationEndedSecond.removeAttribute("display");
	infoDurationEndedAMPM.removeAttribute("display");
	infoDurationDurationHour.removeAttribute("display");
	infoDurationDurationMinute.removeAttribute("display");
	infoDurationDurationSecond.removeAttribute("display");
	infoDeleteRecord.removeAttribute("display");
	infoNewStop.removeAttribute("display");
	selectInfoTab();
}
function contractionEventToHTML(contractionEvent, lastStartTime, index) {
	var endedDate = new Date((contractionEvent.Start).getTime() + contractionEvent.Duration);
	var startDateString = dateToDateString(contractionEvent.Start) + " " + dateToTimeString(contractionEvent.Start, true);
	var endedDateString = dateToDateString(endedDate) + " " + dateToTimeString(endedDate, true);
	var durationString = millisecondsToDurationString(contractionEvent.Duration);
	var frequencyString = "N/A";
	if(lastStartTime != null) {
		frequencyString = millisecondsToDurationString(contractionEvent.Start.getTime() - lastStartTime.getTime());
	}
	var div = document.createElementNS(xhtmlNS,"div");
	div.className = "historyItem";
	if(contractionEvent.NewStart) {
		div.style.borderBottom = "2px solid red";
	}
	var table = document.createElementNS(xhtmlNS,"table");
	table.style.width = "100%";
	var tr1 = document.createElementNS(xhtmlNS,"tr");
	var tr2 = document.createElementNS(xhtmlNS,"tr");
	var tr3 = document.createElementNS(xhtmlNS,"tr");
	var tr4 = document.createElementNS(xhtmlNS,"tr");
	var td = document.createElementNS(xhtmlNS,"td");
	var divInfo = document.createElementNS(xhtmlNS,"div");
	divInfo.style.fontStyle = "italic";
	divInfo.style.backgroundColor = "#0000FF";
	divInfo.style.borderRadius = "10px";
	divInfo.style.width = "20px";
	divInfo.style.height = "20px";
	divInfo.style.lineHeight = "20px";
	divInfo.style.marginLeft = "auto";
	divInfo.style.marginRight = "auto";
	divInfo.style.fontFamily = "Century Schoolbook L";
	divInfo.style.fontWeight = "bolder";
	divInfo.style.textAlign = "center";
	divInfo.innerHTML = "i";
	divInfo.onclick = function() {loadInfoItem(contractionEvent, index);};
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
	td.style.textAlign = "center";
	td.style.verticalAlign = "top";
	td.appendChild(divInfo);
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
function updateContraction(elem, field, datePart) {
	var originalValue = elem.getElementsByTagName("tspan")[0].textContent;
	console.log(originalValue);
	switch(datePart) {
		case "Strength":
			promptStrengthChange.value = originalValue;
			promptStrengthChange.onblur = function() { setContraction(promptStrengthChange, null, datePart); };
			promptStrengthChange.parentElement.removeAttribute("display");
			promptStrengthChange.focus();
			promptStrengthChange.parentElement.setAttribute("display", "none");
			break;
		case "AMPM":
			promptAMPM.value = originalValue;
			promptAMPM.onblur = function() { setContraction(promptAMPM, field, datePart); };
			promptAMPM.parentElement.removeAttribute("display");
			promptAMPM.focus();
			promptAMPM.parentElement.setAttribute("display", "none");
			break;
		case "Second":
			promptSecond.value = originalValue;
			promptSecond.onblur = function() { setContraction(promptSecond, field, datePart); };
			promptSecond.parentElement.removeAttribute("display");
			promptSecond.focus();
			promptSecond.parentElement.setAttribute("display", "none");
			break;
		case "Minute":
			promptMinute.value = originalValue;
			promptMinute.onblur = function() { setContraction(promptMinute, field, datePart); };
			promptMinute.parentElement.removeAttribute("display");
			promptMinute.focus();
			promptMinute.parentElement.setAttribute("display", "none");
			break;
		case "Hour":
			promptHour.value = originalValue;
			promptHour.onblur = function() { setContraction(promptHour, field, datePart); };
			promptHour.parentElement.removeAttribute("display");
			promptHour.focus();
			promptHour.parentElement.setAttribute("display", "none");
			break;
		case "Day":
			promptDay.value = originalValue;
			promptDay.onblur = function() { setContraction(promptDay, field, datePart); };
			promptDay.parentElement.removeAttribute("display");
			promptDay.focus();
			promptDay.parentElement.setAttribute("display", "none");
			break;
		case "Month":
			promptMonth.value = originalValue;
			promptMonth.onblur = function() { setContraction(promptMonth, field, datePart); };
			promptMonth.parentElement.removeAttribute("display");
			promptMonth.focus();
			promptMonth.parentElement.setAttribute("display", "none");
			break;
		case "Year":
			promptYear.value = originalValue;
			promptYear.onblur = function() { setContraction(promptYear, field, datePart); };
			promptYear.parentElement.removeAttribute("display");
			promptYear.focus();
			promptYear.parentElement.setAttribute("display", "none");
			break;
	}
}
function setContraction(sender, field, datePart) {
	sender.onblur = null;
	var db = JSON.parse(localStorage["contractionHistory"], dateTimeReviver);
	db = db.sort(sortContractions);
	if(field == null && datePart == "Strength") {
		db[editingDatabaseIndex].Strength = sender.value;
	} else {
		switch(field) {
			case "Start":
				var d = dateToDateString(db[editingDatabaseIndex].Start).split("/");
				var t = timeStringToArray(dateToTimeString(db[editingDatabaseIndex].Start, true));
				switch(datePart) {
					case "Year":
						d[2] = sender.value;
						break;
					case "Month":
						d[0] = sender.value;
						break;
					case "Day":
						d[1] = sender.value;
						break;
					case "Hour":
						t[0] = sender.value;
						break;
					case "Minute":
						t[1] = sender.value;
						break;
					case "Second":
						t[2] = sender.value;
						break;
					case "AMPM":
						t[3] = sender.value;
						break;
				}
				d[0] = parseInt(d[0], 10) - 1;
				if(t[3] == "PM") {
					t[0] = parseInt(t[0], 10) + 12;
				}
				db[editingDatabaseIndex].Start = new Date(d[2],d[0],d[1],t[0],t[1],t[2]);
				break;
			case "Ended":
				var dur = db[editingDatabaseIndex].Duration;
				var endedDate = new Date(db[editingDatabaseIndex].Start.getTime() + dur);
				var d = dateToDateString(endedDate).split("/");
				var t = timeStringToArray(dateToTimeString(endedDate, true));
				var newEndedDate = null;
				switch(datePart) {
					case "Year":
						d[2] = sender.value;
						break;
					case "Month":
						d[0] = sender.value;
						break;
					case "Day":
						d[1] = sender.value;
						break;
					case "Hour":
						t[0] = sender.value;
						break;
					case "Minute":
						t[1] = sender.value;
						break;
					case "Second":
						t[2] = sender.value;
						break;
					case "AMPM":
						t[3] = sender.value;
						break;
				}
				d[0] = parseInt(d[0], 10) - 1;
				if(t[3] == "PM") {
					t[0] = parseInt(t[0], 10) + 12;
				}
				newEndedDate = new Date(d[2],d[0],d[1],t[0],t[1],t[2]);
				db[editingDatabaseIndex].Start = new Date(newEndedDate.getTime() - dur);
				break;
			case "Duration":
				var durationData = millisecondsToDurationString(db[editingDatabaseIndex].Duration).split(":");
				switch(datePart) {
					case "Hour":
						durationData[0] = sender.value;
						if(parseInt(durationData[0], 10) == 12) {
							durationData[0] = 0;
						}
						break;
					case "Minute":
						durationData[1] = sender.value;
						break;
					case "Second":
						durationData[2] = sender.value;
						break;
				}
				db[editingDatabaseIndex].Duration = (parseInt(durationData[0],10) * 3600000) + (parseInt(durationData[1],10) * 60000) + (parseInt(durationData[2],10) * 1000);
				break;
		}
	}
	localStorage["contractionHistory"] = JSON.stringify(db);
	loadInfoItem(db[editingDatabaseIndex], editingDatabaseIndex);
	updateHistory();
}
function toggleCheckBox(checkBox) {
	if(checkBox.hasAttribute("display")) {
		checkBox.removeAttribute("display");
		repairCheckBoxUI();
	} else {
		checkBox.setAttribute("display", "none");
	}
}
function repairCheckBoxUI() {
	//Repair UI.. cannot set height as percentage of width?
	var checkBoxCount = document.getElementsByClassName("rectCheckBox").length;
	for(var i=0; i<checkBoxCount; i++) {
		try {
			var w = document.getElementsByClassName("rectCheckBox")[i].getBBox().width;
			document.getElementsByClassName("rectCheckBox")[i].setAttribute("height", w);
		} catch(ex) {
		}
		try {
			var w = document.getElementsByClassName("rectCheckBoxFill")[i].getBBox().width;
			document.getElementsByClassName("rectCheckBoxFill")[i].setAttribute("height", w);
		} catch(ex) {
		}
	}
}