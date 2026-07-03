const PRICE_REGEX = /\$\s?([0-9,]+(\.[0-9]{2})?)/g;

let userHourlyWage = 0;

function processTextNode(node) {
    if (node.nodeValue.includes('$')) {
        node.nodeValue=node.nodeValue.replace(PRICE_REGEX, (match, priceString)=>{
            const cleanPriceString=priceString.replace(/ ,/g, '');
            const price=parseFloat(cleanPriceString);

            const hours=price/userHourlyWage;

            if (hours<1){
                return `[${Math.round(hours*60)} mins]`;
            } else if (hours >100){
                return `[${Math.round(hours)} hrs]`;
            } else {
                return `[${hours.toFixed(1)} hrs]`
            }
        });
    }
}

function convertPricesInNodes(rootNode){
    if (rootNode.nodeType===Node.TEXT_NODE){
        processTextNode(rootNode);
        return;
    }

    const walker=document.createTreeWalker(rootNode, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while (node=walker.nextNode()){
        processTextNode(node);
    }
}


chrome.storage.local.get(['hourlyWage'], (result) => {
    if (result.hourlyWage && result.hourlyWage > 0) {
        userHourlyWage=result.hourlyWage;

        convertPricesInNodes(document.body);

        const observer=new MutationObserver((mutations)=>{
            for (const mutation of mutations){
                if (mutation.addedNodes.length){
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType===Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE){
                            if (node.nodeName !== 'SCRIPT' && node.nodeName != 'STYLE' && node.nodeName !== 'NOSCRIPT') {
                                convertPricesInNodes(node);
                            }
                        }
                    }
                }
            }
        })

        observer.observe(document.body, {childList: true, subtree: true});
    }
});