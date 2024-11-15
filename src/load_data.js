
// sorting direction
let sortNo = false;
let sortHoles = false;
let sortLength3d = false;
let sortReg = false;
let sortLeftTurns = false;
let sortRightTurns = false;
let sortSpin = false;

let tbody;

let paths = null;
let allPaths = null;
let selectedRow = null;

async function init() {
    var mazeName = getParameterByName('maze');

    if (mazeName == "up12") {
        document.title = "3D hole maze, 4x5x5, up to 12 holes";

        let res = await fetch('paths_up12.json');
        paths = await res.json();
        allPaths = paths.paths;
        paths = paths.paths;
        selectedRow = null;

    } else if (mazeName == "14_spin") {
        document.title = "3D hole maze, 4x5x5, with 14 holes";

        let res = await fetch('paths_14_spin.json');
        paths = await res.json();
        allPaths = paths.paths;
        paths = paths.paths;
        selectedRow = null;
    } else {
        document.title = "unknown maze";

        return;
    }


    tbody = document.getElementById("tableBody");
    populate_with_new_rows(tbody);

    const holes = [];
    for (let i = 0; i < paths.length; i++) {
        if (!holes.includes(paths[i].holes)) {
            holes.push(paths[i].holes);
        }
    }
    holes.sort((a, b) => a - b);
    let select = document.getElementById('holesToShow');
    for (let i = 0; i < holes.length; i++) {
        var opt = document.createElement('option');
        opt.value = holes[i];
        opt.innerHTML = holes[i];
        select.appendChild(opt);
    }
    select.addEventListener("change", () => {
        if (select.value == "all") {
            paths = allPaths;

            for (var i = tbody.rows.length - 1; i >= 0; i--) {
                tbody.deleteRow(i);
            }

            populate_with_new_rows(tbody);
            window.parent.dispatchEvent(new Event('getFirstPath'));
        }
        else {
            const filter = allPaths.filter(x => x.holes == select.value);
            paths = filter;

            for (var i = tbody.rows.length - 1; i >= 0; i--) {
                tbody.deleteRow(i);
            }

            populate_with_new_rows(tbody);
            window.parent.dispatchEvent(new Event('getFirstPath'));
        }
    });
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function populate_with_new_rows(new_tbody) {
    const viewer = document.getElementById("viewer");
    for (let i = 0; i < paths.length; i++) {
        let row = new_tbody.insertRow();
        //row.addEventListener("click", () => {
        //    viewer.contentWindow.dispatchEvent(new CustomEvent('newPath', { 'detail': paths[i] }));
        //});
        row.onclick = () => {
            viewer.contentWindow.dispatchEvent(new CustomEvent('newPath', { 'detail': paths[i] }));

            //const tb = document.getElementById("tableBody");
            if (selectedRow != null)
                selectedRow.classList.remove("selected-row");
            row.classList.add("selected-row");
            selectedRow = row;
        };

        let pathNbr = row.insertCell(0);
        pathNbr.innerHTML = paths[i].pathNbr;

        let holes = row.insertCell(1);
        holes.innerHTML = paths[i].holes;

        let pathLengthFull = row.insertCell(2);
        pathLengthFull.innerHTML = paths[i].lengthFull;

        let pathReg = row.insertCell(3);
        pathReg.innerHTML = paths[i].regularity.toFixed(3);

        let leftTurnsTh = row.insertCell(4);
        leftTurnsTh.innerHTML = paths[i].leftTurns;

        let rightTurnsTh = row.insertCell(5);
        rightTurnsTh.innerHTML = paths[i].rightTurns;

        let spinTh = row.insertCell(6);
        spinTh.innerHTML = paths[i].spin.toFixed(3);;
    }
}

function sortTable(n) {
    if (n == 0) {
        if (sortNo) {
            paths.sort((a, b) => a.pathNbr - b.pathNbr);
        } else {
            paths.sort((a, b) => b.pathNbr - a.pathNbr);
        }
        sortNo = !sortNo;
    }
    else if (n == 1) {
        if (sortHoles) {
            paths.sort((a, b) => a.holes - b.holes);
        } else {
            paths.sort((a, b) => b.holes - a.holes);
        }
        sortHoles = !sortHoles;
    }
    else if (n == 2) {
        if (sortLength3d) {
            paths.sort((a, b) => a.lengthFull - b.lengthFull);
        } else {
            paths.sort((a, b) => b.lengthFull - a.lengthFull);
        }
        sortLength3d = !sortLength3d;
    } else if (n == 3) {
        if (sortReg) {
            paths.sort((a, b) => a.regularity - b.regularity);
        } else {
            paths.sort((a, b) => b.regularity - a.regularity);
        }
        sortReg = !sortReg;
    } else if (n == 4) {
        if (sortLeftTurns) {
            paths.sort((a, b) => a.leftTurns - b.leftTurns);
        } else {
            paths.sort((a, b) => b.leftTurns - a.leftTurns);
        }
        sortLeftTurns = !sortLeftTurns;
    } else if (n == 5) {
        if (sortRightTurns) {
            paths.sort((a, b) => a.rightTurns - b.rightTurns);
        } else {
            paths.sort((a, b) => b.rightTurns - a.rightTurns);
        }
        sortRightTurns = !sortRightTurns;
    } else if (n == 6) {
        if (sortSpin) {
            paths.sort((a, b) => a.spin - b.spin);
        } else {
            paths.sort((a, b) => b.spin - a.spin);
        }
        sortSpin = !sortSpin;
    }

    var new_tbody = document.createElement('tbody');
    populate_with_new_rows(new_tbody);
    tbody.parentNode.replaceChild(new_tbody, tbody)
    tbody = new_tbody;

}

//loadData();
init();

const pathNbrTh = document.getElementById("pathNbrTh");
pathNbrTh.addEventListener("click", () => sortTable(0));

const holesTh = document.getElementById("holesTh");
holesTh.addEventListener("click", function () { sortTable(1); });

const pathLengthFullTh = document.getElementById("pathLengthFullTh");
pathLengthFullTh.addEventListener("click", function () { sortTable(2); });

const pathRegTh = document.getElementById("pathRegTh");
pathRegTh.addEventListener("click", function () { sortTable(3); });

const leftTurnsTh = document.getElementById("leftTurnsTh");
leftTurnsTh.addEventListener("click", function () { sortTable(4); });

const rightTurnsTh = document.getElementById("rightTurnsTh");
rightTurnsTh.addEventListener("click", function () { sortTable(5); });

const spinTh = document.getElementById("spinTh");
spinTh.addEventListener("click", function () { sortTable(6); });


window.addEventListener('getFirstPath', function (e) {
    const viewer = document.getElementById("viewer");
    viewer.contentWindow.dispatchEvent(new CustomEvent('newPath', { 'detail': paths[0] }));
});