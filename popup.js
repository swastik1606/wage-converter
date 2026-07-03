document.addEventListener('DOMContentLoaded', ()=>{
    const wageInput=document.getElementById('wageInput');
    const saveBtn=document.getElementById('saveBtn');

    chrome.storage.local.get(['hourlyWage'], (result)=>{
        if (result.hourlyWage){
            wageInput.value=result.hourlyWage;
        }
    });

    saveBtn.addEventListener('click', ()=>{
        const wage=parseFloat(wageInput.value);

        if(wage>0) {
            chrome.storage.local.set({hourlyWage: wage}, ()=>{
                const originalText=saveBtn.textContent;
                saveBtn.textContent='Saved!';
                saveBtn.style.background='#28a745';

                setTimeout(()=>{
                    saveBtn.textContent=originalText;
                    saveBtn.style.background='#007bff'
                }, 1500)
            })
        }
    })
});