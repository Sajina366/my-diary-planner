// Meetings Management

// Open new meeting modal
document.getElementById('newMeetingBtn').addEventListener('click', () => {
    openModal('meetingsModal');
});

// Handle meeting form submission
document.getElementById('meetingForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const meeting = {
        title: document.getElementById('meetingTitle').value,
        date: document.getElementById('meetingDate').value,
        time: document.getElementById('meetingTime').value,
        location: document.getElementById('meetingLocation').value,
        participants: document.getElementById('meetingParticipants').value,
        notes: document.getElementById('meetingNotes').value
    };
    
    try {
        const response = await fetch('/api/meetings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(meeting)
        });
        
        if (response.ok) {
            alert('✅ Meeting saved successfully!');
            document.getElementById('meetingForm').reset();
            closeModal('meetingsModal');
            loadMeetings();
        } else {
            alert('❌ Failed to save meeting');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error saving meeting');
    }
});

// Load and display meetings
async function loadMeetings() {
    try {
        const response = await fetch('/api/meetings');
        const meetings = await response.json();
        
        const meetingsList = document.getElementById('meetingsList');
        
        if (meetings.length === 0) {
            meetingsList.innerHTML = '<div class="empty-state"><div class="emoji">🤝</div><p>No meetings scheduled. Create your first meeting!</p></div>';
            return;
        }
        
        meetingsList.innerHTML = meetings.map(meeting => `
            <div class="item">
                <div class="item-header">
                    <div>
                        <div class="item-title">🤝 ${meeting.title}</div>
                        <div style="color: #666; font-size: 0.9em; margin-top: 5px;">
                            📅 ${formatDate(meeting.date)} ⏰ ${meeting.time}
                        </div>
                    </div>
                </div>
                ${meeting.location ? `<div class="item-content"><strong>📍 Location:</strong> ${meeting.location}</div>` : ''}
                ${meeting.participants ? `<div class="item-content"><strong>👥 Participants:</strong> ${meeting.participants}</div>` : ''}
                ${meeting.notes ? `<div class="item-content"><strong>📝 Notes:</strong> ${meeting.notes}</div>` : ''}
                <div class="item-footer">
                    <button class="btn btn-danger btn-small" onclick="deleteMeeting('${meeting.id}')">🗑️ Delete</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading meetings:', error);
        document.getElementById('meetingsList').innerHTML = '<p>Error loading meetings</p>';
    }
}

// Delete meeting
async function deleteMeeting(id) {
    if (confirm('Are you sure you want to delete this meeting?')) {
        try {
            const response = await fetch(`/api/meetings/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                alert('✅ Meeting deleted successfully!');
                loadMeetings();
            } else {
                alert('❌ Failed to delete meeting');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Error deleting meeting');
        }
    }
}