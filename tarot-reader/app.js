/**
 * Oraculo - Tarot Card Reader Application
 * Professional UI/UX Implementation
 */

// ============================================
// Card Data Configuration
// ============================================

const MAJOR_ARCANA = [
    { id: "1", name: "O Mago", numeral: "I" },
    { id: "2", name: "A Papisa", numeral: "II" },
    { id: "3", name: "A Imperatriz", numeral: "III" },
    { id: "4", name: "O Imperador", numeral: "IV" },
    { id: "5", name: "O Papa", numeral: "V" },
    { id: "6", name: "O Amante", numeral: "VI" },
    { id: "7", name: "O Carro", numeral: "VII" },
    { id: "8", name: "A Justiça", numeral: "VIII" },
    { id: "9", name: "O Eremita", numeral: "IX" },
    { id: "10", name: "A Roda da Fortuna", numeral: "X" },
    { id: "11", name: "A Força", numeral: "XI" },
    { id: "12", name: "O Enforcado", numeral: "XII" },
    { id: "13", name: "A Morte", numeral: "XIII" },
    { id: "14", name: "Temperança", numeral: "XIV" },
    { id: "15", name: "O Diabo", numeral: "XV" },
    { id: "16", name: "A Casa Deus", numeral: "XVI" },
    { id: "17", name: "A Estrela", numeral: "XVII" },
    { id: "18", name: "A Lua", numeral: "XVIII" },
    { id: "19", name: "O Sol", numeral: "XIX" },
    { id: "20", name: "O Julgamento", numeral: "XX" },
    { id: "21", name: "O Mundo", numeral: "XXI" },
    { id: "22", name: "O Louco", numeral: "0" }
];

// Note: The tarot_data.json only contains Major Arcana interactions (22 cards)
// Minor Arcana are not included in the interaction dynamics data
const ALL_CARDS = MAJOR_ARCANA.map(c => ({ ...c, type: 'major' }));

// Dynamic descriptions
const DYNAMICS_INFO = {
    engendrar: {
        name: "Engendrar",
        subtitle: "Como uma energia gera a outra",
        icon: "✦",
        description: "A relação de criação e geração entre as cartas"
    },
    conflito: {
        name: "Conflito",
        subtitle: "Onde as energias colidem",
        icon: "⚔",
        description: "Os pontos de tensão e oposição entre as cartas"
    },
    estagnar: {
        name: "Estagnar",
        subtitle: "Quando o movimento cessa",
        icon: "◯",
        description: "Como a combinação pode levar à paralisia"
    },
    regressar: {
        name: "Regressar",
        subtitle: "O caminho de volta",
        icon: "↺",
        description: "A dinâmica de retorno e diminuição"
    },
    necessitar: {
        name: "Necessitar",
        subtitle: "O que uma precisa da outra",
        icon: "∞",
        description: "As necessidades mútuas entre as energias"
    }
};

const DYNAMICS_ORDER = ['engendrar', 'conflito', 'estagnar', 'regressar', 'necessitar'];

// ============================================
// Application State
// ============================================

const state = {
    tarotData: null,
    selectedCards: [null, null],
    searchQuery: '',
    currentDynamic: 'engendrar',
    isLoading: false
};

// ============================================
// DOM Elements
// ============================================

const elements = {
    // Selection Section
    heroSection: document.getElementById('heroSection'),
    selectionSection: document.getElementById('selectionSection'),
    cardsGrid: document.getElementById('cardsGrid'),
    searchInput: document.getElementById('searchInput'),
    searchClear: document.getElementById('searchClear'),
    slot1: document.getElementById('slot1'),
    slot2: document.getElementById('slot2'),
    connectionIndicator: document.getElementById('connectionIndicator'),
    btnRead: document.getElementById('btnRead'),
    btnReset: document.getElementById('btnReset'),

    // Reading Section
    readingSection: document.getElementById('readingSection'),
    readingTitle: document.getElementById('readingTitle'),
    readingCardsDisplay: document.getElementById('readingCardsDisplay'),
    dynamicsNav: document.getElementById('dynamicsNav'),
    readingContent: document.getElementById('readingContent'),
    quickNav: document.getElementById('quickNav'),
    navIndicator: document.getElementById('navIndicator'),
    btnBack: document.getElementById('btnBack'),

    // Loading
    loadingOverlay: document.getElementById('loadingOverlay')
};

// ============================================
// Data Loading
// ============================================

