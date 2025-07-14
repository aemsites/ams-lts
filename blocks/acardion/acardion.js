import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const container = document.createElement('div');
  container.className = 'acardion-container';

  [...block.children].forEach((row) => {
    // Create individual card
    const card = document.createElement('div');
    card.className = 'acardion-card';

    // Create card image and header
    const imageAndHeader = document.createElement('div');
    imageAndHeader.className = 'acardion-card-image-header';

    const imageCell = row.children[0];
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPicture = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      optimizedPicture.className = 'acardion-card-image';
      imageAndHeader.append(optimizedPicture);
    }

    // Create accordion for paragraph text
    const accordionCell = row.children[1];
    const details = document.createElement('details');
    details.className = 'acardion-item';

    const summary = document.createElement('summary');
    summary.className = 'acardion-item-label';

    // Move header into the accordion label
    const header = document.createElement('h3');
    header.className = 'acardion-card-header';
    header.textContent = imageCell.querySelector('h3')?.textContent || '';
    summary.append(header); // Append header to the accordion label

    // Add preview text below the header
    const paragraph = accordionCell.querySelector('p');
    if (paragraph) {
      const previewText = document.createElement('span');
      previewText.className = 'acardion-preview-text';

      const updatePreviewText = () => {
        const fullText = paragraph.textContent.trim();

        // Adjust maxLength based on responsive sizes
        let maxLength = 65; // Default preview text length
        const viewportWidth = window.innerWidth;

        if (viewportWidth <= 600) {
          maxLength = 38; // For widths <= 600px
        } else if (viewportWidth <= 900) {
          maxLength = 60; // For widths <= 900px
        } else if (viewportWidth <= 1280) {
          maxLength = 50; // For widths <= 1280px
        } else if (viewportWidth <= 1600) {
          maxLength = 65; // For widths <= 1600px
        }

        previewText.textContent = fullText.length > maxLength
          ? `${fullText.slice(0, maxLength)}...`
          : fullText;
      };

      // Initial calculation
      updatePreviewText();

      // Update preview text on window resize
      window.addEventListener('resize', updatePreviewText);

      summary.append(previewText); // Append preview text below the header

      const body = document.createElement('div');
      body.className = 'acardion-item-body';
      body.append(paragraph);
      details.append(body);
    }

    details.append(summary);
    card.append(imageAndHeader, details);
    container.append(card);
  });

  block.innerHTML = '';
  block.append(container);
}
