// Job categories data (Unchanged)
const jobCategories = [
    { id: 'websites-software', title: 'برمجة الويب والبرمجيات', icon: 'fas fa-code', description: 'تطوير الويب، هندسة البرمجيات، فول ستاك' },
    { id: 'mobile-computing', title: 'تطبيقات الموبايل', icon: 'fas fa-mobile-alt', description: 'تطوير تطبيقات iOS, Android, cross-platform' },
    { id: 'artificial-intelligence', title: 'الذكاء الاصطناعي', icon: 'fas fa-robot', description: 'تعلم الآلة، علم البيانات، الشبكات العصبية' },
    { id: 'cybersecurity', title: 'الأمن السيبراني', icon: 'fas fa-shield-alt', description: 'أمن المعلومات، الاختراق الأخلاقي' },
    { id: 'bioinformatics', title: 'المعلوماتية الحيوية', icon: 'fas fa-dna', description: 'البيولوجيا الحاسوبية، تحليل الجينوم' },
    { id: 'writing-content', title: 'الكتابة والمحتوى', icon: 'fas fa-pen-fancy', description: 'كتابة المحتوى، التحرير، الكتابة التقنية' },
    { id: 'design-media', title: 'التصميم والميديا', icon: 'fas fa-palette', description: 'تصميم الجرافيك، UI/UX، تحرير الفيديو' },
    { id: 'data-analysis', title: 'تحليل البيانات', icon: 'fas fa-chart-bar', description: 'تحليل البيانات، ذكاء الأعمال، الإحصاء' },
    { id: 'sales-marketing', title: 'التسويق والمبيعات', icon: 'fas fa-bullhorn', description: 'التسويق الرقمي، SEO، إدارة الشبكات' },
    { id: 'telecommunication', title: 'الاتصالات', icon: 'fas fa-satellite-dish', description: 'هندسة الشبكات، أنظمة الاتصالات' },
    { id: 'education', title: 'التعليم والتدريب', icon: 'fas fa-chalkboard-teacher', description: 'التدريس، التدريب، المحتوى التعليمي' },
    { id: 'business-hr', title: 'الأعمال والمحاسبة', icon: 'fas fa-briefcase', description: 'استشارات الأعمال، المحاسبة، الموارد البشرية' },
    { id: 'translation-languages', title: 'الترجمة واللغات', icon: 'fas fa-language', description: 'خدمات الترجمة، الترجمة الفورية، تعليم اللغات' },
    { id: 'photographer', title: 'التصوير', icon: 'fas fa-camera', description: 'التصوير الفوتوغرافي، تحرير الصور' },
    { id: 'music-producer', title: 'الإنتاج الموسيقي', icon: 'fas fa-music', description: 'هندسة الصوت، تصميم الصوت' },
    { id: 'other', title: 'أخرى', icon: 'fas fa-ellipsis-h', description: 'خدمات احترافية وتخصصات أخرى' }
];

let selectedCategory = null;

// Initialize categories page
document.addEventListener('DOMContentLoaded', function() {
    renderCategories();
    addSearchFunctionality(); // Add search bar
    
    const userData = getFormData();
    if (!userData.fullName) {
        showNotification('الرجاء إكمال الفورم أولاً', 'error');
        setTimeout(() => { window.location.href = 'form.html'; }, 2000);
    }
    
    if (userData.selectedCategory) {
        selectedCategory = userData.selectedCategory;
        updateCategorySelection();
    }
});

// Render categories grid
function renderCategories() {
    const grid = document.getElementById('categoriesGrid');
    grid.innerHTML = jobCategories.map(category => `
        <div class="category-card" data-category="${category.id}" onclick="selectCategory('${category.id}')">
            <div class="category-icon">
                <i class="${category.icon}"></i>
            </div>
            <h3 class="category-title">${category.title}</h3>
            <p class="category-description">${category.description}</p>
        </div>
    `).join('');
}

// Select category
function selectCategory(categoryId) {
    selectedCategory = categoryId;
    updateCategorySelection();
    
    const userData = getFormData();
    userData.selectedCategory = categoryId;
    saveFormData(userData);
}

// Update visual selection
function updateCategorySelection() {
    document.querySelectorAll('.category-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    if (selectedCategory) {
        const selectedCard = document.querySelector(`[data-category="${selectedCategory}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
        document.getElementById('generateBtn').classList.add('active');
    }
}

// Generate portfolio
function generatePortfolio() {
    if (!selectedCategory) {
        showNotification('الرجاء اختيار مجال أولاً', 'error');
        return;
    }
    
    const userData = getFormData();
    if (!userData.fullName || !userData.jobTitle || !userData.aboutMe) {
        showNotification('الرجاء إكمال الفورم أولاً', 'error');
        setTimeout(() => { window.location.href = 'form.html'; }, 2000);
        return;
    }
    
    userData.selectedCategory = selectedCategory;
    saveFormData(userData);
    
    showNotification('جاري إنشاء البورتفوليو...', 'success');
    
    const generateBtn = document.getElementById('generateBtn');
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ...جاري الإنشاء';
    generateBtn.style.pointerEvents = 'none';
    
    setTimeout(() => {
        window.location.href = 'portfolio.html';
    }, 2000);
}

// --- DELETED: Old animation block (now handled by main.js) ---

// Add keyboard navigation (Unchanged)
document.addEventListener('keydown', function(e) {
    const cards = document.querySelectorAll('.category-card');
    const currentIndex = Array.from(cards).findIndex(card => card.classList.contains('selected'));
    let newIndex = currentIndex;
    
    switch(e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
            e.preventDefault();
            newIndex = (currentIndex + 1) % cards.length;
            break;
        case 'ArrowLeft':
        case 'ArrowUp':
            e.preventDefault();
            newIndex = currentIndex > 0 ? currentIndex - 1 : cards.length - 1;
            break;
        case 'Enter':
        case ' ':
            e.preventDefault();
            if (selectedCategory) generatePortfolio();
            break;
    }
    
    if (newIndex !== currentIndex && newIndex >= 0) {
        const categoryId = cards[newIndex].getAttribute('data-category');
        selectCategory(categoryId);
        cards[newIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});

// --- MODIFIED: Search Functionality (Styling) ---
function addSearchFunctionality() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container'; // Use CSS class
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'ابحث عن مجالك...';
    searchInput.className = 'search-input'; // Use CSS class
    
    const searchIcon = document.createElement('i');
    searchIcon.className = 'fas fa-search search-icon'; // Use CSS class
    
    searchContainer.appendChild(searchIcon);
    searchContainer.appendChild(searchInput);
    
    const header = document.querySelector('.categories-header');
    header.appendChild(searchContainer);
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const cards = document.querySelectorAll('.category-card');
        
        cards.forEach(card => {
            const title = card.querySelector('.category-title').textContent.toLowerCase();
            const description = card.querySelector('.category-description').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease';
            } else {
                card.style.display = 'none';
            }
        });
    });
}
