//////////////////********************VARIABLE DECLERATION*******************///////////////
var move = 1;
var play = true;
var first;
var second;
var start;
var p1score=0;
var p2score=0;
var game_mode;
var p1name;
var p2name;
var virtual_arena = [0, 1, 2, 3, 4, 5, 6, 7, 8];
var w=document.querySelector("#Select_mode");
var m=document.querySelector("#message");
var x=document.querySelector("#Select_start");
var p1=document.querySelector("#score1");
var p2=document.querySelector("#score2");
var y=document.querySelectorAll("td");
var b1=document.querySelector("#reset");
var b2=document.querySelector("#new");
var player1=document.querySelector("#player1");
var player2=document.querySelector("#player2");
var score=document.getElementsByClassName('score');
///////////////****************EVENT LISTENERS*******************//////////////////
w.addEventListener("change",mode);
x.addEventListener("change",start);
b1.addEventListener("click",reset);
b2.addEventListener("click",newgame);
for(var i=0 ; i<y.length ;i++)
{
	y[i].addEventListener("click",type);
}
////////////**************************START WITH***************////////////////
function start()
{
	if(x.value=='O')
	{
	first='O';
	second='X';
  }
	else if(x.value=='X')
	{
	first='X';
	second='O';
	}
}
////////////**************************GameMode***************////////////////
function mode()
{
	if(w.value=='Single-player')
	{
  game_mode='Single-player';
	p1name=prompt("Enter Player name :");
	player1.textContent= p1name + " score : ";
	p2name="Computer";
	player2.textContent= p2name + " score : ";
	start=prompt("Who will move first "+ p1name + " or " + "computer ? *Type any one exactly displayed*");
	if(start=="computer")
	{
		x.selectedIndex = 1;
		second='X';
		first='O';
		y[4].textContent='X';
		virtual_arena[4]=p2name;
		move++;
	}
	m.textContent= p1name + " turn";
  }
	else if(w.value=='Multiplayer')
	{
  game_mode='Multiplayer';
	p1name=prompt("Enter Player 1 name :");
	p2name=prompt("Enter Player 2 name :");
	if(p1name==p2name)
	{
	alert("You cannot set same name for both players. Set Again");
	p1name=prompt("Enter Player 1 name :");
	p2name=prompt("Enter Player 2 name :");
  }
	player1.textContent= p1name + " score : ";
	player2.textContent= p2name + " score : ";
	m.textContent= p1name + " turn";
  }
	score[0].style.visibility = "visible";
	score[1].style.visibility = "visible";
}
//////////**********************MOVE ON BOARD******************////////////////////////
function type()
{
	if(x.value=='0' || w.value=='0')           /////***************Details not filled*********************////
	{
		alert("Fill the required details");
	}
	else if(game_mode=='Multiplayer')     /////***************MULTI-PLAYER MODE*********************////
	{
		if (virtual_arena[this.id] != p1name && virtual_arena[this.id] != p2name && play)
		{
			if ((move % 2) == 1)
			{
			  this.textContent=first;
				virtual_arena[this.id] = p1name;
			  m.textContent= p2name + " turn";
			}
			else
			{
			  this.textContent=second;
				virtual_arena[this.id] = p2name;
			  m.textContent= p1name + " turn";
			}
			if (winning(virtual_arena, p1name))
			{
			    m.textContent= p1name + " wins";
					p1score++;
					p1.textContent=p1score;
			    m.style.color="green";
					play=false;
			}
			else if(winning(virtual_arena, p2name))
			{
			    m.textContent=p2name + " wins";
					p2score++;
					p2.textContent=p2score;
			    m.style.color="green";
					play=false;
			}
			else if(move==9)
			{
				  m.textContent="No one wins";
				  m.style.color="red";
			}
			move++;
		}
	}
  else     /////////////***************SINGLE PLAYER MODE*********************//////////////
	{
		if (virtual_arena[this.id] != p1name && virtual_arena[this.id] != p2name && play)
		{
	    move++;
			virtual_arena[this.id] = p1name;
	    this.textContent=first;
			if (winning(virtual_arena, p1name))
			{
					m.textContent= p1name + " wins";
					m.style.color="green";
					p1score++;
					p1.textContent=p1score;
					play=false;
			}
      else if (move > 9)
			{
	      m.textContent="No one wins";
				m.style.color="red";
				play=false;
			}
	    else
			{
	      move++;
	      var index = minimax(virtual_arena, p2name).index;
				var selector = `${index}`;
				virtual_arena[index] = p2name;
	      document.getElementById(selector).textContent=second;
	      if (winning(virtual_arena, p2name))
				{
	          m.textContent= p2name + " wins";
						m.style.color="green";
						p2score++;
						p2.textContent=p2score;
						play=false;
				}
				else if (move === 1)
				{
	          m.textContent="No one wins";
						m.style.color="red";
						play=false;
				}
	     }
	  }
	}
}
////////////************EMPTY SPACES FIND**********************8//////////////
function refine(newboard)
{
  return newboard.filter(s => s != p1name && s != p2name);
}
///////////**************MINIMAX ALGORITHM********************/////////
function minimax(newboard, player)
{
  let array = refine(newboard);
  if (winning(newboard, p1name))
	{
    return {
      score: -10
		};
  }
	else if (winning(newboard, p2name))
	{
    return {
      score: 10
    };
  }
	else if (array.length === 0)
	{
    return {
      score: 0
    };
  }
	var moves = [];
	for (var i = 0; i < array.length; i++)
	{
		var move = {};
		move.index = newboard[array[i]];
		newboard[array[i]] = player;

		if (player == p2name)
		{
			var g = minimax(newboard, p1name);
			move.score = g.score;
		}
		else
		{
			var g = minimax(newboard, p2name);
			move.score = g.score;
		}
		newboard[array[i]] = move.index;
		moves.push(move);
	}
  var bestMove;
  if (player === p2name)
	{
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++)
		{
      if (moves[i].score > bestScore)
			{
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
	else
	{
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++)
		{
      if (moves[i].score < bestScore)
			{
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}
/////////////////******************WINNER******************////////////////////////
function winning(virtual_arena, player)
{
	///ROW CHECK
	for(var i=0;i<=6;i=i+3)
	{
	if (virtual_arena[i] == player && virtual_arena[i+1] == player && virtual_arena[i+2] == player)
	 return true;
	}
	///COLUMN CHECK
	for(var i=0;i<=2;i++)
	{
	if (virtual_arena[i] == player && virtual_arena[i+3] == player && virtual_arena[i+6] == player)
	 return true;
	}
	///DIAGONAL CHECK
  if((virtual_arena[0] == player && virtual_arena[4] == player && virtual_arena[8] == player) ||
	   (virtual_arena[2] == player && virtual_arena[4] == player && virtual_arena[6] == player))
  return true;

	return false;
}
/////////////////******************RESET BOARD******************////////////////////////
function reset()
{
	for(var i=0;i<9;i++)
	y[i].textContent="";
  m.textContent= p1name + " turn";
	m.style.color="#232323";
  play=true;
  move=1;
  virtual_arena = [0, 1, 2, 3, 4, 5, 6, 7, 8];
	if(start=="computer")
	{
		x.selectedIndex = 1;
		second='X';
		first='O';
		y[4].textContent='X';
		virtual_arena[4]=p2name;
		move++;
	}
}
//////////////////////**********************NEW GAME***********************////////////////////////
function newgame()
{
  reset();
	for(var i=0;i<9;i++)
	y[i].textContent="";
	virtual_arena = [0, 1, 2, 3, 4, 5, 6, 7, 8];
	move=1;
	p1score=0;
	p2score=0;
	m.textContent="Select game mode and symbol";
	p1.textContent='0';
	p2.textContent='0';
  w.selectedIndex = 0;
	x.selectedIndex = 0;
	player1.textContent="Player 1 score : ";
	player2.textContent="Player 2 score : ";
	score[0].style.visibility = "hidden";
	score[1].style.visibility = "hidden";
}
