document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle
  const themeToggleBtn = document.getElementById('theme-toggle');
  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeToggleBtn.textContent = isDark ? '🌙' : '☀️';
  });

  // Modal Close Handling
  const modal = document.getElementById('lesson-modal');
  const modalCloseBtn = document.getElementById('modal-close');

  modalCloseBtn.addEventListener('click', () => modal.close());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.close();
  });
});

// Function triggered when "Start Learning" is clicked
function openModule(moduleTitle, pdfPath) {
  const modal = document.getElementById('lesson-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const modalDownloadBtn = document.getElementById('modal-download-btn');

  modalTitle.textContent = moduleTitle;
  modalDescription.textContent = `Welcome to ${moduleTitle}! Click below to download the introductory lesson PDF and kickstart your study session.`;
  
  // Attach the PDF file path directly to the download button
  modalDownloadBtn.href = pdfPath;

  modal.showModal();
}