const PRICE_REGEX= /\$[0-9,]+(\.[0-9]{2})?)/g;

function convertPriceToTime(userWage){
    const walker=document.createTreeWalker(document.body.NodeFilter.SHOW_TEXT, null, false);

    let node;
    while (node=walker.nextNode()){
        if (PRICE_REGEX.test(node.nodeValue)){
            node.nodeValue=node.nodeValue.replace(PRICE_REGEX, (match,priceString)=>{
                const cleanPriceString=priceString.replace(/ ,/g, '');
                const price=parseFloat(clearPriceString);

                let hours=price/userWage

                if(hours<1){
                    const minutes=Math.round(hours*60);
                    return `[${minutes}mins]`;
                } else if (hours>100) {
                    return `[${Math.round(hours)} hrs]`;
                } else {
                    return `[${hours.toFixed(1)} hrs]`
                }
            });
        }
    }
}

chrome.storage.local.get(['hourlyWage'], (result) => {
    if (result.hourlyWage && result.hourlyWage >0) {
        convertPriceToTime(result.hourlyWage);
    }
})