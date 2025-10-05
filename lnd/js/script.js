// This event listener ensures that the script runs only after the entire HTML document has been loaded.
// This is a crucial step for compatibility, especially on mobile browsers like Safari on iPhone.
document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. SELEÇÃO DE ELEMENTOS DO DOM ---
    const cardSelectorGrid = document.getElementById('card-selector-grid');
    const compareBtn = document.getElementById('compare-btn');
    const clearBtn = document.getElementById('clear-selection-btn');
    const resultsArea = document.getElementById('results-area');
    const viewToggleTabs = document.getElementById('view-toggle-tabs');
    const comparisonContainer = document.getElementById('comparison-container');

    // --- 2. ESTADO DA APLICAÇÃO ---
    let selectedCards = [];
    let comparisonResults = {};
    let currentView = 'simple';

    // --- 3. FUNÇÕES PRINCIPAIS ---

    /**
     * Populates the card selection grid with buttons for each card.
     */
    function renderCardSelector() {
        // cardData is available here because data.js was loaded first.
        cardData.forEach(card => {
            const btn = document.createElement('button');
            btn.className = 'card-btn';
            btn.dataset.cardId = card.id;
            btn.innerHTML = `<div class="card-id">${card.id}</div>${card.name}`;
            cardSelectorGrid.appendChild(btn);
        });
    }

    /**
     * Updates the UI of the card selector grid (selected/disabled states) and the compare button.
     */
    function updateSelectionControls() {
        const cardBtns = document.querySelectorAll('.card-btn');
        cardBtns.forEach(btn => {
            const cardId = parseInt(btn.dataset.cardId);
            btn.classList.toggle('selected', selectedCards.includes(cardId));
            btn.classList.toggle('disabled', selectedCards.length >= 3 && !selectedCards.includes(cardId));
        });
        compareBtn.disabled = selectedCards.length < 2;
    }

    /**
     * The main logic engine. It processes the selected cards and generates the data
     * needed for both the simple and detailed result views.
     */
    function generateComparison() {
        const selectedData = selectedCards.map(id => cardData.find(c => c.id === id));
        
        // A. Process data for the Simple View (direct subcategory matches)
        const simpleRows = [];
        Object.keys(subcategoryDetails).forEach(subKey => {
            const matches = selectedData.reduce((count, card) => count + (card.categories.includes(subKey) ? 1 : 0), 0);
            if (matches > 0) {
                simpleRows.push({
                    subKey,
                    details: subcategoryDetails[subKey],
                    matches,
                    cardStatus: selectedData.map(card => card.categories.includes(subKey))
                });
            }
        });
        // Sort by number of matches (descending)
        simpleRows.sort((a, b) => b.matches - a.matches);

        // B. Process data for the Detailed View (grouped by parent category)
        const parentGroups = {};
        Object.keys(subcategoryDetails).forEach(subKey => {
            const parent = subcategoryDetails[subKey].parent;
            if (!parentGroups[parent]) parentGroups[parent] = [];
            parentGroups[parent].push(subKey);
        });

        const detailedRows = [];
        Object.keys(parentGroups).forEach(parent => {
            const subKeysInGroup = parentGroups[parent];
            const cardSubcategories = selectedData.map(card => subKeysInGroup.find(sk => card.categories.includes(sk)) || null);
            
            // Only add a row if at least one card belongs to this parent group
            if (cardSubcategories.some(sub => sub !== null)) {
                const occurrences = {};
                cardSubcategories.forEach(sub => { if (sub) occurrences[sub] = (occurrences[sub] || 0) + 1; });
                const maxMatches = Object.values(occurrences).reduce((max, count) => Math.max(max, count), 0);
                detailedRows.push({ parent, cardSubcategories, matches: maxMatches });
            }
        });
        // Sort by the highest number of matching subcategories within the group
        detailedRows.sort((a, b) => b.matches - a.matches);

        // C. Store results and show the results area
        comparisonResults = { simple: simpleRows, detailed: detailedRows, headers: selectedData };
        resultsArea.classList.remove('hidden');
        renderResults();
    }
    
    /**
     * Main render function that decides which layout (table or list) and which view (simple or detailed) to show.
     */
    function renderResults() {
        if (!comparisonResults.headers || comparisonResults.headers.length === 0) {
            comparisonContainer.innerHTML = '<p class="no-results">Selecione cartas e clique em Comparar.</p>';
            return;
        }
        
        // Generate HTML for both table and list layouts
        const tableHtml = currentView === 'simple' ? renderSimpleTable(comparisonResults) : renderDetailedTable(comparisonResults);
        const listHtml = currentView === 'simple' ? renderSimpleList(comparisonResults) : renderDetailedList(comparisonResults);

        // Inject the HTML into the respective wrappers
        comparisonContainer.innerHTML = `
            <div class="results-table-wrapper">${tableHtml}</div>
            <div class="results-list-wrapper">${listHtml}</div>
        `;
    }
    
    // --- 4. RENDER HELPER FUNCTIONS (One for each view/layout combination) ---

    function renderSimpleTable({ simple: rows, headers }) {
        let html = '<table class="results-table"><thead><tr><th>Categoria</th>';
        headers.forEach(card => { html += `<th>${card.name}</th>`; });
        html += '</tr></thead><tbody>';
        rows.forEach(row => {
            const isMatchThree = row.matches === 3;
            const isMatchTwo = row.matches === 2 && headers.length === 3;
            html += `<tr class="${isMatchThree ? 'match-three' : ''}">
                        <td>${row.details.name}<span class="category-parent">${row.details.parent}</span></td>
                        ${row.cardStatus.map(status => `<td class="${isMatchTwo ? (status ? 'cell-match' : 'cell-mismatch') : ''}">${status ? '✔️' : '✖️'}</td>`).join('')}
                    </tr>`;
        });
        return html + '</tbody></table>';
    }
    
    function renderSimpleList({ simple: rows, headers }) {
        return rows.map(row => {
            const isMatchThree = row.matches === 3;
            return `
                <div class="result-card ${isMatchThree ? 'match-three' : ''}">
                    <div class="result-card-header">
                        <div class="result-card-title">${row.details.name}</div>
                        <div class="result-card-parent">${row.details.parent}</div>
                    </div>
                    <div class="result-card-body">
                        ${headers.map((card, i) => {
                            const status = row.cardStatus[i];
                            const isMatchTwo = row.matches === 2 && headers.length === 3;
                            const cellClass = isMatchTwo ? (status ? 'cell-match' : 'cell-mismatch') : '';
                            return `<div class="result-item">
                                        <span class="result-item-card-name">${card.name}</span>
                                        <span class="result-item-value ${cellClass}">${status ? '✔️' : '✖️'}</span>
                                    </div>`;
                        }).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderDetailedTable({ detailed: rows, headers }) {
        let html = '<table class="results-table"><thead><tr><th>Grupo</th>';
        headers.forEach(card => { html += `<th>${card.name}</th>`; });
        html += '</tr></thead><tbody>';
        rows.forEach(row => {
            const isMatchThree = row.matches === 3 && (new Set(row.cardSubcategories.filter(Boolean))).size === 1;
            html += `<tr class="${isMatchThree ? 'match-three' : ''}"><td>${row.parent}</td>`;
            
            const isMatchTwo = row.matches === 2 && headers.length === 3;
            let matchValue = null;
            if(isMatchTwo) {
                const counts = {};
                row.cardSubcategories.forEach(sk => { if(sk) counts[sk] = (counts[sk] || 0) + 1; });
                matchValue = Object.keys(counts).find(k => counts[k] === 2);
            }
            
            row.cardSubcategories.forEach(subKey => {
                if (subKey) {
                    const cellClass = isMatchTwo ? (subKey === matchValue ? 'cell-match' : 'cell-mismatch') : '';
                    html += `<td class="${cellClass}">${subcategoryDetails[subKey].name}</td>`;
                } else {
                    html += `<td class="cell-na">N/A</td>`;
                }
            });
            html += '</tr>';
        });
        return html + '</tbody></table>';
    }

    function renderDetailedList({ detailed: rows, headers }) {
         return rows.map(row => {
            const isMatchThree = row.matches === 3 && (new Set(row.cardSubcategories.filter(Boolean))).size === 1;
             return `
                <div class="result-card ${isMatchThree ? 'match-three' : ''}">
                     <div class="result-card-header">
                         <div class="result-card-title">${row.parent}</div>
                    </div>
                    <div class="result-card-body">
                        ${headers.map((card, i) => {
                            const subKey = row.cardSubcategories[i];
                            let value = '<span class="cell-na">N/A</span>';
                            if(subKey) {
                                const isMatchTwo = row.matches === 2 && headers.length === 3;
                                let cellClass = '';
                                if(isMatchTwo) {
                                    const counts = {};
                                    row.cardSubcategories.forEach(sk => { if(sk) counts[sk] = (counts[sk] || 0) + 1; });
                                    const matchValue = Object.keys(counts).find(k => counts[k] === 2);
                                    cellClass = (subKey === matchValue ? 'cell-match' : 'cell-mismatch');
                                }
                                value = `<span class="${cellClass}">${subcategoryDetails[subKey].name}</span>`;
                            }
                            return `<div class="result-item">
                                        <span>${card.name}</span>
                                        <span class="result-item-value">${value}</span>
                                    </div>`;
                        }).join('')}
                    </div>
                </div>
             `;
         }).join('');
    }
    
    // --- 5. EVENT LISTENERS ---

    cardSelectorGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('.card-btn');
        if (!btn || (btn.classList.contains('disabled') && !btn.classList.contains('selected'))) return;
        const cardId = parseInt(btn.dataset.cardId);
        const index = selectedCards.indexOf(cardId);
        if (index > -1) selectedCards.splice(index, 1);
        else if (selectedCards.length < 3) selectedCards.push(cardId);
        updateSelectionControls();
    });

    compareBtn.addEventListener('click', generateComparison);

    clearBtn.addEventListener('click', () => {
        selectedCards = [];
        resultsArea.classList.add('hidden');
        comparisonContainer.innerHTML = '';
        updateSelectionControls();
    });

    viewToggleTabs.addEventListener('click', (e) => {
        const tab = e.target.closest('.view-tab');
        if(tab){
            document.querySelectorAll('.view-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentView = tab.dataset.view;
            renderResults();
        }
    });

    // --- 6. INICIALIZAÇÃO ---
    renderCardSelector();
});
