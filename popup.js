document.addEventListener('DOMContentLoaded', () => {
    const wageInput = document.getElementById('wageInput');
    const saveBtn = document.getElementById('saveBtn');
    const currencySelect = document.getElementById('currencySelect')

    chrome.storage.local.get(['userWages', 'baseCurrency'], (result) => {
        if (result.baseCurrency) {
            currencySelect.value = result.baseCurrency;

            if (result.userWages) {
                if (result.userWages[result.baseCurrency]) wageInput.value=
                result.userWages[result.baseCurrency];
            }
        }
    });

    saveBtn.addEventListener('click', () => {
        const baseWage = parseFloat(wageInput.value)
        const baseCurrency=currencySelect.value;

        const rates = {
            '$': 1.00,
            '€': 0.92,
            '£': 0.79,
            '₹': 95.20,
            '¥': 155.00
        };

        const precomputedWages = {};

        for (const symbol in rates) {
            precomputedWages[symbol] = (baseWage/rates[baseCurrency]) * rates[symbol];
        }

        chrome.storage.local.set({
            userWages:precomputedWages,
            baseCurrency: baseCurrency
        }, ()=> {
            saveBtn.textContent='Saved!';
            setTimeout(()=> saveBtn.textContent='Save', 1500)
        })
    });
});