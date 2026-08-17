document.addEventListener('DOMContentLoaded', () => {
  // 1. Dark Mode Toggle with localStorage persistence
  const themeToggleBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggleBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', dark);
    themeToggleBtn.textContent = '☀️';
  }

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggleBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  });

  // 2. Course Category Filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const courseCards = document.querySelectorAll('.card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Manage active button state
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      // Filter grid cards
      courseCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // 3. Modal Dialog Handling
  const modal = document.getElementById('lesson-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalConfirmBtn = document.getElementById('modal-confirm');

  modalCloseBtn.addEventListener('click', () => {
    modal.close();
  });

  modalConfirmBtn.addEventListener('click', () => {
    alert('Syllabus download starting...');
    modal.close();
  });

  // Close modal when clicking on backdrop
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.close();
    }
  });
});

// Global function called by card buttons
function openModule(moduleTitle) {
  const modal = document.getElementById('lesson-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');

  modalTitle.textContent = `${moduleTitle} Overview`;
  modalDescription.textContent = `You selected the ${moduleTitle} course track. This module includes step-by-step documentation, interactive quizzes, and project assignments.`;
  
  modal.showModal();
}