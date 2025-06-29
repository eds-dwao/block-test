export default function decorate(block) {
  const rows = Array.from(block.children);
  
  // Create hero container
  const heroContainer = document.createElement('div');
  heroContainer.className = 'hero-container';
  
  // Process each row
  rows.forEach((row, index) => {
    const cells = Array.from(row.children);
    
    if (index === 0 && cells.length >= 1) {
      // First row: Hero image
      const imageCell = cells[0];
      const img = imageCell.querySelector('img');
      
      if (img) {
        const imageContainer = document.createElement('div');
        imageContainer.className = 'hero-image';
        
        const heroImg = document.createElement('img');
        heroImg.src = img.src;
        heroImg.alt = img.alt || 'Hero image';
        heroImg.loading = 'eager';
        
        imageContainer.appendChild(heroImg);
        heroContainer.appendChild(imageContainer);
      }
    } else if (index === 1 && cells.length >= 1) {
      // Second row: Main text content
      const textContainer = document.createElement('div');
      textContainer.className = 'hero-content';
      
      const mainText = document.createElement('p');
      mainText.className = 'hero-text';
      mainText.textContent = cells[0].textContent.trim();
      
      textContainer.appendChild(mainText);
      heroContainer.appendChild(textContainer);
    } else if (index === 2 && cells.length >= 2) {
      // Third row: CTA button (text and link)
      const ctaContainer = document.createElement('div');
      ctaContainer.className = 'hero-cta';
      
      const ctaButton = document.createElement('a');
      ctaButton.href = cells[1].textContent.trim() || '#';
      ctaButton.textContent = cells[0].textContent.trim();
      ctaButton.className = 'cta-button';
      
      const ctaIcon = document.createElement('span');
      ctaIcon.className = 'cta-icon';
      ctaIcon.innerHTML = '→';
      ctaButton.appendChild(ctaIcon);
      
      ctaContainer.appendChild(ctaButton);
      heroContainer.appendChild(ctaContainer);
    }
  });
  
  // Clear block and add new content
  block.innerHTML = '';
  block.appendChild(heroContainer);
}