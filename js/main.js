"use strict";

// Singleton, master list of players and their relevant data. Calling these the player data object. For now, they remain in the order they are added.
var playersArray = [];
var profit = 0;

// Player object. Assumed single game simplifies this structure, and no need to specify bid on creation.
function Player(n, w) {
    this.name = n;
    this.wallet = w;
    this.bid = 0;
    }

// Populating with test data.
playersArray.push(new Player('Player 1', 30));
playersArray.push(new Player('Player 2', 20));
playersArray.push(new Player('Player 3', 50));
playersArray.push(new Player('Bozo', 10));

// window.onload can only happen once when implemented this way.
window.onload = function() {
    playersArray.forEach(function(x) {
        makePlayerControlPanel(x.name, x.wallet);
        });
    }
// TODO needs to be able to handle situation where only one player needs filling in champ/challenger 
function startEvent() {
    // if less than 2 players
    let queue = document.getElementById("queue");
    let error = document.getElementById("winner_error");
    let champName = document.getElementById("champ_queue").firstElementChild.textContent;
    let challengerName = document.getElementById("challenger_queue").firstElementChild.textContent;
//    if (queue.childElementCount < 3) {
    if ((champName == "Empty" && challengerName == "Empty" && queue.childElementCount < 3) ||
        (champName == "Empty" && queue.childElementCount == 1) ||
        (challengerName == "Empty" && queue.childElementCount == 1)) {
        error.textContent = "Not enough players!";
        }
    else {
        error.textContent = "";
        toggleGameControlButton();
        // var startEventButtonElement = document.getElementById("start_event_button");
        // startEventButtonElement.hidden = true;
        // var declareWinnerButtonElement = document.getElementById("declare_winner_button");
        // declareWinnerButtonElement.hidden = false;
        changeChampAndChallenger();
        }
    }
function toggleGameControlButton() {
    var startEventButtonElement = document.getElementById("start_event_button");
    var declareWinnerButtonElement = document.getElementById("declare_winner_button");
    if (startEventButtonElement.hidden == false) {
        startEventButtonElement.hidden = true;
        declareWinnerButtonElement.hidden = false;
    }
    else {
        startEventButtonElement.hidden = false;
        declareWinnerButtonElement.hidden = true;
        }
    console.log("toggleGameControlButton");
    }
// Disallowed names - Empty
function addPlayer(form) {
    // Get the form entered information
    var playerName = form.elements["player_name"].value;
    var walletAmount = form.elements["player_wallet"].value;

    // Create player object, and add it to singleton data structure.
    var p = new Player(playerName, parseInt(walletAmount));
    playersArray.push(p);

    // Make the control panel
    makePlayerControlPanel(p.name, p.wallet);
    }

function placeBid(playerControl) {
    // Pull the name from the control, then pull the data object from playersArray.
    var name = playerControl.firstElementChild.textContent;
    var player = findPlayer(name);

    // Wallet in player control for updating.
    var walletAmountElement = playerControl.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling;
    var w = player.wallet;
    var newWalletAmount = w - 1;

    // Update the web element and player data structure wallet.
    walletAmountElement.textContent = newWalletAmount;
    player.wallet = newWalletAmount;

    // Web page queue element.
    var q = document.getElementById('queue');
    
    // If the player is not in the queue, create the new entry in the queue, and add them to the end.
    if (player.bid == 0) {
        var outerNode, nodeName, nodeBid;        
        outerNode = document.createElement('div');
        outerNode.className = "player_row";
        outerNode.id = name.replace(/ /g, '_') + '_queue';
        nodeName = document.createElement('div');
        nodeName.textContent = name;
        nodeBid = document.createElement('div');
        nodeBid.textContent = 1;
        outerNode.appendChild(nodeName);
        outerNode.appendChild(nodeBid);
        q.appendChild(outerNode);

        player.bid = 1;
        }
    // Otherwise find the player within the queue and update bid value, and then check to sort, and then sort if necessary.
    else {
        player.bid = player.bid + 1;

        var playerSortElement = document.getElementById(name.replace(/ /g, '_') + '_queue');

        playerSortElement.firstElementChild.nextElementSibling.textContent = player.bid;
        // Finally, sort queue. Assume the top player is not bidding.
        // Get all the relevant additional data.
        var previousPlayer = playerSortElement.previousElementSibling;

        let previousBid = parseInt(previousPlayer.firstElementChild.nextElementSibling.textContent);
        let playerBid = parseInt(playerSortElement.firstElementChild.nextElementSibling.textContent);
        var sortingQueue = [];
        if (previousBid < playerBid) {
            // Pull out the exceeded bid and put it in the queue.
            sortingQueue.push(previousPlayer);
            // And do the same for all the rest of the bids after.
            while (playerSortElement.nextElementSibling != null) {
                sortingQueue.push(playerSortElement.nextElementSibling);
                q.removeChild(playerSortElement.nextElementSibling);
                }
            // Then add the whole sorting queue back into the bid queue.
            for (var i = 0; i < sortingQueue.length; i++) {
                q.appendChild(sortingQueue[i]);
                }
            }
        }
    }
       
