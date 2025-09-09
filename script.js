// Initialize saved movies from localStorage
let savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];

// Initialize user profile from localStorage
let userProfile = JSON.parse(localStorage.getItem('userProfile')) || {
    name: 'Hausa Movies User',
    avatar: null
};

// Combine videos, series, and anime data and shuffle
const combinedData = [...videosData, ...seriesData, ...animeData];
const data = shuffleArray(combinedData);

// Track if we're currently in the video modal
let inVideoModal = false;

// Track if we're currently in a grid view
let inGridView = false;

// Track if we're currently in the filter modal
let inFilterModal = false;

// Track if we're currently in the history modal
let inHistoryModal = false;

// Track if we're currently in the sidebar modal
let inSidebarModal = false;

// Track current grid data for filtering
let currentGridData = [];

// Track if we're navigating episodes/seasons
let isEpisodeNavigation = false;

// Track search suggestions
let searchTimeout;
let currentSearchTerm = '';

const logosData = [
    { imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIlQrAhJwP4oyweBiy8rHJngSeN7E2_gNWQjtqKDOiRQ&s", videoUrl: "https://darulfikr.com/" },
    { imgUrl: "https://via.placeholder.com/100", videoUrl: "https://youtube.com/embed/CumW3IY1mMg" },
    { imgUrl: "https://via.placeholder.com/100", videoUrl: "https://youtube.com/embed/SFtKVKoscqA" },
    { imgUrl: "https://via.placeholder.com/100", videoUrl: "https://youtube.com/embed/hJzZRl1C8X0" },
    { imgUrl: "https://via.placeholder.com/100", videoUrl: "https://youtube.com/embed/BjkncLAZu80" },
    { imgUrl: "https://via.placeholder.com/100", videoUrl: "https://youtube.com/embed/UPjyNg1mKAM" },
    { imgUrl: "https://via.placeholder.com/100", videoUrl: "https://youtube.com/embed/iTNyJse9fdk" },
    { imgUrl: "https://via.placeholder.com/100", videoUrl: "https://youtube.com/embed/siFLpeqOWDQ" },
    { imgUrl: "https://via.placeholder.com/100", videoUrl: "https://youtube.com/embed/Ma9xquhYyT0" },
];
const createLogosSection = () => {
    const logosScroll = document.getElementById('logos-scroll');
    logosScroll.innerHTML = '';
    logosData.forEach(logo => {
        const logoItem = document.createElement('div');
        logoItem.className = 'logo-item';
        const img = document.createElement('img');
        img.src = logo.imgUrl;
        img.alt = 'Logo';
        logoItem.appendChild(img);
        logosScroll.appendChild(logoItem);
        // Add click event to open video
        logoItem.onclick = () => {
            document.getElementById('video-nav').style.display = 'flex';
            document.getElementById('video-player').src = logo.videoUrl;
        };
    });
};
// Call the function to create the logos section
createLogosSection();

// Function to toggle the sidebar modal
const toggleSidebarModal = () => {
    const sidebarModal = document.getElementById('sidebar-modal');
    const historyModal = document.getElementById('history-modal');
    const filterModal = document.getElementById('filter-modal');
    
    // If history modal is open, close it first
    if (historyModal.classList.contains('open')) {
        historyModal.classList.remove('open');
        inHistoryModal = false;
    }
    
    // If filter modal is open, close it first
    if (filterModal.classList.contains('open')) {
        filterModal.classList.remove('open');
        inFilterModal = false;
    }
    
    // Toggle the sidebar modal
    sidebarModal.classList.toggle('open');
    inSidebarModal = !inSidebarModal;
    
    // If opening the sidebar modal, push state to history
    if (inSidebarModal) {
        history.pushState({ sidebarOpen: true }, '');
    }
};

// Function to toggle the history modal
const toggleHistoryModal = () => {
    const historyModal = document.getElementById('history-modal');
    const sidebarModal = document.getElementById('sidebar-modal');
    const filterModal = document.getElementById('filter-modal');
    
    // If sidebar modal is open, close it first
    if (sidebarModal.classList.contains('open')) {
        sidebarModal.classList.remove('open');
        inSidebarModal = false;
    }
    
    // If filter modal is open, close it first
    if (filterModal.classList.contains('open')) {
        filterModal.classList.remove('open');
        inFilterModal = false;
    }
    
    // Toggle the history modal
    historyModal.classList.toggle('open');
    inHistoryModal = !inHistoryModal;
    
    // If opening the history modal, push state to history
    if (inHistoryModal) {
        history.pushState({ historyOpen: true }, '');
    }
};

// Function to toggle the filter modal
const toggleFilterModal = () => {
    const filterModal = document.getElementById('filter-modal');
    const sidebarModal = document.getElementById('sidebar-modal');
    const historyModal = document.getElementById('history-modal');
    
    // If sidebar modal is open, close it first
    if (sidebarModal.classList.contains('open')) {
        sidebarModal.classList.remove('open');
        inSidebarModal = false;
    }
    
    // If history modal is open, close it first
    if (historyModal.classList.contains('open')) {
        historyModal.classList.remove('open');
        inHistoryModal = false;
    }
    
    // Toggle the filter modal
    filterModal.classList.toggle('open');
    inFilterModal = !inFilterModal;
    
    // If opening the filter modal, push state to history
    if (inFilterModal) {
        history.pushState({ filterOpen: true }, '');
    }
};

// Function to populate the sidebar with URL logos
const populateSidebar = () => {
    const sidebarList = document.getElementById('sidebar-list');
    sidebarList.innerHTML = '';
    // Example list of URL logos (replace with your own data)
    const urlLogos = [
        { logoUrl: "https://cdn-icons-png.flaticon.com/128/18831/18831648.png", name: "Director Center", url: "#" },
        { logoUrl: "https://cdn-icons-png.flaticon.com/128/5303/5303479.png", name: "Earn Rewards", url: "#" },
        { logoUrl: "https://cdn-icons-png.flaticon.com/128/9592/9592247.png", name: "Viewer Gift", url: "#" },
        { logoUrl: "https://cdn-icons-png.flaticon.com/128/18392/18392966.png", name: "Online Service", url: "#" },
        { logoUrl: "https://cdn-icons-png.flaticon.com/128/2312/2312342.png", name: "Privacy Policy", url: "#" },
        { logoUrl: "https://cdn-icons-png.flaticon.com/128/3405/3405247.png", name: "Settings", url: "#" },
        { logoUrl: "https://cdn-icons-png.flaticon.com/128/2838/2838694.png", name: "Help & Support", url: "#" },
    ];
    urlLogos.forEach(item => {
        const sidebarItem = document.createElement('div');
        sidebarItem.className = 'sidebar-item';
        sidebarItem.onclick = () => window.open(item.url, '_blank');
        const img = document.createElement('img');
        img.src = item.logoUrl;
        img.alt = item.name;
        const span = document.createElement('span');
        span.textContent = item.name;
        sidebarItem.appendChild(img);
        sidebarItem.appendChild(span);
        sidebarList.appendChild(sidebarItem);
    });
};
// Call the function to populate the sidebar on page load
populateSidebar();

// Function to shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Create carousel using the data array - Updated to match screenshot
const createCarousel = () => {
    const carousel = document.getElementById("carousel");
    const dotsContainer = document.getElementById("dots");
    carousel.innerHTML = '';
    dotsContainer.innerHTML = '';
    
    // Use the first 5 items for carousel
    const carouselData = data.slice(0, 5);
    
    carouselData.forEach((item, index) => {
        const slide = document.createElement("div");
        slide.className = "slide";
        
        // Format tags for display
        const tagsDisplay = item.tags ? item.tags.join(" • ") : "";
        
        slide.innerHTML = `
            <img src="${item.carouselCover || item.imgUrl}" alt="${item.title}">
            <div class="overlay"></div>
            <div class="video-title">${item.title}</div>
            <div class="video-info">${item.type || 'Movie'} | ${item.year || '2025'} | ${tagsDisplay}</div>
            <button class="download-btn">
                <i class="fas fa-download"></i> Download
            </button>
        `;
        
        // Add click event to open modal
        slide.onclick = () => openVideoNav(item.videoUrl, item.title, item);
        
        carousel.appendChild(slide);
        
        const dot = document.createElement("div");
        dot.className = "dot";
        if (index === 0) dot.classList.add("active");
        dot.addEventListener("click", () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
};

const createDiscoverSection = () => {
    const discoverScroll = document.getElementById('discover-scroll');
    discoverScroll.innerHTML = '';
    
    // Use items from index 5 to 24 (20 items) for discover section
    const discoverData = data.slice(5, 25);
    
    discoverData.forEach(item => {
        const discoverItem = document.createElement('div');
        discoverItem.className = 'discover-item';
        const img = document.createElement('img');
        img.src = item.imgUrl; // Use movie cover for discover section
        img.alt = item.title;
        const content = document.createElement('div');
        content.className = 'content';
        content.innerHTML = `
            <h2>${item.title}</h2>
            <p>${item.description}</p>
        `;
        
        // Add click event to the entire discover item
        discoverItem.onclick = () => openVideoNav(item.videoUrl, item.title, item);
        
        discoverItem.appendChild(img);
        discoverItem.appendChild(content);
        discoverScroll.appendChild(discoverItem);
    });
};
const createCategories = () => {
    const categories = [...new Set(data.map(item => item.category))]; // Get unique categories
    const container = document.getElementById('categories-container');
    container.innerHTML = '';
    categories.forEach(category => {
        const categoryData = data.filter(item => item.category === category); // Use original data
        const categoryContainer = document.createElement('div');
        categoryContainer.className = 'category-container';
        const categoryTitle = document.createElement('div');
        categoryTitle.className = 'category-title';
        categoryTitle.innerHTML = `
            <span>
                ${category}
                <i class="fas fa-chevron-right"></i> <!-- Right arrow icon -->
            </span>
            <button onclick="showAllVideos('${category}')">All <i class="fas fa-chevron-right"></i></button>
        `;
        // Make the entire title clickable
        categoryTitle.onclick = () => showAllVideos(category);
        const categoryScroll = document.createElement('div');
        categoryScroll.className = 'category-scroll';
        // Display all videos in the category (no slice limit)
        categoryData.forEach(item => {
            const frame = createFrame(item);
            categoryScroll.appendChild(frame);
        });
        categoryContainer.appendChild(categoryTitle);
        categoryContainer.appendChild(categoryScroll);
        container.appendChild(categoryContainer);
    });
};

// Function to show all videos in grid layout
const showAllVideosGrid = () => {
    // Reset scroll position
    window.scrollTo(0, 0);
    
    // Set flag and push state for grid view
    inGridView = true;
    history.pushState({ gridView: true }, '');
    
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    gridContainer.scrollTop = 0; // Reset grid container scroll
    
    // Hide other sections
    document.getElementById('discover-container').style.display = 'none';
    document.getElementById('categories-container').style.display = 'none';
    gridContainer.style.display = 'grid';
    
    // Add all videos to the grid
    data.forEach(item => {
        const frame = createFrame(item);
        gridContainer.appendChild(frame);
    });
};

const showTrendingVideos = () => {
    // Reset scroll position
    window.scrollTo(0, 0);
    
    // Set flag and push state for grid view
    inGridView = true;
    history.pushState({ gridView: true }, '');
    
    const trendingData = data.filter(item => item.trending); // Filter trending videos
    currentGridData = trendingData; // Set current grid data for filtering
    
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    gridContainer.scrollTop = 0; // Reset grid container scroll
    
    // Hide other sections
    document.getElementById('discover-container').style.display = 'none';
    document.getElementById('categories-container').style.display = 'none';
    gridContainer.style.display = 'grid';
    
    // Add filter section
    const filterSection = createFilterSection();
    gridContainer.insertBefore(filterSection, gridContainer.firstChild);
    
    // Add trending videos to the grid
    if (trendingData.length > 0) {
        trendingData.forEach(item => {
            const frame = createFrame(item);
            gridContainer.appendChild(frame);
        });
    } else {
        showNotification('No trending movies found.', 'warning');
    }
};

const showProfileSection = () => {
    // Reset scroll position
    window.scrollTo(0, 0);
    
    // Set flag and push state for grid view
    inGridView = true;
    history.pushState({ gridView: true }, '');
    
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    gridContainer.scrollTop = 0; // Reset grid container scroll
    
    // Hide other sections
    document.getElementById('discover-container').style.display = 'none';
    document.getElementById('categories-container').style.display = 'none';
    gridContainer.style.display = 'block'; // Use block for list layout
    
    // Add profile content using profileApps data
    profileApps.forEach(item => {
        const profileItem = createProfileItem(item);
        gridContainer.appendChild(profileItem);
    });
};

const showHomeVideos = () => {
    // Reset scroll position
    window.scrollTo(0, 0);
    
    // Set flag and push state for grid view
    inGridView = true;
    history.pushState({ gridView: true }, '');
    
    const homeData = data; // Use the entire data array for home videos
    currentGridData = homeData; // Set current grid data for filtering
    
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    gridContainer.scrollTop = 0; // Reset grid container scroll
    
    // Hide other sections
    document.getElementById('discover-container').style.display = 'none';
    document.getElementById('categories-container').style.display = 'none';
    gridContainer.style.display = 'grid';
    
    // Add filter section
    const filterSection = createFilterSection();
    gridContainer.insertBefore(filterSection, gridContainer.firstChild);
    
    // Add home videos to the grid
    if (homeData.length > 0) {
        homeData.forEach(item => {
            const frame = createFrame(item);
            gridContainer.appendChild(frame);
        });
    } else {
        showNotification('No movies found.', 'warning');
    }
};

const showMyList = () => {
    // Reset scroll position
    window.scrollTo(0, 0);
    
    // Set flag and push state for grid view
    inGridView = true;
    history.pushState({ gridView: true }, '');
    
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    gridContainer.scrollTop = 0; // Reset grid container scroll
    
    // Hide other sections
    document.getElementById('discover-container').style.display = 'none';
    document.getElementById('categories-container').style.display = 'none';
    gridContainer.style.display = 'block'; // Use block for list layout
    
    // Get saved movies from localStorage
    const savedMoviesData = data.filter(item => savedMovies.includes(item.title));
    
    if (savedMoviesData.length > 0) {
        savedMoviesData.forEach(item => {
            const listItem = createUnlockedListItem(item);
            gridContainer.appendChild(listItem);
        });
    } else {
        showNotification('No saved movies found. Save some movies to see them here.', 'warning');
    }
};

// Function to show the Discover section with carousel
const showDiscoverSection = () => {
    // Reset scroll position
    window.scrollTo(0, 0);
    
    // Set flag and push state for discover view
    inGridView = false;
    history.pushState({ gridView: false, discoverView: true }, '');
    
    // Show discover and categories containers
    document.getElementById('discover-container').style.display = 'block';
    document.getElementById('categories-container').style.display = 'block';
    
    // Hide grid container
    document.getElementById('grid-container').style.display = 'none';
};

// Function to create filter section
const createFilterSection = () => {
    const filterSection = document.createElement('div');
    filterSection.className = 'filter-section';
    
    // Get unique genres, countries, and years from currentGridData
    const genres = [...new Set(currentGridData.map(item => item.genre).filter(Boolean))];
    const countries = [...new Set(currentGridData.map(item => item.country).filter(Boolean))];
    const years = [...new Set(currentGridData.map(item => item.year).filter(Boolean))].sort((a, b) => b - a);
    
    // Create genre dropdown
    const genreDropdown = document.createElement('select');
    genreDropdown.className = 'filter-dropdown';
    genreDropdown.id = 'genre-filter';
    
    const genreDefault = document.createElement('option');
    genreDefault.value = '';
    genreDefault.textContent = 'All Genres';
    genreDropdown.appendChild(genreDefault);
    
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreDropdown.appendChild(option);
    });
    
    // Create country dropdown
    const countryDropdown = document.createElement('select');
    countryDropdown.className = 'filter-dropdown';
    countryDropdown.id = 'country-filter';
    
    const countryDefault = document.createElement('option');
    countryDefault.value = '';
    countryDefault.textContent = 'All Countries';
    countryDropdown.appendChild(countryDefault);
    
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countryDropdown.appendChild(option);
    });
    
    // Create year dropdown
    const yearDropdown = document.createElement('select');
    yearDropdown.className = 'filter-dropdown';
    yearDropdown.id = 'year-filter';
    
    const yearDefault = document.createElement('option');
    yearDefault.value = '';
    yearDefault.textContent = 'All Years';
    yearDropdown.appendChild(yearDefault);
    
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearDropdown.appendChild(option);
    });
    
    // Create filter button
    const filterButton = document.createElement('button');
    filterButton.className = 'filter-button';
    filterButton.innerHTML = '<i class="fas fa-filter"></i> Apply';
    filterButton.onclick = applyGridFilters;
    
    // Add elements to filter section
    filterSection.appendChild(genreDropdown);
    filterSection.appendChild(countryDropdown);
    filterSection.appendChild(yearDropdown);
    filterSection.appendChild(filterButton);
    
    return filterSection;
};

