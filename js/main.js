// Singleton, master list of players and their relevant data. For now, they remain in the order they are added.
var playersArray = [];

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

    // Form variables, name and total amount of cash
    var playerName;
    var walletAmount;

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

    // Get the form entered information.
    playerName = form.elements["player_name"].value;
    walletAmount = form.elements["player_wallet"].value;

    // Create the player object.
    var p = new Player(playerName, parseInt(walletAmount));
    console.log(p.name, p.wallet);
    playersArray.push(p);

    // Create and add new player control panel  
    cp = document.getElementById('control_panel');
    outerNode = document.createElement('div');
    outerNode.className = "player_control";

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
    // 'this' grabs the input element
    bidButton.setAttribute("onclick", "placeBid(this.parentElement)");
    console.log(bidButton);

    outerNode.appendChild(nodeName);
    outerNode.appendChild(nodeWallet);
    outerNode.appendChild(bidButton);
    cp.appendChild(outerNode);
    }

function placeBid(playerControl) {
    // Grab the needed webpage elements
    var nameElement = playerControl.firstElementChild;
    var walletAmountElement = nameElement.nextElementSibling.firstElementChild.nextElementSibling;

    // for (var i = 0; i < playersArray.length; i ++) {
    //     var compare = (playersArray[i].name == nameElement.textContent);
    //     console.log('Compare', playersArray[i], nameElement.textContent, compare);
    // }

    // Get the player from the main data structure.
    var player = playersArray.find(function(o) {
        return o.name == nameElement.textContent;
        });
    console.log(player);

    // Calculate amount
    var w = parseInt(walletAmountElement.textContent, 10);
    var newWalletAmount = w - 1;

    // Update the web element and player data structure wallets
    walletAmountElement.textContent = newWalletAmount;
    player.wallet = newWalletAmount;

// If the player is not in the queue, create the new entry in the queue.
    var q = document.getElementById('queue');
    if (player.bid == 0) {
//        var q = document.getElementById('queue');
        outerNode = document.createElement('div');
        outerNode.className = "player_row";

        nodeName = document.createElement('div');
        nodeName.textContent = nameElement.textContent;

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
            if (qPlayer.firstElementChild.textContent == nameElement.textContent){
                qPlayer.firstElementChild.nextElementSibling.textContent = player.bid;
                var playerToSort = qPlayer;
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
