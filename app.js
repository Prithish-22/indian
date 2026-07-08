document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('show');
            mobileMenuBtn.classList.toggle('active');
        });
    }

    // Toggle dropdown inside mobile menu
    const dropdownTrigger = document.querySelector('.dropdown-trigger');
    const dropdownLi = document.querySelector('.dropdown');
    if (dropdownTrigger && dropdownLi && window.innerWidth <= 768) {
        dropdownTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            dropdownLi.classList.toggle('active');
        });
    }

    // 2. Search Overlay Bar Toggling
    const searchToggleBtn = document.getElementById('searchToggleBtn');
    const searchBarOverlay = document.getElementById('searchBarOverlay');
    const searchCloseBtn = document.getElementById('searchCloseBtn');
    const articleSearch = document.getElementById('articleSearch');

    if (searchToggleBtn && searchBarOverlay) {
        searchToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            searchBarOverlay.classList.toggle('search-hidden');
            if (!searchBarOverlay.classList.contains('search-hidden') && articleSearch) {
                articleSearch.focus();
            }
        });
    }

    if (searchCloseBtn && searchBarOverlay) {
        searchCloseBtn.addEventListener('click', () => {
            searchBarOverlay.classList.add('search-hidden');
            if (articleSearch) {
                articleSearch.value = '';
                filterArticles('');
            }
        });
    }

    // 3. Live Keyword Filtering
    const postCards = document.querySelectorAll('.post-row-card');
    const noResults = document.getElementById('noResults');

    function filterArticles(query) {
        let visibleCount = 0;
        const lowercaseQuery = query.toLowerCase().trim();

        postCards.forEach(card => {
            const title = card.querySelector('.post-card-title').textContent.toLowerCase();
            const excerpt = card.querySelector('.post-card-excerpt').textContent.toLowerCase();
            const tag = card.querySelector('.post-card-meta').textContent.toLowerCase();

            if (title.includes(lowercaseQuery) || excerpt.includes(lowercaseQuery) || tag.includes(lowercaseQuery)) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        if (noResults) {
            if (visibleCount === 0) {
                noResults.classList.remove('hidden');
            } else {
                noResults.classList.add('hidden');
            }
        }
    }

    if (articleSearch) {
        articleSearch.addEventListener('input', (e) => {
            filterArticles(e.target.value);
        });
    }

    // Filter triggers from centres/footer categories
    const categoryTriggers = document.querySelectorAll('[data-filter]');
    categoryTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const filterValue = trigger.dataset.filter;
            
            // Apply category filter
            let visibleCount = 0;
            postCards.forEach(card => {
                const category = card.dataset.category;
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hidden');
                    visibleCount++;
                } else {
                    card.classList.add('hidden');
                }
            });

            if (noResults) {
                if (visibleCount === 0) {
                    noResults.classList.remove('hidden');
                } else {
                    noResults.classList.add('hidden');
                }
            }

            // Scroll to posts section
            const targetSection = document.getElementById('articles');
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }

            // Close mobile menu if open
            if (navMenu && navMenu.classList.contains('show')) {
                navMenu.classList.remove('show');
            }
        });
    });

    // 4. Form Submissions Logic
    const submissionForm = document.getElementById('submissionForm');
    const formFeedback = document.getElementById('formFeedback');

    if (submissionForm && formFeedback) {
        submissionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = submissionForm.querySelector('button');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            formFeedback.className = 'form-feedback hidden';

            setTimeout(() => {
                const name = document.getElementById('formName').value;
                const email = document.getElementById('formEmail').value;
                const affiliation = document.getElementById('formAffiliation').value;
                const pitch = document.getElementById('formPitch').value;

                if (name && email && affiliation && pitch) {
                    formFeedback.textContent = `Thank you, ${name}! Your abstract has been submitted successfully to the IPR Editorial Core.`;
                    formFeedback.className = 'form-feedback success';
                    submissionForm.reset();
                } else {
                    formFeedback.textContent = 'Please fill out all fields correctly.';
                    formFeedback.className = 'form-feedback error';
                }

                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }, 1000);
        });
    }
});
