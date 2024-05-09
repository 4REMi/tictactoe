// Get all elements with the class "choosableIcon" for player 1
var icons = document.querySelectorAll('.choosableIcon');
var colorElements = document.querySelectorAll('.color');

// Get all elements with the class "choosableIcon" for player 1
var icons2 = document.querySelectorAll('.choosableIcon2');
var colorElements2 = document.querySelectorAll('.color2');

var gameOver = false; // Global variable to track the game state

var playerTurn = 1;

var scoreP1 = 0;
var scoreP2 = 0;

//player 1 icon and color

var player1Icon;
var player1Color;
var player1Status;
var player1iconSVG;


 //player 2 icon and color
var player2Icon;
var player2Color;
var player2Status;
var player2iconSVG;


// Loop through each icon and add an event listener for player 1
icons.forEach(function(icon) {
    icon.addEventListener('click', function() {
        player1Icon = icon.id;   
        player1iconSVG = document.getElementById(player1Icon).innerHTML; //Using the "id" as parameter, we set another variable of the new icon. The inner HTML contains the SVG info.
        var player1defaultIcon = document.querySelector('.player1avi');  //We set the default icon into a variable.
        player1defaultIcon.innerHTML = player1iconSVG;
        
        // Apply the selected color to the player 1 icon if available
        if (player1Color) { 
            var iconPath = player1defaultIcon.querySelector('path');
            iconPath.setAttribute('fill', player1Color);
        }
        checkReady();
    });
});



// Loop through each icon and add an event listener for player 2
icons2.forEach(function(icon) {
    icon.addEventListener('click', function() {
        player2Icon = icon.id;
        player2iconSVG = document.getElementById(player2Icon).innerHTML;
        var player2defaultIcon = document.querySelector('.player2avi');
        player2defaultIcon.innerHTML = player2iconSVG;
        
        // Apply the selected color to the player 2 icon if available
        if (player2Color) {
            var iconPath = player2defaultIcon.querySelector('path');
            iconPath.setAttribute('fill', player2Color);
        }
        checkReady();
    });

    return player2Icon;
});

// Loop through each icon and add an event listener for player 1 color elements
colorElements.forEach(function(element) {
    element.addEventListener('click', function() {
        player1Color = window.getComputedStyle(element).backgroundColor;
        
        // Apply the selected color to the player 1 icon if available
        if (player1Icon) {
            var player1defaultIcon = document.querySelector('.player1avi');
            var iconPath = player1defaultIcon.querySelector('path');
            iconPath.setAttribute('fill', player1Color);
        }
        checkReady();
    });
});


// Loop through each icon and add an event listener for player 2 color elements
colorElements2.forEach(function(element) {
    element.addEventListener('click', function() {
        player2Color = window.getComputedStyle(element).backgroundColor;
        
        // Apply the selected color to the player 2 icon if available
        if (player2Icon) {
            var player2defaultIcon = document.querySelector('.player2avi');
            var iconPath = player2defaultIcon.querySelector('path');
            iconPath.setAttribute('fill', player2Color);
        }
        checkReady();
    });
});


