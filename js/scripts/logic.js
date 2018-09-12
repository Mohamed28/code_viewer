/**
 *  Author: Lucas Barretto e Silva
 *  Description: Insert new code lines and set styles
 */

$(document).ready(function () {
    var tabCode = setTab($("#tab-code"), $("#code-section"));
    var tabConsole = setTab($("#tab-console"), $("#console-section"));
    var tabPrint = setTab($("#tab-print"), $("#print-section"));
    var tabAbout = setTab($("#tab-about"), $("#about-section"));

    var codeRows;
    var consoleRows;

    //START set
    select(tabCode);
    codeRows = checkTextarea($("#code-textarea"), codeRows);
    consoleRows = checkTextarea($("#console-textarea"), consoleRows);
    formattingTable();
    setInputDefault($("#code-input-header"));
    setInputDefault($("#code-input-caption"));
    setInputDefault($("#code-textarea"));
    setInputDefault($("#console-input-caption"));
    setInputDefault($("#console-textarea"));

    //CHECKBOXES
    $(":checkbox").change(function () {
        if (this.checked == true) {
            copy(this.value);
        } else {
            destroy(this.value);
        }
    });

    $("#check-captions").change(function () {
        if (this.checked == true) {
            $("#code-view-copy span").show();
            $("#console-view-copy span").show();
        } else if (this.checked == false) {
            $("#code-view-copy span").hide();
            $("#console-view-copy span").hide();
        }
    });

    $("#check-code-header").change(function () {
        if (this.checked == true) {
            $("#code-view-copy thead").show();
        } else if (this.checked == false) {
            $("#code-view-copy thead").hide();

        }
    });

    //TABS EVENTS  
    tabCode.htmlElement.click(function () {
        select(tabCode);
        deselect(tabConsole);
        deselect(tabPrint);
        deselect(tabAbout);
    });

    tabConsole.htmlElement.click(function () {
        select(tabConsole);
        deselect(tabCode);
        deselect(tabPrint);
        deselect(tabAbout);
    });

    tabPrint.htmlElement.click(function () {
        $("print.checks").checked = false;
        $("#check-captions").checked = true;

        select(tabPrint);
        deselect(tabCode);
        deselect(tabConsole);
        deselect(tabAbout);
    });

    tabAbout.htmlElement.click(function () {
        select(tabAbout);
        deselect(tabCode);
        deselect(tabConsole);
        deselect(tabPrint);
    });

    //TEXTAREA EVENTS
    $("textarea").keyup(function () {
        if (this.id == "code-textarea") {
            codeRows = checkTextarea(this, codeRows);
        } else if (this.id == "console-textarea") {
            consoleRows = checkTextarea(this, consoleRows);
        }
    });

    $("textarea").keydown(function (e) {
        if (e.keyCode == 9 || e.which == 9) {
            e.preventDefault();
            var start = this.selectionStart;
            var end = this.selectionEnd;
            $(this).val($(this).val().substring(0, start) + "\t" + $(this).val().substring(end));
            this.selectionEnd = start + 1;
        }
    });

    //BTN SEND EVENT
    $("#btn-code-send").click(function () {
        let thead = $("thead th").empty();
        let caption = $("#code-caption").empty();
        let tbody = $("#table-body-rows").empty();

        thead.text($("#code-input-header").val());
        caption.text($("#code-input-caption").val());

        for (let i = 0; i < codeRows.length; i++) {
            let tr = $("<tr/>").appendTo(tbody);
            $("<td/>").addClass("col-1").text(i + 1).appendTo(tr);
            $("<td/>").html(codeRows[i]).appendTo(tr);
            // $("<td/>").text(codeRows[i]).appendTo(tr);
        }
        formattingTable();
    });

    $("#btn-console-send").click(function () {
        let consoleReturn = $("#console-return").empty();
        let caption = $("#console-caption").empty();
        for (let i = 0; i < consoleRows.length; i++) {
            let p = $("<p/>");
            p.text(consoleRows[i]).appendTo(consoleReturn);
        }
        caption.text($("#console-input-caption").val());
    });

    //BTN CLEAN EVENT
    $("#btn-code-clean").click(function () {
        $("table").empty();
        $("code-input-header").text("");
        $("code-input-caption").text("");
        $("#code-textarea").text("");
    });

    $("#btn-console-clean").click(function () {
        $("#console-return").empty();
        $("#console-input-caption").text("");
        $("#console-textarea").text("");

    });

    //BTN PRINT EVENT
    $("#btn-print").click(function () {
        print();
    });
});

//TAB FUCTIONS
function setTab(tabElement, relatedSectionElement) {
    var tab = {
        htmlElement: tabElement,
        section: relatedSectionElement,
        selected: false,
    };
    return tab;
}

function select(tab) {
    if (tab.selected == false) {
        tab.selected = true;

        tab.htmlElement.removeClass("tab-deselected");
        tab.htmlElement.addClass("tab-selected");
        toggleSectionVisibility(tab);
    }
}

function deselect(tab) {
    if (tab.selected == true) {
        tab.selected = false;
        tab.htmlElement.addClass("tab-deselected");
        tab.htmlElement.removeClass("tab-selected");
        toggleSectionVisibility(tab);
    }
}

function toggleSectionVisibility(tab) {
    if (tab.selected == true) {
        tab.section.css("display", "block");
    } else {
        tab.section.css("display", "none");
    }
}

//TABLE FUNCTION
function formattingTable() {
    $("table tr:odd").css("background-color", "#eee");
    $("table tr:even").css("background-color", "#fff");
}

//COPY ELEMENTS FUCTIONS
function copy(element) {
    if (element == "code-view") {
        $("#code-view").clone().attr("id", "code-view-copy").appendTo($("#code-copy"));
    } else if (element == "console-view") {
        $("#console-view").clone().attr("id", "console-view-copy").appendTo($("#console-copy"));
    }
    $("#" + element + "-copy label").css("font-size", "16px");
}

function destroy(element) {
    $("#" + element + "-copy").remove();
}

//INPUT FUCTIONS
function setInputDefault(element) {
    element.focus(function () {
        element.css("background-color", "#eee");
    });

    element.blur(function () {
        element.css("background-color", "#fff");
    });

}

//TEXTAREA FUNCTION
function checkTextarea(textarea, rowsArray) {
    if (navigator.appCodeName == "Mozilla") {
        rowsArray = $(textarea).val().split("\n");
    } else {
        rowsArray = textarea.text().split("\n");
    }

    console.log(rowsArray);
    $(textarea).attr("rows", rowsArray.length);
    return rowsArray;
}

//HTML2CANVAS FUNCTIONS
function print() {
    $("#print-result").empty();
    $("body").fadeOut();
    $("body").fadeIn();
    html2canvas(document.querySelector("#print-view")).then(canvas => {
        document.getElementById("print-result").appendChild(canvas);
    });
}