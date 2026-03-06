console.log('setInformation content script loaded!');
// Nutrient map for names that differ between UW website and Cronometer
const NUTRIENT_MAP = {
    'Vit. D': 'Vitamin D',
    'Potas.': 'Potassium',
};
const INPUT_FIELD_ID = '.GHB44OMBGJ';
const FIELD_DIV_LABELS = 'div.GHB44OMBOJ, div.GHB44OMBEK, div.GHB44OMBFK, div.GHB44OMBFJ, tr.GHB44OMBAK div.gwt-Label';
const FOOD_NAME_INPUT_LABEL = 'gwt-uid-581';
const UNRECOGNIZED_THRESHOLD = 5;
/**
 * Listens for a message to set nutrients, then sets nutrient fields based on the
 * data in the message. Sends 'success' if successful, 'error' if not.
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'SET_NUTRIENTS') {
        try {
            let unrecognizedCounter = 0;
            Object.keys(message.data).forEach((nutrient) => {
                const cronName = NUTRIENT_MAP[nutrient] || nutrient;
                try {
                    setField(cronName, message.data[nutrient]);
                } catch (error) {
                    console.log(`Unrecognized field: ${cronName}`);
                    unrecognizedCounter++;
                }
                if (unrecognizedCounter > UNRECOGNIZED_THRESHOLD) {
                    throw new Error('Too many unrecognized fields.');
                }
            });
            sendResponse({status: "success"});
        } catch (error) {
            sendResponse({status: "error"});
        }
    }
});

/**
 * Sets the given data field to the given value
 * @param field the field to set
 * @param value the value for the field to be set to
 * @throws error if a field is not recognized
 */
function setField(field, value) {
    if (field === 'Food Name') {
        setFoodName(value);
    } else {
        let unrecognizedCounter = 0;
        setNutrient(field, value);
    }
}

/**
 * Sets the given nutrient field to the given value
 * @param field the name of the nutrient field
 * @param value the value to set
 * @throws error if field is not recognized as a valid nutrient
 */
function setNutrient(field, value) {
    const labelDiv = Array.from(document.querySelectorAll(FIELD_DIV_LABELS))
        .find(div => div.textContent.trim() === field);
    if (!labelDiv) {
        throw new Error(`Unrecognized Nutrient: ${field}.`);
    }
    const row = labelDiv.closest('tr');
    const input = row.querySelector(INPUT_FIELD_ID);
    const displayDiv = input.previousElementSibling;
    displayDiv.click();
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
}

/**
 * Sets the Food Name field to the give name.
 * @param name the food name
 */
function setFoodName(name) {
    const foodNameField = document.getElementById(FOOD_NAME_INPUT_LABEL);
    foodNameField.value = name;
}