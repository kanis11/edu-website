let lastActiveElement = null;

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);

    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.setAttribute('aria-label', `Switch to ${current === 'dark' ? 'light' : 'dark'} mode`);
        themeBtn.innerHTML = newTheme === 'dark'
            ? '<i class="fa-solid fa-sun" aria-hidden="true"></i>'
            : '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
    }
}

function toggleDropdown(button) {
    const dropdown = button.closest('.dropdown');
    const isExpanded = button.getAttribute('aria-expanded') === 'true';

    document.querySelectorAll('.dropdown-btn').forEach(btn => {
        btn.setAttribute('aria-expanded', 'false');
        btn.closest('.dropdown').classList.remove('open');
    });

    if (!isExpanded) {
        button.setAttribute('aria-expanded', 'true');
        dropdown.classList.add('open');
    }
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-btn').forEach(btn => {
            btn.setAttribute('aria-expanded', 'false');
            btn.closest('.dropdown').classList.remove('open');
        });
    }
});

function toggleMobileMenu() {
    const nav = document.getElementById('primary-nav');
    const btn = document.querySelector('.mobile-menu-toggle');
    const isOpen = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen);
}

function openModal(id) {
    lastActiveElement = document.activeElement;
    document.getElementById(id).showModal();
}

function closeModal(id) {
    const modal = document.getElementById(id);
    modal.close();
    if (lastActiveElement) lastActiveElement.focus();
}

function toggleChatWidget() {
    const widget = document.getElementById('chat-widget');
    widget.classList.toggle('open');
    const btn = document.getElementById('chat-fab');
    btn.setAttribute('aria-expanded', widget.classList.contains('open'));
    if (widget.classList.contains('open')) {
        document.getElementById('chat-input').focus();
    }
}

function appendMessage(text, type) {
    const box = document.getElementById('chat-messages');
    const msg = document.createElement('div');
    msg.className = `message ${type} msg-animate`;
    msg.textContent = text;
    box.appendChild(msg);
    box.scrollTop = box.scrollHeight;
}

function showTypingIndicator() {
    const box = document.getElementById('chat-messages');
    const typing = document.createElement('div');
    typing.id = 'typing-indicator';
    typing.className = 'message bot typing-indicator msg-animate';
    typing.innerHTML = '<span></span><span></span><span></span>';
    box.appendChild(typing);
    box.scrollTop = box.scrollHeight;
}

function removeTypingIndicator() {
    const el = document.getElementById('typing-indicator');
    if (el) el.remove();
}

async function sendChatMessage(e) {
    e.preventDefault();
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    appendMessage(msg, 'user');
    input.value = '';
    showTypingIndicator();

    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg })
        });
        const data = await res.json();
        await new Promise(r => setTimeout(r, 600));
        removeTypingIndicator();
        appendMessage(data.reply, 'bot');
    } catch {
        removeTypingIndicator();
        appendMessage('Sorry, we could not connect to support. Please try again.', 'bot');
    }
}

async function submitAdmission(e) {
    e.preventDefault();
    const form = e.target;
    const status = document.getElementById('form-status');
    const data = Object.fromEntries(new FormData(form));

    status.textContent = 'Submitting your application...';
    status.className = 'form-status loading';

    try {
        const res = await fetch('/api/admission', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        status.textContent = result.message;
        status.className = `form-status ${result.status}`;
        if (result.status === 'success') form.reset();
    } catch {
        status.textContent = 'Submission failed. Please try again later.';
        status.className = 'form-status error';
    }
}

function openLightbox(src, caption) {
    document.getElementById('lightbox-img').src = src;
    document.getElementById('lightbox-caption').textContent = caption;
    openModal('lightbox-modal');
}

document.addEventListener('DOMContentLoaded', () => {
    const current = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === current) link.classList.add('active');
    });
});
