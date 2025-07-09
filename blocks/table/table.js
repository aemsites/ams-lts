/*
 * Table Block
 * Recreate a table
 * https://www.hlx.live/developer/block-collection/table
 */

function buildCell(rowIndex) {
  const cell = rowIndex ? document.createElement('td') : document.createElement('th');
  if (!rowIndex) cell.setAttribute('scope', 'col');
  return cell;
}

/**
 * Function to add radiobutton before the element #nav > div.section.nav-tools > div > p > sub
 */
function addRadioButton() {
  const subElement = document.querySelector('#alternative-accordion-view-');
  if (subElement) {
    const radioButton = document.createElement('input');
    const radioButtonLabel = document.createElement('label');
    radioButton.type = 'checkbox';
    radioButton.name = 'show-hide-alternative';
    radioButton.id = 'show-hide-alternative-checkbox';
    radioButton.classList.add('show-hide-alternative');
    radioButtonLabel.setAttribute('for', 'show-hide-alternative-checkbox');
    radioButtonLabel.textContent = 'Show/Hide';
    radioButtonLabel.id = 'show-hide-label';
    subElement.append(radioButton);
    subElement.append(radioButtonLabel);
  }
}

export default async function decorate(block) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  const header = !block.classList.contains('no-header');
  if (header) table.append(thead);
  table.append(tbody);

  [...block.children].forEach((child, i) => {
    const row = document.createElement('tr');
    if (header && i === 0) thead.append(row);
    else tbody.append(row);
    [...child.children].forEach((col) => {
      const cell = buildCell(header ? i : i + 1);
      const align = col.getAttribute('data-align');
      const valign = col.getAttribute('data-valign');
      if (align) cell.style.textAlign = align;
      if (valign) cell.style.verticalAlign = valign;
      cell.innerHTML = col.innerHTML;
      row.append(cell);
    });
  });
  block.innerHTML = '';
  block.append(table);
  addRadioButton();
  // TEMP remove me:
  // Checkbox toggle for accordion content
  const checkbox = document.querySelector('#show-hide-alternative-checkbox');
  const accordionContents = document.querySelectorAll('body > main > div:nth-child(5) > div.accordion-wrapper > div');
  checkbox.addEventListener('change', () => {
    accordionContents.forEach((content) => {
      content.style.display = checkbox.checked ? 'block' : 'none'; // Hide when checked, show when unchecked
    });
  });
}
