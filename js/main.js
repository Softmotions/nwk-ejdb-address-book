if (window.global) {

    global.$ = $;
    global.console = console;

    var path = require("path");

    $(document).ready(function() {
        console.log("Loaded !!!!");

    });

}
