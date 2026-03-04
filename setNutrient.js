/**
 * Sets the given nutrient field to the given value
 * @param field the name of the nutrient field
 * @param value the value to set
 */
function setNutrient(field, value) {
    const labelDiv = Array.from(document.querySelectorAll('div.GHB44OMBOJ'))
        .find(div => div.textContent.trim() === field);
    const row = labelDiv.closest('tr');
    const displayDiv = input.previousElementSibling;
    displayDiv.click();
    const input = row.querySelector('.GHB44OMBGJ');
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
}