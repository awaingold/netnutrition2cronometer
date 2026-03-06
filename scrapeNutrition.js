/**
 * Listens for a scrape message, then scrapes the nutrition information on
 * the page if it is available. Sends 'success' if successful, 'error' if not.
 * Also sends a data field containing nutrition data, which is null in the
 * event of an error.
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'SCRAPE') {
        try {
            const data = scrapeNutrition();
            sendResponse({ status: 'success', data: data });
        } catch(error) {
            sendResponse({status: 'error', data: null});
        }
    }
});

/**
 * Parses a nutrition label and returns an object with key-value pairs representing the label.
 * @return An object where keys correspond to nutrient names and values correspond to nutrient
 * quantities. Keys are strings, values are floats.
 * @throws Error if no nutrition label is found.
 */
function scrapeNutrition() {
    const labelDiv = document.querySelector('#nutritionLabel');
    if (!labelDiv) {
        throw new Error("Nutrition label not found.");
    }
    const rows = Array.from(labelDiv.querySelectorAll('tr'));
    const pairs = rows.filter(row => row.querySelectorAll('span').length === 2)
    .map(row => Array.from(row.querySelectorAll('span')).map(span => span.innerText))
    .map(text => [text[0], parseFloat(text[1])]);
    const nutrition = Object.fromEntries(pairs);
    nutrition['Food Name'] = rows[0].innerText;
    const calorieDiv = document.querySelector('.inline-div-right.bold-text.font-22');
    nutrition['Calories'] = parseFloat(calorieDiv.textContent);
    const addedSugarsSpan = rows.find(row => row.textContent.includes('Added Sugars')).querySelector("span");
    const match = addedSugarsSpan.textContent.match(/[\d.]+/);
    const value = match ? parseFloat(match[0]) : 0;
    nutrition['Added Sugars'] = value;
    return nutrition;
}