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

  // Select all carousels and the timeline graph
  const containers = document.querySelectorAll('.cards.cardousel.block');
  const timelineGraph = document.querySelector('#timelinegraph');

  // Apply dragging, scrolling, and background-position update to each carousel
  containers.forEach((container) => {
    let isDragging = false;
    let startX;
    let scrollLeft;
    let targetScrollLeft = container.scrollLeft;
    let animationFrameId = null;

    // Function to update background-position and sync all carousels
    const updateScrollAndBackground = (targetContainer, newScrollLeft) => {
      const maxScrollLeft = targetContainer.scrollWidth - targetContainer.clientWidth;
      const clampedScrollLeft = Math.max(0, Math.min(newScrollLeft, maxScrollLeft));
      const scrollRatio = maxScrollLeft > 0 ? clampedScrollLeft / maxScrollLeft : 0;
      const backgroundPositionX = scrollRatio * 100;

      // Update background-position of timelineGraph
      timelineGraph.style.backgroundPositionX = `${backgroundPositionX}%`;

      // Sync scroll position of all other carousels
      containers.forEach((otherContainer) => {
        if (otherContainer !== targetContainer) {
          const otherMaxScrollLeft = otherContainer.scrollWidth - otherContainer.clientWidth;
          otherContainer.scrollLeft = scrollRatio * otherMaxScrollLeft;
        }
      });

      // Update targetContainer's scrollLeft to ensure exact boundary alignment
      targetContainer.scrollLeft = clampedScrollLeft;
    };

    // Function to smoothly animate scrollLeft
    const smoothScroll = () => {
      const currentScrollLeft = container.scrollLeft;
      const delta = targetScrollLeft - currentScrollLeft;

      if (Math.abs(delta) < 0.1) { // Increased precision for convergence
        container.scrollLeft = targetScrollLeft;
        updateScrollAndBackground(container, targetScrollLeft);
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      } else {
        container.scrollLeft += delta * 0.2; // Keep lerp factor for smooth delay
        updateScrollAndBackground(container, container.scrollLeft);
        animationFrameId = requestAnimationFrame(smoothScroll);
      }
    };

    // Mouse events for dragging
    container.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      isDragging = true;
      container.classList.add('grabbing');
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      targetScrollLeft = scrollLeft;
      cancelAnimationFrame(animationFrameId);
      e.preventDefault();
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
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      const newScrollLeft = scrollLeft - walk;
      container.scrollLeft = newScrollLeft;
      targetScrollLeft = newScrollLeft;
      updateScrollAndBackground(container, newScrollLeft);
    });

    // Touch events for dragging
    container.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      targetScrollLeft = scrollLeft;
      cancelAnimationFrame(animationFrameId);
    });

    container.addEventListener('touchend', () => {
      isDragging = false;
    });

    container.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const x = e.touches[0].pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const newScrollLeft = scrollLeft - walk;

      // Only prevent default scrolling if carousel can scroll in the direction
      if (
        (walk > 0 && container.scrollLeft > 0) // Swiping right, not at start
        || (walk < 0 && container.scrollLeft < maxScrollLeft) // Swiping left, not at end
      ) {
        e.preventDefault();
      }

      container.scrollLeft = newScrollLeft;
      targetScrollLeft = newScrollLeft;
      updateScrollAndBackground(container, newScrollLeft);
    });

    // Mouse wheel scrolling with smooth animation
    container.addEventListener('wheel', (e) => {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const isAtStart = container.scrollLeft <= 1; // Tolerance for start
      const isAtEnd = container.scrollLeft >= maxScrollLeft - 1; // Tolerance for end

      // Allow native page scrolling if at boundaries
      if (
        (isAtStart && e.deltaY < 0) // Scrolling left at start
        || (isAtEnd && e.deltaY > 0) // Scrolling right at end
        || Math.abs(e.deltaX) > Math.abs(e.deltaY) // Native horizontal scrolling
      ) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        return;
      }

      e.preventDefault();
      targetScrollLeft = Math.max(0, Math.min(targetScrollLeft + e.deltaY * 3, maxScrollLeft));
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(smoothScroll);
      }
    });

    // Update background-position and sync on scroll (for non-wheel events)
    container.addEventListener('scroll', () => {
      if (!isDragging && !animationFrameId) {
        targetScrollLeft = container.scrollLeft;
        updateScrollAndBackground(container, container.scrollLeft);
      }
    });
  });

  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);
}
