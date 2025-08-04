// Court Data Fetcher JavaScript

// Global variables
let currentSearchData = null;

// Main search function
async function searchCase(caseType, caseNumber, filingYear) {
    try {
        // Show loading state
        showLoading(true);
        hideResults();
        hideError();
        
        // Prepare search data
        const searchData = {
            case_type: caseType,
            case_number: caseNumber,
            filing_year: filingYear
        };
        
        // Make API call
        const response = await fetch('/api/case-search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(searchData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Store current search data
            currentSearchData = {
                ...searchData,
                result: result.data
            };
            
            // Display results
            displayCaseResults(result.data);
            showNotification('Case data retrieved successfully!', 'success');
            
            // Update search history
            updateSearchHistory();
            
        } else {
            throw new Error(result.error || 'Failed to fetch case data');
        }
        
    } catch (error) {
        console.error('Search error:', error);
        showError(error.message || 'An error occurred while searching. Please try again.');
        showNotification('Failed to fetch case data', 'error');
    } finally {
        showLoading(false);
    }
}

// Display case results
function displayCaseResults(data) {
    const resultsContainer = document.getElementById('caseResults');
    const petitionerName = document.getElementById('petitionerName');
    const respondentName = document.getElementById('respondentName');
    const filingDate = document.getElementById('filingDate');
    const nextHearing = document.getElementById('nextHearing');
    const ordersList = document.getElementById('ordersList');
    
    // Update case details
    petitionerName.textContent = data.parties?.petitioner || 'Not available';
    respondentName.textContent = data.parties?.respondent || 'Not available';
    filingDate.textContent = formatDate(data.filing_date) || 'Not available';
    nextHearing.textContent = formatDate(data.next_hearing) || 'Not available';
    
    // Update case status
    const caseStatus = document.querySelector('.case-status');
    if (caseStatus) {
        caseStatus.textContent = data.case_status || 'Pending';
        caseStatus.className = `case-status ${(data.case_status || 'pending').toLowerCase()}`;
    }
    
    // Update orders
    ordersList.innerHTML = '';
    if (data.orders && data.orders.length > 0) {
        data.orders.forEach(order => {
            const orderItem = createOrderItem(order);
            ordersList.appendChild(orderItem);
        });
    } else {
        ordersList.innerHTML = '<p class="no-orders">No orders available</p>';
    }
    
    // Show results
    resultsContainer.style.display = 'block';
    
    // Animate results
    resultsContainer.style.opacity = '0';
    resultsContainer.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        resultsContainer.style.transition = 'all 0.5s ease';
        resultsContainer.style.opacity = '1';
        resultsContainer.style.transform = 'translateY(0)';
    }, 100);
}

// Create order item element
function createOrderItem(order) {
    const orderItem = document.createElement('div');
    orderItem.className = 'order-item';
    
    orderItem.innerHTML = `
        <div class="order-info">
            <span class="order-date">${formatDate(order.date)}</span>
            <span class="order-title">${order.title}</span>
        </div>
        <a href="${order.pdf_link}" class="order-download" download>
            <i class="fas fa-download"></i>
            Download
        </a>
    `;
    
    // Add click handler for download
    const downloadLink = orderItem.querySelector('.order-download');
    downloadLink.addEventListener('click', function(e) {
        e.preventDefault();
        downloadPDF(order.pdf_link, order.title);
    });
    
    return orderItem;
}

// Download PDF function
async function downloadPDF(pdfLink, title) {
    try {
        showNotification('Downloading PDF...', 'info');
        
        const response = await fetch(pdfLink);
        if (!response.ok) {
            throw new Error('Failed to download PDF');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showNotification('PDF downloaded successfully!', 'success');
        
    } catch (error) {
        console.error('Download error:', error);
        showNotification('Failed to download PDF', 'error');
    }
}

// Update search history
async function updateSearchHistory() {
    try {
        const response = await fetch('/api/search-history');
        const result = await response.json();
        
        if (result.success) {
            // You can implement a search history display here
            console.log('Search history updated:', result.history);
        }
    } catch (error) {
        console.error('Failed to update search history:', error);
    }
}

// Utility functions
function showLoading(show) {
    const loadingSpinner = document.getElementById('loadingSpinner');
    if (loadingSpinner) {
        loadingSpinner.style.display = show ? 'block' : 'none';
    }
}

function hideResults() {
    const resultsContainer = document.getElementById('caseResults');
    if (resultsContainer) {
        resultsContainer.style.display = 'none';
    }
}

function showResults() {
    const resultsContainer = document.getElementById('caseResults');
    if (resultsContainer) {
        resultsContainer.style.display = 'block';
    }
}

function hideError() {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
}

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    
    if (errorMessage && errorText) {
        errorText.textContent = message;
        errorMessage.style.display = 'block';
        
        // Animate error message
        errorMessage.style.opacity = '0';
        errorMessage.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            errorMessage.style.transition = 'all 0.3s ease';
            errorMessage.style.opacity = '1';
            errorMessage.style.transform = 'translateY(0)';
        }, 100);
    }
}

