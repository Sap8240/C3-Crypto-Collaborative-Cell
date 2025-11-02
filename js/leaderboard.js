document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const top1Player = {
        username: document.querySelector('#top-1 .username'),
        volume: document.querySelector('#top-1 .metric-value'),
        avatar: document.querySelector('#top-1 .avatar')
    };
    const top2Player = {
        username: document.querySelector('#top-2 .username'),
        volume: document.querySelector('#top-2 .metric-value'),
        avatar: document.querySelector('#top-2 .avatar')
    };
    const top3Player = {
        username: document.querySelector('#top-3 .username'),
        volume: document.querySelector('#top-3 .metric-value'),
        avatar: document.querySelector('#top-3 .avatar')
    };

    const leaderboardBody = document.getElementById('leaderboard-body');
    
    // --- State for Tracking Updates ---
    const updatedPlayers = new Set(); // Stores names of players who just updated

    // --- Helper Functions ---

    function formatNumber(num) {
        return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function updateTopThree(topPlayers) {
        const [p1, p2, p3] = topPlayers;
        if (p1) {
            top1Player.username.textContent = p1.player;
            top1Player.volume.textContent = formatNumber(p1.volume);
            top1Player.avatar.src = p1.avatarUrl;
        }
        if (p2) {
            top2Player.username.textContent = p2.player;
            top2Player.volume.textContent = formatNumber(p2.volume);
            top2Player.avatar.src = p2.avatarUrl;
        }
        if (p3) {
            top3Player.username.textContent = p3.player;
            top3Player.volume.textContent = formatNumber(p3.volume);
            top3Player.avatar.src = p3.avatarUrl;
        }
    }

    function updateTable(allPlayers) {
        const userRow = leaderboardBody.querySelector('.user-row');
        
        // Keep track of which rows are currently expanded
        const activePlayer = leaderboardBody.querySelector('tr.active')?.dataset.player;
        
        leaderboardBody.innerHTML = ''; // Clear all
        leaderboardBody.appendChild(userRow); // Add 'You' row back

        allPlayers.forEach((player) => {
            const row = document.createElement('tr');
            row.dataset.player = player.player; // Add data attribute to identify
            
            // Add 'flash' class if this player was just updated
            if (updatedPlayers.has(player.player)) {
                row.classList.add('flash-update');
            }
            
            // Restore 'active' class if it was active before update
            if (activePlayer === player.player) {
                row.classList.add('active');
            }

            const coinIcon = `<span class="coin-icon"></span>`;
            row.innerHTML = `
                <td data-label="RANK">[${player.rank}]</td>
                <td data-label="PLAYER">${player.player}</td>
                <td data-label="WON">${formatNumber(player.won)} ${coinIcon}</td>
                <td data-label="TRADES">${player.trades}</td>
                <td data-label="WIN RATE">${player.winRate.toFixed(2)}%</td>
                <td data-label="VOLUME">${formatNumber(player.volume)} ${coinIcon}</td>
            `;
            leaderboardBody.appendChild(row);

            // NEW: Create the expandable details row
            const detailsRow = document.createElement('tr');
            detailsRow.className = 'player-details-row';
            detailsRow.innerHTML = `
                <td colspan="6">
                    <div class="player-details-content">
                        <div><strong>Wallet:</strong> ${player.wallet}</div>
                        <div><strong>Joined:</strong> ${player.joined}</div>
                        <button class="challenge-btn">Challenge</button>
                    </div>
                </td>
            `;
            leaderboardBody.appendChild(detailsRow);
        });
        
        // Clear the set after updates are rendered
        updatedPlayers.clear();
    }

    // Master function to update all data
    function updatePageData(allPlayers) {
        // Re-rank all players
        const rankedPlayers = allPlayers
            .sort((a, b) => b.won - a.won)
            .map((player, index) => ({
                ...player,
                rank: index + 1
            }));

        updateTopThree(rankedPlayers.slice(0, 3)); 
        updateTable(rankedPlayers);
    }

    // --- NEW: Click-to-Expand Event Listener ---
    leaderboardBody.addEventListener('click', (e) => {
        // Find the `tr` that was clicked
        const clickedRow = e.target.closest('tr');

        // Ignore clicks on details rows, user row, or outside a row
        if (!clickedRow || 
            clickedRow.classList.contains('player-details-row') || 
            clickedRow.classList.contains('user-row')) {
            return;
        }

        // Ignore clicks on the 'challenge' button itself
        if (e.target.classList.contains('challenge-btn')) {
            alert(`Challenging ${clickedRow.dataset.player}!`);
            return;
        }
        
        // Check if it's already active
        const wasActive = clickedRow.classList.contains('active');
        
        // Close all other active rows
        leaderboardBody.querySelectorAll('tr.active').forEach(row => {
            row.classList.remove('active');
        });

        // If it wasn't already active, open it
        if (!wasActive) {
            clickedRow.classList.add('active');
        }
    });


    // --- REAL-TIME SIMULATION ---
    let mockPlayers = [
        { player: 'marion_stiedemann', won: 3000.50, trades: 5, winRate: 34.07, volume: 1671.57, avatarUrl: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=marion', wallet: '0x...a1b2', joined: '2025-10-20' },
        { player: 'shannon_kautzer', won: 1950.20, trades: 5, winRate: 34.07, volume: 1671.57, avatarUrl: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=shannon', wallet: '0x...c3d4', joined: '2025-10-21' },
        { player: 'billy_mraz', won: 1800.00, trades: 5, winRate: 34.07, volume: 1671.57, avatarUrl: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=billy', wallet: '0x...e5f6', joined: '2025-10-22' },
        { player: 'bernadette_mclaugh', won: 5700.00, trades: 5, winRate: 34.07, volume: 1500.56, avatarUrl: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=bernadette', wallet: '0x...g7h8', joined: '2025-10-23' },
        { player: 'alberta_spencer', won: 1650.00, trades: 5, winRate: 34.07, volume: 1400.56, avatarUrl: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=alberta', wallet: '0x...i9j0', joined: '2025-10-24' },
        { player: 'leo_ruecker', won: 1500.00, trades: 5, winRate: 34.07, volume: 1300.56, avatarUrl: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=leo', wallet: '0x...k1l2', joined: '2025-10-25' },
        { player: 'rudolph_boehm', won: 1400.00, trades: 5, winRate: 34.07, volume: 1200.56, avatarUrl: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=rudolph', wallet: '0x...m3n4', joined: '2025-10-26' },
    ];

    function simulateDataUpdate() {
        const playerIndex = Math.floor(Math.random() * mockPlayers.length);
        
        // Update the data directly in the array
        mockPlayers[playerIndex].won += Math.random() * 100;
        mockPlayers[playerIndex].volume += Math.random() * 50;
        mockPlayers[playerIndex].trades += 1;
        
        // Add this player's name to the 'updated' set
        updatedPlayers.add(mockPlayers[playerIndex].player);
        
        // Call the master update function with a copy of the players array
        updatePageData([...mockPlayers]);
    }

    setInterval(simulateDataUpdate, 2000); // Update every 2 seconds
    updatePageData([...mockPlayers]); // Initial load
});