// Function to apply grid filters
const applyGridFilters = () => {
    const genreValue = document.getElementById('genre-filter').value;
    const countryValue = document.getElementById('country-filter').value;
    const yearValue = document.getElementById('year-filter').value;
    
    let filteredData = currentGridData;
    
    if (genreValue) {
        filteredData = filteredData.filter(item => item.genre === genreValue);
    }
    
    if (countryValue) {
        filteredData = filteredData.filter(item => item.country === countryValue);
    }
    
    if (yearValue) {
        filteredData = filteredData.filter(item => item.year == yearValue);
    }
    
    // Update the grid with filtered data
    const gridContainer = document.getElementById('grid-container');
    
    // Remove existing frames but keep the filter section
    const filterSection = gridContainer.querySelector('.filter-section');
    gridContainer.innerHTML = '';
    if (filterSection) {
        gridContainer.appendChild(filterSection);
    }
    
    if (filteredData.length > 0) {
        filteredData.forEach(item => {
            const frame = createFrame(item);
            gridContainer.appendChild(frame);
        });
    } else {
        showNotification('No movies found with the selected filters.', 'warning');
    }
};

const createProfileItem = (item) => {
    const profileItem = document.createElement('div');
    profileItem.className = 'profile-item';
    profileItem.style.display = 'flex';
    profileItem.style.alignItems = 'center';
    profileItem.style.gap = '10px';
    profileItem.style.padding = '10px';
    profileItem.style.borderBottom = '1px solid #333';
    const icon = document.createElement('img');
    icon.src = item.icon;
    icon.alt = item.name;
    icon.style.width = '50px';
    icon.style.height = '50px';
    icon.style.borderRadius = '8px';
    const content = document.createElement('div');
    content.style.flex = '1';
    const name = document.createElement('h4');
    name.textContent = item.name;
    name.style.margin = '0';
    name.style.fontSize = '13px';
    name.style.color = '#ccc';
    const description = document.createElement('p');
    description.textContent = item.description;
    description.style.margin = '0';
    description.style.fontSize = '10px';
    description.style.color = '#888';
    const openButton = document.createElement('button');
    openButton.textContent = 'Install';
    openButton.style.backgroundColor = '#00b300';
    openButton.style.color = '#fff';
    openButton.style.border = 'none';
    openButton.style.padding = '6px 12px';
    openButton.style.borderRadius = '5px';
    openButton.style.cursor = 'pointer';
    openButton.style.fontSize = '14px';
    openButton.onclick = () => window.open(item.link, '_blank');
    content.appendChild(name);
    content.appendChild(description);
    profileItem.appendChild(icon);
    profileItem.appendChild(content);
    profileItem.appendChild(openButton);
    return profileItem;
};