function declareWinner(form) {
    var playerSelected = form.elements["versus"].value;
    
    if (playerSelected == "") {
        document.getElementById("winner_error").textContent = "Error!";
        }
    else {
        document.getElementById("winner_error").textContent = "";

        // Get the radio control results.
        let playersRadioArray = form.elements["versus"];
        let champObject = findPlayer(playersRadioArray[0].value);
        let challengerObject = findPlayer(playersRadioArray[1].value);

        // Variables for money tracking and contestants.
        var bountyElement = document.getElementById("bounty_amount_element");
        let bounty = parseInt(bountyElement.textContent);
        var winnerControlPanel;
        var bid, newWallet, newBounty, newProfit;
        var queue = document.getElementById('queue');
        var playerLostQueueElement;
        if (playersRadioArray[0].checked) {
            // Determine where contested bid is distributed.
            bid = challengerObject.bid;
            newWallet = champObject.wallet + bid * (1/4);
            newBounty = bounty + bid * (1/4);
            newProfit = profit + bid * (1/2);

            // Assign parts of bid
            challengerObject.bid = 0;
            champObject.wallet = newWallet;
            bountyElement.textContent = newBounty;
            profit = newProfit;
            winnerControlPanel = document.getElementById(champObject.name.replace(/ /g, '_') + '_control_panel');
//            playerWonQueueElement = document.getElementById("champ_queue");
            playerLostQueueElement = document.getElementById("challenger_queue");
//            playerWonQueueElement = document.getElementById(champObject.name.replace(/ /g, '_') + '_queue');
//            playerLostQueueElement = document.getElementById(challengerObject.name.replace(/ /g, '_') + '_queue');
            }
        else {
            bid = champObject.bid;
            newWallet = challengerObject.wallet + bounty + bid * (1/4);
            newBounty = bid * (1/4);
            newProfit = profit + bid * (1/2);

            champObject.bid = 0;
            challengerObject.wallet = newWallet;
            bountyElement.textContent = newBounty;
            profit = newProfit;
            winnerControlPanel = document.getElementById(challengerObject.name.replace(/ /g, '_') + '_control_panel');
//            playerWonQueueElement = document.getElementById(challengerObject.name.replace(/ /g, '_') + 'queue');
//            playerLostQueueElement = document.getElementById(champObject.name.replace(/ /g, '_') + '_queue');
            playerLostQueueElement = document.getElementById("champ_queue");
            }
        var walletElement = winnerControlPanel.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling;
        walletElement.textContent = newWallet;

        // Remove relevant player data from losers queue.
        playerLostQueueElement.firstElementChild.textContent = "Empty";
        playerLostQueueElement.firstElementChild.nextElementSibling.textContent = "0";

        if (queue.childElementCount < 2) {
            document.getElementById("winner_error").textContent = "Error!";
            toggleGameControlButton();
            }
        else {
            changeChampAndChallenger();
            form.reset();
            }
        form.reset();
        }
    logPlayersArray();
    }
function findPlayer(name) {
    var player = playersArray.find(function(o) {
        return o.name == name;
        });
    return player;
    }
function logPlayersArray() {
    for (var i = 0; i < playersArray.length; i++) {
        var p = playersArray[i];
        }
    }
function makePlayerControlPanel(name, wallet) {
    // Various containers for user control panel to be created
    var outerNode, nodeName, nodeWallet;

    // Wallet info, label and actual amount. This might be better as a single string
    var walletLabel, w;

    // Bid button that will be specific to the user
    var bidButton;

    // Create and add new player control panel
    var cp = document.getElementById('master_player_control_panel');

    outerNode = document.createElement('div');
    outerNode.className = "player_control";
    // Will need to validate out anything that cannot be an attribute value.
    outerNode.id = name.replace(/ /g, '_') + '_control_panel';

    nodeName = document.createElement('div');
    nodeName.className = "player_name";
    nodeName.textContent = name;

    nodeWallet = document.createElement('div');
    nodeWallet.className = "control_panel_wallet";

    walletLabel = document.createElement('div');
    walletLabel.textContent = "Wallet:";
    w = document.createElement('div');
    w.textContent = wallet;

    nodeWallet.appendChild(walletLabel);
    nodeWallet.appendChild(w);

    bidButton = document.createElement('input');
    bidButton.className = "bid_input_button";
    bidButton.type = "button";
    bidButton.value = "Bid";
    bidButton.setAttribute("onclick", "placeBid(this.parentElement)");

    outerNode.appendChild(nodeName);
    outerNode.appendChild(nodeWallet);
    outerNode.appendChild(bidButton);

    cp.append(outerNode);
    }
