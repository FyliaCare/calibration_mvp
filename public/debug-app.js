// Simple debugging version
console.log('Script loaded');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM ready');
    
    const newRecordBtn = document.getElementById('newRecord');
    const loadTemplateBtn = document.getElementById('loadTemplate');
    const formArea = document.getElementById('formArea');
    
    console.log('Elements:', {
        newRecordBtn,
        loadTemplateBtn, 
        formArea
    });
    
    if (newRecordBtn) {
        newRecordBtn.addEventListener('click', (e) => {
            console.log('New Record clicked!');
            e.preventDefault();
            
            if (formArea) {
                formArea.style.display = 'block';
                alert('Form opened!');
            } else {
                alert('Form area not found!');
            }
        });
    }
    
    if (loadTemplateBtn) {
        loadTemplateBtn.addEventListener('click', (e) => {
            console.log('Load Template clicked!');
            e.preventDefault();
            alert('Load Template clicked!');
        });
    }
});