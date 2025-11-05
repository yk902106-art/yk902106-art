// --- NEW: Multi-Step Form Logic ---
let currentStep = 0; // Current step is 0
document.addEventListener("DOMContentLoaded", function() {
    showStep(currentStep); // Show the first step
});

function showStep(n) {
    let steps = document.getElementsByClassName("form-step");
    let progressSteps = document.getElementsByClassName("progress-step");
    
    if (steps.length === 0) return; // Not on the form page

    // Hide all steps
    for (let i = 0; i < steps.length; i++) {
        steps[i].style.display = "none";
        steps[i].classList.remove("active");
    }
    // Remove active class from all progress steps
    for (let i = 0; i < progressSteps.length; i++) {
        progressSteps[i].classList.remove("active");
    }

    // Show the current step
    steps[n].style.display = "block";
    steps[n].classList.add("active");
    
    // Activate progress step dot
    if (progressSteps[n]) {
        progressSteps[n].classList.add("active");
        // Also activate previous steps
        for (let j = 0; j < n; j++) {
            progressSteps[j].classList.add("active");
        }
    }

    // Update button visibility
    document.getElementById("prevBtn").style.display = (n === 0) ? "none" : "inline-flex";
    
    if (n === (steps.length - 1)) {
        document.getElementById("nextBtn").innerHTML = 'إنشاء البورتفوليو <i class="fas fa-magic"></i>';
        document.getElementById("nextBtn").setAttribute("onclick", "submitPortfolioForm()");
    } else {
        document.getElementById("nextBtn").innerHTML = 'التالي <i class="fas fa-arrow-left"></i>';
        document.getElementById("nextBtn").setAttribute("onclick", "nextPrev(1)");
    }
}

function nextPrev(n) {
    // This function will figure out which step to display
    let steps = document.getElementsByClassName("form-step");
    
    // Validate current step before proceeding
    if (n === 1 && !validateStep(currentStep)) {
        return false;
    }

    // Hide the current step
    steps[currentStep].style.display = "none";
    
    // Increase or decrease the current step
    currentStep = currentStep + n;
    
    // if you have reached the end of the form...
    if (currentStep >= steps.length) {
        // ... the form gets submitted
        // This is handled by the new button click function `submitPortfolioForm`
        return false;
    }
    
    // Otherwise, display the correct step
    showStep(currentStep);
}

function validateStep(n) {
    let valid = true;
    let step = document.getElementsByClassName("form-step")[n];
    let inputs = step.querySelectorAll("input[required], textarea[required]");

    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value === "") {
            inputs[i].style.borderColor = "var(--error-color)"; // Highlight error
            valid = false;
        } else {
            inputs[i].style.borderColor = "var(--border-color)"; // Reset
        }
    }

    if (!valid) {
        showNotification("الرجاء ملء جميع الحقول المطلوبة (*)", "error");
    }

    // Special validation for step 2 (skills)
    if (n === 1 && skills.length === 0) {
        showNotification("الرجاء إضافة مهارة واحدة على الأقل", "error");
        valid = false;
    }
    
    return valid;
}

// --- END: Multi-Step Form Logic ---


// --- Existing Logic (Integrated) ---
let skills = [];
let projects = [];
let experiences = [];
let projectCounter = 0;
let experienceCounter = 0;
let profileImageBase64 = null;
let logoBase64 = null;

document.addEventListener('DOMContentLoaded', function() {
    loadExistingData();
    setupFileUploadPreviews();
    
    if (projects.length === 0) addProject();
    if (experiences.length === 0) addExperience();

    const profileImageLabel = document.querySelector('label[for="profileImage"] span');
    if (profileImageLabel) profileImageLabel.setAttribute('data-default-text', profileImageLabel.textContent);
    const logoLabel = document.querySelector('label[for="logo"] span');
    if (logoLabel) logoLabel.setAttribute('data-default-text', logoLabel.textContent);

    const profileImageInput = document.getElementById('profileImage');
    if (profileImageInput) {
        profileImageInput.addEventListener('change', (event) => handleImageUpload(event.target.files[0], 'profileImage'));
    }
    const logoInput = document.getElementById('logo');
    if (logoInput) {
        logoInput.addEventListener('change', (event) => handleImageUpload(event.target.files[0], 'logo'));
    }
});

