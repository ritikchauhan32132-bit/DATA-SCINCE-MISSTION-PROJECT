/**
 * Data Science Career Journey Tracker - Main Application Logic
 * Modular Vanilla JavaScript with LocalStorage Persistence
 */

// Central Application State
let appState = {
    tasks: {},       // Format: { "sprintId_dayIndex_taskIndex": true/false }
    projects: {},    // Format: { projectId: { status, notes, github, live, ... } }
    notes: {},       // Format: { noteId: { title, content, date } }
    coding: {},      // Format: { problemId: { name, category, difficulty, status, date } }
    english: {},     // Format: { "modIndex_taskIndex": true/false }
    revisions: {},   // Format: { "sprintId_topicName": "Revised" | "Due" }
    achievements: {},// Format: { badgeId: true/false }
    streak: {
        current: 0,
        longest: 0,
        lastActiveDate: null,
        todayCompleted: false
    },
    settings: {
        darkMode: true,
        dailyTarget: 3
    },
    activeSprintId: 'sprint-1'
};

// Master Curriculum Roadmap Data (22 Sprints)
const ROADMAP_DATA = [
    {
        id: 'sprint-1',
        title: 'Sprint 1 — Python Foundation',
        desc: '7-Day Starter Sprint covering syntax, data types, loops, and core fundamentals.',
        days: [
            {
                day: 'Day 1 — Python Fundamentals',
                topics: ['Variables', 'Data Types', 'Input and Output', 'Operators', 'Conditional Statements', 'Loops'],
                practice: ['10 beginner Python problems', '1 small coding challenge'],
                english: ['Self Introduction', '10 daily-use English sentences', 'Read sentences aloud']
            },
            {
                day: 'Day 2 — Python Core',
                topics: ['Functions', 'Parameters', 'Return values', 'Lists', 'Tuples', 'Dictionaries', 'Sets'],
                practice: ['10 Python problems', '1 mini coding challenge'],
                english: ['Basic grammar', 'Daily-use vocabulary', '10 new words']
            },
            {
                day: 'Day 3 — NumPy',
                topics: ['NumPy installation & import', 'NumPy arrays', 'Array dimensions', 'Indexing', 'Slicing', 'Operations'],
                practice: ['NumPy exercises', 'Small array challenge'],
                english: ['Speaking practice', 'Describe your daily routine', '10 spoken sentences']
            },
            {
                day: 'Day 4 — Pandas',
                topics: ['Series', 'DataFrame', 'Reading CSV', 'Selecting columns', 'Filtering rows', 'Sorting data'],
                practice: ['Load CSV dataset', 'Perform basic filtering'],
                english: ['Technical English', '15 interview sentences', 'Pronunciation practice']
            },
            {
                day: 'Day 5 — Data Visualization',
                topics: ['Matplotlib', 'Line chart', 'Bar chart', 'Histogram', 'Scatter plot', 'Labels & Titles'],
                practice: ['Create 3 charts from dataset'],
                english: ['Explain one technical topic in simple English']
            },
            {
                day: 'Day 6 — Statistics',
                topics: ['Mean, Median, Mode', 'Range, Variance', 'Standard deviation', 'Percentiles', 'Correlation'],
                practice: ['Calculate statistics from dataset', 'Solve basic stats questions'],
                english: ['HR interview questions', 'Simple English answers', 'Speak answers aloud']
            },
            {
                day: 'Day 7 — Mini Data Science Project',
                topics: ['Choose dataset', 'Load & understand data', 'Clean data', 'Analyze & visualize', 'Write conclusion'],
                practice: ['End-to-end mini project workflow'],
                english: ['Self introduction', 'Explain project & findings']
            }
        ]
    },
    {
        id: 'sprint-2',
        title: 'Sprint 2 — NumPy',
        desc: 'Master multi-dimensional array operations, vectorization, and broadcasting.',
        days: [
            {
                day: 'Core Array Operations & Broadcasting',
                topics: ['Array creation', 'Shape & Reshape', 'Indexing & Slicing', 'Broadcasting rules', 'Vectorized math', 'Boolean indexing', 'Random module'],
                practice: ['Minimum 20 NumPy exercises', 'NumPy Data Analysis mini project']
            }
        ]
    },
    {
        id: 'sprint-3',
        title: 'Sprint 3 — Pandas',
        desc: 'Data manipulation, aggregation, joining, and timeseries handling in Pandas.',
        days: [
            {
                day: 'DataFrames & Advanced Aggregations',
                topics: ['Series & DataFrame', 'CSV/Excel/JSON I/O', 'Data filtering & sorting', 'Missing values handling', 'GroupBy & Aggregation', 'Merge, Join, Concat', 'Apply & Lambda', 'Datetime indexing'],
                practice: ['Sales Data Analysis complete project']
            }
        ]
    },
    {
        id: 'sprint-4',
        title: 'Sprint 4 — Data Cleaning',
        desc: 'Sanitizing messy real-world datasets for downstream modeling.',
        days: [
            {
                day: 'Data Hygiene & Outlier Treatment',
                topics: ['Missing values imputation', 'Duplicate handling', 'Type casting', 'Outlier detection (IQR/Z-score)', 'String & Date cleaning', 'Data validation checks'],
                practice: ['Messy Dataset Cleaning Project']
            }
        ]
    },
    {
        id: 'sprint-5',
        title: 'Sprint 5 — Statistics & Probability',
        desc: 'Probability distributions, sampling, hypothesis testing, and statistical inference.',
        days: [
            {
                day: 'Descriptive & Inferential Stats',
                topics: ['Central tendency & Spread', 'Probability axioms', 'Conditional probability', 'Normal & Binomial distributions', 'Sampling theory', 'Hypothesis testing basics'],
                practice: ['Statistical Dataset Analysis Project']
            }
        ]
    },
    {
        id: 'sprint-6',
        title: 'Sprint 6 — Data Visualization',
        desc: 'Advanced plotting with Matplotlib, Seaborn, and data storytelling principles.',
        days: [
            {
                day: 'Visual Storytelling & Seaborn',
                topics: ['Matplotlib advanced customization', 'Seaborn heatmaps, boxplots, pairplots', 'Subplot layouts', 'Color theory in data viz', 'Executive dashboard design'],
                practice: ['Interactive-style Sales Analysis Dashboard']
            }
        ]
    },
    {
        id: 'sprint-7',
        title: 'Sprint 7 — SQL',
        desc: 'Database management, complex joins, window functions, and CTEs.',
        days: [
            {
                day: 'Relational Queries & Analytics',
                topics: ['SELECT, WHERE, GROUP BY, HAVING', 'INNER/LEFT/RIGHT JOIN', 'Subqueries & UNION', 'Window functions (ROW_NUMBER, RANK)', 'CTEs'],
                practice: ['At least 50 SQL problems solved', 'Business Database Analysis Project']
            }
        ]
    },
    {
        id: 'sprint-8',
        title: 'Sprint 8 — Exploratory Data Analysis (EDA)',
        desc: 'Uncovering hidden patterns, correlations, and formulating analytical hypotheses.',
        days: [
            {
                day: 'Univariate, Bivariate & Multivariate EDA',
                topics: ['Formulating analytical questions', 'Univariate distribution checks', 'Bivariate scatter/box analysis', 'Correlation matrix heatmaps', 'Extracting actionable insights'],
                practice: ['Complete Exploratory Data Analysis Project']
            }
        ]
    },
    {
        id: 'sprint-9',
        title: 'Sprint 9 — Machine Learning Fundamentals',
        desc: 'Core paradigms of AI/ML, supervised vs unsupervised learning, and Scikit-Learn.',
        days: [
            {
                day: 'ML Theory & Scikit-Learn Setup',
                topics: ['AI vs ML vs Deep Learning', 'Train/test split strategy', 'Overfitting & Underfitting', 'Bias-Variance tradeoff', 'Scikit-Learn API standard pipeline'],
                practice: ['First Machine Learning Model End-to-End']
            }
        ]
    },
    {
        id: 'sprint-10',
        title: 'Sprint 10 — Supervised Learning',
        desc: 'Regression and classification algorithms for predictive modeling.',
        days: [
            {
                day: 'Regression & Classification Models',
                topics: ['Linear & Logistic Regression', 'K-Nearest Neighbors (KNN)', 'Decision Trees', 'Random Forests', 'Naive Bayes', 'Support Vector Machines (SVM)'],
                practice: ['House Price Prediction Project', 'Customer Churn Prediction Project']
            }
        ]
    },
    {
        id: 'sprint-11',
        title: 'Sprint 11 — Unsupervised Learning',
        desc: 'Clustering algorithms and dimensionality reduction techniques.',
        days: [
            {
                day: 'Clustering & PCA',
                topics: ['K-Means clustering', 'Hierarchical clustering', 'Principal Component Analysis (PCA)', 'Dimensionality reduction trade-offs'],
                practice: ['Customer Segmentation Project']
            }
        ]
    },
    {
        id: 'sprint-12',
        title: 'Sprint 12 — Feature Engineering',
        desc: 'Transforming raw features into high-signal representations for ML models.',
        days: [
            {
                day: 'Scaling, Encoding & Selection',
                topics: ['Feature selection methods', 'One-hot & Label encoding', 'Normalization vs Standardization', 'Polynomial features', 'Handling categorical cardinality'],
                practice: ['ML Dataset Feature Engineering Project']
            }
        ]
    },
    {
        id: 'sprint-13',
        title: 'Sprint 13 — Model Evaluation & Tuning',
        desc: 'Rigorous metrics, cross-validation, and hyperparameter optimization.',
        days: [
            {
                day: 'Metrics, CV & Hyperparameter Tuning',
                topics: ['Accuracy, Precision, Recall, F1', 'ROC-AUC & Confusion Matrix', 'MAE, MSE, RMSE', 'K-Fold Cross-Validation', 'Grid Search & Random Search'],
                practice: ['Model Evaluation & Hyperparameter Tuning Lab']
            }
        ]
    },
    {
        id: 'sprint-14',
        title: 'Sprint 14 — Advanced Machine Learning',
        desc: 'Ensemble methods, gradient boosting frameworks, and pipelines.',
        days: [
            {
                day: 'Boosting & Ensemble Pipelines',
                topics: ['Bagging vs Boosting', 'XGBoost fundamentals', 'LightGBM fundamentals', 'Scikit-Learn Pipelines & Transformers'],
                practice: ['Advanced Prediction System Project']
            }
        ]
    },
    {
        id: 'sprint-15',
        title: 'Sprint 15 — Deep Learning',
        desc: 'Neural networks, activation functions, backpropagation, and framework introduction.',
        days: [
            {
                day: 'Neural Networks & PyTorch/TF',
                topics: ['Perceptrons & Multi-Layer Perceptrons', 'Activation functions (ReLU, Sigmoid, Softmax)', 'Loss functions & Optimizers', 'Backpropagation mechanics', 'CNN & RNN introduction'],
                practice: ['Neural Network Classification Project']
            }
        ]
    },
    {
        id: 'sprint-16',
        title: 'Sprint 16 — Natural Language Processing (NLP)',
        desc: 'Text preprocessing, TF-IDF, word embeddings, and sentiment analysis.',
        days: [
            {
                day: 'Text Processing & Sentiment Analysis',
                topics: ['Tokenization, Stopwords, Lemmatization', 'Bag of Words & TF-IDF', 'Word Embeddings (Word2Vec)', 'Text classification & Sentiment analysis'],
                practice: ['Sentiment Analysis NLP Project']
            }
        ]
    },
    {
        id: 'sprint-17',
        title: 'Sprint 17 — Computer Vision',
        desc: 'Image processing with OpenCV, convolutional layers, and transfer learning.',
        days: [
            {
                day: 'OpenCV & Image Classification',
                topics: ['Images as matrices', 'OpenCV filtering & transformations', 'CNN architectures', 'Transfer learning with pre-trained models'],
                practice: ['Image Classification Project']
            }
        ]
    },
    {
        id: 'sprint-18',
        title: 'Sprint 18 — MLOps',
        desc: 'Experiment tracking, model serialization, containerization, and deployment baselines.',
        days: [
            {
                day: 'ML Pipelines & Deployment',
                topics: ['Model saving (Pickle/Joblib)', 'Experiment tracking concepts', 'Docker fundamentals for ML', 'Model monitoring & versioning'],
                practice: ['Deploy a Machine Learning Model']
            }
        ]
    },
    {
        id: 'sprint-19',
        title: 'Sprint 19 — APIs & Deployment',
        desc: 'Building RESTful APIs with FastAPI/Flask and connecting them to frontends.',
        days: [
            {
                day: 'FastAPI & Web Integration',
                topics: ['REST API design principles', 'FastAPI routing & Pydantic models', 'Connecting ML inference to API endpoints', 'Cloud hosting basics'],
                practice: ['ML Prediction Web App End-to-End']
            }
        ]
    },
    {
        id: 'sprint-20',
        title: 'Sprint 20 — Real-World Data Science Projects',
        desc: 'End-to-end portfolio project execution and documentation.',
        days: [
            {
                day: 'Portfolio Project Showcase',
                topics: ['Sales Prediction', 'Customer Churn System', 'Recommendation Engine', 'Fraud Detection', 'Sentiment Analyzer', 'End-to-End DS Pipeline'],
                practice: ['Build & document 7 core portfolio projects']
            }
        ]
    },
    {
        id: 'sprint-21',
        title: 'Sprint 21 — Git, GitHub & Portfolio',
        desc: 'Version control workflows, professional README documentation, and portfolio optimization.',
        days: [
            {
                day: 'Git Workflow & Portfolio Branding',
                topics: ['Git branching & merging', 'Professional GitHub READMEs', 'Portfolio website structuring', 'LinkedIn profile optimization'],
                practice: ['Complete portfolio and GitHub readiness checklist']
            }
        ]
    },
    {
        id: 'sprint-22',
        title: 'Sprint 22 — Interview Preparation',
        desc: 'Technical questions, system design case studies, behavioral mocks, and resume polish.',
        days: [
            {
                day: 'Interview Mastery & Mock Prep',
                topics: ['Python & SQL technical questions', 'Statistics & ML conceptual deep-dives', 'Data Science case studies', 'HR interview alignment', 'Mock interview simulations'],
                practice: ['Interview preparation checklist and mock run-throughs']
            }
        ]
    }
];