const createFrame = (item) => {
    const frame = document.createElement('div');
    frame.className = 'frame';
    const img = document.createElement('img');
    img.src = item.imgUrl; // Use movie cover for frame
    img.alt = item.title;
    const content = document.createElement('div');
    content.className = 'content';
    const title = document.createElement('h2');
    title.textContent = item.title;
    
    // Add click event to the entire frame
    frame.onclick = () => openVideoNav(item.videoUrl, item.title, item);
    
    content.appendChild(title);
    frame.appendChild(img);
    frame.appendChild(content);
    return frame;
};

const createUnlockedListItem = (item) => {
    const listItem = document.createElement('div');
    listItem.className = 'unlocked-item';
    listItem.style.display = 'flex';
    listItem.style.alignItems = 'center';
    listItem.style.gap = '10px';
    listItem.style.padding = '10px';
    listItem.style.borderBottom = '1px solid #333';
    listItem.style.cursor = 'pointer';
    
    const img = document.createElement('img');
    img.src = item.imgUrl; // Use movie cover for list item
    img.alt = item.title;
    img.style.width = '80px';
    img.style.height = '115px';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '5px';
    
    const content = document.createElement('div');
    content.style.flex = '1';
    
    const title = document.createElement('h4');
    title.textContent = item.title;
    title.style.margin = '0';
    title.style.fontSize = '14px';
    title.style.color = '#ccc';
    
    const description = document.createElement('p');
    description.textContent = item.description;
    description.style.margin = '0';
    description.style.fontSize = '12px';
    description.style.color = '#777';
    
    // Add click event to the entire list item
    listItem.onclick = () => openVideoNav(item.videoUrl, item.title, item);
    
    content.appendChild(title);
    content.appendChild(description);
    listItem.appendChild(img);
    listItem.appendChild(content);
    return listItem;
};

