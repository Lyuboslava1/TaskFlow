const translations = {
    bg: {
        subtitle: "Днешен преглед",
        "progress-title": "Изпълнение на задачите",
        "input-placeholder": "Какво трябва да се направи?",
        "topic-placeholder": "Категория (по избор)",
        "opt-low": "Нисък",
        "opt-medium": "Среден",
        "opt-high": "Висок",
        "due-date-title": "Краен срок",
        "details-toggle-title": "Покажи / скрий детайли",
        "btn-add": "Добави",
        "tab-active": "Активни",
        "tab-history": "Архив",
        "drag-hint": "Придърпайте задачите, за да ги пренаредите",
        "btn-clear": "Изчисти всичко",
        "player-title": "Плейлист",
        "player-toggle-title": "Минимизиране / Разширяване",
        "modal-title": "Редактиране на задача",
        "modal-label-title": "Заглавие:",
        "modal-label-topic": "Категория:",
        "modal-label-priority": "Приоритет:",
        "modal-label-date": "Краен срок:",
        "btn-cancel": "Отказ",
        "btn-save": "Запази",
        "confirm-delete": "Сигурни ли сте, че искате да изтриете тази задача?",
        "confirm-delete-yes": "Да, изтрий",
        "confirm-delete-no": "Отказ",
        "playlist-placeholder": "Поставете Spotify Playlist линк...",
        "playlist-hint-text": "Искаш ли да слушаш любимата си музика, кликни тук",

        "tooltip-edit": "Редактиране",
        "tooltip-archive": "Премести в архив",
        "tooltip-delete": "Изтрий",
        "tooltip-restore": "Възстанови в активни",
        "tooltip-delete-perm": "Изтрий завинаги",
        "tooltip-complete": "Кликнете за изпълнение",

        "toast-empty": "Моля, въведете текст на задачата!",
        "toast-emptyList": "Няма задачи за изчистване!",
        "toast-added": "Задачата е добавена успешно!",
        "toast-edit-empty": "Заглавието не може да бъде празно!",
        "toast-saved": "Промените бяха запазени!",
        "toast-completed": "Браво! Задачата е изпълнена.",
        "toast-uncompleted": "Задачата е върната в активни.",
        "toast-archived": "Задачата е преместена в архив.",
        "toast-restored": "Задачата е възстановена.",
        "toast-deleted": "Задачата е изтрита.",
        "toast-cleared": "Изгледът е изчистен.",
        "confirm-clear": "Сигурни ли сте, че искате да изчистите задачите в този изглед?"
    },
    en: {
        subtitle: "Today's Overview",
        "progress-title": "Task Completion",
        "input-placeholder": "What needs to be done?",
        "topic-placeholder": "Category (optional)",
        "opt-low": "Low",
        "opt-medium": "Medium",
        "opt-high": "High",
        "due-date-title": "Due Date",
        "details-toggle-title": "Show / hide details",
        "btn-add": "Add",
        "tab-active": "Active",
        "tab-history": "Archive",
        "drag-hint": "Drag tasks to reorder them",
        "btn-clear": "Clear All",
        "player-title": "Playlist",
        "player-toggle-title": "Minimize / Expand",
        "modal-title": "Edit Task",
        "modal-label-title": "Task Title:",
        "modal-label-topic": "Category:",
        "modal-label-priority": "Priority:",
        "modal-label-date": "Due Date:",
        "btn-cancel": "Cancel",
        "btn-save": "Save Changes",
        "confirm-delete": "Are you sure you want to delete this task?",
        "confirm-delete-yes": "Yes, delete",
        "confirm-delete-no": "Cancel",
        "playlist-placeholder": "Paste Spotify Playlist link...",
        "playlist-hint-text": "Want to listen to your favorite music? Click here",

        "tooltip-edit": "Edit Task",
        "tooltip-archive": "Move to Archive",
        "tooltip-delete": "Delete",
        "tooltip-restore": "Restore to Active",
        "tooltip-delete-perm": "Delete Permanently",
        "tooltip-complete": "Click to complete/incomplete",

        "toast-empty": "Please enter a task text!",
        "toast-emptyList": "No tasks to clear!",
        "toast-added": "Task added successfully!",
        "toast-edit-empty": "Task title cannot be empty!",
        "toast-saved": "Changes saved successfully!",
        "toast-completed": "Great job! Task completed.",
        "toast-uncompleted": "Task moved back to active.",
        "toast-archived": "Task moved to archive.",
        "toast-restored": "Task restored successfully.",
        "toast-deleted": "Task deleted.",
        "toast-cleared": "View cleared.",
        "confirm-clear": "Are you sure you want to clear tasks in this view?"
    }
};