async function loadTarotData() {
    const paths = ['./tarot_data.json', '../tarot_data.json', '/tarot_data.json'];

    for (const path of paths) {
        try {
            const response = await fetch(path);
            if (response.ok) {
                state.tarotData = await response.json();
                console.log(`Tarot data loaded successfully from ${path}`);
                return;
            }
        } catch (error) {
            console.log(`Trying alternate path, ${path} failed:`, error.message);
        }
    }

    console.error('Failed to load tarot data from all paths');
}

// ============================================
// Card Grid Rendering
// ============================================

function renderCardsGrid() {
    const fragment = document.createDocumentFragment();

    ALL_CARDS.forEach(card => {
        const cardElement = createCardElement(card);
        fragment.appendChild(cardElement);
    });

    elements.cardsGrid.innerHTML = '';
    elements.cardsGrid.appendChild(fragment);
}

function createCardElement(card) {
    const div = document.createElement('div');
    div.className = 'card-item';
    div.dataset.id = card.id;
    div.dataset.name = card.name.toLowerCase();
    div.dataset.type = card.type;

    const isSelected = state.selectedCards.some(s => s?.id === card.id);
    const isFull = state.selectedCards[0] !== null && state.selectedCards[1] !== null;
    const isDisabled = !isSelected && isFull;

    if (isSelected) div.classList.add('selected');
    if (isDisabled) div.classList.add('disabled');

    div.innerHTML = `
        <span class="card-number">${card.numeral}</span>
        <span class="card-name">${card.name}</span>
        ${card.suit ? `<span class="card-suit">${card.element}</span>` : ''}
    `;

    div.addEventListener('click', () => handleCardClick(card));

    return div;
}

function updateCardsGrid() {
    const cards = elements.cardsGrid.querySelectorAll('.card-item');
    const isFull = state.selectedCards[0] !== null && state.selectedCards[1] !== null;

    cards.forEach(cardEl => {
        const cardId = cardEl.dataset.id;
        const cardName = cardEl.dataset.name;

        const isSelected = state.selectedCards.some(s => s?.id === cardId);
        const isDisabled = !isSelected && isFull;

        // Check search visibility
        let isVisible = true;
        if (state.searchQuery) {
            isVisible = cardName.includes(state.searchQuery.toLowerCase());
        }

        // Apply classes
        cardEl.classList.toggle('selected', isSelected);
        cardEl.classList.toggle('disabled', isDisabled);
        cardEl.classList.toggle('hidden', !isVisible);
    });
}

// ============================================
// Card Selection Handling
// ============================================

function handleCardClick(card) {
    const slot1 = state.selectedCards[0];
    const slot2 = state.selectedCards[1];

    // Check if card is already selected
    if (slot1?.id === card.id) {
        state.selectedCards[0] = null;
    } else if (slot2?.id === card.id) {
        state.selectedCards[1] = null;
    } else if (slot1 === null) {
        state.selectedCards[0] = card;
    } else if (slot2 === null) {
        state.selectedCards[1] = card;
    } else {
        // Both slots full, can't add more
        return;
    }

    updateSelectedCardsDisplay();
    updateCardsGrid();
    updateReadButton();
}

function updateSelectedCardsDisplay() {
    const slot1Card = state.selectedCards[0];
    const slot2Card = state.selectedCards[1];

    // Update slot 1
    if (slot1Card) {
        elements.slot1.classList.add('filled');
        elements.slot1.innerHTML = `
            <div class="selected-card-content" style="--card-color: var(--color-${slot1Card.type})">
                <span class="selected-card-number">${slot1Card.numeral}</span>
                <span class="selected-card-name">${slot1Card.name}</span>
            </div>
        `;
    } else {
        elements.slot1.classList.remove('filled');
        elements.slot1.innerHTML = `
            <div class="card-placeholder">
                <span class="placeholder-number">1</span>
                <span class="placeholder-text">Primeira Carta</span>
            </div>
        `;
    }

    // Update slot 2
    if (slot2Card) {
        elements.slot2.classList.add('filled');
        elements.slot2.innerHTML = `
            <div class="selected-card-content" style="--card-color: var(--color-${slot2Card.type})">
                <span class="selected-card-number">${slot2Card.numeral}</span>
                <span class="selected-card-name">${slot2Card.name}</span>
            </div>
        `;
    } else {
        elements.slot2.classList.remove('filled');
        elements.slot2.innerHTML = `
            <div class="card-placeholder">
                <span class="placeholder-number">2</span>
                <span class="placeholder-text">Segunda Carta</span>
            </div>
        `;
    }

    // Update connection indicator
    if (slot1Card && slot2Card) {
        elements.connectionIndicator.classList.add('active');
    } else {
        elements.connectionIndicator.classList.remove('active');
    }
}

