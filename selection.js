var selection = -1;
window.addEventListener("keydown", function (e) {
    var li = document.getElementsByTagName("li");
    var prevSelection = selection;
    switch (e.keyCode) {
    case 13: // enter
        var url = li[selection].getElementsByClassName("name")[0].href;
        window.open(url, '_blank').focus();
        return;
    // case 40: // down
    case 74: // j
        if (selection < li.length) {
            selection += 1;
        }
        break;
    // case 38: // up
    case 75: // k
        if (selection > -1) {
            selection -= 1;
        }
        break;
    default:
        return;
    }
    if (selection in li) {
        li[selection].classList.add("focused");
        if (prevSelection in li) {
            li[prevSelection].classList.remove("focused");
        }
        li[selection].scrollIntoView({ block: "nearest" });
    } else {
        selection = prevSelection;
    }
});