// Track current movie in modal
let currentMovieInModal = null;

const openVideoNav = (videoUrl, videoId, item) => {
    // Check network connection before opening video
    if (!navigator.onLine) {
        showNetworkWarning();
        return;
    }
    
    // Display the video navigation modal
    document.getElementById('video-nav').style.display = 'flex';
    
    // Check if the iframe exists, if not create it
    const navBody = document.querySelector('.nav-body');
    const iframeContainer = navBody.querySelector('div[style*="position: relative"]');
    let videoPlayer = document.getElementById('video-player');
    
    if (!videoPlayer) {
        // Create a new iframe
        videoPlayer = document.createElement('iframe');
        videoPlayer.id = 'video-player';
        videoPlayer.setAttribute('frameborder', '0');
        videoPlayer.setAttribute('allowfullscreen', '');
        videoPlayer.style.width = '100%';
        videoPlayer.style.height = '100%';
        iframeContainer.appendChild(videoPlayer);
    }
    
    // Process the video URL based on its source
    let processedUrl = videoUrl;
    
    // Check if it's a YouTube embed URL
    if (videoUrl.includes('youtube.com/embed/')) {
        // Add autoplay=1 parameter for YouTube to autoplay with sound
        const separator = videoUrl.includes('?') ? '&' : '?';
        processedUrl = videoUrl + separator + 'autoplay=1&mute=0';
    } 
    // For Google Drive preview, ensure no autoplay parameters
    else if (videoUrl.includes('drive.google.com/file/d/')) {
        // Google Drive preview doesn't autoplay by default, so no changes needed
        processedUrl = videoUrl;
    }
    
    // Set the processed video URL in the iframe
    videoPlayer.src = processedUrl;
    
    // Track current movie
    currentMovieInModal = item;
    
    // Update save button state
    updateSaveButton();
    
    // Only push state if we're not already in the modal
    if (!inVideoModal) {
        history.pushState({ videoOpen: true }, '');
        inVideoModal = true;
    }
    
    // Check if this is a series with episodes
    const episodeFooter = document.getElementById('episode-footer');
    if (item && item.isSeries && item.seasons) {
        // Show episode footer
        episodeFooter.style.display = 'block';
        
        // Set current season index (if not set, default to 0)
        if (typeof item.currentSeason === 'undefined') {
            item.currentSeason = 0;
        }
        
        // Update episode title to include season
        document.getElementById('episode-title').textContent = `${item.title} - Season ${item.seasons[item.currentSeason].seasonNumber}`;
        
        // Update episode count for the current season
        document.getElementById('episode-count').textContent = `${item.seasons[item.currentSeason].episodes.length} Episodes`;
        
        // Clear existing episodes
        const episodeScroller = document.getElementById('episode-scroller');
        episodeScroller.innerHTML = '';
        
        // Add Previous Season button if not the first season
        if (item.currentSeason > 0) {
            const prevSeasonBtn = document.createElement('div');
            prevSeasonBtn.className = 'season-nav-btn prev-season';
            prevSeasonBtn.innerHTML = `
                <span class="season-nav-text">Prev</span>
                <span class="season-number">S${item.seasons[item.currentSeason - 1].seasonNumber}</span>
            `;
            
            prevSeasonBtn.onclick = () => {
                goToSeason(item.currentSeason - 1);
            };
            
            episodeScroller.appendChild(prevSeasonBtn);
        }
        
        // Add episode buttons for the current season
        item.seasons[item.currentSeason].episodes.forEach((episode, index) => {
            const episodeBtn = document.createElement('div');
            episodeBtn.className = 'episode-btn';
            if (index === 0) episodeBtn.classList.add('active');
            
            const epNum = document.createElement('div');
            epNum.className = 'ep-num';
            epNum.textContent = `EP`;
            
            const epNumber = document.createElement('div');
            epNumber.textContent = episode.number;
            
            episodeBtn.appendChild(epNum);
            episodeBtn.appendChild(epNumber);
            
            // Add click event
            episodeBtn.onclick = () => {
                // Set flag to indicate we're navigating episodes
                isEpisodeNavigation = true;
                
                // Remove active class from all buttons
                document.querySelectorAll('.episode-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Add active class to clicked button
                episodeBtn.classList.add('active');
                
                // Process episode URL if it's a YouTube video
                let episodeUrl = episode.url;
                if (episodeUrl.includes('youtube.com/embed/')) {
                    const separator = episodeUrl.includes('?') ? '&' : '?';
                    episodeUrl = episodeUrl + separator + 'autoplay=1&mute=0';
                }
                
                // Load episode in iframe
                videoPlayer.src = episodeUrl;
                
                // Reset flag after a short delay
                setTimeout(() => {
                    isEpisodeNavigation = false;
                }, 100);
            };
            
            episodeScroller.appendChild(episodeBtn);
        });
        
        // Add Next Season button if not the last season
        if (item.currentSeason < item.seasons.length - 1) {
            const nextSeasonBtn = document.createElement('div');
            nextSeasonBtn.className = 'season-nav-btn next-season';
            nextSeasonBtn.innerHTML = `
                <span class="season-nav-text">Next</span>
                <span class="season-number">S${item.seasons[item.currentSeason + 1].seasonNumber}</span>
            `;
            
            nextSeasonBtn.onclick = () => {
                goToSeason(item.currentSeason + 1);
            };
            
            episodeScroller.appendChild(nextSeasonBtn);
        }
    } else {
        // Hide episode footer for non-series content
        episodeFooter.style.display = 'none';
    }
    
    // Add the video to the history
    addToHistory(videoId);
};

// Function to go to a specific season
const goToSeason = (seasonIndex) => {
    if (!currentMovieInModal || !currentMovieInModal.isSeries || !currentMovieInModal.seasons) return;
    
    // Set flag to indicate we're navigating episodes
    isEpisodeNavigation = true;
    
    // Update current season
    currentMovieInModal.currentSeason = seasonIndex;
    
    // Update the episode scroller for the new season
    const currentSeason = currentMovieInModal.seasons[seasonIndex];
    document.getElementById('episode-title').textContent = `${currentMovieInModal.title} - Season ${currentSeason.seasonNumber}`;
    document.getElementById('episode-count').textContent = `${currentSeason.episodes.length} Episodes`;
    
    // Clear and repopulate episode scroller
    const episodeScroller = document.getElementById('episode-scroller');
    episodeScroller.innerHTML = '';
    
    // Add Previous Season button if not the first season
    if (seasonIndex > 0) {
        const prevSeasonBtn = document.createElement('div');
        prevSeasonBtn.className = 'season-nav-btn prev-season';
        prevSeasonBtn.innerHTML = `
            <span class="season-nav-text">PREV</span>
            <span class="season-number">S${currentMovieInModal.seasons[seasonIndex - 1].seasonNumber}</span>
        `;
        
        prevSeasonBtn.onclick = () => {
            goToSeason(seasonIndex - 1);
        };
        
        episodeScroller.appendChild(prevSeasonBtn);
    }
    
    // Add episode buttons for the current season
    currentSeason.episodes.forEach((episode, index) => {
        const episodeBtn = document.createElement('div');
        episodeBtn.className = 'episode-btn';
        if (index === 0) episodeBtn.classList.add('active');
        
        const epNum = document.createElement('div');
        epNum.className = 'ep-num';
        epNum.textContent = `EP`;
        
        const epNumber = document.createElement('div');
        epNumber.textContent = episode.number;
        
        episodeBtn.appendChild(epNum);
        episodeBtn.appendChild(epNumber);
        
        episodeBtn.onclick = () => {
            // Set flag to indicate we're navigating episodes
            isEpisodeNavigation = true;
            
            document.querySelectorAll('.episode-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            episodeBtn.classList.add('active');
            
            // Process episode URL if it's a YouTube video
            let episodeUrl = episode.url;
            if (episodeUrl.includes('youtube.com/embed/')) {
                const separator = episodeUrl.includes('?') ? '&' : '?';
                episodeUrl = episodeUrl + separator + 'autoplay=1&mute=0';
            }
            
            document.getElementById('video-player').src = episodeUrl;
            
            // Reset flag after a short delay
            setTimeout(() => {
                isEpisodeNavigation = false;
            }, 100);
        };
        
        episodeScroller.appendChild(episodeBtn);
    });
    
    // Add Next Season button if not the last season
    if (seasonIndex < currentMovieInModal.seasons.length - 1) {
        const nextSeasonBtn = document.createElement('div');
        nextSeasonBtn.className = 'season-nav-btn next-season';
        nextSeasonBtn.innerHTML = `
            <span class="season-nav-text">NEXT</span>
            <span class="season-number">S${currentMovieInModal.seasons[seasonIndex + 1].seasonNumber}</span>
        `;
        
        nextSeasonBtn.onclick = () => {
            goToSeason(seasonIndex + 1);
        };
        
        episodeScroller.appendChild(nextSeasonBtn);
    }
    
    // Load the first episode of the new season
    if (currentSeason.episodes.length > 0) {
        let firstEpisodeUrl = currentSeason.episodes[0].url;
        // Process URL if it's a YouTube video
        if (firstEpisodeUrl.includes('youtube.com/embed/')) {
            const separator = firstEpisodeUrl.includes('?') ? '&' : '?';
            firstEpisodeUrl = firstEpisodeUrl + separator + 'autoplay=1&mute=0';
        }
        document.getElementById('video-player').src = firstEpisodeUrl;
    }
    
    // Scroll to the beginning of the episode scroller
    episodeScroller.scrollLeft = 0;
    
    // Reset flag after a short delay
    setTimeout(() => {
        isEpisodeNavigation = false;
    }, 100);
};

// Function to update save button state
const updateSaveButton = () => {
    const saveBtn = document.getElementById('save-btn');
    if (currentMovieInModal && savedMovies.includes(currentMovieInModal.title)) {
        saveBtn.textContent = 'Added';
        saveBtn.style.backgroundColor = '#ff0000';
    } else {
        saveBtn.textContent = 'Add to list';
        saveBtn.style.backgroundColor = '#00b300';
    }
};

// Function to toggle save status
const toggleSaveStatus = () => {
    if (!currentMovieInModal) return;
    
    const movieTitle = currentMovieInModal.title;
    const saveBtn = document.getElementById('save-btn');
    
    if (savedMovies.includes(movieTitle)) {
        // Remove from saved list
        savedMovies = savedMovies.filter(title => title !== movieTitle);
        saveBtn.textContent = 'Add to list';
        saveBtn.style.backgroundColor = '#00b300';
        showNotification('Removed from My List', 'success');
    } else {
        // Add to saved list
        savedMovies.push(movieTitle);
        saveBtn.textContent = 'Added';
        saveBtn.style.backgroundColor = '#ff0000';
        showNotification('Added to My List', 'success');
    }
    
    // Update localStorage
    localStorage.setItem('savedMovies', JSON.stringify(savedMovies));
};

const addToHistory = (videoId) => {
    const history = JSON.parse(localStorage.getItem('videoHistory')) || [];
    const video = data.find(item => item.title === videoId);
    if (video) {
        // Remove duplicate entries
        const filteredHistory = history.filter(item => item.title !== videoId);
        // Add the new entry at the beginning
        filteredHistory.unshift(video);
        // Save the updated history
        localStorage.setItem('videoHistory', JSON.stringify(filteredHistory));
        // Update the history list
        updateHistoryList();
    }
};

const updateHistoryList = () => {
    const history = JSON.parse(localStorage.getItem('videoHistory')) || [];
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    if (history.length === 0) {
        historyList.innerHTML = '<p>No history available.</p>';
        return;
    }
    history.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        const img = document.createElement('img');
        img.src = item.imgUrl;
        img.alt = item.title;
        const content = document.createElement('div');
        content.className = 'content';
        content.innerHTML = `
            <h4>${item.title}</h4>
            <p>${item.description}</p>
        `;
        
        // Add click event to the entire history item that closes the history modal
        historyItem.onclick = () => {
            // Close the history modal first
            toggleHistoryModal();
            // Then open the video
            openVideoNav(item.videoUrl, item.title, item);
        };
        
        historyItem.appendChild(img);
        historyItem.appendChild(content);
        historyList.appendChild(historyItem);
    });
};

