// ==UserScript==
// @name         Biz.Network ARK per day
// @namespace    https://classicdelegate.biz
// @version      1.0
// @description  Displays ARK gained per day on the biz.network delegate dashboard. Future updates to dashboard may (irrevocably) break this script.
// @author       Felix Barten
// @match        https://classicdelegate.biz/dashboard
// @match 		   https://privatedelegate.biz/dashboard
// @grant        none
// @require  	   http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require  	   https://gist.github.com/raw/2625891/waitForKeyElements.js
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
	function update() {
		console.log("Calculating ARK gain per day");
		var arkPerDay = arkDue() / returnDays();
		console.log(arkPerDay, " ARK per day this payment period");
		jQ("div#payoutStats").append("<br> <b> ARK per day: </b>");
		jQ("div#payoutStats").append(arkPerDay);
	}
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
	update();
};

// Wait for page add data.
waitForKeyElements ("div#payoutStats", start);

function start() {
    addJQuery(main);
}
