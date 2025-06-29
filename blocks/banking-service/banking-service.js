export default function decorate(block) {
  const rows = Array.from(block.children);
  
  // Extract navigation items from first row
  const navRow = rows[0];
  const navItems = Array.from(navRow.children).map(cell => cell.textContent.trim());
  
  // Create navigation
  const nav = document.createElement('nav');
  nav.className = 'banking-service-nav';
  
  const navList = document.createElement('ul');
  navList.className = 'nav-tabs';
  
  navItems.forEach((item, index) => {
    const navItem = document.createElement('li');
    const navLink = document.createElement('button');
    navLink.textContent = item;
    navLink.className = index === 0 ? 'nav-link active' : 'nav-link';
    navLink.dataset.tab = item.toLowerCase();
    navItem.appendChild(navLink);
    navList.appendChild(navItem);
  });
  
  nav.appendChild(navList);
  
  // Create cards container
  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'banking-service-cards';
  
  // Process service cards (skip first nav row)
  const serviceRows = rows.slice(1);
  
  serviceRows.forEach((row, index) => {
    const cells = Array.from(row.children);
    if (cells.length >= 6) { // tag, title, description, cta-text, cta-link, icon
      const card = document.createElement('div');
      card.className = 'service-card';
      
      const tag = document.createElement('span');
      tag.className = 'service-tag';
      tag.textContent = cells[0].textContent.trim();
      
      const title = document.createElement('h3');
      title.className = 'service-title';
      title.textContent = cells[1].textContent.trim();
      
      const description = document.createElement('p');
      description.className = 'service-description';
      description.textContent = cells[2].textContent.trim();
      
      const ctaContainer = document.createElement('div');
      ctaContainer.className = 'service-cta';
      
      const ctaLink = document.createElement('a');
      ctaLink.href = cells[4].textContent.trim() || '#';
      ctaLink.textContent = cells[3].textContent.trim();
      ctaLink.className = 'cta-link';
      
      const ctaIcon = document.createElement('span');
      ctaIcon.className = 'cta-icon';
      ctaIcon.innerHTML = '→';
      ctaLink.appendChild(ctaIcon);
      
      ctaContainer.appendChild(ctaLink);
      
      const iconContainer = document.createElement('div');
      iconContainer.className = 'service-icon';
      
      // Handle icon - could be image URL or emoji/text
      const iconContent = cells[5].textContent.trim();
      if (iconContent.startsWith('http')) {
        const img = document.createElement('img');
        img.src = iconContent;
        img.alt = title.textContent;
        iconContainer.appendChild(img);
      } else {
        iconContainer.textContent = iconContent;
      }
      
      card.appendChild(tag);
      card.appendChild(title);
      card.appendChild(description);
      card.appendChild(ctaContainer);
      card.appendChild(iconContainer);
      
      cardsContainer.appendChild(card);
    }
  });
  
  // Clear block and add new content
  block.innerHTML = '';
  block.appendChild(nav);
  block.appendChild(cardsContainer);
  
  // Add tab functionality
  const tabButtons = nav.querySelectorAll('.nav-link');
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      tabButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');
      
      // Here you could add logic to filter cards based on selected tab
      // For now, we'll just update the visual state
    });
  });
}