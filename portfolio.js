// Portfolio page functionality
let portfolioData = {};
// --- DELETED: currentTheme and currentFont variables ---

// Initialize portfolio page
document.addEventListener('DOMContentLoaded', function() {
    loadPortfolioData();
    populatePortfolio();
    setupControls();
    // --- DELETED: applyTheme and applyFont calls ---
    
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    addQuickNavigation(); // Add side navigation
});

// Load portfolio data from localStorage
function loadPortfolioData() {
    portfolioData = getFormData();
    
    if (!portfolioData.fullName || !portfolioData.selectedCategory) {
        showNotification('بيانات البورتفوليو غير موجودة. جاري التوجيه...', 'error');
        setTimeout(() => {
            window.location.href = 'form.html';
        }, 2000);
        return;
    }
}

// Populate portfolio with user data
function populatePortfolio() {
    // Basic information
    document.getElementById('fullName').textContent = portfolioData.fullName || '';
    document.getElementById('jobTitle').textContent = portfolioData.jobTitle || '';
    document.getElementById('country').textContent = portfolioData.country || '';
    document.getElementById('aboutMe').textContent = portfolioData.aboutMe || '';
    document.getElementById('footerName').textContent = portfolioData.fullName || '';
    
    // Profile image
    const profileImgElement = document.getElementById('profileImage');
    if (portfolioData.profileImage) {
        profileImgElement.src = portfolioData.profileImage;
        profileImgElement.style.display = 'block';
    } else {
        profileImgElement.src = 'https://placehold.co/120x120/1E293B/94A3B8?text=Profile'; // Dark placeholder
        profileImgElement.style.display = 'block';
    }
    
    // Logo
    const logoContainer = document.getElementById('logoContainer');
    const logoImgElement = document.getElementById('logoImage');
    if (portfolioData.logo) {
        logoImgElement.src = portfolioData.logo;
        logoContainer.style.display = 'block';
    } else {
        logoContainer.style.display = 'none';
    }
    
    setupContactInfo();
    populateSkills();
    populateProjects();
    populateExperience();
    populateEducation();
    populateAchievements();
    
    // --- DELETED: applyCategoryTheme() ---
}

// Setup contact information
function setupContactInfo() {
    const emailLink = document.getElementById('emailLink');
    const phoneLink = document.getElementById('phoneLink');
    const linkedinLink = document.getElementById('linkedinLink');
    const githubLink = document.getElementById('githubLink');
    
    if (portfolioData.contactEmail) {
        emailLink.href = `mailto:${portfolioData.contactEmail}`;
        emailLink.style.display = 'flex';
    }
    if (portfolioData.phoneNumber) {
        phoneLink.href = `tel:${portfolioData.phoneNumber}`;
        phoneLink.style.display = 'flex';
    }
    if (portfolioData.linkedin) {
        linkedinLink.href = portfolioData.linkedin;
        linkedinLink.style.display = 'flex';
    }
    if (portfolioData.github) {
        githubLink.href = portfolioData.github;
        githubLink.style.display = 'flex';
    }
    
    // Populate contact grid
    const contactGrid = document.getElementById('contactInfo');
    const contactItems = [];
    
    if (portfolioData.contactEmail) {
        contactItems.push(`
            <div class="contact-item-grid">
                <i class="fas fa-envelope"></i>
                <div>
                    <strong>البريد الإلكتروني</strong>
                    <p><a href="mailto:${portfolioData.contactEmail}">${portfolioData.contactEmail}</a></p>
                </div>
            </div>
        `);
    }
    if (portfolioData.phoneNumber) {
        contactItems.push(`
            <div class="contact-item-grid">
                <i class="fas fa-phone"></i>
                <div>
                    <strong>الهاتف</strong>
                    <p><a href="tel:${portfolioData.phoneNumber}">${portfolioData.phoneNumber}</a></p>
                </div>
            </div>
        `);
    }
    if (portfolioData.linkedin) {
        contactItems.push(`
            <div class="contact-item-grid">
                <i class="fab fa-linkedin"></i>
                <div>
                    <strong>LinkedIn</strong>
                    <p><a href="${portfolioData.linkedin}" target="_blank">عرض الملف الشخصي</a></p>
                </div>
            </div>
        `);
    }
    if (portfolioData.github) {
        contactItems.push(`
            <div class="contact-item-grid">
                <i class="fab fa-github"></i>
                <div>
                    <strong>GitHub</strong>
                    <p><a href="${portfolioData.github}" target="_blank">عرض الملف الشخصي</a></p>
                </div>
            </div>
        `);
    }
    contactGrid.innerHTML = contactItems.join('');
}

// Populate skills
function populateSkills() {
    const skillsList = document.getElementById('skillsList');
    if (portfolioData.skills && portfolioData.skills.length > 0) {
        skillsList.innerHTML = portfolioData.skills.map(skill => `
            <div class="skill-item">
                <span class="skill-name">${skill}</span>
            </div>
        `).join('');
    } else {
        skillsList.innerHTML = '<p>لم تتم إضافة مهارات.</p>';
    }
}