const clearHistory = () => {
    localStorage.removeItem('videoHistory');
    updateHistoryList();
    showNotification('All history has been cleared.', 'success');
};

const showAllVideos = (category) => {
    // Reset scroll position
    window.scrollTo(0, 0);
    
    // Set flag and push state for grid view
    inGridView = true;
    history.pushState({ gridView: true }, '');
    
    const categoryData = data.filter(item => item.category === category);
    currentGridData = categoryData; // Set current grid data for filtering
    
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    gridContainer.scrollTop = 0; // Reset grid container scroll
    
    // Hide other sections
    document.getElementById('discover-container').style.display = 'none';
    document.getElementById('categories-container').style.display = 'none';
    gridContainer.style.display = 'grid';
    
    // Add filter section
    const filterSection = createFilterSection();
    gridContainer.insertBefore(filterSection, gridContainer.firstChild);
    
    // Add videos to the grid
    categoryData.forEach(item => {
        const frame = createFrame(item);
        gridContainer.appendChild(frame);
    });
};

// Enhanced search function to search by title, genre, tags, and keywords
const handleSearch = () => {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    currentSearchTerm = searchTerm;
    
    // Clear any existing timeout
    clearTimeout(searchTimeout);
    
    // Set a new timeout to delay the search
    searchTimeout = setTimeout(() => {
        // Reset scroll position
        window.scrollTo(0, 0);
        
        // Set flag and push state for grid view
        inGridView = true;
        history.pushState({ gridView: true }, '');
        
        // Filter data based on search term across multiple fields
        const filteredData = data.filter(item => {
            // Search in title
            if (item.title && item.title.toLowerCase().includes(searchTerm)) {
                return true;
            }
            
            // Search in genre
            if (item.genre && item.genre.toLowerCase().includes(searchTerm)) {
                return true;
            }
            
            // Search in tags
            if (item.tags && Array.isArray(item.tags)) {
                for (const tag of item.tags) {
                    if (tag.toLowerCase().includes(searchTerm)) {
                        return true;
                    }
                }
            }
            
            // Search in description (keywords)
            if (item.description && item.description.toLowerCase().includes(searchTerm)) {
                return true;
            }
            
            // Search in category
            if (item.category && item.category.toLowerCase().includes(searchTerm)) {
                return true;
            }
            
            // Search in year
            if (item.year && item.year.toString().includes(searchTerm)) {
                return true;
            }
            
            // Search in type (Movie, Series, etc.)
            if (item.type && item.type.toLowerCase().includes(searchTerm)) {
                return true;
            }
            
            return false;
        });
        
        currentGridData = filteredData; // Set current grid data for filtering
        
        const gridContainer = document.getElementById('grid-container');
        gridContainer.innerHTML = '';
        gridContainer.scrollTop = 0; // Reset grid container scroll
        
        // Hide other sections
        document.getElementById('discover-container').style.display = 'none';
        document.getElementById('categories-container').style.display = 'none';
        gridContainer.style.display = 'grid';
        
        // Add filter section
        const filterSection = createFilterSection();
        gridContainer.insertBefore(filterSection, gridContainer.firstChild);
        
        // Add search results to the grid
        if (filteredData.length > 0) {
            filteredData.forEach(item => {
                const frame = createFrame(item);
                gridContainer.appendChild(frame);
            });
        } else {
            showNotification('No movies found matching your search.', 'warning');
        }
    }, 300); // 300ms delay for better performance
};

