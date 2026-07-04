document.addEventListener('DOMContentLoaded', () => {
    const wageInput = document.getElementById('wageInput');
    const saveBtn = document.getElementById('saveBtn');

    chrome.storage.local.get(['userWages'], (result) => {
        if (result.userWages && result.userWages['$']) {
            wageInput.value = result.userWages['$'];
        }
    });

    saveBtn.addEventListener('click', () => {
        const baseWage = parseFloat(wageInput.value);

        if (baseWage > 0) {
            const rates = {
                '$': 1.00,
                '€': 0.92,
                '£': 0.79,
                '₹': 95.20,
                '¥': 155.00
            };

            const precomputedWages= {};
            for (const symbol in rates) {
                precomputedWages[symbol]=baseWage*rates[symbol];
            }

            chrome.storage.local.set({userWages: precomputedWages}, ()=> {
                saveBtn.textContent='Saved!';
                setTimeout(()=> saveBtn.textContent='Save',1500);
            });
        }
    })
});