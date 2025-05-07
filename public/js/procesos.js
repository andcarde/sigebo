
// procesos.js
'use strict';

$(document).ready(function () {
    const $selectedDateEl = $('#selected-date');
    const $taskListEl = $('#task-list');
    const $taskInputEl = $('#task-name');
    const tasksByDate = {};
    let selectedDate = new Date();

    displaySelectedDate();
    renderTasks();

    $('#prev-day').on('click', function () {
        changeDate(-1);
    });

    $('#next-day').on('click', function () {
        changeDate(1);
    });

    $('#add-task').on('click', addTask);

    function displaySelectedDate() {
        $selectedDateEl.text(selectedDate.toDateString());
    }

    function changeDate(days) {
        selectedDate.setDate(selectedDate.getDate() + days);
        displaySelectedDate();
        renderTasks();
    }

    function addTask() {
        const taskName = $taskInputEl.val().trim();
        if (!taskName) return;

        const dateKey = selectedDate.toDateString();
        if (!tasksByDate[dateKey]) {
            tasksByDate[dateKey] = [];
        }

        tasksByDate[dateKey].push(taskName);
        $taskInputEl.val('');
        renderTasks();
    }

    function renderTasks() {
        const dateKey = selectedDate.toDateString();
        $taskListEl.empty();

        if (!tasksByDate[dateKey] || tasksByDate[dateKey].length === 0) {
            $taskListEl.html('<p>No hay tareas asignadas para este día.</p>');
            return;
        }

        tasksByDate[dateKey].forEach((task, index) => {
            const $taskEl = $(`
                <div class="task-item">
                    <span>${task}</span>
                    <button class="delete-task-btn">Eliminar</button>
                </div>
            `);

            $taskEl.find('.delete-task-btn').on('click', function () {
                deleteTask(dateKey, index);
            });

            $taskListEl.append($taskEl);
        });
    }

    function deleteTask(dateKey, taskIndex) {
        tasksByDate[dateKey].splice(taskIndex, 1);
        renderTasks();
    }
});