// Function to show search suggestions
const showSearchSuggestions = () => {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const suggestionsContainer = document.getElementById('search-suggestions');
    
    if (searchTerm.length < 2) {
        suggestionsContainer.innerHTML = '';
        suggestionsContainer.classList.remove('show');
        return;
    }
    
    // Get unique suggestions from various fields
    const suggestions = new Set();
    
    data.forEach(item => {
        // Title suggestions
        if (item.title && item.title.toLowerCase().includes(searchTerm)) {
            suggestions.add({
                text: item.title,
                type: 'Title',
                item: item
            });
        }
        
        // Genre suggestions
        if (item.genre && item.genre.toLowerCase().includes(searchTerm)) {
            suggestions.add({
                text: item.genre,
                type: 'Genre',
                item: item
            });
        }
        
        // Tag suggestions
        if (item.tags && Array.isArray(item.tags)) {
            item.tags.forEach(tag => {
                if (tag.toLowerCase().includes(searchTerm)) {
                    suggestions.add({
                        text: tag,
                        type: 'Tag',
                        item: item
                    });
                }
            });
        }
        
        // Category suggestions
        if (item.category && item.category.toLowerCase().includes(searchTerm)) {
            suggestions.add({
                text: item.category,
                type: 'Category',
                item: item
            });
        }
    });
    
    // Convert to array and limit to 5 suggestions
    const suggestionsArray = Array.from(suggestions).slice(0, 5);
    
    // Clear and populate suggestions container
    suggestionsContainer.innerHTML = '';
    
    if (suggestionsArray.length > 0) {
        suggestionsArray.forEach(suggestion => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'search-suggestion-item';
            suggestionItem.innerHTML = `
                ${suggestion.text}
                <span class="suggestion-type">${suggestion.type}</span>
            `;
            
            suggestionItem.onclick = () => {
                document.getElementById('search-bar').value = suggestion.text;
                handleSearch();
                suggestionsContainer.classList.remove('show');
            };
            
            suggestionsContainer.appendChild(suggestionItem);
        });
        
        suggestionsContainer.classList.add('show');
    } else {
        suggestionsContainer.classList.remove('show');
    }
};

// Function to hide search suggestions with delay
const hideSearchSuggestions = () => {
    setTimeout(() => {
        document.getElementById('search-suggestions').classList.remove('show');
    }, 200);
};

const showNotification = (message, type) => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    notification.style.position = 'fixed';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%)';
    notification.style.zIndex = '9999';
    setTimeout(() => {
        notification.remove();
    }, 3000);
};

// Function to close the modal - optimized for immediate closing
const closeModal = () => {
    // Stop the video immediately
    const videoPlayer = document.getElementById('video-player');
    const currentSrc = videoPlayer.src;
    
    // Clear the src to stop playback
    videoPlayer.src = 'about:blank'; // Use about:blank to unload
    
    // For YouTube videos, we need additional handling
    if (currentSrc && currentSrc.includes('youtube.com/embed/')) {
        // Create a temporary iframe to properly unload YouTube content
        const tempIframe = document.createElement('iframe');
        tempIframe.style.display = 'none';
        document.body.appendChild(tempIframe);
        tempIframe.src = 'about:blank';
        setTimeout(() => {
            document.body.removeChild(tempIframe);
        }, 100);
    }
    
    // Hide the modal immediately
    document.getElementById('video-nav').style.display = 'none';
    
    // Reset state immediately
    currentMovieInModal = null;
    inVideoModal = false;
    isEpisodeNavigation = false; // Reset the flag
    
    // Clear any episode/season data
    const episodeFooter = document.getElementById('episode-footer');
    episodeFooter.style.display = 'none';
    
    // Remove the iframe from the DOM to completely stop the video
    const navBody = document.querySelector('.nav-body');
    const iframeContainer = navBody.querySelector('div[style*="position: relative"]');
    if (iframeContainer) {
        const oldIframe = iframeContainer.querySelector('iframe');
        if (oldIframe) {
            oldIframe.remove();
        }
    }
};
// Modified closeNav function for immediate closing
const closeNav = () => {
    if (inVideoModal) {
        // Close modal immediately without any delay
        closeModal();
        
        // Only use history.back() if we actually pushed a state
        if (window.history.state && window.history.state.videoOpen) {
            // Use a small timeout to ensure the modal is fully closed before navigating back
            setTimeout(() => {
                window.history.back();
            }, 10);
        }
    } else {
        closeModal();
    }
};

// Carousel functionality
let currentIndex = 0;
let startX = 0;
let moveX = 0;
let isDragging = false;

function updateCarousel() {
    const carousel = document.getElementById("carousel");
    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    document.querySelectorAll(".dot").forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
    });
}