let tasks = JSON.parse(localStorage.getItem('tasksflow_tasks')) || [];
let activeTab = 'active';
let currentEditingTaskId = null;
let currentLang = localStorage.getItem('tasksflow_lang') || 'bg';
let taskToDeleteId = null;
let viewToClear = null;
let hintDismissed = localStorage.getItem('tasksflow_hint_dismissed') === '1';
const completionSound = new Audio('./completed.mp3');

const TASKS_PER_PAGE = 6;
const pages = { active: 1, history: 1 };
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
let suppressClickUntil = 0;

const CATEGORY_PALETTE = [
    { bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' },
    { bg: '#fef3c7', color: '#b45309', border: '#fde68a' },
    { bg: '#dcfce7', color: '#15803d', border: '#bbf7d0' },
    { bg: '#f3e8ff', color: '#7e22ce', border: '#e9d5ff' },
    { bg: '#fce7f3', color: '#be185d', border: '#fbcfe8' },
    { bg: '#e0e7ff', color: '#4338ca', border: '#c7d2fe' },
    { bg: '#ccfbf1', color: '#0f766e', border: '#99f6e4' },
    { bg: '#ffedd5', color: '#c2410c', border: '#fed7aa' }
];


const inputBox = document.getElementById('input-box');
const topicBox = document.getElementById('topic-box');
const prioritySelect = document.getElementById('priority-select');
const dateBox = document.getElementById('date-box');
const inputSection = document.getElementById('input-section');
const activeList = document.getElementById('list-container');
const historyList = document.getElementById('history-container');
const progressFill = document.getElementById('progress-fill');
const progressPercent = document.getElementById('progress-percent');
const activeCount = document.getElementById('active-count');
const historyCount = document.getElementById('history-count');
const topicList = document.getElementById('topic-list');

const editModal = document.getElementById('edit-modal');
const editTextInput = document.getElementById('edit-text-input');
const editTopicInput = document.getElementById('edit-topic-input');
const editPrioritySelect = document.getElementById('edit-priority-select');
const editDateInput = document.getElementById('edit-date-input');
const deleteModal = document.getElementById('delete-confirm-modal');
const confirmDeleteYes = document.getElementById('btn-confirm-yes');
const confirmDeleteNo = document.getElementById('btn-confirm-no');
const clearModal = document.getElementById('clear-confirm-modal');
const clearYesBtn = document.getElementById('btn-clear-yes');
const clearNoBtn = document.getElementById('btn-clear-no');



applyLanguage();

if (hintDismissed) {
    const hint = document.getElementById('playlist-hint');
    if (hint) hint.style.display = 'none';
}

const savedPlaylist = localStorage.getItem('tasksflow_spotify_playlist');
if (savedPlaylist) {
    const iframe = document.getElementById('spotify-iframe');
    if (iframe) iframe.src = savedPlaylist;
}

inputBox.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });
topicBox.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });

confirmDeleteYes.addEventListener('click', () => {
    if (taskToDeleteId === null) return;
    tasks = tasks.filter(task => task.id !== taskToDeleteId);
    saveAndRender();
    deleteModal.classList.add('hidden');
    taskToDeleteId = null;
    showToast('toast-deleted', 'success');
});