// Pre-defined Projects list for Sprint 20 & general tracker
const INITIAL_PROJECTS = [
    { id: 'proj-1', name: 'Sales Prediction', category: 'Regression', tech: 'Python, Pandas, Scikit-Learn', status: 'In Progress' },
    { id: 'proj-2', name: 'Customer Churn Prediction', category: 'Classification', tech: 'Python, XGBoost, Seaborn', status: 'Pending' },
    { id: 'proj-3', name: 'Recommendation System', category: 'Unsupervised', tech: 'Python, Collaborative Filtering', status: 'Pending' },
    { id: 'proj-4', name: 'Fraud Detection System', category: 'Imbalanced Data', tech: 'Python, Scikit-Learn, SMOTE', status: 'Pending' },
    { id: 'proj-5', name: 'Sentiment Analysis Engine', category: 'NLP', tech: 'Python, NLTK, TF-IDF', status: 'Pending' },
    { id: 'proj-6', name: 'Image Classification App', category: 'Computer Vision', tech: 'Python, PyTorch, OpenCV', status: 'Pending' },
    { id: 'proj-7', name: 'End-to-End DS Pipeline', category: 'MLOps', tech: 'FastAPI, Docker, Scikit-Learn', status: 'Pending' }
];

// English Modules
const ENGLISH_MODULES = [
    { id: 'eng-1', title: 'Self-Introduction & Fluency', desc: 'Practice pronouncing clear self-introductions and daily routines.' },
    { id: 'eng-2', title: 'Technical Vocabulary', desc: 'Master 50+ essential data science and programming terms.' },
    { id: 'eng-3', title: 'Explaining Technical Topics', desc: 'Practice articulating algorithms and data pipelines in simple English.' },
    { id: 'eng-4', title: 'HR & Behavioral Interviews', desc: 'Prepare confident responses to standard professional interview questions.' }
];

