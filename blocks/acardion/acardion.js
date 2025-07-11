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
      const fullText = paragraph.textContent.trim();
      previewText.textContent = fullText.length > 65
        ? `${fullText.slice(0, 65)}...` // Limit to 60 characters and add "..."
        : fullText; // Use full text if it's shorter than 60 characters
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