// Manual sort. Unused. Every row in queue is ID'd now.
// function getPlayerRowFromQueue(queue, name) {
//     // First element is the title row, and needs to be skipped.
//     var playerSearchElement = queue.firstElementChild;
//     var playerSortElement;
//     for (var i = 0; i < queue.childElementCount - 1; i++) {
//         playerSearchElement = playerSearchElement.nextElementSibling;
//         if (playerSearchElement.firstElementChild.textContent == name){
//             playerSortElement = playerSearchElement;
//             }
//         }
//     return playerSortElement;
//     }
function changeChampAndChallenger() {
    var queue = document.getElementById("queue");
    
    let nextPlayerQueue = queue.firstElementChild.nextElementSibling;
    let nextPlayerName = nextPlayerQueue.firstElementChild.textContent;
    let nextPlayerBid = nextPlayerQueue.firstElementChild.nextElementSibling.textContent;
    
    let secondPlayerQueue = nextPlayerQueue.nextElementSibling;
    let champQueue = document.getElementById("champ_queue");
    let challengerQueue = document.getElementById("challenger_queue");
    let champRowName = champQueue.firstElementChild.textContent;
    let challengerRowName = challengerQueue.firstElementChild.textContent;

    var champInput = document.getElementById("champ_radio_input");
    var challengerInput = document.getElementById("challenger_radio_input");
    var errorElement = document.getElementById("winner_error");
    // If queue is empty.
    if (queue.childElementCount == 1) {
        console.log("Queue is empty.");
        errorElement.textContent = "Queue is empty!";
        }
    // If both champ and challenger are empty.
    else if (champRowName == "Empty" && challengerRowName == "Empty") {
        errorElement.textContent = "";
        console.log("Both players are empty");
        
        champQueue.firstElementChild.textContent = nextPlayerName;
        champQueue.firstElementChild.nextElementSibling.textContent = nextPlayerBid;

        let secondPlayerName = secondPlayerQueue.firstElementChild.textContent;
        challengerQueue.firstElementChild.textContent = secondPlayerName;
        let secondPlayerBid = secondPlayerQueue.firstElementChild.nextElementSibling.textContent;
        challengerQueue.firstElementChild.nextElementSibling.textContent = secondPlayerBid;
        
        queue.removeChild(nextPlayerQueue);
        queue.removeChild(secondPlayerQueue);
        
        champInput.nextElementSibling.textContent = nextPlayerName;
        challengerInput.nextElementSibling.textContent = secondPlayerName;
        champInput.value = nextPlayerName;
        challengerInput.value = secondPlayerName;
        }
    // If champ is empty.
    // TODO put in more clear code lines, and shouldnt be a need for recalced, etc
    else if (champRowName == "Empty") {
        errorElement.textContent = "";
        console.log("Champ changes");
        champQueue.firstElementChild.textContent = challengerRowName;
        let oldChallengerBid = challengerQueue.firstElementChild.nextElementSibling.textContent;
        champQueue.firstElementChild.nextElementSibling.textContent = oldChallengerBid;

        challengerQueue.firstElementChild.textContent = nextPlayerName;
        challengerQueue.firstElementChild.nextElementSibling.textContent = nextPlayerBid;
        
        queue.removeChild(nextPlayerQueue);

        champInput.nextElementSibling.textContent = challengerRowName;
        challengerInput.nextElementSibling.textContent = nextPlayerName;
        champInput.value = challengerRowName;
        challengerInput.value = nextPlayerName;
        }
    // If challenger is empty {
    else if (challengerRowName == "Empty") {
        errorElement.textContent = "";
        challengerQueue.firstElementChild.textContent = nextPlayerName;
        challengerQueue.firstElementChild.nextElementSibling.textContent = nextPlayerBid;
        queue.removeChild(nextPlayerQueue);

        challengerInput.nextElementSibling.textContent = nextPlayerName;
        challengerInput.value = nextPlayerName;
          }
    else {
        errorElement.textContent = "Unspecified error in changeChampandChallenger";
        }
    
    }
