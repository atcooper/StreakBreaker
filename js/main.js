function hello() {
  alert('Hello Cruel World');
  console.log("Hello, console. This is from the p tag.");
}

function cry() {
  console.log("Cry, no alert, input tag");
}

function addPlayer(form) {
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
    
  playerName = form.elements["player_name"].value;
  walletAmount = form.elements["player_wallet"].value;

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

  var nameElement = playerControl.firstElementChild;
  var walletAmountElement = nameElement.nextElementSibling.firstElementChild.nextElementSibling;
  var walletNumber = parseInt(walletAmountElement.textContent, 10);
  var newWalletAmount = walletNumber - 1;

  walletAmountElement.textContent = newWalletAmount;

// If the player is not in the queue, create the new entry in the queue.

  var q = document.getElementById('queue');
  outerNode = document.createElement('div');
  outerNode.className = "player_row";
 
  nodeName = document.createElement('div');
  nodeName.textContent = nameElement.textContent;

  nodeBid = document.createElement('div');
  nodeBid.textContent = 1;

  outerNode.appendChild(nodeName);
  outerNode.appendChild(nodeBid);

  q.appendChild(outerNode);

 }
