//Medical Business Logic
//
//	A message to call the doctor will be given when 
//		"
//			When your contractions are regular and strong, and coming every four to five minutes for one to two hours, you should call your midwife or doctor. 
//		"
//		This is defined as:
//			5 or more database entries
//			The first n records is considered to be the
//				first (5 to n records) each between 3.5 (3 mins 30 seconds) and 5.5 (5 mins 30 seconds)
//			Only newest are considered, any record after the first NewStart is ignored, all records after first falling out of frequency range are ignored
//			Contraction strength is ignored (contrary to statement above)
//			Duration between first .Start and n .Start (n) has a duration of one hour
var ThreeMinutesThirtySeconds = 210000;
var FiveMinutesThirtySeconds = 330000;
var OneHour = 3600000;
//checkDatabaseForAlert Test Cases
var tooShortToQualify = ([
  {	 Start: new Date("2013-11-26T00:00:00.000Z")	,Duration: (1000 * 60 * 2)	,Strength: "regular"	,NewStart: false	,Note: "a note" }
 ,{	 Start: new Date("2013-11-26T01:00:00.000Z")	,Duration: (1000 * 60 * 2)	,Strength: "mild"	,NewStart: false	,Note: "" }
 ,{	 Start: new Date("2013-11-26T02:00:00.000Z")	,Duration: (1000 * 60 * 2)	,Strength: "mild"	,NewStart: false	,Note: "" }
 ,{	 Start: new Date("2013-11-24T03:00:00.000Z")	,Duration: (1000 * 60 * 5)	,Strength: "mild"	,NewStart: false	,Note: "" }
]);
var newStartPreventsQualify = ([
  {	 Start: new Date("2013-11-26T00:00:00.000Z")	,Duration: (1000 * 60 * 2)	,Strength: "regular"	,NewStart: false	,Note: "a note" }
 ,{	 Start: new Date("2013-11-26T01:00:00.000Z")	,Duration: (1000 * 60 * 2)	,Strength: "mild"	,NewStart: false	,Note: "" }
 ,{	 Start: new Date("2013-11-26T02:00:00.000Z")	,Duration: (1000 * 60 * 2)	,Strength: "mild"	,NewStart: true	,Note: "" }
 ,{	 Start: new Date("2013-11-26T03:00:00.000Z")	,Duration: (1000 * 60 * 5)	,Strength: "mild"	,NewStart: true	,Note: "" }
 ,{	 Start: new Date("2013-11-26T04:00:00.000Z")	,Duration: (1000 * 60 * 5)	,Strength: "mild"	,NewStart: true	,Note: "" }
]);
var oneIrregularPreventsQualify = ([
  {	 Start: new Date("2013-11-26T00:00:00.000Z")	,Duration: (1000 * 60 * 4)	,Strength: "regular"	,NewStart: false	,Note: "a note" }
 ,{	 Start: new Date("2013-11-26T01:00:00.000Z")	,Duration: (1000 * 60 * 4)	,Strength: "mild"	,NewStart: false	,Note: "" }
 ,{	 Start: new Date("2013-11-26T02:00:00.000Z")	,Duration: (1000 * 60 * 2)	,Strength: "mild"	,NewStart: false	,Note: "" }
 ,{	 Start: new Date("2013-11-26T03:00:00.000Z")	,Duration: (1000 * 60 * 5)	,Strength: "mild"	,NewStart: false	,Note: "" }
 ,{	 Start: new Date("2013-11-26T04:00:00.000Z")	,Duration: (1000 * 60 * 5)	,Strength: "mild"	,NewStart: false	,Note: "" }
]);
var regularButFarApart = ([
  {	 Start: new Date("2013-11-26T00:00:00.000Z")	,Duration: (1000 * 60 * 4)	,Strength: "regular"	,NewStart: false	,Note: "a note" }
 ,{	 Start: new Date("2013-11-26T01:00:00.000Z")	,Duration: (1000 * 60 * 4)	,Strength: "mild"	,NewStart: false	,Note: "" }
 ,{	 Start: new Date("2013-11-26T02:00:00.000Z")	,Duration: (1000 * 60 * 4)	,Strength: "mild"	,NewStart: false	,Note: "" }
 ,{	 Start: new Date("2013-11-26T03:00:00.000Z")	,Duration: (1000 * 60 * 4)	,Strength: "mild"	,NewStart: false	,Note: "" }
 ,{	 Start: new Date("2013-11-26T04:00:00.000Z")	,Duration: (1000 * 60 * 4)	,Strength: "mild"	,NewStart: false	,Note: "" }
]);
var tooSoonToTell = ([
  {	 Start: new Date("2013-11-26T00:00:00.000Z")	,Duration: (1000 * 60 * 2)	,Strength: "regular"	,NewStart: false	,Note: "a note" }
 ,{	 Start: new Date("2013-11-26T00:04:00.000Z")	,Duration: (1000 * 60 * 2)	,Strength: "mild"	,NewStart: false	,Note: "" }
 ,{	 Start: new Date("2013-11-26T00:08:00.000Z")	,Duration: (1000 * 60 * 2)	,Strength: "mild"	,NewStart: false	,Note: "" }
 ,{	 Start: new Date("2013-11-26T00:12:00.000Z")	,Duration: (1000 * 60 * 2)	,Strength: "mild"	,NewStart: false	,Note: "" }
 ,{	 Start: new Date("2013-11-26T00:16:00.000Z")	,Duration: (1000 * 60 * 2)	,Strength: "mild"	,NewStart: false	,Note: "" }
]);
var oneHourSpacedOutBy4Minutes = ([
  {	 Start: new Date("2013-11-26T00:00:00.000Z")	,Duration: (1000 * 60 * 2)	,Strength: "mild"	,NewStart: false	,Note: "i=0" }
 ,{	 Start: new Date("2013-11-26T00:04:00.000Z")	,Duration: (1000 * 60 * 2)	,Strength: "mild"	,NewStart: false	,Note: "i=1" }
 ,{	 Start: new Date("2013-11-26T00:08:00.000Z")	,Duration: (1000 * 60 * 2)	,Strength: "mild"	,NewStart: false	,Note: "i=2" }
 ,{	 Start: new Date("2013-11-26T00:12:00.000Z")	,Duration: (1000 * 60 * 2)	,Strength: "mild"	,NewStart: false	,Note: "i=3" }
 ,{	 Start: new Date("2013-11-26T00:16:00.000Z")	,Duration: (1000 * 60 * 2)	,Strength: "mild"	,NewStart: false	,Note: "i=4" }
 ,{	 Start: new Date("2013-11-26T00:20:00.000Z")	,Duration: (1000 * 60 * 2)	,Strength: "mild"	,NewStart: false	,Note: "i=5" }
 ,{	 Start: new Date("2013-11-26T00:24:00.000Z")	,Duration: (1000 * 60 * 2)	,Strength: "mild"	,NewStart: false	,Note: "i=6" }
 ,{	 Start: new Date("2013-11-26T00:28:00.000Z")	,Duration: (1000 * 60 * 2)	,Strength: "mild"	,NewStart: false	,Note: "i=7" }
 ,{	 Start: new Date("2013-11-26T00:32:00.000Z")	,Duration: (1000 * 60 * 2)	,Strength: "mild"	,NewStart: false	,Note: "i=8" }
 ,{	 Start: new Date("2013-11-26T00:36:00.000Z")	,Duration: (1000 * 60 * 2)	,Strength: "mild"	,NewStart: false	,Note: "i=9" }
 ,{	 Start: new Date("2013-11-26T00:40:00.000Z")	,Duration: (1000 * 60 * 2)	,Strength: "mild"	,NewStart: false	,Note: "i=10" }
 ,{	 Start: new Date("2013-11-26T00:44:00.000Z")	,Duration: (1000 * 60 * 2)	,Strength: "mild"	,NewStart: false	,Note: "i=11" }
 ,{	 Start: new Date("2013-11-26T00:48:00.000Z")	,Duration: (1000 * 60 * 2)	,Strength: "mild"	,NewStart: false	,Note: "i=12" }
 ,{	 Start: new Date("2013-11-26T00:52:00.000Z")	,Duration: (1000 * 60 * 2)	,Strength: "mild"	,NewStart: false	,Note: "i=13" }
 ,{	 Start: new Date("2013-11-26T00:56:00.000Z")	,Duration: (1000 * 60 * 2)	,Strength: "mild"	,NewStart: false	,Note: "i=14" }
 ,{	 Start: new Date("2013-11-26T01:00:00.000Z")	,Duration: (1000 * 60 * 2)	,Strength: "mild"	,NewStart: false	,Note: "i=15" }
]);
//
function runTestCases_all() {
	runTestCases_checkDatabaseForAlert(null);
	runTestCases_checkDatabaseSortFunction(null);
}
function runTestCases_checkDatabaseForAlert(testSpecificRule) {
	if(testSpecificRule == null || testSpecificRule == 1) {
		console.log("-----------------------------------------");
		console.log("tooShortToQualify - Not enough records");
		console.log(checkDatabaseForAlert(tooShortToQualify));
	}
	if(testSpecificRule == null || testSpecificRule == 2) {
		console.log("-----------------------------------------");
		console.log("newStartPreventsQualify - Not enough qualifying records");
		console.log(checkDatabaseForAlert(newStartPreventsQualify));
	}
	if(testSpecificRule == null || testSpecificRule == 3) {
		console.log("-----------------------------------------");
		console.log("oneIrregularPreventsQualify - Not enough qualifying records");
		console.log(checkDatabaseForAlert(oneIrregularPreventsQualify));
	}
	if(testSpecificRule == null || testSpecificRule == 4) {
		console.log("-----------------------------------------");
		console.log("regularButFarApart - Not enough qualifying records");
		console.log(checkDatabaseForAlert(regularButFarApart));
	}
	if(testSpecificRule == null || testSpecificRule == 5) {
		console.log("-----------------------------------------");
		console.log("tooSoonToTell - Not yet");
		console.log(checkDatabaseForAlert(tooSoonToTell));
	}
	if(testSpecificRule == null || testSpecificRule == 6) {
		console.log("-----------------------------------------");
		console.log("oneHourSpacedOutBy4Minutes - Call Doctor");
		console.log(checkDatabaseForAlert(oneHourSpacedOutBy4Minutes));
	}
}
function runTestCases_checkDatabaseSortFunction(testSpecificRule) {
	if(testSpecificRule == null || testSpecificRule == 1) {
		console.log("-----------------------------------------");
		console.log("tooShortToQualify - More recent to older");
		console.log(checkDatabaseSortFunction(tooShortToQualify));
	}
	if(testSpecificRule == null || testSpecificRule == 2) {
		console.log("-----------------------------------------");
		console.log("newStartPreventsQualify - More recent to older");
		console.log(checkDatabaseSortFunction(newStartPreventsQualify));
	}
	if(testSpecificRule == null || testSpecificRule == 3) {
		console.log("-----------------------------------------");
		console.log("oneIrregularPreventsQualify - More recent to older");
		console.log(checkDatabaseSortFunction(oneIrregularPreventsQualify));
	}
	if(testSpecificRule == null || testSpecificRule == 4) {
		console.log("-----------------------------------------");
		console.log("regularButFarApart - More recent to older");
		console.log(checkDatabaseSortFunction(regularButFarApart));
	}
	if(testSpecificRule == null || testSpecificRule == 5) {
		console.log("-----------------------------------------");
		console.log("tooSoonToTell - More recent to older");
		console.log(checkDatabaseSortFunction(tooSoonToTell));
	}
	if(testSpecificRule == null || testSpecificRule == 6) {
		console.log("-----------------------------------------");
		console.log("oneHourSpacedOutBy4Minutes - More recent to older");
		console.log(checkDatabaseSortFunction(oneHourSpacedOutBy4Minutes));
	}
}
function checkDatabaseSortFunction(db) {
	db = db.sort(sortContractions);
	var i = 0;
	while(i<db.length) {
		console.log("CurrentRecord: " + dateToDateString(db[i].Start) + " " + dateToTimeString(db[i].Start) );
		i++;
	}
}
function checkDatabaseForAlert(db) {
	db = db.sort(sortContractions);
	if(db.length >= 5) {
		var n = 0;
		var foundN = false;
		var i = 0;
		var lastStart = null;
		while((i<db.length) && (!foundN)) {
			//console.log("CurrentRecord(" + i.toString() + "): " + dateToDateString(db[i].Start) + " " + dateToTimeString(db[i].Start) + " Note:" + db[i].Note);
			if(db[i].NewStart) {
				//console.log("found NewStart at" + i.toString());
				foundN = true;
			} else {
				if(lastStart != null) {
					var f = (lastStart.getTime() - db[i].Start.getTime());
					//console.log(dateToTimeString(lastStart) + " - " + dateToTimeString(db[i].Start) + ": " + millisecondsToDurationString(f) + " - " + f.toString() );
					if( (f < ThreeMinutesThirtySeconds) || (f > FiveMinutesThirtySeconds) ) {
						//console.log("found bad duration: " + millisecondsToDurationString(f) + " at " + i.toString());
						foundN = true;
					}
				}
				lastStart = db[i].Start;
			}
			i++;
		}
		//console.log("i= " + i.toString());
		if( i >= 5) {
			//At least 5 records exist with each frequency between 3.5 and 5.5
			if(i<db.length) {
				n = i;
			} else {
				n = db.length - 1;
			}
			var f = (db[0].Start.getTime() - db[n].Start.getTime());
			if(f >= OneHour) {
				return ({
					 Alert: true
					,Message: "It's time to Call the doctor.\nXD\nRemember to relax." //Unknown: is it appropiate to put words of encouragement here? From a coding perspective
				});
			} else {
				//console.log( millisecondsToDurationString(f) );
				return ({
					 Alert: false
					,Message: "Not yet"
				});
			}
		} else {
			return ({
				 Alert: false
				,Message: "Not enough qualifying records to consider anything"
			});
		}
	} else {
		return ({
			 Alert: false
			,Message: "Not enough records to consider anything"
		});
	}
}