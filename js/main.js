if (window.global) {

    global.$ = $;
    global.console = console;

    var gui = require('nw.gui');
    var win = gui.Window.get();
    var path = require("path");
    var EJDB = require("ejdb");

    var jb = global.jb;


    win.on("close", function() {
        if (jb && jb.isOpen()) {
            try {
                console.info("Closing EJDB..");
                jb.close();
                jb = global.jb = null;
            } catch (e) {
                console.error(e);
            }
        }
        this.close(true);
    });

    $(document).ready(function() {
        if (jb == null) {
            jb = global.jb = EJDB.open("addressbook");
        }
        $(".alert-error").live("click", function() {
            $(this).hide();
        });

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
            jb.save("contacts", saveObj, function(err, oids) {
                if (err) {
                    SaveErr(err);
                    return;
                }
                $("#saverr").parent().hide();
                $('#addContact').modal("hide");
                Search(null, saveObj["_id"], true);
            });
        });


        $(".rmrecord").live("click", function() {
            var href = $(this).attr("href");
            Remove(href.substring(1));
        });

        var sq = window.location.search;  //Query pattern
        if (sq && sq.indexOf("?q=") == 0) {
            sq = decodeURIComponent(sq.substring("?q=".length));
            $("input[name='q']").val(sq);
        } else {
            sq = null;
        }
        Search(sq); //Load contact list
    });

    function SaveErr(err) {
        $("#saverr").text(err ? err.toString() : "Unknown error");
        $("#saverr").parent().show();
    }

    function Remove(id) {
        jb.remove("contacts", id, function(err) {
            if (err) {
                console.error(err);
                return;
            }
            $("a[href='#" + id + "']").parent().parent().remove();
        });
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
        if (id) {
            q["_id"] = id;
        } else if (pattern) {
            orq.push({"name" : {"$begin" : pattern}});
            orq.push({"email" : {"$begin" : pattern}});
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
                rows.push("<td>" + (obj["birthdate"] ? obj["birthdate"].toLocaleDateString() : "") + "</td>");
                rows.push("<td><a href='#" + obj["_id"] + "' class='rmrecord'><img src='img/cross16.png' border='0'></a></td>");
                rows.push("</tr>");
            }
            $("#contacts > tbody:last").append(rows.join(""));
        });
    }
}