function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
}

function nextSlide() {
    const carouselData = data.slice(0, 5);
    currentIndex = (currentIndex + 1) % carouselData.length;
    updateCarousel();
}

function prevSlide() {
    const carouselData = data.slice(0, 5);
    currentIndex = (currentIndex - 1 + carouselData.length) % carouselData.length;
    updateCarousel();
}

function handleTouchStart(e) {
    startX = e.touches[0].clientX;
    isDragging = true;
}

function handleTouchMove(e) {
    if (!isDragging) return;
    moveX = e.touches[0].clientX - startX;
}

function handleTouchEnd() {
    isDragging = false;
    if (moveX > 50) {
        prevSlide();
    } else if (moveX < -50) {
        nextSlide();
    }
}

function handleMouseDown(e) {
    startX = e.clientX;
    isDragging = true;
}

function handleMouseMove(e) {
    if (!isDragging) return;
    moveX = e.clientX - startX;
}

function handleMouseUp() {
    isDragging = false;
    if (moveX > 50) {
        prevSlide();
    } else if (moveX < -50) {
        nextSlide();
    }
}

// Initialize carousel event listeners
function initCarousel() {
    const carousel = document.getElementById("carousel");
    carousel.addEventListener("touchstart", handleTouchStart);
    carousel.addEventListener("touchmove", handleTouchMove);
    carousel.addEventListener("touchend", handleTouchEnd);
    carousel.addEventListener("mousedown", handleMouseDown);
    carousel.addEventListener("mousemove", handleMouseMove);
    carousel.addEventListener("mouseup", handleMouseUp);
    carousel.addEventListener("mouseleave", handleMouseUp);
    
    // Auto-slide every 5 seconds
    setInterval(nextSlide, 5000);
}

// Initialize the page
createCarousel();
createDiscoverSection();
createCategories();
updateHistoryList();
initCarousel();

// Add category button click handlers
document.addEventListener('DOMContentLoaded', () => {
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter content based on selected category
            const selectedCategory = this.dataset.category;
            if (selectedCategory === 'All') {
                createDiscoverSection();
            } else {
                filterContentByCategory(selectedCategory);
            }
        });
    });
});

// Function to filter content by category
const filterContentByCategory = (category) => {
    const discoverScroll = document.getElementById('discover-scroll');
    discoverScroll.innerHTML = '';
    
    // Filter data by category
    const filteredData = data.filter(item => {
        // Check if item matches the selected category
        if (category === 'Hollywood') return item.category === 'Hollywood';
        if (category === 'Nollywood') return item.category === 'Nollywood';
        if (category === 'Bollywood') return item.category === 'Bollywood';
        if (category === 'Kannywood') return item.category === 'Kannywood';
        if (category === 'Action') return item.genre === 'Action';
        if (category === 'Drama') return item.genre === 'Drama';
        if (category === 'Comedy') return item.genre === 'Comedy';
        return true;
    });
    
    // Add filtered items to discover section
    filteredData.forEach(item => {
        const discoverItem = document.createElement('div');
        discoverItem.className = 'discover-item';
        const img = document.createElement('img');
        img.src = item.imgUrl;
        img.alt = item.title;
        const content = document.createElement('div');
        content.className = 'content';
        content.innerHTML = `
            <h2>${item.title}</h2>
            <p>${item.description}</p>
        `;
        
        // Add click event to the entire discover item
        discoverItem.onclick = () => openVideoNav(item.videoUrl, item.title, item);
        
        discoverItem.appendChild(img);
        discoverItem.appendChild(content);
        discoverScroll.appendChild(discoverItem);
    });
};

let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const footer = document.querySelector('footer');
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    // Check if user has reached the bottom of the page
    const atPageEnd = (currentScrollTop + windowHeight) >= documentHeight;
    if (atPageEnd && currentScrollTop > lastScrollTop) {
        // Immediately hide footer when at the end of the page and scrolling down
        footer.classList.add('hide');
    } else {
        // Show footer when scrolling down anywhere else or when scrolling up
        footer.classList.remove('hide');
    }
    lastScrollTop = currentScrollTop;
});

// Fixed: Changed timeout value to something more reasonable (40 seconds)
setTimeout(() => {
    const bar = document.getElementById('notification-bar');
    bar.style.opacity = '1';
    bar.style.pointerEvents = 'auto'; // Enable interaction once visible
}, 40000); // Show after 40 seconds

function closeNotification() {
    const bar = document.getElementById('notification-bar');
    bar.style.opacity = '0';
    bar.style.pointerEvents = 'none'; // Disable interaction immediately
    setTimeout(() => {
        bar.remove(); // Fully remove from DOM
    }, 500); // Allow fade-out to complete
}

// New functions for added features

// Apply filters
const applyFilters = () => {
    // Reset scroll position
    window.scrollTo(0, 0);
    
    // Set flag and push state for grid view
    inGridView = true;
    history.pushState({ gridView: true }, '');
    
    // Get selected filters
    const selectedGenre = document.querySelector('.filter-option[data-genre].active')?.dataset.genre || 'All';
    const selectedSort = document.querySelector('.filter-option[data-sort].active')?.dataset.sort || 'Newest';
    
    // Apply filters to data
    let filteredData = data;
    
    if (selectedGenre !== 'All') {
        filteredData = filteredData.filter(item => item.genre === selectedGenre);
    }
    
    // Sort data
    if (selectedSort === 'Newest') {
        filteredData.sort((a, b) => b.id - a.id);
    } else if (selectedSort === 'Popular') {
        filteredData.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (selectedSort === 'Rating') {
        filteredData.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (selectedSort === 'A-Z') {
        filteredData.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    // Update UI with filtered data
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    
    // Hide other sections
    document.getElementById('discover-container').style.display = 'none';
    document.getElementById('categories-container').style.display = 'none';
    gridContainer.style.display = 'grid';
    
    filteredData.forEach(item => {
        const frame = createFrame(item);
        gridContainer.appendChild(frame);
    });
    
    // Close filter modal
    toggleFilterModal();
};

// Share movie function
const shareMovie = () => {
    // Create a URL with video ID parameter
    const url = new URL(window.location.href);
    url.searchParams.set('videoId', currentMovieInModal.id);
    const shareUrl = url.toString();
    
    if (navigator.share) {
        navigator.share({
            title: currentMovieInModal.title,
            text: 'Check out this movie on Hausa Movies!',
            url: shareUrl
        })
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
        // Fallback - copy to clipboard
        const dummy = document.createElement('input');
        document.body.appendChild(dummy);
        dummy.value = shareUrl;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        showNotification('Link copied to clipboard!', 'success');
    }
};

// Download movie function - updated to visit arewa.com
const downloadMovie = () => {
    // Open the arewa.com link in a new tab
    window.open('http://arewa.com', '_blank');
};

// Open Edit Profile Modal
const openEditProfileModal = () => {
    const editProfileModal = document.getElementById('edit-profile-modal');
    editProfileModal.classList.add('open');
    
    // Set current user name in input
    document.getElementById('user-name-input').value = userProfile.name;
    
    // Set selected avatar
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.avatar === userProfile.avatar) {
            option.classList.add('selected');
        }
    });
};

