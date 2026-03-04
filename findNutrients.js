/**
 * Parses a nutrition label and returns an object with key-value pairs representing the label.
 * @return An object where keys correspond to nutrient names and values correspond to nutrient
 * quantities. Keys are strings, values are floats.
 */
function scrapeNutrition() {
    const labelDiv = document.querySelector('#nutritionLabel');
    const rows = Array.from(labelDiv.querySelectorAll('tr'));
    const pairs = rows.filter(row => row.querySelectorAll('span').length === 2)
    .map(row => Array.from(row.querySelectorAll('span')).map(span => span.innerText))
    .map(text => [text[0], parseFloat(text[1])]);
    const nutrition = Object.fromEntries(pairs);
    return nutrition;
}