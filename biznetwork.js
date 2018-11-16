// ==UserScript==
// @name         Biz.Network ARK per day
// @namespace    https://classicdelegate.biz
// @version      1.1
// @description  Displays ARK gained per day on the biz.network delegate dashboard. Future updates to the delegate's dashboard may (irrevocably) break this script.
// @author       Felix Barten
// @match        https://classicdelegate.biz/dashboard
// @match 		 https://privatedelegate.biz/dashboard
// @grant        none
// @require  	 http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require  	 https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

// a function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
    script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

var main = function () {
    function run() {
        updateARKPerDay();
        percentageOfVotes();
    }

	function updateARKPerDay() {
		console.log("Calculating ARK gain per day");
		var arkPerDay = arkDue() / returnDays();
		console.log(arkPerDay, " ARK per day this payment period");
        if(!isNaN(arkPerDay)) {
            console.log(arkPerDay, " ARK per day this payment period");
		    jQ("div#payoutStats").append("<br> <b> ARK per day: </b>");
            jQ("div#payoutStats").append(arkPerDay);
        }
	}
	
    // Returns the days passed after the payout date. Known issue: if in a different timezone than delegate may be inaccurate.
	function returnDays() {
		var str = jQ("div#payoutStats").text()
		var regex = /\w\w\w\s\w\w\w\s\d\d?\s\d\d\d\d/;
		var matches = str.match(regex);
		var date = new Date(matches);
		var now = Date.now();
		var daysPassed = (now - date) / 86400000;
		return Math.floor(daysPassed);
	}

	function arkDue() {
		var str = jQ("div#payoutStats").text();
        var matches = str.match(/[0-9]*\.[0-9]*/g);
        //alternative for refunded text.
        if (str.includes("Refunded")) {
            return matches[1];
        }
        return matches[0];
	}

    // calculates the percentage of votes your balance carries.
    function percentageOfVotes() {
		var voterAmount = jQ("div#largeStats div:nth-child(2) span.statValue").text();
		voterAmount = voterAmount.replace(/,/g, "");
        var balanceAmount = jQ("div#balanceStats").text();

        // match balance from the string.
        var matches = balanceAmount.match(/[0-9]*\.[0-9]*/g);
        var percentage = parseFloat(matches[0]) / parseFloat(voterAmount) * parseFloat(100.0);

        jQ("div#balanceStats").append("<br> <b> Votes percentage: </b>");
		jQ("div#balanceStats").append(percentage.toFixed(5) + "%");
    }

	run();
};

// Wait for page add data.
waitForKeyElements ("div#payoutStats", start);

function start() {
    addJQuery(main);
}