function updateReadButton() {
    const canRead = state.selectedCards[0] !== null && state.selectedCards[1] !== null;
    elements.btnRead.disabled = !canRead;
}

// ============================================
// Slot Click Handling
// ============================================

function handleSlotClick(slotIndex) {
    if (state.selectedCards[slotIndex] !== null) {
        state.selectedCards[slotIndex] = null;
        updateSelectedCardsDisplay();
        updateCardsGrid();
        updateReadButton();
    }
}

// ============================================
// Search
// ============================================

function handleSearchInput(query) {
    state.searchQuery = query;
    elements.searchClear.classList.toggle('visible', query.length > 0);
    updateCardsGrid();
}

function clearSearch() {
    state.searchQuery = '';
    elements.searchInput.value = '';
    elements.searchClear.classList.remove('visible');
    updateCardsGrid();
}

// ============================================
// Reading Display
// ============================================

function showReading() {
    if (!state.tarotData) {
        console.error('Tarot data not loaded');
        return;
    }

    const card1 = state.selectedCards[0];
    const card2 = state.selectedCards[1];

    if (!card1 || !card2) return;

    // Show loading
    showLoading();

    // Simulate loading for dramatic effect
    setTimeout(() => {
        hideLoading();

        // Hide selection, show reading
        elements.heroSection.classList.add('hidden');
        elements.selectionSection.classList.add('hidden');
        elements.readingSection.classList.remove('hidden');

        // Update reading title
        elements.readingTitle.textContent = `${card1.name} → ${card2.name}`;

        // Render reading cards
        renderReadingCards(card1, card2);

        // Set initial dynamic
        state.currentDynamic = 'engendrar';
        updateDynamicsNav();
        renderDynamicContent();

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
}

function renderReadingCards(card1, card2) {
    elements.readingCardsDisplay.innerHTML = `
        <div class="reading-card" style="--card-color: var(--color-${card1.type})">
            <span class="reading-card-label">Carta 1</span>
            <span class="reading-card-number">${card1.numeral}</span>
            <span class="reading-card-name">${card1.name}</span>
        </div>
        <div class="reading-connection">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
            <span class="reading-connection-text">Dinâmica</span>
        </div>
        <div class="reading-card" style="--card-color: var(--color-${card2.type})">
            <span class="reading-card-label">Carta 2</span>
            <span class="reading-card-number">${card2.numeral}</span>
            <span class="reading-card-name">${card2.name}</span>
        </div>
    `;
}

function findInteraction(card1Id, card2Id) {
    if (!state.tarotData) return null;

    // Find the source card in tarot data
    const sourceCard = state.tarotData.find(c => c.id === card1Id);
    if (!sourceCard) return null;

    // Find the interaction with target card
    const interaction = sourceCard.interactions?.find(i => i.target_id === card2Id);
    return interaction?.dynamics || null;
}

function renderDynamicContent() {
    const card1 = state.selectedCards[0];
    const card2 = state.selectedCards[1];
    const dynamicKey = state.currentDynamic;
    const dynamicInfo = DYNAMICS_INFO[dynamicKey];

    // Find the interaction
    const dynamics = findInteraction(card1.id, card2.id);

    let content = '';
    if (dynamics && dynamics[dynamicKey]) {
        content = dynamics[dynamicKey];
    } else {
        content = `Não foi possível encontrar a interpretação da dinâmica de ${dynamicInfo.name.toLowerCase()} entre ${card1.name} e ${card2.name}. Esta combinação pode não estar disponível no banco de dados.`;
    }

    // Get color variable
    const colorMap = {
        engendrar: 'var(--color-engendrar)',
        conflito: 'var(--color-conflito)',
        estagnar: 'var(--color-estagnar)',
        regressar: 'var(--color-regressar)',
        necessitar: 'var(--color-necessitar)'
    };

    elements.readingContent.style.setProperty('--reading-color', colorMap[dynamicKey]);

    elements.readingContent.innerHTML = `
        <div class="reading-dynamic-title">
            <div class="reading-dynamic-icon">${dynamicInfo.icon}</div>
            <div>
                <div class="reading-dynamic-name">${dynamicInfo.name}</div>
                <div class="reading-dynamic-subtitle">${dynamicInfo.subtitle}</div>
            </div>
        </div>
        <p class="reading-text">${content}</p>
    `;

    // Update navigation
    updateQuickNav();
}

function updateDynamicsNav() {
    elements.dynamicsNav.querySelectorAll('.dynamic-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.dynamic === state.currentDynamic);
    });
}

function handleDynamicClick(dynamicKey) {
    state.currentDynamic = dynamicKey;
    updateDynamicsNav();
    renderDynamicContent();
}

function updateQuickNav() {
    const currentIndex = DYNAMICS_ORDER.indexOf(state.currentDynamic);
    const prevBtn = elements.quickNav.querySelector('[data-direction="prev"]');
    const nextBtn = elements.quickNav.querySelector('[data-direction="next"]');

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === DYNAMICS_ORDER.length - 1;

    elements.navIndicator.textContent = `${currentIndex + 1} / ${DYNAMICS_ORDER.length}`;
}

function navigateDynamic(direction) {
    const currentIndex = DYNAMICS_ORDER.indexOf(state.currentDynamic);
    let newIndex;

    if (direction === 'prev') {
        newIndex = Math.max(0, currentIndex - 1);
    } else {
        newIndex = Math.min(DYNAMICS_ORDER.length - 1, currentIndex + 1);
    }

    if (newIndex !== currentIndex) {
        state.currentDynamic = DYNAMICS_ORDER[newIndex];
        updateDynamicsNav();
        renderDynamicContent();
    }
}

// ============================================
// Navigation
// ============================================

function goBack() {
    elements.readingSection.classList.add('hidden');
    elements.heroSection.classList.remove('hidden');
    elements.selectionSection.classList.remove('hidden');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetReading() {
    state.selectedCards = [null, null];
    state.currentDynamic = 'engendrar';
    state.searchQuery = '';

    // Reset UI
    elements.readingSection.classList.add('hidden');
    elements.heroSection.classList.remove('hidden');
    elements.selectionSection.classList.remove('hidden');

    // Reset search
    elements.searchInput.value = '';
    elements.searchClear.classList.remove('visible');

    updateSelectedCardsDisplay();
    updateCardsGrid();
    updateReadButton();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// Loading
// ============================================

function showLoading() {
    state.isLoading = true;
    elements.loadingOverlay.classList.add('visible');
}

function hideLoading() {
    state.isLoading = false;
    elements.loadingOverlay.classList.remove('visible');
}

// ============================================
// Touch/Swipe Support
// ============================================

let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next
            navigateDynamic('next');
        } else {
            // Swipe right - prev
            navigateDynamic('prev');
        }
    }
}