function handleImageUpload(file, type) {
    let labelSpan = (type === 'profileImage') ? 
        document.querySelector('label[for="profileImage"] span') : 
        document.querySelector('label[for="logo"] span');
    let fileUploadLabel = (type === 'profileImage') ? 
        document.querySelector('label[for="profileImage"]') : 
        document.querySelector('label[for="logo"]');

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            if (type === 'profileImage') profileImageBase64 = e.target.result;
            else if (type === 'logo') logoBase64 = e.target.result;
            
            if (labelSpan) labelSpan.textContent = file.name;
            if (fileUploadLabel) {
                fileUploadLabel.style.borderColor = 'var(--success-color)';
                fileUploadLabel.style.color = 'var(--success-color)';
            }
            showNotification(`${type === 'profileImage' ? 'الصورة الشخصية' : 'الشعار'} تم اختياره!`, 'info');
            autoSave();
        };
        reader.readAsDataURL(file);
    } else {
        if (type === 'profileImage') profileImageBase64 = null;
        else if (type === 'logo') logoBase64 = null;
        
        if (labelSpan && fileUploadLabel) {
            labelSpan.textContent = fileUploadLabel.getAttribute('data-default-text');
            fileUploadLabel.style.borderColor = '';
            fileUploadLabel.style.color = '';
        }
    }
}

function loadExistingData() {
    const userData = getFormData();
    if (userData.fullName) document.getElementById('fullName').value = userData.fullName;
    if (userData.jobTitle) document.getElementById('jobTitle').value = userData.jobTitle;
    // ... (rest of the fields) ...
    if (userData.country) document.getElementById('country').value = userData.country;
    if (userData.aboutMe) document.getElementById('aboutMe').value = userData.aboutMe;
    if (userData.university) document.getElementById('university').value = userData.university;
    if (userData.major) document.getElementById('major').value = userData.major;
    if (userData.studyYears) document.getElementById('studyYears').value = userData.studyYears;
    if (userData.onlineCourses) document.getElementById('onlineCourses').value = userData.onlineCourses;
    if (userData.contactEmail) document.getElementById('contactEmail').value = userData.contactEmail;
    if (userData.phoneNumber) document.getElementById('phoneNumber').value = userData.phoneNumber;
    if (userData.linkedin) document.getElementById('linkedin').value = userData.linkedin;
    if (userData.github) document.getElementById('github').value = userData.github;
    
    if (userData.skills) { skills = userData.skills; renderSkills(); }
    if (userData.projects) { projects = userData.projects; renderProjects(); }
    if (userData.experiences) { experiences = userData.experiences; renderExperiences(); }

    if (userData.profileImage) {
        profileImageBase64 = userData.profileImage;
        const label = document.querySelector('label[for="profileImage"] span');
        if (label) label.textContent = 'تم تحميل الصورة الشخصية';
    }
    if (userData.logo) {
        logoBase64 = userData.logo;
        const label = document.querySelector('label[for="logo"] span');
        if (label) label.textContent = 'تم تحميل الشعار';
    }
}

// Skills management
function addSkill() {
    const skillInput = document.getElementById('skillInput');
    const skill = skillInput.value.trim();
    if (skill && !skills.includes(skill)) {
        skills.push(skill);
        skillInput.value = '';
        renderSkills();
        autoSave();
    }
}
function removeSkill(index) {
    skills.splice(index, 1);
    renderSkills();
    autoSave();
}
function renderSkills() {
    const container = document.getElementById('skillsContainer');
    if (!container) return;
    container.innerHTML = skills.map((skill, index) => `
        <div class="skill-tag">
            <span>${skill}</span>
            <span class="remove-skill" onclick="removeSkill(${index})">×</span>
        </div>
    `).join('');
}
const skillInput = document.getElementById('skillInput');
if (skillInput) {
    skillInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); addSkill(); }
    });
}

