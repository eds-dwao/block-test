/**
 * Banking Services Block
 * Displays banking services organized by categories with tab navigation
 */

export default function decorate(block) {
  // Extract content from block
  const rows = [...block.children];
  
  // Create the container structure
  const container = document.createElement('div');
  container.className = 'banking-services-container';

  // Parse content to extract tabs and services
  const tabsData = parseContent(rows);
  
  // Create tab navigation
  const tabNav = createTabNavigation(tabsData);
  container.appendChild(tabNav);

  // Create tab content area
  const tabContent = createTabContent(tabsData);
  container.appendChild(tabContent);

  // Replace block content
  block.innerHTML = '';
  block.appendChild(container);

  // Initialize tab functionality
  initializeTabs(container);
}

function parseContent(rows) {
  const tabs = {};
  let currentTab = '';

  rows.forEach((row) => {
    const cells = [...row.children];
    
    if (cells.length === 1) {
      // This is a tab header
      currentTab = cells[0].textContent.trim();
      if (!tabs[currentTab]) {
        tabs[currentTab] = [];
      }
    } else if (cells.length >= 5 && currentTab) {
      // This is a service row
      tabs[currentTab].push({
        category: cells[0].textContent.trim(),
        title: cells[1].textContent.trim(),
        description: cells[2].textContent.trim(),
        link: cells[3].textContent.trim(),
        image: cells[4].querySelector('img')?.src || cells[4].textContent.trim()
      });
    }
  });

  return tabs;
}

function createTabNavigation(tabsData) {
  const nav = document.createElement('div');
  nav.className = 'banking-services-nav';

  const tabList = document.createElement('div');
  tabList.className = 'tab-list';
  tabList.setAttribute('role', 'tablist');

  const tabKeys = Object.keys(tabsData);
  
  tabKeys.forEach((tabKey, index) => {
    const tabButton = document.createElement('button');
    tabButton.className = `tab-button ${index === 0 ? 'active' : ''}`;
    tabButton.textContent = tabKey;
    tabButton.setAttribute('role', 'tab');
    tabButton.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    tabButton.setAttribute('data-tab', tabKey.toLowerCase());
    
    tabList.appendChild(tabButton);
  });

  // Create progress indicator
  const progressIndicator = document.createElement('div');
  progressIndicator.className = 'tab-progress';
  
  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  progressIndicator.appendChild(progressBar);

  nav.appendChild(tabList);
  nav.appendChild(progressIndicator);

  return nav;
}

function createTabContent(tabsData) {
  const contentContainer = document.createElement('div');
  contentContainer.className = 'banking-services-content';

  Object.entries(tabsData).forEach(([tabKey, services], index) => {
    const tabPanel = document.createElement('div');
    tabPanel.className = `tab-panel ${index === 0 ? 'active' : ''}`;
    tabPanel.setAttribute('role', 'tabpanel');
    tabPanel.setAttribute('data-tab', tabKey.toLowerCase());

    const servicesGrid = document.createElement('div');
    servicesGrid.className = 'services-grid';

    services.forEach((service, serviceIndex) => {
      const serviceCard = createServiceCard(service, serviceIndex);
      servicesGrid.appendChild(serviceCard);
    });

    tabPanel.appendChild(servicesGrid);
    contentContainer.appendChild(tabPanel);
  });

  return contentContainer;
}

function createServiceCard(service, index) {
  const card = document.createElement('div');
  card.className = 'service-card';
  card.style.animationDelay = `${index * 0.1}s`;

  // Category badge
  const categoryBadge = document.createElement('span');
  categoryBadge.className = `category-badge ${service.category.toLowerCase()}`;
  categoryBadge.textContent = service.category.toUpperCase();

  // Card content
  const cardContent = document.createElement('div');
  cardContent.className = 'card-content';

  const title = document.createElement('h3');
  title.className = 'card-title';
  title.textContent = service.title;

  const description = document.createElement('p');
  description.className = 'card-description';
  description.textContent = service.description;

  const link = document.createElement('a');
  link.href = service.link || '#';
  link.className = 'card-link';
  link.innerHTML = 'Know More <svg width="16" height="16" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6V6z" fill="currentColor"/></svg>';

  cardContent.appendChild(title);
  cardContent.appendChild(description);
  cardContent.appendChild(link);

  // Card image
  const imageContainer = document.createElement('div');
  imageContainer.className = 'card-image';

  if (service.image && (service.image.includes('http') || service.image.includes('.'))) {
    const image = document.createElement('img');
    image.src = service.image;
    image.alt = service.title;
    image.loading = 'lazy';
    imageContainer.appendChild(image);
  } else {
    // Create a placeholder icon
    const iconPlaceholder = document.createElement('div');
    iconPlaceholder.className = 'icon-placeholder';
    iconPlaceholder.innerHTML = getServiceIcon(service.title);
    imageContainer.appendChild(iconPlaceholder);
  }

  card.appendChild(categoryBadge);
  card.appendChild(cardContent);
  card.appendChild(imageContainer);

  return card;
}

function getServiceIcon(title) {
  const iconMap = {
    'insurance': '<svg width="48" height="48" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill="currentColor"/></svg>',
    'savings': '<svg width="48" height="48" viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" fill="currentColor"/></svg>',
    'current': '<svg width="48" height="48" viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" fill="currentColor"/></svg>',
    'default': '<svg width="48" height="48" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/></svg>'
  };

  const key = Object.keys(iconMap).find(k => title.toLowerCase().includes(k)) || 'default';
  return iconMap[key];
}

function initializeTabs(container) {
  const tabButtons = container.querySelectorAll('.tab-button');
  const tabPanels = container.querySelectorAll('.tab-panel');
  const progressBar = container.querySelector('.progress-bar');

  function switchTab(targetTab) {
    // Update buttons
    tabButtons.forEach(button => {
      const isActive = button.getAttribute('data-tab') === targetTab;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Update panels
    tabPanels.forEach(panel => {
      const isActive = panel.getAttribute('data-tab') === targetTab;
      panel.classList.toggle('active', isActive);
    });

    // Update progress bar
    const activeIndex = Array.from(tabButtons).findIndex(btn => btn.classList.contains('active'));
    const progressWidth = ((activeIndex + 1) / tabButtons.length) * 100;
    progressBar.style.width = `${progressWidth}%`;

    // Animate service cards
    const activePanel = container.querySelector(`.tab-panel[data-tab="${targetTab}"]`);
    if (activePanel) {
      const cards = activePanel.querySelectorAll('.service-card');
      cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          card.style.transition = 'all 0.4s ease-out';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 100);
      });
    }
  }

  // Add click listeners to tab buttons
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });

  // Initialize progress bar
  const initialProgress = (1 / tabButtons.length) * 100;
  progressBar.style.width = `${initialProgress}%`;

  // Initialize first tab animation
  setTimeout(() => {
    const firstPanel = container.querySelector('.tab-panel.active');
    if (firstPanel) {
      const cards = firstPanel.querySelectorAll('.service-card');
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 100);
      });
    }
  }, 300);
}