confirmDeleteNo.addEventListener('click', () => {
    deleteModal.classList.add('hidden');
    taskToDeleteId = null;
});

clearYesBtn.addEventListener('click', () => {
    tasks = viewToClear === 'active'
        ? tasks.filter(task => task.archived)
        : tasks.filter(task => !task.archived);
    saveAndRender();
    clearModal.classList.add('hidden');
    showToast('toast-cleared', 'info');
});

clearNoBtn.addEventListener('click', () => clearModal.classList.add('hidden'));

renderTasks();
setupDragAndDrop();
setupTouchDrag();

const detailsBtn = document.getElementById('toggle-details-btn');
const detailsGroup = document.querySelector('.input-group');

detailsBtn.addEventListener('click', () => {
    const collapsed = detailsGroup.classList.toggle('details-collapsed');
    detailsBtn.setAttribute('aria-expanded', String(!collapsed));
});


function toggleLanguage() {
    currentLang = currentLang === 'bg' ? 'en' : 'bg';
    localStorage.setItem('tasksflow_lang', currentLang);
    applyLanguage();
    renderTasks();
}

function applyLanguage() {
    document.getElementById('html-root').lang = currentLang;
    document.getElementById('lang-label').textContent = currentLang === 'bg' ? 'EN' : 'BG';

    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[currentLang][key]) el.textContent = translations[currentLang][key];
    });

    document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
        const key = el.getAttribute('data-translate-placeholder');
        if (translations[currentLang][key]) el.placeholder = translations[currentLang][key];
    });

    document.querySelectorAll('[data-translate-title]').forEach(el => {
        const key = el.getAttribute('data-translate-title');
        if (translations[currentLang][key]) el.title = translations[currentLang][key];
    });

    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const localeStr = currentLang === 'bg' ? 'bg-BG' : 'en-US';
    document.getElementById('current-date').textContent = new Date().toLocaleDateString(localeStr, dateOptions);
}


function showToast(key, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = './images/mark.png';
    if (type === 'info') icon = './images/information.png';
    if (type === 'warning') icon = './images/alert.png';
    if (type === 'error') icon = './images/close.png';

    const message = translations?.[currentLang]?.[key] ?? key;

    const img = document.createElement('img');
    img.src = icon;
    img.className = 'toast-icon';
    img.width = 30;
    img.height = 30;
    img.alt = '';

    const span = document.createElement('span');
    span.textContent = message;

    toast.append(img, span);

    toast.onclick = () => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 200);
    };

    container.appendChild(toast);

    setTimeout(() => {
        if (toast.isConnected) {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }
    }, 400);
}


function normalizeTopic(topic) {
    return (topic || '').trim();
}

function getCategoryStyle(topic) {
    const clean = normalizeTopic(topic).toLowerCase();
    let hash = 0;
    for (let i = 0; i < clean.length; i++) {
        hash = (hash * 31 + clean.charCodeAt(i)) >>> 0;
    }
    return CATEGORY_PALETTE[hash % CATEGORY_PALETTE.length];
}

function createCategoryBadgeHTML(topic) {
    const clean = normalizeTopic(topic);
    if (!clean) return '';
    const palette = getCategoryStyle(clean);
    return `<span class="badge badge-category" style="background-color:${palette.bg};color:${palette.color};border:1px solid ${palette.border};">${escapeHTML(clean)}</span>`;
}

function getView(tab) {
    const archived = tab === 'history';
    return tasks.filter(t => !!t.archived === archived);
}

function updateTopicList() {
    const names = new Set();
    tasks.forEach(t => {
        const clean = normalizeTopic(t.topic);
        if (clean) names.add(clean);
    });
    if (!topicList) return;
    topicList.innerHTML = '';
    names.forEach(n => {
        const opt = document.createElement('option');
        opt.value = n;
        topicList.appendChild(opt);
    });
}


