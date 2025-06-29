/**
 * Mobile Services Block
 * Displays banking services with a central mobile phone mockup
 */

export default function decorate(block) {
  // Extract the section title from the first row if it exists
  const rows = [...block.children];
  let sectionTitle = '';
  let contentRows = rows;

  // Check if first row contains only the title
  if (rows.length > 0 && rows[0].children.length === 1) {
    const firstRowText = rows[0].textContent.trim();
    if (!firstRowText.includes('|') && !firstRowText.includes('http')) {
      sectionTitle = firstRowText;
      contentRows = rows.slice(1);
    }
  }

  // Create the container structure
  const container = document.createElement('div');
  container.className = 'mobile-services-container';

  // Add section title if provided
  if (sectionTitle) {
    const titleElement = document.createElement('h2');
    titleElement.className = 'mobile-services-title';
    titleElement.textContent = sectionTitle;
    container.appendChild(titleElement);
  }

  // Create the main content area
  const contentArea = document.createElement('div');
  contentArea.className = 'mobile-services-content';

  // Create services grid
  const servicesGrid = document.createElement('div');
  servicesGrid.className = 'services-grid';

  // Create mobile mockup container
  const mobileContainer = document.createElement('div');
  mobileContainer.className = 'mobile-mockup-container';

  // Process content rows to separate mobile image and services
  let mobileImage = '';
  const services = [];

  contentRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 3) {
      const firstCell = cells[0].textContent.trim();
      
      // Check if this row contains the mobile image
      if (firstCell.toLowerCase().includes('mobile') || firstCell.includes('.png') || firstCell.includes('.jpg')) {
        mobileImage = cells[1].querySelector('img')?.src || cells[1].textContent.trim();
      } else {
        // This is a service row
        services.push({
          icon: cells[0].querySelector('img')?.src || cells[0].textContent.trim(),
          title: cells[1].textContent.trim(),
          description: cells[2].textContent.trim()
        });
      }
    }
  });

  // Create mobile mockup
  if (mobileImage) {
    const mockup = createMobileMockup(mobileImage);
    mobileContainer.appendChild(mockup);
  }

  // Create service cards
  services.forEach((service, index) => {
    const serviceCard = createServiceCard(service, index);
    servicesGrid.appendChild(serviceCard);
  });

  // Assemble the layout
  contentArea.appendChild(servicesGrid);
  contentArea.appendChild(mobileContainer);
  container.appendChild(contentArea);

  // Replace block content
  block.innerHTML = '';
  block.appendChild(container);

  // Initialize animations
  initializeAnimations(container);
}

function createMobileMockup(imageSrc) {
  const mockup = document.createElement('div');
  mockup.className = 'mobile-mockup';

  const phone = document.createElement('div');
  phone.className = 'phone-frame';

  const screen = document.createElement('div');
  screen.className = 'phone-screen';

  const image = document.createElement('img');
  image.src = imageSrc;
  image.alt = 'Mobile Banking App';
  image.className = 'phone-content';

  screen.appendChild(image);
  phone.appendChild(screen);
  mockup.appendChild(phone);

  return mockup;
}

function createServiceCard(service, index) {
  const card = document.createElement('div');
  card.className = `service-card service-card-${index + 1}`;
  card.setAttribute('data-index', index);

  const iconContainer = document.createElement('div');
  iconContainer.className = 'service-icon';

  if (service.icon.includes('http') || service.icon.includes('.')) {
    const icon = document.createElement('img');
    icon.src = service.icon;
    icon.alt = service.title;
    iconContainer.appendChild(icon);
  } else {
    // Create a simple icon placeholder
    const iconPlaceholder = document.createElement('div');
    iconPlaceholder.className = 'icon-placeholder';
    iconPlaceholder.textContent = service.icon;
    iconContainer.appendChild(iconPlaceholder);
  }

  const title = document.createElement('h3');
  title.className = 'service-title';
  title.textContent = service.title;

  const description = document.createElement('p');
  description.className = 'service-description';
  description.textContent = service.description;

  card.appendChild(iconContainer);
  card.appendChild(title);
  if (service.description) {
    card.appendChild(description);
  }

  return card;
}

function initializeAnimations(container) {
  // Animate service cards on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observe all service cards
  const serviceCards = container.querySelectorAll('.service-card');
  serviceCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    observer.observe(card);
  });

  // Observe mobile mockup
  const mobileMockup = container.querySelector('.mobile-mockup');
  if (mobileMockup) {
    observer.observe(mobileMockup);
  }

  // Add hover effects
  serviceCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.classList.add('hovered');
    });

    card.addEventListener('mouseleave', () => {
      card.classList.remove('hovered');
    });
  });
}