// Achievements List
const ACHIEVEMENTS_LIST = [
    { id: 'badge-python', title: '🐍 Python Starter', desc: 'Complete Sprint 1 tasks.', icon: '🐍' },
    { id: 'badge-explorer', title: '📊 Data Explorer', desc: 'Complete Pandas and NumPy sprints.', icon: '📊' },
    { id: 'badge-stats', title: '🧮 Statistics Beginner', desc: 'Finish Statistics & Probability tasks.', icon: '🧮' },
    { id: 'badge-sql', title: '🗄️ SQL Starter', desc: 'Complete SQL query exercises.', icon: '🗄️' },
    { id: 'badge-ml-beg', title: '🤖 ML Beginner', desc: 'Reach Machine Learning Fundamentals.', icon: '🤖' },
    { id: 'badge-ml-prac', title: '🧠 ML Practitioner', desc: 'Complete Supervised and Unsupervised sprints.', icon: '🧠' },
    { id: 'badge-deploy', title: '🚀 First Deployment', desc: 'Complete MLOps or API deployment modules.', icon: '🚀' },
    { id: 'badge-coding-50', title: '💻 50 Coding Problems', desc: 'Log 50 coding problems solved.', icon: '💻' },
    { id: 'badge-tasks-100', title: '📚 100 Tasks Completed', desc: 'Complete 100 roadmap tasks.', icon: '📚' },
    { id: 'badge-streak-7', title: '🔥 7 Day Streak', desc: 'Maintain a 7-day study streak.', icon: '🔥' },
    { id: 'badge-streak-30', title: '🔥 30 Day Streak', desc: 'Maintain a 30-day study streak.', icon: '🔥' },
    { id: 'badge-project', title: '🏆 First Data Science Project', desc: 'Mark a project as Completed.', icon: '🏆' },
    { id: 'badge-roadmap', title: '🏆 Data Science Roadmap Completed', desc: 'Complete all 22 sprints.', icon: '🏆' }
];