// Populate projects
function populateProjects() {
    const projectsList = document.getElementById('projectsList');
    const projectsSection = document.getElementById('projectsSection');
    if (portfolioData.projects && portfolioData.projects.length > 0) {
        projectsList.innerHTML = portfolioData.projects.map(project => `
            <div class="project-card">
                <div class="project-header">
                    <h4 class="project-title">${project.name || 'مشروع بدون عنوان'}</h4>
                    <div class="project-links">
                        ${project.liveDemo ? `<a href="${project.liveDemo}" target="_blank" class="project-link"><i class="fas fa-external-link-alt"></i> عرض مباشر</a>` : ''}
                        ${project.codeLink ? `<a href="${project.codeLink}" target="_blank" class="project-link"><i class="fab fa-github"></i> الكود</a>` : ''}
                    </div>
                </div>
                <p class="project-description">${project.description || 'لا يوجد وصف.'}</p>
                ${project.technologies ? `
                    <div class="project-technologies">
                        ${project.technologies.split(',').map(tech => `<span class="tech-tag">${tech.trim()}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('');
    } else {
        projectsSection.style.display = 'none';
    }
}

// Populate experience
function populateExperience() {
    const experienceList = document.getElementById('experienceList');
    const experienceSection = document.getElementById('experienceSection');
    if (portfolioData.experiences && portfolioData.experiences.length > 0) {
        experienceList.innerHTML = portfolioData.experiences.map(exp => `
            <div class="experience-item">
                <div class="experience-timeline-dot"></div>
                <div class="experience-content">
                    <h4 class="experience-title">${exp.position || 'منصب'} في ${exp.company || 'شركة'}</h4>
                    <p class="experience-period">${exp.timePeriod || 'فترة غير محددة'}</p>
                    ${exp.description ? `<p class="experience-description">${exp.description}</p>` : ''}
                </div>
            </div>
        `).join('');
    } else {
        experienceSection.style.display = 'none';
    }
}

// Populate education
function populateEducation() {
    const educationContent = document.getElementById('educationContent');
    const educationSection = document.getElementById('educationSection');
    const hasEducation = portfolioData.university || portfolioData.major || portfolioData.studyYears || portfolioData.onlineCourses;
    
    if (hasEducation) {
        let educationHTML = '';
        if (portfolioData.university || portfolioData.major) {
            educationHTML += `
                <div class="education-item">
                    <h4 class="education-title">${portfolioData.major || 'الدرجة العلمية'}</h4>
                    <p class="education-institution">${portfolioData.university || 'الجامعة'}</p>
                    ${portfolioData.studyYears ? `<p class="education-period">${portfolioData.studyYears}</p>` : ''}
                </div>
            `;
        }
        if (portfolioData.onlineCourses) {
            educationHTML += `
                <div class="education-item">
                    <h4 class="education-title">كورسات أونلاين</h4>
                    <p class="education-description">${portfolioData.onlineCourses}</p>
                </div>
            `;
        }
        educationContent.innerHTML = educationHTML;
    } else {
        educationSection.style.display = 'none';
    }
}

// Populate achievements
function populateAchievements() {
    const achievementsContent = document.getElementById('achievementsContent');
    const achievementsSection = document.getElementById('achievementsSection');
    const hasAchievements = portfolioData.certificates || portfolioData.contests;
    
    if (hasAchievements) {
        let achievementsHTML = '';
        if (portfolioData.certificates) {
            achievementsHTML += `
                <div class="achievement-item">
                    <h4 class="achievement-title"><i class="fas fa-certificate"></i> شهادات</h4>
                    <p class="achievement-description">${portfolioData.certificates}</p>
                </div>
            `;
        }
        if (portfolioData.contests) {
            achievementsHTML += `
                <div class="achievement-item">
                    <h4 class="achievement-title"><i class="fas fa-trophy"></i> جوائز ومسابقات</h4>
                    <p class="achievement-description">${portfolioData.contests}</p>
                </div>
            `;
        }
        achievementsContent.innerHTML = achievementsHTML;
    } else {
        achievementsSection.style.display = 'none';
    }
}

// Setup controls
function setupControls() {
    // --- DELETED: Theme/Font selectors ---
}

// --- DELETED: applyTheme function ---
// --- DELETED: applyFont function ---

// Edit portfolio
function editPortfolio() {
    showNotification('جاري التوجيه لصفحة التعديل...', 'info');
    setTimeout(() => {
        window.location.href = 'form.html';
    }, 1500);
}

// --- DELETED: Dynamically injected CSS block ---

// Add side navigation
function addQuickNavigation() {
    const nav = document.getElementById('portfolioNav');
    if (!nav) return;

    const sections = [
        { id: 'headerSection', title: 'البداية' },
        { id: 'aboutSection', title: 'من أنا؟' },
        { id: 'skillsSection', title: 'المهارات' },
        { id: 'projectsSection', title: 'المشاريع' },
        { id: 'experienceSection', title: 'الخبرة' },
        { id: 'educationSection', title: 'التعليم' },
        { id: 'achievementsSection', title: 'الإنجازات' },
        { id: 'contactSection', title: 'التواصل' }
    ];

    nav.innerHTML = sections.map(section => `
        <a href="#${section.id}" class="nav-dot" title="${section.title}">
            <span></span>
        </a>
    `).join('');

    // Add scroll spying
    const navDots = nav.querySelectorAll('.nav-dot');
    const sectionElements = sections.map(s => document.getElementById(s.id));

    window.addEventListener('scroll', () => {
        let current = '';
        sectionElements.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 150) { // 150px offset
                current = section.getAttribute('id');
            }
        });

        navDots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('href') === `#${current}`) {
                dot.classList.add('active');
            }
        });
    });

    // Add smooth scrolling
    navDots.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}
