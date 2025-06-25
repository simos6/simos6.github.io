document.addEventListener('DOMContentLoaded', () => {
    const habitInput = document.getElementById('habitInput');
    const addHabitBtn = document.getElementById('addHabitBtn');
    const habitList = document.getElementById('habitList');
    const resetTodayBtn = document.getElementById('resetTodayBtn');

    let habits = loadHabits();

    function saveHabits() {
        localStorage.setItem('habits', JSON.stringify(habits));
    }

    function loadHabits() {
        const storedHabits = localStorage.getItem('habits');
        if (storedHabits) {
            const parsedHabits = JSON.parse(storedHabits);
            // Ensure dailyCompletion status is updated for the current day
            const today = new Date().toDateString();
            return parsedHabits.map(habit => {
                if (habit.lastResetDate !== today) {
                    habit.completedToday = false;
                    habit.lastResetDate = today;
                }
                return habit;
            });
        }
        return [];
    }

    function renderHabits() {
        habitList.innerHTML = '';
        habits.forEach((habit, index) => {
            const listItem = document.createElement('li');
            listItem.classList.add('habit-item');

            const habitNameSpan = document.createElement('span');
            habitNameSpan.classList.add('habit-name');
            habitNameSpan.textContent = habit.name;
            listItem.appendChild(habitNameSpan);

            const controlsDiv = document.createElement('div');
            controlsDiv.classList.add('habit-controls');

            const completeBtn = document.createElement('button');
            completeBtn.classList.add('complete-btn');
            completeBtn.textContent = habit.completedToday ? 'Completed!' : 'Mark Done';
            if (habit.completedToday) {
                completeBtn.classList.add('completed');
            }
            completeBtn.addEventListener('click', () => toggleComplete(index));
            controlsDiv.appendChild(completeBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deleteHabit(index));
            controlsDiv.appendChild(deleteBtn);

            listItem.appendChild(controlsDiv);
            habitList.appendChild(listItem);
        });
    }

    function addHabit() {
        const habitName = habitInput.value.trim();
        if (habitName) {
            habits.push({
                name: habitName,
                completedToday: false,
                lastResetDate: new Date().toDateString()
            });
            habitInput.value = '';
            saveHabits();
            renderHabits();
        } else {
            alert('Please enter a habit!');
        }
    }

    function toggleComplete(index) {
        habits[index].completedToday = !habits[index].completedToday;
        habits[index].lastResetDate = new Date().toDateString(); // Update reset date to today
        saveHabits();
        renderHabits();
    }

    function deleteHabit(index) {
        if (confirm('Are you sure you want to delete this habit?')) {
            habits.splice(index, 1);
            saveHabits();
            renderHabits();
        }
    }

    function resetToday() {
        if (confirm('Are you sure you want to reset all habits for today?')) {
            const today = new Date().toDateString();
            habits = habits.map(habit => {
                habit.completedToday = false;
                habit.lastResetDate = today; // Update lastResetDate to ensure proper daily reset
                return habit;
            });
            saveHabits();
            renderHabits();
        }
    }

    addHabitBtn.addEventListener('click', addHabit);
    habitInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addHabit();
        }
    });
    resetTodayBtn.addEventListener('click', resetToday);

    // Initial render when the page loads
    renderHabits();
});
