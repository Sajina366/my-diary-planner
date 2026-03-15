// Diary Entry Management

// Open new diary modal
document.getElementById('newDiaryBtn').addEventListener('click', () => {
    openModal('diaryModal');
});

// Handle diary form submission
document.getElementById('diaryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const entry = {
        date: document.getElementById('diaryDate').value,
        mood: document.getElementById('diaryMood').value,
        title: document.getElementById('diaryTitle').value,
        content: document.getElementById('diaryContent').value
    };
    
    try {
        const response = await fetch('/api/diary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry)
        });
        
        if (response.ok) {
            alert('✅ Diary entry saved successfully!');
            document.getElementById('diaryForm').reset();
            closeModal('diaryModal');
            loadDiaryEntries();
        } else {
            alert('❌ Failed to save diary entry');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error saving diary entry');
    }
});

// Load and display diary entries
async function loadDiaryEntries() {
    try {
        const response = await fetch('/api/diary');
        const entries = await response.json();
        
        const diaryList = document.getElementById('diaryList');
        
        if (entries.length === 0) {
            diaryList.innerHTML = '<div class="empty-state"><div class="emoji">📔</div><p>No diary entries yet. Create your first entry!</p></div>';
            return;
        }
        
        diaryList.innerHTML = entries.map(entry => `
            <div class="item">
                <div class="item-header">
                    <div>
                        <span class="item-mood">${entry.mood || '📝'}</span>
                        <span class="item-title">${entry.title}</span>
                    </div>
                    <span class="item-date">${formatDate(entry.date)}</span>
                </div>
                <div class="item-content">${entry.content}</div>
                <div class="item-footer">
                    <button class="btn btn-danger btn-small" onclick="deleteDiaryEntry('${entry.id}')">🗑️ Delete</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading diary entries:', error);
        document.getElementById('diaryList').innerHTML = '<p>Error loading entries</p>';
    }
}

// Delete diary entry
async function deleteDiaryEntry(id) {
    if (confirm('Are you sure you want to delete this entry?')) {
        try {
            const response = await fetch(`/api/diary/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                alert('✅ Entry deleted successfully!');
                loadDiaryEntries();
            } else {
                alert('❌ Failed to delete entry');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Error deleting entry');
        }
    }
}