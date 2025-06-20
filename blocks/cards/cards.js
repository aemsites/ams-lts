import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);

    // Assign classes to div elements before wrapping in a link
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else {
        div.className = 'cards-card-body';
      }
    });

    // Check if the third column exists and contains a link
    const thirdColumn = li.children[2]; // Get the third child (0-based index)
    if (thirdColumn && thirdColumn.querySelector('a')) {
      const link = thirdColumn.querySelector('a'); // Get the link
      const { href } = link; // Extract the href attribute using destructuring

      // Remove the text content of the link
      link.textContent = ''; // Clears any text inside the <a> tag

      // Wrap the entire <li> content in the link
      const wrapperLink = document.createElement('a');
      wrapperLink.href = href;
      wrapperLink.style.display = 'block'; // Ensure the link covers the entire <li>
      while (li.firstChild) wrapperLink.append(li.firstChild); // Move all children into the link
      li.append(wrapperLink); // Append the link back to the <li>
    }

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);
}
