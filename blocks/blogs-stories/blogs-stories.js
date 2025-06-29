/**
 * Blogs and Stories Block
 * Displays a collection of blog posts and stories in a responsive carousel format
 */

export default function decorate(block) {
  // Extract the section title from the first row if it exists
  const rows = [...block.children];
  let sectionTitle = 'Our blogs and stories';
  let contentRows = rows;

  // Check if first row contains only the title
  if (rows.length > 0 && rows[0].children.length === 1) {
    const firstRowText = rows[0].textContent.trim();
    if (!firstRowText.includes('http') && !firstRowText.includes('|')) {
      sectionTitle = firstRowText;
      contentRows = rows.slice(1);
    }
  }

  // Create the container structure
  const container = document.createElement('div');
  container.className = 'blogs-stories-container';

  // Add section title
  const titleElement = document.createElement('h2');
  titleElement.className = 'blogs-stories-title';
  titleElement.textContent = sectionTitle;
  container.appendChild(titleElement);

  // Create carousel wrapper
  const carouselWrapper = document.createElement('div');
  carouselWrapper.className = 'blogs-stories-carousel-wrapper';

  // Create carousel container
  const carousel = document.createElement('div');
  carousel.className = 'blogs-stories-carousel';

  // Process each content row to create cards
  contentRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 4) {
      const card = createCard({
        image: cells[0].querySelector('img')?.src || cells[0].textContent.trim(),
        category: cells[1].textContent.trim(),
        title: cells[2].textContent.trim(),
        readTime: cells[3].textContent.trim(),
        link: cells[4]?.textContent.trim() || '#'
      });
      carousel.appendChild(card);
    }
  });

  carouselWrapper.appendChild(carousel);

  // Create navigation controls
  const controls = createNavigationControls(carousel);
  carouselWrapper.appendChild(controls);

  container.appendChild(carouselWrapper);

  // Replace block content
  block.innerHTML = '';
  block.appendChild(container);

  // Initialize carousel functionality
  initializeCarousel(carousel, controls);
}

function createCard(data) {
  const card = document.createElement('div');
  card.className = 'blogs-stories-card';

  // Create image container
  const imageContainer = document.createElement('div');
  imageContainer.className = 'card-image-container';

  const image = document.createElement('img');
  image.src = data.image;
  image.alt = data.title;
  image.loading = 'lazy';

  const categoryBadge = document.createElement('span');
  categoryBadge.className = `card-category ${data.category.toLowerCase()}`;
  categoryBadge.textContent = data.category.toUpperCase();

  imageContainer.appendChild(image);
  imageContainer.appendChild(categoryBadge);

  // Create content container
  const contentContainer = document.createElement('div');
  contentContainer.className = 'card-content';

  const title = document.createElement('h3');
  title.className = 'card-title';
  title.textContent = data.title;

  const metadata = document.createElement('div');
  metadata.className = 'card-metadata';
  metadata.textContent = data.readTime;

  contentContainer.appendChild(title);
  contentContainer.appendChild(metadata);

  // Wrap in link if provided
  if (data.link && data.link !== '#') {
    const link = document.createElement('a');
    link.href = data.link;
    link.className = 'card-link';
    link.appendChild(imageContainer);
    link.appendChild(contentContainer);
    card.appendChild(link);
  } else {
    card.appendChild(imageContainer);
    card.appendChild(contentContainer);
  }

  return card;
}

function createNavigationControls(carousel) {
  const controls = document.createElement('div');
  controls.className = 'blogs-stories-controls';

  // Create navigation arrows
  const navContainer = document.createElement('div');
  navContainer.className = 'carousel-nav';

  const prevButton = document.createElement('button');
  prevButton.className = 'nav-button prev';
  prevButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6v12z"/></svg>';
  prevButton.setAttribute('aria-label', 'Previous');

  const nextButton = document.createElement('button');
  nextButton.className = 'nav-button next';
  nextButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6V6z"/></svg>';
  nextButton.setAttribute('aria-label', 'Next');

  navContainer.appendChild(prevButton);
  navContainer.appendChild(nextButton);

  // Create View All link
  const viewAllContainer = document.createElement('div');
  viewAllContainer.className = 'view-all-container';

  const viewAllLink = document.createElement('a');
  viewAllLink.href = '#';
  viewAllLink.className = 'view-all-link';
  viewAllLink.innerHTML = 'View All <svg width="16" height="16" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6V6z"/></svg>';

  viewAllContainer.appendChild(viewAllLink);

  controls.appendChild(navContainer);
  controls.appendChild(viewAllContainer);

  return controls;
}

function initializeCarousel(carousel, controls) {
  const cards = carousel.querySelectorAll('.blogs-stories-card');
  const prevButton = controls.querySelector('.prev');
  const nextButton = controls.querySelector('.next');
  
  let currentIndex = 0;
  let cardsPerView = getCardsPerView();

  function getCardsPerView() {
    const width = window.innerWidth;
    if (width < 768) return 1;
    if (width < 1024) return 2;
    return 3;
  }

  function updateCarousel() {
    const cardWidth = 100 / cardsPerView;
    const translateX = -(currentIndex * cardWidth);
    carousel.style.transform = `translateX(${translateX}%)`;
    
    // Update button states
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex >= cards.length - cardsPerView;
  }

  function nextSlide() {
    if (currentIndex < cards.length - cardsPerView) {
      currentIndex++;
      updateCarousel();
    }
  }

  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  }

  // Event listeners
  nextButton.addEventListener('click', nextSlide);
  prevButton.addEventListener('click', prevSlide);

  // Handle window resize
  window.addEventListener('resize', () => {
    const newCardsPerView = getCardsPerView();
    if (newCardsPerView !== cardsPerView) {
      cardsPerView = newCardsPerView;
      currentIndex = Math.min(currentIndex, cards.length - cardsPerView);
      updateCarousel();
    }
  });

  // Touch/swipe support
  let startX = 0;
  let isDragging = false;

  carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  carousel.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
  });

  carousel.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;
    
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  });

  // Initialize
  updateCarousel();
}