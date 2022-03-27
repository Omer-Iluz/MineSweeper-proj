document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector(".grid");
    const result = document.querySelector("#result");
    const FLAG = '🚩'
    const BOMB = '💣'
    var gBoard = 4;
    var numBombs = 2;
    var flags = 0;
    var squares = [];
    var isGameOver = false;
    var min = 0;
    var sec = 0;

    var gLevel = {
        SIZE: 4,
        MINES: 2,
    }

    var gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
    }

    function myTimer() {
        timer.innerHTML = "Time: " + min + ":" + sec;
        sec++;
        if (sec >= 60) {
            sec = 0;
            min++;
        }
    }
    document.addEventListener('click', () => {
        setInterval(myTimer, 1000);
    }, { once: true });


    //create Board
    function buildBoard() {
        //get shuffled game array with random bombs
        const bombsArray = Array(numBombs).fill("bomb");
        const emptyArray = Array(gBoard * gBoard - numBombs).fill("valid");
        const gameArray = emptyArray.concat(bombsArray);
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

        for (var i = 0; i < gBoard * gBoard; i++) {
            const square = document.createElement("div");
            square.setAttribute("id", i);
            square.classList.add(shuffledArray[i]);
            grid.appendChild(square);
            squares.push(square);

            //normal click
            square.addEventListener("click", function (e) {
                cellClicked(square);
            })

            //left click
            square.oncontextmenu = function (e) {
                e.preventDefault();
                addFlag(square);
            }
        }

        //add numbers
        for (var count = 0; count < squares.length; count++) {
            var total = 0;
            const isLeftEdge = count % gBoard === 0;
            const isRightEdge = count % gBoard === gBoard - 1;

            if (squares[count].classList.contains("valid")) {
                if (
                    count > 0 &&
                    !isLeftEdge &&
                    squares[count - 1].classList.contains("bomb")
                )
                    total++;
                if (
                    count > 9 &&
                    !isRightEdge &&
                    squares[count + 1 - gBoard].classList.contains("bomb")
                )
                    total++;
                if (count > 10 && squares[count - gBoard].classList.contains("bomb"))
                    total++;
                if (
                    count > 11 &&
                    !isLeftEdge &&
                    squares[count - 1 - gBoard].classList.contains("bomb")
                )
                    total++;
                if (
                    count < 98 &&
                    !isRightEdge &&
                    squares[count + 1].classList.contains("bomb")
                )
                    total++;
                if (
                    count < 90 &&
                    !isLeftEdge &&
                    squares[count - 1 + gBoard].classList.contains("bomb")
                )
                    total++;
                if (
                    count < 88 &&
                    !isRightEdge &&
                    squares[count + 1 + gBoard].classList.contains("bomb")
                )
                    total++;
                if (count < 89 && squares[count + gBoard].classList.contains("bomb"))
                    total++;
                squares[count].setAttribute("data", total);
            }
        }
    }


    initGame()
    function initGame() {
        buildBoard();
    }

    //add Flag with right click
    function addFlag(square) {
        if (isGameOver) return;
        if (!square.classList.contains("checked") && flags < numBombs) {
            if (!square.classList.contains("flag")) {
                square.classList.add("flag");
                square.innerText = `${FLAG}`;
                flags++;
                checkForWin();
            } else {
                square.classList.remove("flag");
                square.innerText = "";
                flags--;
            }
        }
    }

    //cellClicked on square actions
    function cellClicked(square) {
        var currentId = square.id;
        if (isGameOver) return;
        if (
            square.classList.contains("checked") ||
            square.classList.contains("flag")
        )
            return;
        if (square.classList.contains("bomb")) {
            gameOver(square);
        } else {
            var total = square.getAttribute("data");
            if (total != 0) {
                square.classList.add("checked");
                if (total == 1) square.classList.add("one");
                if (total == 2) square.classList.add("two");
                if (total == 3) square.classList.add("three");
                if (total == 4) square.classList.add("four");
                square.innerHTML = total;
                return;
            }
            expandShown(square, currentId);
        }
        square.classList.add("checked");
    }

    // check neighboring squares once square is clicked
    function expandShown(board, elCell) {
        const isLeftEdge = elCell % gBoard === 0;
        const isRightEdge = elCell % gBoard === gBoard - 1;

        setTimeout(() => {
            if (elCell > 0 && !isLeftEdge) {
                const newId = squares[parseInt(elCell) - 1].id;
                const newSquare = document.getElementById(newId);
                cellClicked(newSquare);
            }
            if (elCell > 9 && !isRightEdge) {
                const newId = squares[parseInt(elCell) + 1 - gBoard].id;
                const newSquare = document.getElementById(newId);
                cellClicked(newSquare);
            }
            if (elCell > 10) {
                const newId = squares[parseInt(elCell - gBoard)].id;
                const newSquare = document.getElementById(newId);
                cellClicked(newSquare);
            }
            if (elCell > 11 && !isLeftEdge) {
                const newId = squares[parseInt(elCell) - 1 - gBoard].id;
                const newSquare = document.getElementById(newId);
                cellClicked(newSquare);
            }
            if (elCell < 98 && !isRightEdge) {
                const newId = squares[parseInt(elCell) + 1].id;
                const newSquare = document.getElementById(newId);
                cellClicked(newSquare);
            }
            if (elCell < 90 && !isLeftEdge) {
                const newId = squares[parseInt(elCell) - 1 + gBoard].id;
                const newSquare = document.getElementById(newId);
                cellClicked(newSquare);
            }
            if (elCell < 88 && !isRightEdge) {
                const newId = squares[parseInt(elCell) + 1 + gBoard].id;
                const newSquare = document.getElementById(newId);
                cellClicked(newSquare);
            }
            if (elCell < 89) {
                const newId = squares[parseInt(elCell) + gBoard].id;
                const newSquare = document.getElementById(newId);
                cellClicked(newSquare);
            }
        }, 10);
    }

    //game over
    function gameOver(square) {

        result.innerHTML = "Game Over 😡";
        isGameOver = true;

        //show ALL the bombs
        squares.forEach((square) => {
            if (square.classList.contains("bomb")) {
                square.innerText = `${BOMB}`;
                square.classList.remove("bomb");
                square.classList.add("checked");
            }
        });
    }

    //check for win
    function checkForWin() {
        var matches = 0;

        for (var count = 0; count < squares.length; count++) {
            if (
                squares[count].classList.contains("flag") &&
                squares[count].classList.contains("bomb")
            ) {
                matches++;
            }
            if (matches === numBombs) {
                result.innerHTML = "You Win 😀";
                isGameOver = true;
            } else {
                result.innerHTML = "Keep Playing 🙂";
            }
        }

    }

})