function addTask() {
    const text = inputBox.value.trim();
    if (!text) {
        showToast('toast-empty', 'warning');
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        topic: normalizeTopic(topicBox.value),
        priority: prioritySelect.value,
        dueDate: dateBox.value,
        completed: false,
        archived: false
    };

    tasks.unshift(newTask);
    pages.active = 1;

    inputBox.value = '';
    topicBox.value = '';
    dateBox.value = '';
    prioritySelect.value = 'low';

    saveAndRender();
    showToast('toast-added', 'success');
}

function openEditModal(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    currentEditingTaskId = id;
    editTextInput.value = task.text;
    editTopicInput.value = task.topic || '';
    editPrioritySelect.value = task.priority;
    editDateInput.value = task.dueDate || '';

    editModal.classList.remove('hidden');
}

function closeEditModal() {
    editModal.classList.add('hidden');
    currentEditingTaskId = null;
}

function saveTaskEdit() {
    const newText = editTextInput.value.trim();
    if (!newText) {
        showToast('toast-edit-empty', 'warning');
        return;
    }
    if (!currentEditingTaskId) return;

    tasks = tasks.map(task => task.id === currentEditingTaskId
        ? {
            ...task,
            text: newText,
            topic: normalizeTopic(editTopicInput.value),
            priority: editPrioritySelect.value,
            dueDate: editDateInput.value
        }
        : task);

    saveAndRender();
    closeEditModal();
    showToast('toast-saved', 'success');
}

function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    task.completed = !task.completed;
    if (task.completed) {
        playCompletionSound();
        showToast('toast-completed', 'success');
    } else {
        showToast('toast-uncompleted', 'info');
    }
    saveAndRender();
}

function archiveTask(id) {
    tasks = tasks.map(task => task.id === id ? { ...task, archived: true } : task);
    saveAndRender();
    showToast('toast-archived', 'info');
}

function restoreTask(id) {
    tasks = tasks.map(task => task.id === id ? { ...task, archived: false, completed: false } : task);
    saveAndRender();
    showToast('toast-restored', 'success');
}

function deleteTask(id) {
    taskToDeleteId = id;
    const textEl = document.getElementById('delete-confirm-text');

    textEl.textContent = translations[currentLang]['confirm-delete'];
    confirmDeleteYes.textContent = translations[currentLang]['confirm-delete-yes'];
    confirmDeleteNo.textContent = translations[currentLang]['confirm-delete-no'];

    deleteModal.classList.remove('hidden');
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    const date = new Date(year, month - 1, day);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const localeStr = currentLang === 'bg' ? 'bg-BG' : 'en-US';
    return date.toLocaleDateString(localeStr, options);
}


function switchTab(tab) {
    activeTab = tab;
    document.getElementById('tab-active').classList.toggle('active', tab === 'active');
    document.getElementById('tab-history').classList.toggle('active', tab === 'history');

    if (tab === 'active') {
        activeList.classList.remove('hidden-view');
        historyList.classList.add('hidden-view');
        inputSection.classList.remove('hidden');
    } else {
        activeList.classList.add('hidden-view');
        historyList.classList.remove('hidden-view');
        inputSection.classList.add('hidden');
    }
    renderPager();
}

function totalPagesFor(tab) {
    const count = tasks.filter(t => !!t.archived === (tab === 'history')).length;
    return Math.max(1, Math.ceil(count / TASKS_PER_PAGE));
}

function goToPage(page) {
    pages[activeTab] = Math.min(Math.max(1, page), totalPagesFor(activeTab));
    renderTasks();
}

function renderPager() {
    const pager = document.getElementById('pages-bar');
    if (!pager) return;

    const total = totalPagesFor(activeTab);
    const current = pages[activeTab];

    pager.style.display = total > 1 ? 'flex' : 'none';
    document.getElementById('pages-info').textContent = `${current} / ${total}`;
    document.getElementById('page-prev').disabled = current <= 1;
    document.getElementById('page-next').disabled = current >= total;
}