// ============================================
// Keyboard Support
// ============================================

function handleKeydown(e) {
    if (elements.readingSection.classList.contains('hidden')) return;

    switch (e.key) {
        case 'ArrowLeft':
            navigateDynamic('prev');
            break;
        case 'ArrowRight':
            navigateDynamic('next');
            break;
        case 'Escape':
            goBack();
            break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
            const index = parseInt(e.key) - 1;
            if (index >= 0 && index < DYNAMICS_ORDER.length) {
                handleDynamicClick(DYNAMICS_ORDER[index]);
            }
            break;
    }
}

// ============================================
// Event Listeners
// ============================================

function setupEventListeners() {
    // Slot clicks
    elements.slot1.addEventListener('click', () => handleSlotClick(0));
    elements.slot2.addEventListener('click', () => handleSlotClick(1));

    // Read button
    elements.btnRead.addEventListener('click', showReading);

    // Reset button
    elements.btnReset.addEventListener('click', resetReading);

    // Back button
    elements.btnBack.addEventListener('click', goBack);

    // Search
    elements.searchInput.addEventListener('input', (e) => {
        handleSearchInput(e.target.value);
    });

    elements.searchClear.addEventListener('click', clearSearch);

    // Dynamics navigation
    elements.dynamicsNav.addEventListener('click', (e) => {
        const tab = e.target.closest('.dynamic-tab');
        if (tab) {
            handleDynamicClick(tab.dataset.dynamic);
        }
    });

    // Quick navigation
    elements.quickNav.addEventListener('click', (e) => {
        const btn = e.target.closest('.quick-nav-btn');
        if (btn && !btn.disabled) {
            navigateDynamic(btn.dataset.direction);
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', handleKeydown);

    // Touch/swipe support for reading content
    elements.readingContent?.addEventListener('touchstart', handleTouchStart, { passive: true });
    elements.readingContent?.addEventListener('touchend', handleTouchEnd, { passive: true });
}

// ============================================
// Initialization
// ============================================

async function init() {
    console.log('Initializing Oraculo...');

    // Load tarot data
    await loadTarotData();

    // Render cards grid
    renderCardsGrid();

    // Setup event listeners
    setupEventListeners();

    // Initial state
    updateSelectedCardsDisplay();
    updateReadButton();

    console.log('Oraculo initialized successfully');
}

// Start the application
document.addEventListener('DOMContentLoaded', init);

// Export for potential module usage
export { state, ALL_CARDS, DYNAMICS_INFO };