function checkReady() {
    if (player1Color && player1Icon && player2Color && player2Icon) {
      // Both players are ready
      console.log('Both players are ready');
      // Trigger the screen transition
      loadGameReadyScreen();
    } else if (player1Color && player1Icon) {
      console.log('Player 1 is ready');
    } else if (player2Color && player2Icon) {
      console.log('Player 2 is ready');
    }
  }

  function loadGameReadyScreen() {
    // Use AJAX or fetch to load the gameReady.html file
    fetch('gameReady.html')
      .then(response => response.text())
      .then(html => {
        // Replace the current screen with the gameReady.html content
        document.querySelector('body').innerHTML = html;
        initializeGameScreen(); // Call the initialization function
      })
      .catch(error => {
        console.error('Error loading gameReady.html:', error);
      });
  }

  function initializeGameScreen () {
    var scoreIconP1 = document.getElementById('player1Icon'); //We set the respective icons for the score divs.
    scoreIconP1.innerHTML = player1iconSVG;
    var iconPathP1 = scoreIconP1.querySelector('path');
    iconPathP1.setAttribute('fill', player1Color);

    var scoreIconP2 = document.getElementById('player2Icon');
    scoreIconP2.innerHTML = player2iconSVG;
    var iconPathP2 = scoreIconP2.querySelector('path');
    iconPathP2.setAttribute('fill', player2Color);


    var squares = document.querySelectorAll('.square');
    // Loop through each icon and add an event listener for player 1 color elements
squares.forEach(function(element) {
    element.addEventListener('click', function() {
        if (!gameOver) {
            validateSquare(element.id);
          }

    });
});
    
  }

  function disableSquares() {
    var squares = document.querySelectorAll('.square');
    squares.forEach(function(square) {
      square.style.pointerEvents = 'none';
      square.style.cursor = 'default';
    });
  }


  function validateSquare(id) {
    var squareToValidate = document.getElementById(id);
  
    if (squareToValidate.innerHTML === "") {
      console.log("Empty square, valid to populate");
  
      if (playerTurn === 1) {
        squareToValidate.innerHTML = player1iconSVG;
        var iconPath = squareToValidate.querySelector('path');
        iconPath.setAttribute('fill', player1Color);
        playerTurn = 2;
      } else if (playerTurn === 2) {
        squareToValidate.innerHTML = player2iconSVG;
        var iconPath = squareToValidate.querySelector('path');
        iconPath.setAttribute('fill', player2Color);
        playerTurn = 1;
      }
  
      checkForWin();
      checkGameOver();
      return playerTurn;
    } else {
      console.log("Already populated, cannot set");
      return;
    }
  }

  



  function checkForWin() {
    var squares = document.querySelectorAll('.square');
    var winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
  
    for (var i = 0; i < winningCombinations.length; i++) {
      var [a, b, c] = winningCombinations[i];
      var squareA = squares[a];
      var squareB = squares[b];
      var squareC = squares[c];
  
      if (
        squareA.innerHTML !== "" &&
        squareA.innerHTML === squareB.innerHTML &&
        squareA.innerHTML === squareC.innerHTML
      ) {
        if (playerTurn === 1) {
          console.log("Player 1 Won");
          disableSquares();
          return 2;
        } else if (playerTurn === 2) {
          console.log("Player 2 Won");
          disableSquares();
          return 1;
        }
      }
    }
  
    // Check for a draw
    var isDraw = true;
    for (var i = 0; i < squares.length; i++) {
      if (squares[i].innerHTML === "") {
        isDraw = false;
        console.log(isDraw);
        break;
      }
    }
  
    if (isDraw) {
      console.log("It's a draw!");
      return "draw";
    }
  
    return null;
  }


  function checkGameOver() {
    var winner = checkForWin();
  
    if (winner !== null) {
      gameOver = true;
      disableSquares();
      displayGameOverMessage(winner);
    }
  }

  function displayGameOverMessage(winner) {
    var messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container');
  
    var iconElement = document.createElement('div');
    iconElement.classList.add('winner-icon');
    iconElement.innerHTML = winner === 1 ? player1iconSVG : player2iconSVG;
    var iconPath = iconElement.querySelector('path');
    iconPath.setAttribute('fill', winner === 1 ? player1Color : player2Color);
    
    if (winner === "draw") {
      var messageElement = document.createElement('div');
      messageElement.classList.add('game-over-message');
      messageElement.textContent = "TIE - Everybody's a loser! ";
      messageContainer.appendChild(messageElement);
    } else {
      var messageElement = document.createElement('div');
      messageElement.classList.add('game-over-message');
      messageElement.textContent = "Player " + winner + " won this round!";
      messageContainer.appendChild(iconElement);
      messageContainer.appendChild(messageElement);
  
      // Increment the score for the winning player
      if (winner === 1) {
        scoreP1++;
        var scoreChange = document.querySelector('.scoreP1');
        scoreChange.innerHTML = scoreP1;
      } else if (winner === 2) {
        scoreP2++;
        var scoreChange = document.querySelector('.scoreP2');
        scoreChange.innerHTML = scoreP2;
      }
    }
  
    var container = document.querySelector('.container');
    container.parentNode.insertBefore(messageContainer, container);
    playAgain();
  }

  function playAgain() {
    var playAgainContainer = document.createElement('div');
    playAgainContainer.classList.add('play-again-container');
  
    var playAgainButton = document.createElement('button');
    playAgainButton.textContent = 'Go Again?';
    playAgainButton.addEventListener('click', resetGame);
  
    playAgainContainer.appendChild(playAgainButton);
  
    // Get the main container element
    var mainContainer = document.querySelector('.container');
  
    // Insert the playAgainContainer after the main container
    mainContainer.insertAdjacentElement('afterend', playAgainContainer);
  }

  function resetGame() {
    // Clear the game board
    var squares = document.querySelectorAll('.square');
    squares.forEach(function(square) {
      square.innerHTML = '';
    });
  
    // Remove the game over message
    var messageContainer = document.querySelector('.message-container');
    if (messageContainer) {
      messageContainer.remove();
    }
  
    // Remove the play again container
    var playAgainContainer = document.querySelector('.play-again-container');
    if (playAgainContainer) {
      playAgainContainer.remove();
    }
  
    // Reset the game state
    gameOver = false;
    playerTurn = 1;
  
    // Enable the squares for interaction
    enableSquares();
  }
  
  function enableSquares() {
    var squares = document.querySelectorAll('.square');
    squares.forEach(function(square) {
      square.style.pointerEvents = 'auto';
      square.style.cursor = 'pointer';
    });
  }