function formatDate(dateString) {
    if (!dateString) return null;
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
}

// Form validation
function validateSearchForm() {
    const caseType = document.getElementById('caseType')?.value;
    const caseNumber = document.getElementById('caseNumber')?.value;
    const filingYear = document.getElementById('filingYear')?.value;
    
    const errors = [];
    
    if (!caseType) {
        errors.push('Please select a case type');
    }
    
    if (!caseNumber) {
        errors.push('Please enter a case number');
    } else if (!/^[0-9\/]+$/.test(caseNumber)) {
        errors.push('Case number should contain only numbers and forward slashes');
    }
    
    if (!filingYear) {
        errors.push('Please enter a filing year');
    } else if (filingYear < 2000 || filingYear > new Date().getFullYear()) {
        errors.push('Please enter a valid filing year');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Enhanced search with validation
function performSearch() {
    const validation = validateSearchForm();
    
    if (!validation.isValid) {
        validation.errors.forEach(error => {
            showNotification(error, 'error');
        });
        return;
    }
    
    const caseType = document.getElementById('caseType').value;
    const caseNumber = document.getElementById('caseNumber').value;
    const filingYear = document.getElementById('filingYear').value;
    
    searchCase(caseType, caseNumber, filingYear);
}

// Auto-save search data
function saveSearchData() {
    const searchData = {
        caseType: document.getElementById('caseType')?.value,
        caseNumber: document.getElementById('caseNumber')?.value,
        filingYear: document.getElementById('filingYear')?.value
    };
    
    localStorage.setItem('devcourt_last_search', JSON.stringify(searchData));
}

// Load saved search data
function loadSearchData() {
    const savedData = localStorage.getItem('devcourt_last_search');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            if (data.caseType) document.getElementById('caseType').value = data.caseType;
            if (data.caseNumber) document.getElementById('caseNumber').value = data.caseNumber;
            if (data.filingYear) document.getElementById('filingYear').value = data.filingYear;
        } catch (error) {
            console.error('Failed to load saved search data:', error);
        }
    }
}

// Initialize court fetcher
document.addEventListener('DOMContentLoaded', function() {
    // Load saved search data
    loadSearchData();
    
    // Auto-save on form changes
    const formInputs = document.querySelectorAll('#caseSearchForm input, #caseSearchForm select');
    formInputs.forEach(input => {
        input.addEventListener('change', saveSearchData);
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to search
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
        
        // Escape to clear form
        if (e.key === 'Escape') {
            document.getElementById('caseSearchForm').reset();
            hideResults();
            hideError();
            localStorage.removeItem('devcourt_last_search');
        }
    });
    
    // Add form auto-complete
    const caseNumberInput = document.getElementById('caseNumber');
    if (caseNumberInput) {
        caseNumberInput.addEventListener('input', function() {
            // Auto-format case number
            let value = this.value.replace(/[^0-9\/]/g, '');
            if (value.length > 0 && !value.includes('/')) {
                // Add default format if no slash
                if (value.length >= 3) {
                    value = value.slice(0, 3) + '/' + value.slice(3);
                }
            }
            this.value = value;
        });
    }
    
    // Add filing year auto-complete
    const filingYearInput = document.getElementById('filingYear');
    if (filingYearInput) {
        filingYearInput.addEventListener('focus', function() {
            if (!this.value) {
                this.value = new Date().getFullYear();
            }
        });
    }
});

// Export functions for global access
window.searchCase = searchCase;
window.performSearch = performSearch;
window.downloadPDF = downloadPDF; 