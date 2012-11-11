if (window.global) {

    global.$ = $;
    global.console = console;

    var gui = require('nw.gui');
    var win = gui.Window.get();
    var path = require("path");
    var EJDB = require("ejdb");
    var jb = null;


    win.on("close", function() {
        if (jb && jb.isOpen()) {
            try {
                console.info("Closing EJDB..");
                jb.close();
                jb = null;
            } catch (e) {
                console.error(e);
            }
        }
        this.close(true);
    });

    $(document).ready(function() {
        if (jb != null) {
            throw new Error("EJDB already initalized");
        }
        jb = EJDB.open("addressbook");

        $("#birthdate").datepicker({
            changeMonth : true,
            changeYear : true,
            showOtherMonths : true,
            selectOtherMonths : true
        });

        $("#newcontact").click(function() {
            var saveObj = {};
            ["name", "email", "address", "birthdate"].forEach(function(n) {
                if (n === "birthdate") {
                    saveObj[n] = $("#" + n).datepicker("getDate");
                } else {
                    saveObj[n] = $("#" + n).val();
                }
                $("#" + n).val("");
            });
            if (saveObj["name"] == null || saveObj["name"] == "") {
                SaveErr("At least name field should be filled");
                return;
            }
            $("#saverr").parent().hide();
            jb.save("contacts", saveObj, function(err, oids) {
                if (err) {
                    SaveErr(err);
                    return;
                }
                $('#addContact').modal("hide");

                Search(null, saveObj["_id"], true);
            });
        });

        Search(); //Load contact list
    });

    function SaveErr(err) {
        $("#saverr").text(err ? err.toString() : "Unknown error");
        $("#saverr").parent().show();
    }

    function Search(pattern, id, append) {
        if (!append) {
            $("#contacts").remove("td");
        }
        if (!jb) {
            console.error("EJDB is closed");
            return;
        }
        var q = { //Main query
        };
        var orq = []; //OR joined queries
        console.log("id=" + id);
        if (id) {
            q["_id"] = id;
        } else if (pattern) {
            //todo
        }
        jb.find("contacts", q, orq, {$orderby : {name : 1}}, function(err, cursor, count) {
            if (err) {
                console.error(err);
                return;
            }
            var rows = [];
            while (cursor.next()) {
                var obj = cursor.object();
                rows.push("<tr>");
                rows.push("<td>" + (obj["name"] ? obj["name"] : "") + "</td>");
                rows.push("<td>" + (obj["email"] ? obj["email"] : "") + "</td>");
                rows.push("<td>" + (obj["address"] ? obj["address"] : "") + "</td>");
                rows.push("<td>" + (obj["birthdate"] ? obj["birthdate"].getFullYear()  : "") + "</td>");
                rows.push("</tr>");
            }
            $("#contacts > tbody:last").append(rows.join(""));
        });
    }
}