// Initialization on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initNavigation();
    initTheme();
    renderAll();
    checkStreakIntegrity();
});

// --- Storage Functions ---
function saveData() {
    localStorage.setItem('ds_tracker_state', JSON.stringify(appState));
}

function loadData() {
    const saved = localStorage.getItem('ds_tracker_state');
    if (saved) {
        try {
            appState = JSON.parse(saved);
            if (!appState.projects || Object.keys(appState.projects).length === 0) {
                INITIAL_PROJECTS.forEach(p => {
                    appState.projects[p.id] = { ...p, github: '', live: '', notes: '' };
                });
            }
        } catch (e) {
            console.error('Error loading saved state:', e);
        }
    } else {
        // Initialize default projects
        INITIAL_PROJECTS.forEach(p => {
            appState.projects[p.id] = { ...p, github: '', live: '', notes: '' };
        });
        saveData();
    }
}

// --- Navigation & Views ---
function initNavigation() {
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.getAttribute('data-target');
            navigateToView(target);
            
            // Close mobile sidebar if open
            document.getElementById('sidebar').classList.remove('mobile-open');
        });
    });

    document.getElementById('mobileMenuToggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.add('mobile-open');
    });

    document.getElementById('mobileCloseBtn').addEventListener('click', () => {
        document.getElementById('sidebar').classList.remove('mobile-open');
    });

    // Global Search listener
    document.getElementById('globalSearch').addEventListener('input', (e) => {
        handleGlobalSearch(e.target.value);
    });
}