// Projects management
function addProject() {
    projectCounter++;
    projects.push({ id: projectCounter, name: '', description: '', technologies: '', liveDemo: '', codeLink: '', screenshots: [] });
    renderProjects();
    autoSave();
}
function removeProject(index) {
    projects.splice(index, 1);
    renderProjects();
    autoSave();
}
function renderProjects() {
    const container = document.getElementById('projectsContainer');
    if (!container) return;
    container.innerHTML = projects.map((project, index) => `
        <div class="dynamic-section">
            <div class="section-header">
                <div class="section-number">${index + 1}</div>
                <button type="button" class="remove-section" onclick="removeProject(${index})">إزالة</button>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <input type="text" name="projectName_${index}" value="${project.name}" placeholder=" " required onchange="updateProject(${index}, 'name', this.value)">
                    <label>اسم المشروع *</label>
                </div>
                <div class="form-group">
                    <input type="text" name="projectTech_${index}" value="${project.technologies}" placeholder=" " onchange="updateProject(${index}, 'technologies', this.value)">
                    <label>التقنيات المستخدمة (افصل بفواصل)</label>
                </div>
            </div>
            <div class="form-row single">
                <div class="form-group">
                    <textarea name="projectDesc_${index}" required placeholder=" " onchange="updateProject(${index}, 'description', this.value)">${project.description}</textarea>
                    <label>وصف المشروع *</label>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <input type="url" name="projectDemo_${index}" value="${project.liveDemo}" placeholder=" " onchange="updateProject(${index}, 'liveDemo', this.value)">
                    <label>رابط العرض المباشر</label>
                </div>
                <div class="form-group">
                    <input type="url" name="projectCode_${index}" value="${project.codeLink}" placeholder=" " onchange="updateProject(${index}, 'codeLink', this.value)">
                    <label>رابط الكود (GitHub)</label>
                </div>
            </div>
            <div class="form-row single">
                <div class="form-group">
                    <label>صور المشروع</label>
                    <div class="file-upload">
                        <input type="file" name="projectScreenshots_${index}" multiple accept="image/*" onchange="handleProjectScreenshots(${index}, this.files)">
                        <label class="file-upload-label" data-default-text="ارفع صور للمشروع">
                            <i class="fas fa-images"></i>
                            <span>ارفع صور للمشروع</span>
                        </label>
                    </div>
                    <div class="screenshot-previews" id="screenshotPreviews_${index}">
                        ${project.screenshots.map(imgSrc => `<img src="${imgSrc}" class="preview-thumbnail" />`).join('')}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}
function updateProject(index, field, value) {
    if (projects[index]) { projects[index][field] = value; autoSave(); }
}
function handleProjectScreenshots(index, files) {
    if (!projects[index]) return;
    projects[index].screenshots = [];
    const readerPromises = [];
    const previewContainer = document.getElementById(`screenshotPreviews_${index}`);
    if (previewContainer) previewContainer.innerHTML = '';
    
    const labelSpan = document.querySelector(`input[name="projectScreenshots_${index}"]`).nextElementSibling.querySelector('span');

    if (files.length > 0) {
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            const promise = new Promise(resolve => {
                reader.onload = (e) => {
                    projects[index].screenshots.push(e.target.result);
                    if (previewContainer) {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.className = 'preview-thumbnail';
                        previewContainer.appendChild(img);
                    }
                    resolve();
                };
            });
            reader.readAsDataURL(file);
            readerPromises.push(promise);
        });
        Promise.all(readerPromises).then(() => {
            if(labelSpan) labelSpan.textContent = `${files.length} صور تم اختيارها`;
            autoSave();
            showNotification(`تم رفع صور المشروع!`, 'info');
        });
    } else {
        if(labelSpan) labelSpan.textContent = labelSpan.parentElement.getAttribute('data-default-text');
        autoSave();
    }
}

// Experience management
function addExperience() {
    experienceCounter++;
    experiences.push({ id: experienceCounter, company: '', position: '', timePeriod: '', description: '' });
    renderExperiences();
    autoSave();
}
function removeExperience(index) {
    experiences.splice(index, 1);
    renderExperiences();
    autoSave();
}
function renderExperiences() {
    const container = document.getElementById('experienceContainer');
    if (!container) return;
    container.innerHTML = experiences.map((experience, index) => `
        <div class="dynamic-section">
            <div class="section-header">
                <div class="section-number">${index + 1}</div>
                <button type="button" class="remove-section" onclick="removeExperience(${index})">إزالة</button>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <input type="text" name="companyName_${index}" value="${experience.company}" placeholder=" " required onchange="updateExperience(${index}, 'company', this.value)">
                    <label>اسم الشركة *</label>
                </div>
                <div class="form-group">
                    <input type="text" name="position_${index}" value="${experience.position}" placeholder=" " onchange="updateExperience(${index}, 'position', this.value)">
                    <label>المنصب</label>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <input type="text" name="timePeriod_${index}" value="${experience.timePeriod}" placeholder=" " required onchange="updateExperience(${index}, 'timePeriod', this.value)">
                    <label>الفترة الزمنية * (مثال: 2020 - الآن)</label>
                </div>
                <div class="form-group">
                    <textarea name="jobDesc_${index}" placeholder=" " onchange="updateExperience(${index}, 'description', this.value)">${experience.description}</textarea>
                    <label>وصف المهام</label>
                </div>
            </div>
        </div>
    `).join('');
}
function updateExperience(index, field, value) {
    if (experiences[index]) { experiences[index][field] = value; autoSave(); }
}

// File upload previews (general)
function setupFileUploadPreviews() {
    document.querySelectorAll('input[type="file"]').forEach(input => {
        if (input.id !== 'profileImage' && input.id !== 'logo' && !input.name.startsWith('projectScreenshots_')) {
            input.addEventListener('change', function() {
                const label = this.nextElementSibling;
                const files = this.files;
                if (files.length > 0) {
                    label.querySelector('span').textContent = files[0].name;
                    label.style.borderColor = 'var(--success-color)';
                } else {
                    label.querySelector('span').textContent = label.getAttribute('data-default-text');
                    label.style.borderColor = '';
                }
            });
            const label = input.nextElementSibling;
            if (label) label.setAttribute('data-default-text', label.querySelector('span').textContent);
        }
    });
}

// --- NEW: Final Form Submission Function ---
function submitPortfolioForm() {
    // Final validation before submitting
    if (!validateStep(currentStep)) return;

    const formData = new FormData(document.getElementById('portfolioForm'));
    const portfolioData = {};
    
    for (let [key, value] of formData.entries()) {
        if (!key.includes('_') && key !== 'profileImage' && key !== 'logo' && !key.startsWith('projectScreenshots_')) {
            portfolioData[key] = value;
        }
    }
    
    portfolioData.skills = skills;
    portfolioData.projects = projects;
    portfolioData.experiences = experiences;
    portfolioData.profileImage = profileImageBase64;
    portfolioData.logo = logoBase64;
    
    // Final check on key data
    if (!portfolioData.fullName || !portfolioData.jobTitle || !portfolioData.aboutMe || !portfolioData.contactEmail) {
        showNotification('بيانات أساسية مفقودة، يرجى مراجعة الخطوة 1', 'error');
        showStep(0);
        return;
    }
    if (!profileImageBase64) {
        showNotification('الرجاء رفع صورة شخصية', 'error');
        showStep(0);
        return;
    }
    if (skills.length === 0) {
        showNotification('الرجاء إضافة مهارة واحدة على الأقل', 'error');
        showStep(1);
        return;
    }
    
    // Save data
    saveFormData(portfolioData);
    
    showNotification('تم حفظ بياناتك بنجاح!', 'success');
    
    // Redirect to categories page
    setTimeout(() => {
        window.location.href = 'categories.html';
    }, 1500);
}

// Auto-save functionality
let autoSaveTimeout;
function autoSave() {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
        const formData = new FormData(document.getElementById('portfolioForm'));
        const portfolioData = {};
        
        for (let [key, value] of formData.entries()) {
            if (!key.includes('_') && key !== 'profileImage' && key !== 'logo' && !key.startsWith('projectScreenshots_')) {
                portfolioData[key] = value;
            }
        }
        portfolioData.skills = skills;
        portfolioData.projects = projects;
        portfolioData.experiences = experiences;
        portfolioData.profileImage = profileImageBase64;
        portfolioData.logo = logoBase64;
        
        saveFormData(portfolioData);
        // showNotification('تم الحفظ التلقائي', 'info'); // Optional
    }, 2000);
}

// Add auto-save listeners
const form = document.getElementById('portfolioForm');
if (form) {
    form.addEventListener('input', autoSave);
}
