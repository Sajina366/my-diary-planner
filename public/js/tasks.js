// Tasks Management

// Open new task modal
document.getElementById('newTaskBtn').addEventListener('click', () => {
    openModal('tasksModal');
});

// Handle task form submission
document.getElementById('taskForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const task = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        priority: document.getElementById('taskPriority').value,
        status: 'pending',
        due_date: document.getElementById('taskDueDate').value
    };
    
    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        });
        
        if (response.ok) {
            alert('✅ Task created successfully!');
            document.getElementById('taskForm').reset();
            closeModal('tasksModal');
            loadTasks();
        } else {
            alert('❌ Failed to create task');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error creating task');
    }
});

// Load and display tasks
async function loadTasks() {
    try {
        const response = await fetch('/api/tasks');
        const tasks = await response.json();
        
        const tasksList = document.getElementById('tasksList');
        
        if (tasks.length === 0) {
            tasksList.innerHTML = '<div class="empty-state"><div class="emoji">✅</div><p>No tasks yet. Create your first task!</p></div>';
            return;
        }
        
        tasksList.innerHTML = tasks.map(task => {
            const priorityClass = `priority-${task.priority.toLowerCase()}`;
            return `
                <div class="item">
                    <div class="item-header">
                        <div>
                            <div class="item-title">✅ ${task.title}</div>
                            <div style="margin-top: 5px;">
                                <span class="item-priority ${priorityClass}">${task.priority} Priority</span>
                                <span class="item-status ${task.status === 'completed' ? 'completed' : ''}">${task.status}</span>
                            </div>
                        </div>
                    </div>
                    ${task.description ? `<div class="item-content"><strong>📝 Description:</strong> ${task.description}</div>` : ''}
                    ${task.due_date ? `<div class="item-content"><strong>📅 Due Date:</strong> ${formatDate(task.due_date)}</div>` : ''}
                    <div class="item-footer">
                        <button class="btn btn-success btn-small" onclick="toggleTaskStatus('${task.id}', '${task.status}')">
                            ${task.status === 'completed' ? '↩️ Undo' : '✅ Complete'}
                        </button>
                        <button class="btn btn-danger btn-small" onclick="deleteTask('${task.id}')">🗑️ Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading tasks:', error);
        document.getElementById('tasksList').innerHTML = '<p>Error loading tasks</p>';
    }
}

// Toggle task status
async function toggleTaskStatus(id, currentStatus) {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    
    try {
        const response = await fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (response.ok) {
            loadTasks();
        } else {
            alert('❌ Failed to update task');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error updating task');
    }
}

// Delete task
async function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                alert('✅ Task deleted successfully!');
                loadTasks();
            } else {
                alert('❌ Failed to delete task');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Error deleting task');
        }
    }
}