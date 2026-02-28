// For generating dropdowns or common form fields
function generateDropdown(options, selectedValue) {
    let dropdown = '<option value="">--Select--</option>';
    options.forEach(option => {
        const selected = option.id === selectedValue ? 'selected' : '';
        dropdown += `<option value="${option.id}" ${selected}>${option.name}</option>`;
    });
    return dropdown;
}

module.exports = { generateDropdown };