function navigateToView(viewId) {
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(nav => nav.classList.remove('active'));

    const targetSection = document.getElementById(viewId);
    const targetNav = document.querySelector(`.sidebar-nav .nav-item[data-target="${viewId}"]`);

    if (targetSection) targetSection.classList.add('active');
    if (targetNav) {
        targetNav.classList.add('active');
        document.getElementById('topBarTitle').textContent = targetNav.textContent.replace(/[^\w\s]/gi, '').trim();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Theme Management ---
function initTheme() {
    if (appState.settings.darkMode) {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
    } else {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
    }
}

function toggleThemeMode() {
    appState.settings.darkMode = !appState.settings.darkMode;
    initTheme();
    saveData();
    showToast('Theme updated successfully', 'success');
}

// --- Master Render Function ---
function renderAll() {
    updateDashboard();
    renderRoadmap();
    renderSprintSelector();
    renderSprintWorkspace(appState.activeSprintId);
    renderCodingTable();
    renderProjectsGrid();
    renderEnglishDashboard();
    renderRevisionTable();
    renderAchievementsGrid();
    renderAnalytics();
    renderNotesGrid();
}

// --- 1. Dashboard Logic ---
function updateDashboard() {
    const totalTasks = getTotalRoadmapTasksCount();
    const completedTasks = getCompletedRoadmapTasksCount();
    const overallPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    document.getElementById('dashStreak').textContent = appState.streak.current;
    document.getElementById('sidebarStreakCount').textContent = appState.streak.current;
    document.getElementById('dashCompletedTasks').textContent = `${completedTasks} / ${totalTasks}`;
    document.getElementById('dashOverallPct').textContent = `${overallPct}%`;

    // Current Sprint Box
    const currentSprintObj = ROADMAP_DATA.find(s => s.id === appState.activeSprintId) || ROADMAP_DATA[0];
    document.getElementById('dashCurrentSprintName').textContent = currentSprintObj.title;
    document.getElementById('dashCurrentSprintDesc').textContent = currentSprintObj.desc;
    
    const sprintStats = getSprintProgressStats(currentSprintObj.id);
    document.getElementById('dashSprintBar').style.width = `${sprintStats.pct}%`;
    document.getElementById('dashSprintProgressText').textContent = `${sprintStats.pct}% Complete (${sprintStats.completed}/${sprintStats.total} Tasks)`;

    // Next Task Box
    renderNextTaskBox();

    // Today's Focus Checklist
    renderDashFocusChecklist();
}

function renderNextTaskBox() {
    const box = document.getElementById('dashNextTaskBox');
    let foundTask = null;
    let foundSprintTitle = '';

    for (let sprint of ROADMAP_DATA) {
        let tIdx = 0;
        for (let d = 0; d < sprint.days.length; d++) {
            const day = sprint.days[d];
            const allItems = [...day.topics, ...(day.practice || []), ...(day.english || [])];
            for (let i = 0; i < allItems.length; i++) {
                const key = `${sprint.id}_${d}_${i}`;
                if (!appState.tasks[key]) {
                    foundTask = allItems[i];
                    foundSprintTitle = sprint.title;
                    break;
                }
                tIdx++;
            }
            if (foundTask) break;
        }
        if (foundTask) break;
    }

    if (foundTask) {
        box.innerHTML = `
            <div class="next-task-meta">${foundSprintTitle}</div>
            <div class="next-task-title">→ ${foundTask}</div>
            <button class="btn-secondary mt-10" onclick="navigateToView('learn')">Open Workspace</button>
        `;
    } else {
        box.innerHTML = `<p class="text-muted">🎉 All roadmap tasks completed! You are ready for professional Data Science roles.</p>`;
    }
}

function renderDashFocusChecklist() {
    const container = document.getElementById('dashFocusChecklist');
    container.innerHTML = `
        <label class="task-checkbox-item ${appState.streak.todayCompleted ? 'checked' : ''}">
            <input type="checkbox" ${appState.streak.todayCompleted ? 'checked' : ''} disabled>
            <span>Complete at least 1 roadmap task or coding problem today</span>
        </label>
    `;
}

function markDayComplete() {
    appState.streak.todayCompleted = true;
    recordActivity();
    saveData();
    renderAll();
    showToast('Day marked complete! Streak updated 🔥', 'success');
}

function checkStreakIntegrity() {
    const today = new Date().toDateString();
    if (appState.streak.lastActiveDate) {
        const lastDate = new Date(appState.streak.lastActiveDate);
        const diffTime = Math.abs(new Date(today) - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 1 && !appState.streak.todayCompleted) {
            appState.streak.current = 0;
            appState.streak.todayCompleted = false;
        }
    }
}

function recordActivity() {
    const today = new Date().toDateString();
    if (appState.streak.lastActiveDate !== today) {
        appState.streak.current += 1;
        if (appState.streak.current > appState.streak.longest) {
            appState.streak.longest = appState.streak.current;
        }
        appState.streak.lastActiveDate = today;
    }
    checkAchievements();
}

// --- 2. Roadmap View Logic ---
function renderRoadmap() {
    const grid = document.getElementById('roadmapGrid');
    grid.innerHTML = '';

    ROADMAP_DATA.forEach(sprint => {
        const stats = getSprintProgressStats(sprint.id);
        let statusClass = 'locked';
        let statusText = '🔒 Locked';

        if (stats.pct === 100) {
            statusClass = 'completed';
            statusText = '✅ Completed';
        } else if (stats.completed > 0 || sprint.id === 'sprint-1') {
            statusClass = 'in-progress';
            statusText = '🟡 In Progress';
        }

        const card = document.createElement('div');
        card.className = 'roadmap-card';
        card.innerHTML = `
            <div class="roadmap-card-header">
                <span class="roadmap-card-title">${sprint.title}</span>
                <span class="status-badge ${statusClass}">${statusText}</span>
            </div>
            <p style="font-size: 13px; color: var(--text-muted);">${sprint.desc}</p>
            <div class="progress-bar-wrap">
                <div class="progress-bar-fill" style="width: ${stats.pct}%"></div>
            </div>
            <div class="flex-between">
                <span class="progress-text">${stats.completed} / ${stats.total} Tasks</span>
                <button class="btn-secondary" onclick="openSprintWorkspace('${sprint.id}')">Start / View →</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function openSprintWorkspace(sprintId) {
    appState.activeSprintId = sprintId;
    document.getElementById('activeSprintSelector').value = sprintId;
    navigateToView('learn');
    renderSprintWorkspace(sprintId);
}

// --- 3. Learn View / Sprint Workspace ---
function renderSprintSelector() {
    const select = document.getElementById('activeSprintSelector');
    select.innerHTML = '';
    ROADMAP_DATA.forEach(sprint => {
        const opt = document.createElement('option');
        opt.value = sprint.id;
        opt.textContent = sprint.title;
        if (sprint.id === appState.activeSprintId) opt.selected = true;
        select.appendChild(opt);
    });
}

function switchActiveSprint(sprintId) {
    appState.activeSprintId = sprintId;
    renderSprintWorkspace(sprintId);
}

function renderSprintWorkspace(sprintId) {
    const sprint = ROADMAP_DATA.find(s => s.id === sprintId) || ROADMAP_DATA[0];
    document.getElementById('workspaceSprintTitle').textContent = sprint.title;
    
    const stats = getSprintProgressStats(sprint.id);
    const statusSpan = document.getElementById('workspaceSprintStatus');
    statusSpan.textContent = stats.pct === 100 ? 'Completed ✅' : 'In Progress 🟡';
    statusSpan.className = `badge ${stats.pct === 100 ? 'status-badge completed' : 'status-badge in-progress'}`;

    const container = document.getElementById('workspaceContent');
    container.innerHTML = '';

    sprint.days.forEach((dayObj, dIdx) => {
        const dayBox = document.createElement('div');
        dayBox.className = 'module-day-box';
        
        let html = `<div class="module-day-title">${dayObj.day}</div>`;

        // Render topics
        if (dayObj.topics) {
            html += `<div style="font-size:12px; font-weight:600; color:var(--text-muted); margin-bottom:6px;">TOPICS:</div>`;
            dayObj.topics.forEach((topic, tIdx) => {
                const key = `${sprint.id}_${dIdx}_${tIdx}`;
                const isChecked = !!appState.tasks[key];
                html += `
                    <label class="task-checkbox-item ${isChecked ? 'checked' : ''}">
                        <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="toggleTaskState('${key}')">
                        <span>${topic}</span>
                    </label>
                `;
            });
        }

        // Render practice
        if (dayObj.practice) {
            html += `<div style="font-size:12px; font-weight:600; color:var(--text-muted); margin: 10px 0 6px 0;">PRACTICE:</div>`;
            const offsetIdx = dayObj.topics.length;
            dayObj.practice.forEach((prac, pIdx) => {
                const key = `${sprint.id}_${dIdx}_${offsetIdx + pIdx}`;
                const isChecked = !!appState.tasks[key];
                html += `
                    <label class="task-checkbox-item ${isChecked ? 'checked' : ''}">
                        <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="toggleTaskState('${key}')">
                        <span>💻 ${prac}</span>
                    </label>
                `;
            });
        }

        // Render English if present
        if (dayObj.english) {
            html += `<div style="font-size:12px; font-weight:600; color:var(--text-muted); margin: 10px 0 6px 0;">ENGLISH LEARNING:</div>`;
            const offsetIdx = dayObj.topics.length + (dayObj.practice ? dayObj.practice.length : 0);
            dayObj.english.forEach((eng, eIdx) => {
                const key = `${sprint.id}_${dIdx}_${offsetIdx + eIdx}`;
                const isChecked = !!appState.tasks[key];
                html += `
                    <label class="task-checkbox-item ${isChecked ? 'checked' : ''}">
                        <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="toggleTaskState('${key}')">
                        <span>🇬🇧 ${eng}</span>
                    </label>
                `;
            });
        }

        dayBox.innerHTML = html;
        container.appendChild(dayBox);
    });
}

function toggleTaskState(taskKey) {
    appState.tasks[taskKey] = !appState.tasks[taskKey];
    recordActivity();
    saveData();
    updateDashboard();
    renderRoadmap();
    checkAchievements();
    showToast('Task completed 🎉', 'success');
}

// --- Progress Calculation Utilities ---
function getSprintProgressStats(sprintId) {
    const sprint = ROADMAP_DATA.find(s => s.id === sprintId);
    if (!sprint) return { completed: 0, total: 0, pct: 0 };

    let total = 0;
    let completed = 0;

    sprint.days.forEach((day, dIdx) => {
        const count = day.topics.length + (day.practice ? day.practice.length : 0) + (day.english ? day.english.length : 0);
        total += count;
        for (let i = 0; i < count; i++) {
            if (appState.tasks[`${sprintId}_${dIdx}_${i}`]) {
                completed++;
            }
        }
    });

    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, pct };
}

function getTotalRoadmapTasksCount() {
    let total = 0;
    ROADMAP_DATA.forEach(s => {
        s.days.forEach(d => {
            total += d.topics.length + (d.practice ? d.practice.length : 0) + (d.english ? d.english.length : 0);
        });
    });
    return total;
}

function getCompletedRoadmapTasksCount() {
    let completed = 0;
    ROADMAP_DATA.forEach(s => {
        s.days.forEach((d, dIdx) => {
            const count = d.topics.length + (d.practice ? d.practice.length : 0) + (d.english ? d.english.length : 0);
            for (let i = 0; i < count; i++) {
                if (appState.tasks[`${s.id}_${dIdx}_${i}`]) {
                    completed++;
                }
            }
        });
    });
    return completed;
}

// --- 4. Coding Tracker Logic ---
let currentCodingFilter = 'all';

function renderCodingTable() {
    const tbody = document.getElementById('codingTableBody');
    tbody.innerHTML = '';

    const problems = Object.values(appState.coding);
    const filtered = currentCodingFilter === 'all' 
        ? problems 
        : problems.filter(p => p.category === currentCodingFilter);

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--text-muted);">No coding problems logged yet. Click "+ Add Problem" to begin.</td></tr>`;
        return;
    }

    filtered.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${p.name}</strong></td>
            <td><span class="badge" style="background:rgba(59,130,246,0.1); color:var(--accent-blue);">${p.category}</span></td>
            <td>${p.difficulty}</td>
            <td><span class="status-badge ${p.status === 'Completed' ? 'completed' : 'in-progress'}">${p.status}</span></td>
            <td>${p.date || 'N/A'}</td>
            <td>
                <button class="btn-secondary" style="padding: 4px 8px; font-size: 11px;" onclick="deleteCodingProblem('${p.id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filterCoding(cat, event) {
    currentCodingFilter = cat;
    document.querySelectorAll('#coding .filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderCodingTable();
}

function openAddCodingModal() {
    openModal(`
        <div class="modal-header">
            <h3>Add Coding Problem</h3>
            <button class="modal-close" onclick="closeModal()">×</button>
        </div>
        <form onsubmit="saveCodingProblem(event)">
            <div class="form-group">
                <label>Problem Name</label>
                <input type="text" id="cpName" required placeholder="e.g. Two Sum">
            </div>
            <div class="form-group">
                <label>Category</label>
                <select id="cpCategory">
                    <option value="Python">Python</option>
                    <option value="SQL">SQL</option>
                    <option value="DSA">DSA</option>
                    <option value="ML">ML Practice</option>
                </select>
            </div>
            <div class="form-group">
                <label>Difficulty</label>
                <select id="cpDifficulty">
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
            </div>
            <div class="form-group">
                <label>Status</label>
                <select id="cpStatus">
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                </select>
            </div>
            <button type="submit" class="btn-primary mt-10" style="width: 100%;">Save Problem</button>
        </form>
    `);
}

function saveCodingProblem(e) {
    e.preventDefault();
    const id = 'cp-' + Date.now();
    appState.coding[id] = {
        id,
        name: document.getElementById('cpName').value,
        category: document.getElementById('cpCategory').value,
        difficulty: document.getElementById('cpDifficulty').value,
        status: document.getElementById('cpStatus').value,
        date: new Date().toLocaleDateString()
    };
    recordActivity();
    saveData();
    renderCodingTable();
    checkAchievements();
    closeModal();
    showToast('Coding problem added successfully', 'success');
}

function deleteCodingProblem(id) {
    delete appState.coding[id];
    saveData();
    renderCodingTable();
    showToast('Problem removed', 'warning');
}

// --- 5. Projects View Logic ---
function renderProjectsGrid() {
    const grid = document.getElementById('projectsGrid');
    grid.innerHTML = '';

    Object.values(appState.projects).forEach(proj => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <div class="flex-between">
                <span class="project-title">${proj.name}</span>
                <span class="status-badge ${proj.status === 'Completed' ? 'completed' : 'in-progress'}">${proj.status}</span>
            </div>
            <div class="project-meta-pills">
                <span class="mini-pill">${proj.category}</span>
                <span class="mini-pill">${proj.tech}</span>
            </div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
                GitHub: ${proj.github ? `<a href="${proj.github}" target="_blank" style="color:var(--accent-blue);">Link</a>` : 'Not linked'} | 
                Live: ${proj.live ? `<a href="${proj.live}" target="_blank" style="color:var(--accent-blue);">Demo</a>` : 'Not linked'}
            </div>
            <button class="btn-secondary mt-10" onclick="openEditProjectModal('${proj.id}')">Edit Project Details</button>
        `;
        grid.appendChild(card);
    });
}

function openEditProjectModal(projId) {
    const proj = appState.projects[projId];
    openModal(`
        <div class="modal-header">
            <h3>Edit Project: ${proj.name}</h3>
            <button class="modal-close" onclick="closeModal()">×</button>
        </div>
        <form onsubmit="saveProjectDetails(event, '${projId}')">
            <div class="form-group">
                <label>Status</label>
                <select id="projStatus">
                    <option value="Pending" ${proj.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="In Progress" ${proj.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="Completed" ${proj.status === 'Completed' ? 'selected' : ''}>Completed</option>
                </select>
            </div>
            <div class="form-group">
                <label>GitHub Repository URL</label>
                <input type="url" id="projGithub" value="${proj.github || ''}" placeholder="https://github.com/...">
            </div>
            <div class="form-group">
                <label>Live Demo URL</label>
                <input type="url" id="projLive" value="${proj.live || ''}" placeholder="https://...">
            </div>
            <button type="submit" class="btn-primary mt-10" style="width: 100%;">Update Project</button>
        </form>
    `);
}

function saveProjectDetails(e, projId) {
    e.preventDefault();
    appState.projects[projId].status = document.getElementById('projStatus').value;
    appState.projects[projId].github = document.getElementById('projGithub').value;
    appState.projects[projId].live = document.getElementById('projLive').value;
    
    recordActivity();
    saveData();
    renderProjectsGrid();
    checkAchievements();
    closeModal();
    showToast('Project updated successfully', 'success');
}

// --- 6. English Learning System ---
function renderEnglishDashboard() {
    const grid = document.getElementById('englishModulesGrid');
    grid.innerHTML = '';

    let totalTasks = ENGLISH_MODULES.length * 3;
    let completedTasks = 0;

    ENGLISH_MODULES.forEach((mod, mIdx) => {
        for (let i = 0; i < 3; i++) {
            if (appState.english[`${mIdx}_${i}`]) completedTasks++;
        }
    });

    const pct = Math.round((completedTasks / totalTasks) * 100);
    document.getElementById('englishProgressText').textContent = `${pct}% Completed`;
    document.getElementById('englishProgressBar').style.width = `${pct}%`;

    ENGLISH_MODULES.forEach((mod, mIdx) => {
        const card = document.createElement('div');
        card.className = 'glass-card';
        card.innerHTML = `
            <h4 style="font-size:15px; font-weight:600; margin-bottom:4px;">${mod.title}</h4>
            <p style="font-size:12px; color:var(--text-muted); margin-bottom:12px;">${mod.desc}</p>
            <label class="task-checkbox-item ${appState.english[`${mIdx}_0`] ? 'checked' : ''}">
                <input type="checkbox" ${appState.english[`${mIdx}_0`] ? 'checked' : ''} onchange="toggleEnglishTask('${mIdx}_0')">
                <span>Learn 10 technical terms & phrases</span>
            </label>
            <label class="task-checkbox-item ${appState.english[`${mIdx}_1`] ? 'checked' : ''}">
                <input type="checkbox" ${appState.english[`${mIdx}_1`] ? 'checked' : ''} onchange="toggleEnglishTask('${mIdx}_1')">
                <span>Speak 10 sentences aloud</span>
            </label>
            <label class="task-checkbox-item ${appState.english[`${mIdx}_2`] ? 'checked' : ''}">
                <input type="checkbox" ${appState.english[`${mIdx}_2`] ? 'checked' : ''} onchange="toggleEnglishTask('${mIdx}_2')">
                <span>Explain module topic in simple English</span>
            </label>
        `;
        grid.appendChild(card);
    });
}

function toggleEnglishTask(key) {
    appState.english[key] = !appState.english[key];
    recordActivity();
    saveData();
    renderEnglishDashboard();
    showToast('English task updated', 'success');
}

// --- 7. Revision System ---
function renderRevisionTable() {
    const tbody = document.getElementById('revisionTableBody');
    tbody.innerHTML = '';

    // Collect topics from completed or in-progress sprints
    let revisionItems = [];
    ROADMAP_DATA.forEach(sprint => {
        sprint.days.forEach(day => {
            day.topics.forEach(topic => {
                const revKey = `${sprint.id}_${topic}`;
                const status = appState.revisions[revKey] || 'Due';
                revisionItems.push({ topic, sprint: sprint.title, key: revKey, status });
            });
        });
    });

    if (revisionItems.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No topics available for revision yet.</td></tr>`;
        return;
    }

    revisionItems.slice(0, 30).forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${item.topic}</strong></td>
            <td><span style="font-size:12px; color:var(--text-muted);">${item.sprint}</span></td>
            <td><span class="status-badge ${item.status === 'Revised ✅' ? 'completed' : 'in-progress'}">${item.status}</span></td>
            <td>
                <button class="btn-secondary" style="padding:4px 10px; font-size:11px;" onclick="toggleRevisionStatus('${item.key}')">
                    ${item.status === 'Revised ✅' ? 'Mark Due' : 'Mark Revised ✅'}
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function toggleRevisionStatus(key) {
    const current = appState.revisions[key];
    appState.revisions[key] = current === 'Revised ✅' ? 'Due' : 'Revised ✅';
    saveData();
    renderRevisionTable();
    showToast('Revision status updated', 'success');
}

// --- 8. Achievements Logic ---
function checkAchievements() {
    const completedTasks = getCompletedRoadmapTasksCount();
    const codingCount = Object.keys(appState.coding).length;
    const completedProjects = Object.values(appState.projects).filter(p => p.status === 'Completed').length;

    if (completedTasks >= 1) appState.achievements['badge-python'] = true;
    if (completedTasks >= 30) appState.achievements['badge-explorer'] = true;
    if (completedTasks >= 60) appState.achievements['badge-stats'] = true;
    if (completedTasks >= 90) appState.achievements['badge-sql'] = true;
    if (completedTasks >= 120) appState.achievements['badge-ml-beg'] = true;
    if (completedTasks >= 100) appState.achievements['badge-tasks-100'] = true;
    if (codingCount >= 50) appState.achievements['badge-coding-50'] = true;
    if (completedProjects >= 1) appState.achievements['badge-project'] = true;
    if (appState.streak.current >= 7) appState.achievements['badge-streak-7'] = true;
    if (appState.streak.current >= 30) appState.achievements['badge-streak-30'] = true;

    saveData();
}

function renderAchievementsGrid() {
    const grid = document.getElementById('achievementsGrid');
    grid.innerHTML = '';

    ACHIEVEMENTS_LIST.forEach(badge => {
        const isUnlocked = !!appState.achievements[badge.id];
        const card = document.createElement('div');
        card.className = `achievement-card ${isUnlocked ? 'unlocked' : ''}`;
        card.innerHTML = `
            <div class="achievement-icon">${badge.icon}</div>
            <div class="achievement-info">
                <h4>${badge.title}</h4>
                <p>${badge.desc}</p>
                <span style="font-size:10px; font-weight:600; color:${isUnlocked ? 'var(--success)' : 'var(--text-muted)'};">
                    ${isUnlocked ? 'UNLOCKED 🏆' : 'LOCKED'}
                </span>
            </div>
        `;
        grid.appendChild(card);
    });
}

// --- 9. Analytics View ---
function renderAnalytics() {
    document.getElementById('analyticsStreakBig').textContent = appState.streak.current;
    document.getElementById('analyticsLongestStreak').textContent = appState.streak.longest;
    document.getElementById('analyticsTotalTasksDone').textContent = getCompletedRoadmapTasksCount();
    document.getElementById('analyticsTotalCoding').textContent = Object.keys(appState.coding).length;

    const catList = document.getElementById('analyticsCategoryList');
    catList.innerHTML = '';

    const displaySprints = ROADMAP_DATA.slice(0, 6);
    displaySprints.forEach(sprint => {
        const stats = getSprintProgressStats(sprint.id);
        const item = document.createElement('div');
        item.className = 'analytics-bar-item';
        item.innerHTML = `
            <div class="flex-between" style="font-size: 13px;">
                <span>${sprint.title.split('—')[0]}</span>
                <span style="color:var(--text-muted);">${stats.pct}%</span>
            </div>
            <div class="progress-bar-wrap">
                <div class="progress-bar-fill" style="width: ${stats.pct}%"></div>
            </div>
        `;
        catList.appendChild(item);
    });
}

// --- 10. Notes Bank Logic ---
function renderNotesGrid() {
    const grid = document.getElementById('notesGrid');
    grid.innerHTML = '';

    const notes = Object.values(appState.notes);
    if (notes.length === 0) {
        grid.innerHTML = `<p class="text-muted">No notes recorded yet. Click "+ Add Note" to store technical takeaways.</p>`;
        return;
    }

    notes.forEach(note => {
        const card = document.createElement('div');
        card.className = 'note-card';
        card.innerHTML = `
            <h4>${note.title}</h4>
            <span style="font-size:11px; color:var(--accent-purple);">${note.date}</span>
            <p>${note.content}</p>
            <button class="btn-danger" style="padding:4px 8px; font-size:11px; align-self:flex-start; margin-top:10px;" onclick="deleteNote('${note.id}')">Delete Note</button>
        `;
        grid.appendChild(card);
    });
}

function openAddNoteModal() {
    openModal(`
        <div class="modal-header">
            <h3>Add Technical Note</h3>
            <button class="modal-close" onclick="closeModal()">×</button>
        </div>
        <form onsubmit="saveNote(event)">
            <div class="form-group">
                <label>Title / Topic</label>
                <input type="text" id="noteTitle" required placeholder="e.g. Pandas Vectorization Note">
            </div>
            <div class="form-group">
                <label>Content / Takeaways</label>
                <textarea id="noteContent" rows="4" required placeholder="Write your notes here..."></textarea>
            </div>
            <button type="submit" class="btn-primary mt-10" style="width: 100%;">Save Note</button>
        </form>
    `);
}

function saveNote(e) {
    e.preventDefault();
    const id = 'note-' + Date.now();
    appState.notes[id] = {
        id,
        title: document.getElementById('noteTitle').value,
        content: document.getElementById('noteContent').value,
        date: new Date().toLocaleDateString()
    };
    saveData();
    renderNotesGrid();
    closeModal();
    showToast('Note saved successfully', 'success');
}

function deleteNote(id) {
    delete appState.notes[id];
    saveData();
    renderNotesGrid();
    showToast('Note deleted', 'warning');
}

// --- 11. Global Search Handler ---
function handleGlobalSearch(query) {
    if (!query || query.trim() === '') return;
    const q = query.toLowerCase();
    
    // Check if matching any sprint title
    const foundSprint = ROADMAP_DATA.find(s => s.title.toLowerCase().includes(q));
    if (foundSprint) {
        openSprintWorkspace(foundSprint.id);
        showToast(`Navigated to ${foundSprint.title}`, 'success');
    }
}

// --- 12. Settings Backup & Reset ---
function exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `ds_learning_tracker_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    showToast('Backup exported successfully', 'success');
}

function importData(event) {
    const fileReader = new FileReader();
    if (event.target.files[0]) {
        fileReader.readAsText(event.target.files[0], "UTF-8");
        fileReader.onload = (e) => {
            try {
                const parsed = JSON.parse(e.target.result);
                appState = parsed;
                saveData();
                initTheme();
                renderAll();
                showToast('Progress imported successfully', 'success');
            } catch (err) {
                showToast('Invalid JSON backup file', 'error');
            }
        };
    }
}

function confirmResetProgress() {
    if (confirm("Are you sure you want to completely reset all progress, tasks, and streaks? This action cannot be undone.")) {
        localStorage.removeItem('ds_tracker_state');
        location.reload();
    }
}

// --- Modal & Toast UI Helpers ---
function openModal(htmlContent) {
    const overlay = document.getElementById('modalOverlay');
    overlay.innerHTML = `<div class="modal-box">${htmlContent}</div>`;
    overlay.classList.add('active');
}

function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.remove('active');
    overlay.innerHTML = '';
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}