// Autocomplete functionality for calibration worksheets
// Helps field technicians fill forms quickly with suggestions

class AutocompleteField {
  constructor(inputElement, options = {}) {
    this.input = inputElement;
    this.options = {
      minChars: 1,
      onSelect: options.onSelect || (() => {}),
      searchFn: options.searchFn || (() => []),
      displayFn: options.displayFn || (item => item),
      maxResults: options.maxResults || 10
    };
    
    this.resultsContainer = null;
    this.selectedIndex = -1;
    this.results = [];
    
    this.init();
  }
  
  init() {
    // Create results container
    this.resultsContainer = document.createElement('div');
    this.resultsContainer.className = 'autocomplete-results';
    this.input.parentNode.style.position = 'relative';
    this.input.parentNode.appendChild(this.resultsContainer);
    
    // Event listeners
    this.input.addEventListener('input', this.handleInput.bind(this));
    this.input.addEventListener('keydown', this.handleKeydown.bind(this));
    this.input.addEventListener('blur', this.handleBlur.bind(this));
    this.input.addEventListener('focus', this.handleFocus.bind(this));
  }
  
  handleInput(e) {
    const value = e.target.value;
    
    if (value.length < this.options.minChars) {
      this.hideResults();
      return;
    }
    
    this.results = this.options.searchFn(value);
    this.showResults();
  }
  
  handleKeydown(e) {
    if (!this.resultsContainer.style.display || this.resultsContainer.style.display === 'none') {
      return;
    }
    
    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, this.results.length - 1);
        this.updateSelection();
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
        this.updateSelection();
        break;
        
      case 'Enter':
        e.preventDefault();
        if (this.selectedIndex >= 0) {
          this.selectItem(this.results[this.selectedIndex]);
        }
        break;
        
      case 'Escape':
        this.hideResults();
        break;
    }
  }
  
  handleBlur() {
    // Delay to allow click on results
    setTimeout(() => this.hideResults(), 200);
  }
  
  handleFocus() {
    if (this.input.value.length >= this.options.minChars) {
      this.results = this.options.searchFn(this.input.value);
      this.showResults();
    }
  }
  
  showResults() {
    if (this.results.length === 0) {
      this.hideResults();
      return;
    }
    
    this.resultsContainer.innerHTML = '';
    this.selectedIndex = -1;
    
    this.results.slice(0, this.options.maxResults).forEach((result, index) => {
      const item = document.createElement('div');
      item.className = 'autocomplete-item';
      item.innerHTML = this.options.displayFn(result);
      
      item.addEventListener('mousedown', (e) => {
        e.preventDefault();
        this.selectItem(result);
      });
      
      item.addEventListener('mouseenter', () => {
        this.selectedIndex = index;
        this.updateSelection();
      });
      
      this.resultsContainer.appendChild(item);
    });
    
    this.resultsContainer.style.display = 'block';
  }
  
  hideResults() {
    this.resultsContainer.style.display = 'none';
    this.selectedIndex = -1;
  }
  
  updateSelection() {
    const items = this.resultsContainer.querySelectorAll('.autocomplete-item');
    items.forEach((item, index) => {
      if (index === this.selectedIndex) {
        item.classList.add('selected');
      } else {
        item.classList.remove('selected');
      }
    });
  }
  
  selectItem(item) {
    this.options.onSelect(item);
    this.hideResults();
  }
}

// Initialize autocomplete on certificate form fields
function initializeAutocomplete() {
  console.log('🎯 Initializing autocomplete for worksheet fields...');
  
  const manufacturerInput = document.getElementById('manufacturer');
  const modelInput = document.getElementById('model');
  const rangeInput = document.getElementById('equipmentRange');
  const instrumentTypeSelect = document.getElementById('instrumentType');
  
  if (!manufacturerInput || !modelInput) {
    console.warn('⚠️ Form fields not found for autocomplete');
    return;
  }
  
  // Manufacturer autocomplete
  const manufacturerAC = new AutocompleteField(manufacturerInput, {
    minChars: 1,
    searchFn: (query) => {
      return searchManufacturers(query).map(m => ({ name: m }));
    },
    displayFn: (item) => {
      return `<strong>${item.name}</strong>`;
    },
    onSelect: (item) => {
      manufacturerInput.value = item.name;
      modelInput.focus();
      
      // Clear model and range when manufacturer changes
      modelInput.value = '';
      rangeInput.value = '';
    }
  });
  
  // Model autocomplete (filtered by manufacturer and equipment type)
  const modelAC = new AutocompleteField(modelInput, {
    minChars: 1,
    searchFn: (query) => {
      const manufacturer = manufacturerInput.value;
      const category = instrumentTypeSelect?.value;
      
      if (manufacturer) {
        // Search models for specific manufacturer
        const models = getModelsByManufacturer(manufacturer, category);
        return models.filter(m => m.model.toLowerCase().includes(query.toLowerCase()));
      } else {
        // Search all models
        return searchEquipment(query, category);
      }
    },
    displayFn: (item) => {
      return `
        <strong>${item.model}</strong><br>
        <small style="color: #666;">${item.type} | ${item.range || 'N/A'}</small>
      `;
    },
    onSelect: (item) => {
      modelInput.value = item.model;
      
      // Auto-fill manufacturer if empty
      if (!manufacturerInput.value) {
        manufacturerInput.value = item.manufacturer;
      }
      
      // Auto-fill range if available
      if (item.range && !rangeInput.value) {
        rangeInput.value = item.range;
      }
      
      // Move to next field
      rangeInput.focus();
    }
  });
  
  // Equipment type search (optional - for dynamic type field)
  const equipmentTypeInput = document.querySelector('input[name="equipmentType"]');
  if (equipmentTypeInput) {
    const typeAC = new AutocompleteField(equipmentTypeInput, {
      minChars: 2,
      searchFn: (query) => {
        return searchEquipment(query).map(eq => ({
          type: eq.type,
          category: eq.category
        })).filter((v, i, a) => a.findIndex(t => t.type === v.type) === i); // Unique types
      },
      displayFn: (item) => {
        return `<strong>${item.type}</strong>`;
      },
      onSelect: (item) => {
        equipmentTypeInput.value = item.type;
        manufacturerInput.focus();
      }
    });
  }
  
  console.log('✅ Autocomplete initialized on worksheet fields');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAutocomplete);
} else {
  initializeAutocomplete();
}