function renderTaskList(container, tab) {
    const isActive = tab === 'active';
    const view = getView(tab);

    pages[tab] = Math.min(pages[tab], totalPagesFor(tab));
    const start = (pages[tab] - 1) * TASKS_PER_PAGE;
    const pageItems = view.slice(start, start + TASKS_PER_PAGE);

    container.innerHTML = '';

    if (view.length === 0) {
        const emptyLi = document.createElement('li');
        emptyLi.className = 'empty-state';
        const img = isActive ? 'active-empty.png' : 'archive-empty.png';
        const msg = isActive
            ? (currentLang === 'bg' ? 'Няма активни задачи засега!' : 'No active tasks yet!')
            : (currentLang === 'bg' ? 'Архивът е празен.' : 'Archive is empty.');
        emptyLi.innerHTML = `
            <img src="./images/${img}" width="80" height="80" style="opacity: 0.3;" alt="">
            <p style="margin-top: 20px">${msg}</p>
        `;
        container.appendChild(emptyLi);
        return;
    }

    pageItems.forEach(task => {
        container.appendChild(isActive ? createActiveTaskElement(task) : createHistoryTaskElement(task));
    });
}

function renderTasks() {
    renderTaskList(activeList, 'active');
    renderTaskList(historyList, 'history');
    renderPager();
    updateTopicList();

    const activeTasks = tasks.filter(t => !t.archived);
    const archivedTasks = tasks.filter(t => t.archived);

    activeCount.textContent = activeTasks.length;
    historyCount.textContent = archivedTasks.length;

    const total = activeTasks.length;
    const completedCount = activeTasks.filter(t => t.completed).length;
    const percent = total === 0 ? 0 : Math.round((completedCount / total) * 100);
    progressFill.style.width = `${percent}%`;
    progressPercent.textContent = `${percent}%`;
}

function translatePriority(p) {
    if (p === 'low') return currentLang === 'bg' ? 'нисък' : 'low';
    if (p === 'medium') return currentLang === 'bg' ? 'среден' : 'medium';
    if (p === 'high') return currentLang === 'bg' ? 'висок' : 'high';
    return p;
}

function createActiveTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item priority-${task.priority} ${task.completed ? 'completed' : ''}`;
    li.draggable = !isTouchDevice;
    li.dataset.id = task.id;

    const tEdit = translations[currentLang]['tooltip-edit'];
    const tArch = translations[currentLang]['tooltip-archive'];
    const tDel = translations[currentLang]['tooltip-delete'];
    const tComp = translations[currentLang]['tooltip-complete'];
    const categoryBadge = createCategoryBadgeHTML(task.topic);

    li.innerHTML = `
        <div class="task-content" title="${tComp}">
            <div class="custom-checkbox">
                ${task.completed ? '<img src="./images/check-box.png" width="27" height="27" alt="">' : ''}
            </div>
            <div class="task-text-group">
                <span class="task-title">${escapeHTML(task.text)}</span>
                <div class="task-meta">
                    <span class="badge badge-${task.priority}">${translatePriority(task.priority)}</span>
                    ${categoryBadge}
                    ${task.dueDate ? `<span class="due-date-display"><img src="./images/calendar-solid.png" width="15" height="15" alt=""> ${formatDate(task.dueDate)}</span>` : ''}
                </div>
            </div>
        </div>
        <div class="task-actions">
            <button type="button" class="action-btn edit" title="${tEdit}">
                <img src="./images/blue-pen.png" width="15" height="15" alt="">
            </button>
            <button type="button" class="action-btn archive" title="${tArch}">
                <img src="./images/yellow-folder.png" width="15" height="15" alt="">
            </button>
            <button type="button" class="action-btn delete" title="${tDel}">
                <img src="./images/red-trashcan.png" width="15" height="15" alt="">
            </button>
        </div>
    `;

    li.querySelector('.task-content').addEventListener('click', () => {
        if (Date.now() < suppressClickUntil) return;
        toggleComplete(task.id);
    });

    li.querySelector('.action-btn.edit').addEventListener('click', e => {
        e.stopPropagation();
        openEditModal(task.id);
    });
    li.querySelector('.action-btn.archive').addEventListener('click', e => {
        e.stopPropagation();
        archiveTask(task.id);
    });
    li.querySelector('.action-btn.delete').addEventListener('click', e => {
        e.stopPropagation();
        deleteTask(task.id);
    });

    return li;
}

function createHistoryTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'task-item completed history-item';
    li.dataset.id = task.id;

    const tRest = translations[currentLang]['tooltip-restore'];
    const tDelPerm = translations[currentLang]['tooltip-delete-perm'];
    const categoryBadge = createCategoryBadgeHTML(task.topic);

    li.innerHTML = `
        <div class="task-content">
            <span class="task-title">${escapeHTML(task.text)}</span>
            ${categoryBadge}
            ${task.dueDate ? `<span class="due-date-display" style="margin-left: 12px;"><img src="./images/calendar-solid.png" width="15" height="15" alt=""> ${formatDate(task.dueDate)}</span>` : ''}
        </div>
        <div class="task-actions" style="margin-left: auto;">
            <button type="button" class="action-btn restore" onclick="restoreTask(${task.id})" title="${tRest}">
                <img src="./images/restore.png" width="23" height="23" alt="">
            </button>
            <button type="button" class="action-btn delete" onclick="deleteTask(${task.id})" title="${tDelPerm}">
                <img src="./images/red-trashcan.png" width="14" height="14" alt="">
            </button>
        </div>
    `;

    return li;
}


function saveAndRender() {
    localStorage.setItem('tasksflow_tasks', JSON.stringify(tasks));
    renderTasks();
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g,
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}


function playCompletionSound() {
    completionSound.volume = 0.3;
    completionSound.currentTime = 0;

    completionSound.play()
        .then(() => {
            console.log('Success!');
        })
        .catch(error => {
            console.error('Error:', error.name, error.message);
        });
}



function togglePlayer() {
    const playerCard = document.getElementById('music-player-card');
    const appLayout = document.querySelector('.app-layout');
    const playlistInputContainer = document.getElementById('playlist-input-container');
    const gearBtn = document.getElementById('change-playlist-btn');
    const hintBanner = document.getElementById('playlist-hint');

    if (!playerCard || !appLayout) return;

    const minimized = playerCard.classList.toggle('minimized');
    appLayout.classList.toggle('player-minimized', minimized);

    if (minimized) {
        if (gearBtn) gearBtn.style.display = 'none';
        if (playlistInputContainer) playlistInputContainer.style.display = 'none';
        if (hintBanner) hintBanner.style.display = hintDismissed ? 'none' : 'flex';
    } else {
        if (gearBtn) gearBtn.style.display = 'flex';
        if (hintBanner) hintBanner.style.display = 'none';

        if (!hintDismissed) {
            hintDismissed = true;
            localStorage.setItem('tasksflow_hint_dismissed', '1');
        }
    }
}

function promptPlaylistChange() {
    const container = document.getElementById('playlist-input-container');
    if (!container) return;

    if (container.style.display === 'none') {
        container.style.display = 'flex';
        document.getElementById('playlist-url-input').focus();
    } else {
        container.style.display = 'none';
    }
}

function saveNewPlaylist() {
    const userInput = document.getElementById('playlist-url-input').value.trim();
    if (!userInput) return;

    let playlistId = "";
    if (userInput.includes("playlist/")) {
        playlistId = userInput.split("playlist/")[1].split("?")[0];
    } else {
        playlistId = userInput;
    }

    if (playlistId) {
        const newSrc = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`;
        document.getElementById('spotify-iframe').src = newSrc;
        localStorage.setItem('tasksflow_spotify_playlist', newSrc);

        document.getElementById('playlist-input-container').style.display = 'none';
        document.getElementById('playlist-url-input').value = '';

        showToast('toast-saved', 'success');
    }
}


