


let usernames = [];
let pairCount = 0;
let pgmstart = 0;
let id = 0;


  

  socket.emit('message', 'sending a message using sockets from the server' )

//   socket.on('addClient', (username) => {
    // const thePlayerName = {}
    // socket.user = username
    // thePlayerName['user'] = username;
    // thePlayerName['score'] = 0;
    // usernames.push(thePlayerName);
    // console.log('Adding a client with addClient', username);

    pairCount++;
    if (pairCount === 1 || pairCount >= 3) {
      id = Math.round((Math.random() * 1000000));
			socket.room = id;
			pairCount = 1;
			console.log(`Amout of players: ${pairCount} - Room Number: ${id}`);
			socket.join(id);
			pgmstart = 1;
    }
    if (pairCount === 2) {
      console.log(`Amout of players: ${pairCount} - Room Number: ${id}`);
        	socket.join(id);
          pgmstart = 2;
          console.log(`All the players are here: ${usernames.map(e => e.user)}`)
    }
  
  


  socket.join('rummet')
  // socket.emit('').to('rummet')

  socket.on('questions', (data) => {
    io.emit('question', data)
  }

  socket.on('join-game-as-host', () => {
    socket.on('start-game', data => {
      socket.broadcast.emit('game-started', 'asd')
    })
  })

  
  socket.on("disconnect", () => console.log("Client disconnected"));
})