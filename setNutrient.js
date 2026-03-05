console.log('setNutrient content script loaded!');
const NUTRIENT_MAP = {
    'Vit. D': 'Vitamin D',
    'Potas.': 'Potassium',
};
/**
 * Listens for a message to set nutrients, then sets nutrient fields based on the
 * data in the message. Sends 'success' if successful, 'error' if not.
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'SET_NUTRIENTS') {
        try {
            Object.keys(message.data).forEach((nutrient) => {
                const cronName = NUTRIENT_MAP[nutrient] || nutrient;
                console.log('Setting nutrient:', cronName, message.data[nutrient]);
                setNutrient(cronName, message.data[nutrient]);
            });
            sendResponse({status: "success"});
        } catch (error) {
            sendResponse({status: "error"});
        }
    }
});

/**
 * Sets the given nutrient field to the given value
 * @param field the name of the nutrient field
 * @param value the value to set
 * @throws Error if there is no field with name parameter field
 */
function setNutrient(field, value) {
    const labelDiv = Array.from(document.querySelectorAll('div.GHB44OMBOJ, div.GHB44OMBEK, div.GHB44OMBFK, div.GHB44OMBFJ, tr.GHB44OMBAK div.gwt-Label'))
        .find(div => div.textContent.trim() === field);
    console.log('labelDiv for', field, ':', labelDiv);
    if (!labelDiv) {
        console.log('Skipping unrecognized nutrient:', field);
        return;
    }
    const row = labelDiv.closest('tr');
    const input = row.querySelector('.GHB44OMBGJ');
    console.log('input for', field, ':', input);
    const displayDiv = input.previousElementSibling;
    console.log('displayDiv for', field, ':', displayDiv);
    displayDiv.click();
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
}