function setupDragAndDrop() {
    let dragged = null;

    activeList.addEventListener('dragstart', e => {
        const item = e.target.closest('.task-item');
        if (!item) return;
        dragged = item;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', '');
        setTimeout(() => dragged && dragged.classList.add('dragging'), 0);
    });

    activeList.addEventListener('dragover', e => {
        if (!dragged) return;
        e.preventDefault();
        const after = getDragAfterElement(activeList, '.task-item:not(.dragging)', e.clientY);
        if (after == null) activeList.appendChild(dragged);
        else activeList.insertBefore(dragged, after);
    });

    activeList.addEventListener('dragend', () => {
        if (!dragged) return;
        dragged.classList.remove('dragging');
        dragged = null;
        commitDragOrder();
    });
}

function setupTouchDrag() {
    let item = null;
    let timer = null;
    let startY = 0;

    const cancelTimer = () => {
        clearTimeout(timer);
        timer = null;
    };

    activeList.addEventListener('touchstart', e => {
        const li = e.target.closest('.task-item');
        if (!li || e.target.closest('.action-btn')) return;
        startY = e.touches[0].clientY;
        timer = setTimeout(() => {
            item = li;
            li.classList.add('dragging');
            if (navigator.vibrate) navigator.vibrate(15);
        }, 300);
    }, { passive: true });

    activeList.addEventListener('touchmove', e => {
        if (!item) {
            if (Math.abs(e.touches[0].clientY - startY) > 8) cancelTimer();
            return;
        }
        e.preventDefault();

        const y = e.touches[0].clientY;
        const after = getDragAfterElement(activeList, '.task-item:not(.dragging)', y);
        if (after == null) activeList.appendChild(item);
        else activeList.insertBefore(item, after);

        if (y < 80) window.scrollBy(0, -8);
        else if (y > window.innerHeight - 80) window.scrollBy(0, 8);
    }, { passive: false });

    const finish = () => {
        cancelTimer();
        if (!item) return;
        item.classList.remove('dragging');
        item = null;
        suppressClickUntil = Date.now() + 400;
        commitDragOrder();
    };

    activeList.addEventListener('touchend', finish);
    activeList.addEventListener('touchcancel', finish);
}

function getDragAfterElement(container, selector, y) {
    const elements = [...container.querySelectorAll(`:scope > ${selector}`)];
    return elements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) return { offset, element: child };
        return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function commitDragOrder() {
    const pageIds = [...activeList.querySelectorAll('.task-item')].map(el => Number(el.dataset.id));
    const activeTasks = tasks.filter(t => !t.archived);
    const archivedTasks = tasks.filter(t => t.archived);

    const start = (pages.active - 1) * TASKS_PER_PAGE;
    const currentSlice = activeTasks.slice(start, start + TASKS_PER_PAGE);
    const reorderedSlice = pageIds
        .map(id => currentSlice.find(t => t.id === id))
        .filter(Boolean);

    if (reorderedSlice.length !== currentSlice.length) return;

    activeTasks.splice(start, currentSlice.length, ...reorderedSlice);
    tasks = [...activeTasks, ...archivedTasks];
    saveAndRender();
}


function clearData() {
    const hasItemsToClear = tasks.some(task => activeTab === 'active' ? !task.archived : task.archived);

    if (!hasItemsToClear) {
        showToast('toast-emptyList', 'info');
        return;
    }

    viewToClear = activeTab;

    document.getElementById('clear-confirm-text').textContent = translations[currentLang]['confirm-clear'];
    clearYesBtn.textContent = currentLang === 'bg' ? 'Да, изчисти' : 'Yes, clear';
    clearNoBtn.textContent = currentLang === 'bg' ? 'Отказ' : 'Cancel';

    clearModal.classList.remove('hidden');
}

