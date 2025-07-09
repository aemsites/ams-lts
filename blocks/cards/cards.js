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

    // Check if the second column contains a link in the last <p> tag
    const secondColumn = li.children[1]; // Get the second child (0-based index)
    if (secondColumn) {
      const lastP = secondColumn.querySelector('p:last-of-type'); // Find the last <p> tag in the second column
      if (lastP) {
        const link = lastP.querySelector('a'); // Find the first <a> tag within the last <p> tag
        if (link) {
          const { href } = link; // Extract the href attribute using destructuring

          // Remove the text content of the link
          link.textContent = ''; // Clears any text inside the <a> tag

          // Wrap the entire <li> content in the link
          const wrapperLink = document.createElement('a');
          wrapperLink.href = href;
          wrapperLink.classList.add('cards-link-wrapper'); // Add a class instead of inline CSS
          while (li.firstChild) {
            wrapperLink.append(li.firstChild); // Move all children into the link
          }
          li.append(wrapperLink); // Append the link back to the <li>
        }
      }
    }

    ul.append(li);
  });

  const container = document.querySelector('.cards.cardousel.block');
  let isDragging = false;
  let startX;
  let scrollLeft;

  // Mouse events for dragging
  container.addEventListener('mousedown', (e) => {
    // Only start dragging if the left mouse button is pressed
    if (e.button !== 0) return;
    isDragging = true;
    container.classList.add('grabbing');
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener('mouseleave', () => {
    isDragging = false;
    container.classList.remove('grabbing');
  });

  container.addEventListener('mouseup', () => {
    isDragging = false;
    container.classList.remove('grabbing');
  });

  container.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault(); // Prevent text selection during drag
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2; // Adjust drag speed
    container.scrollLeft = scrollLeft - walk;
  });

  // Touch events for swiping
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener('touchend', () => {
    isDragging = false;
  });

  container.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - container.offsetLeft;
    const walk = (x - startX) * 2; // Adjust drag speed
    container.scrollLeft = scrollLeft - walk;
  });

  // Ensure mouse wheel scrolling works naturally
  container.addEventListener('wheel', (e) => {
    // Allow default horizontal scrolling if the wheel event is primarily horizontal
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      return; // Let the browser handle horizontal wheel scrolling
    }
    // For vertical wheel scrolling, translate to horizontal
    e.preventDefault(); // Prevent vertical page scrolling
    container.scrollLeft += e.deltaY * 2; // Adjust scroll speed
  });

  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);
}
