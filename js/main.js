"use strict";

// Singleton, master list of players and their relevant data. For now, they remain in the order they are added.
var playersArray = [];

var profit = 0;

// Player object. Assumed single game simplifies this structure, and no need to specify bid on creation.
function Player(n, w) {
    this.name = n;
    this.wallet = w;
    this.bid = 0;
    }

// Populating with test data.
playersArray.push(new Player('Player 1', 60));
playersArray.push(new Player('Player 2', 25));
playersArray.push(new Player('Player 3', 70));
playersArray[0].bid = 40;
playersArray[1].bid = 25;
playersArray[2].bid = 30;
// playersArray.forEach(function(x) {
//     console.log(x.name, x.wallet, x.bid);
// });

function addPlayer(form) {
    // Needs to check if player by the same name already exists.

    // Form variables, name and total amount of cash.
    var playerName;
    var walletAmount;

    // Player object to add to the global object, playersArray
    var p;

    // For grabbing the master control panel that houses all the user control
    // panels
    var cp;

    // Various containers for user control panel to be created
    var outerNode;
    var nodeName;
    var nodeWallet;

    // Wallet info, label and actual amount. This might be better as a single
    // string
    var walletLabel;
    var w;

    // Bid button that will be specific to the user
    var bidButton;

    // Get the form entered information, then create the player object, and add to the global, playersArray.
    playerName = form.elements["player_name"].value;
    walletAmount = form.elements["player_wallet"].value;
    p = new Player(playerName, parseInt(walletAmount));
    playersArray.push(p);
    console.log("Player object created:", p.name, p.wallet);

    // Create and add new player control panel
    cp = document.getElementById('control_panel');
    outerNode = document.createElement('div');
    outerNode.className = "player_control";
    // Will need to validate out anything that cannot be an attribute value.
    outerNode.id = playerName.replace(/ /g, '_') + '_control_panel';

    nodeName = document.createElement('div');
    nodeName.className = "player_name";
    nodeName.textContent = playerName;

    nodeWallet = document.createElement('div');
    nodeWallet.className = "control_panel_wallet";

    walletLabel = document.createElement('div');
    walletLabel.textContent = "Wallet:";
    w = document.createElement('div');
    w.textContent = walletAmount;

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
    cp.appendChild(outerNode);
    console.log("Player control panel created:", outerNode);
    }

// Need to clean this function up a bunch. Started in, and pulling all the variables I can to the top first.
function placeBid(playerControl) {
    // Pull the name from the control, then pull the object from playersArray.
    var name = playerControl.firstElementChild.textContent;
    var player = findPlayer(name);

    // Wallet in player control for updating.
    var walletAmountElement = playerControl.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling;
    
    console.log("wallet element:", walletAmountElement);
    var w = player.wallet;
    var newWalletAmount = w - 1;

    // Update the web element and player data structure wallets
    walletAmountElement.textContent = newWalletAmount;
    player.wallet = newWalletAmount;

    var playerToSort;
// If the player is not in the queue, create the new entry in the queue.
    var q = document.getElementById('queue');
    if (player.bid == 0) {
//        var q = document.getElementById('queue');
        var outerNode, nodeName, nodeBid;

        
        outerNode = document.createElement('div');
        outerNode.className = "player_row";
        outerNode.id = name.replace(/ /g, '_') + 'queue';
p
        nodeName = document.createElement('div');
        nodeName.textContent = name;

        nodeBid = document.createElement('div');
        nodeBid.textContent = 1;

        outerNode.appendChild(nodeName);
        outerNode.appendChild(nodeBid);

        q.appendChild(outerNode);

        player.bid = 1;
        }
    else {
        player.bid = player.bid + 1;
//        console.log(q);
        var qPlayer = q.firstElementChild;
        for (var i = 0; i < q.childElementCount - 1; i++) {
            qPlayer = qPlayer.nextElementSibling;
//            console.log(qPlayer);
            if (qPlayer.firstElementChild.textContent == name){
                qPlayer.firstElementChild.nextElementSibling.textContent = player.bid;
                playerToSort = qPlayer;
                }
            }
        }
    // Finally, sort queue. Assume the top player is not bidding.
    var previousPlayer = playerToSort.previousElementSibling;
    var sortingQueue = [];
    console.log(playerToSort);
    console.log(previousPlayer);

    if (previousPlayer.firstElementChild.nextElementSibling.textContent < playerToSort.firstElementChild.nextElementSibling.textContent) {
        console.log("Exceeded bid. Time to move up the queue.");
        sortingQueue.push(previousPlayer);
        while (playerToSort.nextElementSibling != null) {
            sortingQueue.push(playerToSort.nextElementSibling);
            q.removeChild(playerToSort.nextElementSibling);
            }
        for (var i = 0; i < sortingQueue.length; i++) {
            q.appendChild(sortingQueue[i]);
            }
        }
    }
function declareWinner(form) {
    var playerSelected = form.elements["versus"].value;
    
    if (playerSelected == "") {
//        console.log("Empty player selected in win declare.");
        document.getElementById("winner_error").textContent = "Error!";
        }
    else {
        document.getElementById("winner_error").textContent = "";

        // Have to add loss of bid to loser and removal from queue as well as updating their bid value in their global object. Also have to update the wallet amounts in player control.
        let playersRadioArray = form.elements["versus"];
        let champObject = findPlayer(playersRadioArray[0].value);
        let challengerObject = findPlayer(playersRadioArray[1].value);
        console.log(champObject, challengerObject);

        var bountyElement = document.getElementById("bounty_amount_element");
        let bounty = parseInt(bountyElement.textContent);
        
        if (playersRadioArray[0].checked) {
            console.log("Champ branch selected");
            let bid = challengerObject.bid;
            let newWallet = champObject.wallet + bid * (1/4);
            let newBounty = bounty + bid * (1/4);
            let newProfit = profit + bid * (1/2);

            champObject.wallet = newWallet;
            bountyElement.textContent = newBounty;
            profit = newProfit;
            }
        else {
            console.log("Challenger selected");
            let bid = champObject.bid;
            let newWallet = challengerObject.wallet + bounty + bid * (1/4);
            let newBounty = bid * (1/4);
            let newProfit = profit + bid * (1/2);

            challengerObject.wallet = newWallet;
            bountyElement.textContent = newBounty;
            profit = newProfit;
            }
        console.log("Final player objects:", champObject, challengerObject);

//        form.reset();
        }
    }
function findPlayer(name) {
    var player = playersArray.find(function(o) {
        return o.name == name;
        });
    return player;
    }
function logPlayersArray() {
    console.log("Players array:");
    for (var i = 0; i < playersArray.length; i++) {
        var p = playersArray[i];
        console.log(p.name, p.wallet, p.bid);
        }
    }