// Close Edit Profile Modal
const closeEditProfileModal = () => {
    const editProfileModal = document.getElementById('edit-profile-modal');
    editProfileModal.classList.remove('open');
};

// Save Profile
const saveProfile = () => {
    // Get selected avatar
    const selectedAvatar = document.querySelector('.avatar-option.selected');
    if (selectedAvatar) {
        userProfile.avatar = selectedAvatar.dataset.avatar;
    }
    
    // Get user name
    const userName = document.getElementById('user-name-input').value;
    if (userName.trim() !== '') {
        userProfile.name = userName.trim();
    }
    
    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    
    // Update UI
    updateUserProfile();
    
    // Close modal
    closeEditProfileModal();
    
    // Show notification
    showNotification('Profile updated successfully!', 'success');
};

// Update User Profile UI
const updateUserProfile = () => {
    // Update user name
    document.getElementById('user-name').textContent = userProfile.name;
    
    // Update user avatar
    const userAvatar = document.getElementById('user-avatar');
    userAvatar.innerHTML = '';
    
    if (userProfile.avatar) {
        const avatarImg = document.createElement('img');
        avatarImg.src = getAvatarUrl(userProfile.avatar);
        avatarImg.alt = 'User Avatar';
        userAvatar.appendChild(avatarImg);
    } else {
        const defaultIcon = document.createElement('i');
        defaultIcon.className = 'fas fa-user';
        defaultIcon.style.fontSize = '36px';
        userAvatar.appendChild(defaultIcon);
    }
};

// Get Avatar URL by ID
const getAvatarUrl = (avatarId) => {
    const avatars = {
        '1': 'https://cdn-icons-png.flaticon.com/128/6997/6997666.png',
        '2': 'https://cdn-icons-png.flaticon.com/128/6997/6997662.png',
        '3': 'https://cdn-icons-png.flaticon.com/128/6997/6997661.png',
        '4': 'https://cdn-icons-png.flaticon.com/128/6997/6997664.png'
    };
    return avatars[avatarId] || avatars['1'];
};

// Function to check for video ID in URL and open video modal immediately
const checkVideoIdInUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('videoId');
    
    if (videoId) {
        const video = data.find(item => item.id == videoId);
        if (video) {
            // Open video modal immediately without delay
            openVideoNav(video.videoUrl, video.title, video);
        }
    }
};

// Network connection warning functions - Updated to match image
const showNetworkWarning = () => {
    const networkWarning = document.getElementById('network-warning');
    networkWarning.classList.remove('hidden');
    
    // Hide app content when network warning is shown
    document.querySelector('header').style.display = 'none';
    document.getElementById('discover-container').style.display = 'none';
    document.getElementById('categories-container').style.display = 'none';
    document.getElementById('grid-container').style.display = 'none';
    document.querySelector('footer').style.display = 'none';
};

const hideNetworkWarning = () => {
    const networkWarning = document.getElementById('network-warning');
    networkWarning.classList.add('hidden');
    
    // Restore app content when network warning is hidden
    document.querySelector('header').style.display = 'flex';
    
    // Restore the appropriate section based on current state
    if (inGridView) {
        document.getElementById('grid-container').style.display = 'grid';
    } else {
        document.getElementById('discover-container').style.display = 'block';
        document.getElementById('categories-container').style.display = 'block';
    }
    
    document.querySelector('footer').style.display = 'flex';
};

// Check network connection status
const checkNetworkConnection = () => {
    if (navigator.onLine) {
        hideNetworkWarning();
        showNotification('Network connection restored', 'success');
    } else {
        // Still offline, keep showing the warning
        showNetworkWarning();
    }
};

// Initialize all new features when the page loads
window.addEventListener('load', () => {
    // Initialize filter options
    document.querySelectorAll('.filter-option').forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from siblings in the same filter-options container
            const siblings = this.parentElement.querySelectorAll('.filter-option');
            siblings.forEach(sib => sib.classList.remove('active'));
            // Add active class to clicked option
            this.classList.add('active');
        });
    });
    
    // Initialize avatar options
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            document.querySelectorAll('.avatar-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            // Add selected class to clicked option
            this.classList.add('selected');
        });
    });
    
    // Update user profile UI
    updateUserProfile();
    
    // Check for video ID in URL immediately
    checkVideoIdInUrl();
    
    // Check network connection on load
    checkNetworkConnection();
    
    // Add event listeners for online/offline events
    window.addEventListener('online', () => {
        hideNetworkWarning();
        showNotification('Network connection restored', 'success');
    });
    
    window.addEventListener('offline', () => {
        showNetworkWarning();
    });
    
    // Add history state handling with immediate response
    window.addEventListener('popstate', (event) => {
        // If we're navigating episodes, ignore the back button
        if (isEpisodeNavigation) {
            // Push state again to prevent closing the modal
            history.pushState({ videoOpen: true }, '');
            return;
        }
        
        // Handle video modal - close immediately
        if (inVideoModal) {
            closeModal();
            return; // Exit early to prevent any delays
        } 
        // Handle grid view
        else if (inGridView) {
            inGridView = false;
            // Show both discover container and categories container
            document.getElementById('discover-container').style.display = 'block';
            document.getElementById('categories-container').style.display = 'block';
            document.getElementById('grid-container').style.display = 'none';
        }
        // Handle filter modal
        else if (inFilterModal) {
            document.getElementById('filter-modal').classList.remove('open');
            inFilterModal = false;
        }
        // Handle history modal
        else if (inHistoryModal) {
            document.getElementById('history-modal').classList.remove('open');
            inHistoryModal = false;
        }
        // Handle sidebar modal
        else if (inSidebarModal) {
            document.getElementById('sidebar-modal').classList.remove('open');
            inSidebarModal = false;
        }
        // Default to discover if no specific state
        else {
            showDiscoverSection();
        }
    });
});

// Ad logic
const adContainer = document.getElementById('adContainer');
const adContent = document.getElementById('adContent');
const installButton = document.getElementById('installButton');
let currentAdIndex = parseInt(localStorage.getItem('currentAdIndex')) || 0;
function showAd(index) {
    const app = adsData[index];
    adContent.innerHTML = `
        <div class="app-icon">
            <img src="${app.icon}" alt="App Icon" />
        </div>
        <div class="ad-info">
            <div class="app-name">${app.name}</div>
            <div class="ad-meta">
                <span class="sponsored">Sponsored ·</span>
                <span>${app.rating} ★ FREE</span>
            </div>
        </div>
    `;
    installButton.href = app.link;
    adContainer.style.display = 'flex';
    localStorage.setItem('currentAdIndex', index);
}
function rotateAds() {
    showAd(currentAdIndex);
    currentAdIndex = (currentAdIndex + 1) % adsData.length;
}
// Show first ad immediately and rotate
rotateAds();
setInterval(rotateAds, 15000);