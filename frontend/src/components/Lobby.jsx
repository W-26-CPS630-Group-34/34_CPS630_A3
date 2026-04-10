function Lobby({ roomCode, players, isHost, onStartGame }) {

    return (
        <div>
            <h2>Lobby</h2>
            <p>Room code: <strong>{roomCode}</strong></p>
            <p>Players in room: {players.length}</p>
            <ul>
                {players.map((player) => (
                    <li key={player.id}>
                        {player.username}
                    </li>
                ))}
            </ul>

            {isHost ? (
                <button onClick={onStartGame}>Start Game</button>
            ) : (
                <p>Waiting for the host to start the game...</p>
            )}
        </div>
    );
}

export default Lobby;
