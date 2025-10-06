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
        logoItem.onclick = () => {
            document.getElementById('video-nav').style.display = 'flex';
            document.getElementById('video-player').src = logo.videoUrl;
        };
    });
};
createLogosSection();

const toggleSidebarModal = () => {
    const sidebarModal = document.getElementById('sidebar-modal');
    const historyModal = document.getElementById('history-modal');
    const filterModal = document.getElementById('filter-modal');
    
    if (historyModal.classList.contains('open')) {
        historyModal.classList.remove('open');
        inHistoryModal = false;
    }
    
    if (filterModal.classList.contains('open')) {
        filterModal.classList.remove('open');
        inFilterModal = false;
    }
    
    sidebarModal.classList.toggle('open');
    inSidebarModal = !inSidebarModal;
    
    if (inSidebarModal) {
        history.pushState({ sidebarOpen: true }, '');
    }
};

const toggleHistoryModal = () => {
    const historyModal = document.getElementById('history-modal');
    const sidebarModal = document.getElementById('sidebar-modal');
    const filterModal = document.getElementById('filter-modal');
    
    if (sidebarModal.classList.contains('open')) {
        sidebarModal.classList.remove('open');
        inSidebarModal = false;
    }
    
    if (filterModal.classList.contains('open')) {
        filterModal.classList.remove('open');
        inFilterModal = false;
    }
    
    historyModal.classList.toggle('open');
    inHistoryModal = !inHistoryModal;
    
    if (inHistoryModal) {
        history.pushState({ historyOpen: true }, '');
    }
};

const toggleFilterModal = () => {
    const filterModal = document.getElementById('filter-modal');
    const sidebarModal = document.getElementById('sidebar-modal');
    const historyModal = document.getElementById('history-modal');
    
    if (sidebarModal.classList.contains('open')) {
        sidebarModal.classList.remove('open');
        inSidebarModal = false;
    }
    
    if (historyModal.classList.contains('open')) {
        historyModal.classList.remove('open');
        inHistoryModal = false;
    }
    
    filterModal.classList.toggle('open');
    inFilterModal = !inFilterModal;
    
    if (inFilterModal) {
        history.pushState({ filterOpen: true }, '');
    }
};

const populateSidebar = () => {
    const sidebarList = document.getElementById('sidebar-list');
    sidebarList.innerHTML = '';
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
populateSidebar();

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

const createCarousel = () => {
    const carousel = document.getElementById("carousel");
    const dotsContainer = document.getElementById("dots");
    carousel.innerHTML = '';
    dotsContainer.innerHTML = '';
    
    const carouselData = data.slice(0, 5);
    
    carouselData.forEach((item, index) => {
        const slide = document.createElement("div");
        slide.className = "slide";
        
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
    
    const discoverData = data.slice(5, 25);
    
    discoverData.forEach(item => {
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
        
        discoverItem.onclick = () => openVideoNav(item.videoUrl, item.title, item);
        
        discoverItem.appendChild(img);
        discoverItem.appendChild(content);
        discoverScroll.appendChild(discoverItem);
    });
};

const createCategories = () => {
    const categories = [...new Set(data.map(item => item.category))];
    const container = document.getElementById('categories-container');
    container.innerHTML = '';
    categories.forEach(category => {
        const categoryData = data.filter(item => item.category === category);
        const categoryContainer = document.createElement('div');
        categoryContainer.className = 'category-container';
        const categoryTitle = document.createElement('div');
        categoryTitle.className = 'category-title';
        categoryTitle.innerHTML = `
            <span>
                ${category}
                <i class="fas fa-chevron-right"></i>
            </span>
            <button onclick="showAllVideos('${category}')">All <i class="fas fa-chevron-right"></i></button>
        `;
        categoryTitle.onclick = () => showAllVideos(category);
        const categoryScroll = document.createElement('div');
        categoryScroll.className = 'category-scroll';
        categoryData.forEach(item => {
            const frame = createFrame(item);
            categoryScroll.appendChild(frame);
        });
        categoryContainer.appendChild(categoryTitle);
        categoryContainer.appendChild(categoryScroll);
        container.appendChild(categoryContainer);
    });
};

const showAllVideosGrid = () => {
    window.scrollTo(0, 0);
    
    inGridView = true;
    history.pushState({ gridView: true }, '');
    
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    gridContainer.scrollTop = 0;
    
    document.getElementById('discover-container').style.display = 'none';
    document.getElementById('categories-container').style.display = 'none';
    gridContainer.style.display = 'grid';
    
    data.forEach(item => {
        const frame = createFrame(item);
        gridContainer.appendChild(frame);
    });
};

const showTrendingVideos = () => {
    window.scrollTo(0, 0);
    
    inGridView = true;
    history.pushState({ gridView: true }, '');
    
    const trendingData = data.filter(item => item.trending);
    currentGridData = trendingData;
    
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    gridContainer.scrollTop = 0;
    
    document.getElementById('discover-container').style.display = 'none';
    document.getElementById('categories-container').style.display = 'none';
    gridContainer.style.display = 'grid';
    
    const filterSection = createFilterSection();
    gridContainer.insertBefore(filterSection, gridContainer.firstChild);
    
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
    window.scrollTo(0, 0);
    
    inGridView = true;
    history.pushState({ gridView: true }, '');
    
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    gridContainer.scrollTop = 0;
    
    document.getElementById('discover-container').style.display = 'none';
    document.getElementById('categories-container').style.display = 'none';
    gridContainer.style.display = 'block';
    
    profileApps.forEach(item => {
        const profileItem = createProfileItem(item);
        gridContainer.appendChild(profileItem);
    });
};

const showHomeVideos = () => {
    window.scrollTo(0, 0);
    
    inGridView = true;
    history.pushState({ gridView: true }, '');
    
    const homeData = data;
    currentGridData = homeData;
    
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    gridContainer.scrollTop = 0;
    
    document.getElementById('discover-container').style.display = 'none';
    document.getElementById('categories-container').style.display = 'none';
    gridContainer.style.display = 'grid';
    
    const filterSection = createFilterSection();
    gridContainer.insertBefore(filterSection, gridContainer.firstChild);
    
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
    window.scrollTo(0, 0);
    
    inGridView = true;
    history.pushState({ gridView: true }, '');
    
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    gridContainer.scrollTop = 0;
    
    document.getElementById('discover-container').style.display = 'none';
    document.getElementById('categories-container').style.display = 'none';
    gridContainer.style.display = 'block';
    
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

const showDiscoverSection = () => {
    window.scrollTo(0, 0);
    
    inGridView = false;
    history.pushState({ gridView: false, discoverView: true }, '');
    
    document.getElementById('discover-container').style.display = 'block';
    document.getElementById('categories-container').style.display = 'block';
    document.getElementById('grid-container').style.display = 'none';
};

const createFilterSection = () => {
    const filterSection = document.createElement('div');
    filterSection.className = 'filter-section';
    
    const genres = [...new Set(currentGridData.map(item => item.genre).filter(Boolean))];
    const countries = [...new Set(currentGridData.map(item => item.country).filter(Boolean))];
    const years = [...new Set(currentGridData.map(item => item.year).filter(Boolean))].sort((a, b) => b - a);
    
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
    
    const filterButton = document.createElement('button');
    filterButton.className = 'filter-button';
    filterButton.innerHTML = '<i class="fas fa-filter"></i> Apply';
    filterButton.onclick = applyGridFilters;
    
    filterSection.appendChild(genreDropdown);
    filterSection.appendChild(countryDropdown);
    filterSection.appendChild(yearDropdown);
    filterSection.appendChild(filterButton);
    
    return filterSection;
};

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
    
    const gridContainer = document.getElementById('grid-container');
    
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
    img.src = item.imgUrl;
    img.alt = item.title;
    const content = document.createElement('div');
    content.className = 'content';
    const title = document.createElement('h2');
    title.textContent = item.title;
    
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
    img.src = item.imgUrl;
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
    
    listItem.onclick = () => openVideoNav(item.videoUrl, item.title, item);
    
    content.appendChild(title);
    content.appendChild(description);
    listItem.appendChild(img);
    listItem.appendChild(content);
    return listItem;
};

let currentMovieInModal = null;

const openVideoNav = (videoUrl, videoTitle, item, fromSharedLink = false) => {
    if (!navigator.onLine) {
        showNetworkWarning();
        return;
    }
    
    document.getElementById('video-nav').style.display = 'flex';
    
    const navBody = document.querySelector('.nav-body');
    const iframeContainer = navBody.querySelector('div[style*="position: relative"]');
    let videoPlayer = document.getElementById('video-player');
    
    if (!videoPlayer) {
        videoPlayer = document.createElement('iframe');
        videoPlayer.id = 'video-player';
        videoPlayer.setAttribute('frameborder', '0');
        videoPlayer.setAttribute('allowfullscreen', '');
        videoPlayer.style.width = '100%';
        videoPlayer.style.height = '100%';
        iframeContainer.appendChild(videoPlayer);
    }
    
    let processedUrl = videoUrl;
    
    if (videoUrl.includes('youtube.com/embed/')) {
        const separator = videoUrl.includes('?') ? '&' : '?';
        processedUrl = videoUrl + separator + 'autoplay=1&mute=0';
    } else if (videoUrl.includes('drive.google.com/file/d/')) {
        processedUrl = videoUrl;
    }
    
    videoPlayer.src = processedUrl;
    
    currentMovieInModal = item;
    
    updateSaveButton();
    
    if (!inVideoModal && !fromSharedLink) {
        history.pushState({ videoOpen: true }, '');
    }
    inVideoModal = true;
    
    const episodeFooter = document.getElementById('episode-footer');
    if (item && item.isSeries && item.seasons) {
        episodeFooter.style.display = 'block';
        
        if (typeof item.currentSeason === 'undefined') {
            item.currentSeason = 0;
        }
        
        document.getElementById('episode-title').textContent = `${item.title} - Season ${item.seasons[item.currentSeason].seasonNumber}`;
        document.getElementById('episode-count').textContent = `${item.seasons[item.currentSeason].episodes.length} Episodes`;
        
        const episodeScroller = document.getElementById('episode-scroller');
        episodeScroller.innerHTML = '';
        
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
            
            episodeBtn.onclick = () => {
                isEpisodeNavigation = true;
                
                document.querySelectorAll('.episode-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                episodeBtn.classList.add('active');
                
                let episodeUrl = episode.url;
                if (episodeUrl.includes('youtube.com/embed/')) {
                    const separator = episodeUrl.includes('?') ? '&' : '?';
                    episodeUrl = episodeUrl + separator + 'autoplay=1&mute=0';
                }
                
                videoPlayer.src = episodeUrl;
                
                setTimeout(() => {
                    isEpisodeNavigation = false;
                }, 100);
            };
            
            episodeScroller.appendChild(episodeBtn);
        });
        
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
        episodeFooter.style.display = 'none';
    }
    
    addToHistory(videoTitle);
};

const goToSeason = (seasonIndex) => {
    if (!currentMovieInModal || !currentMovieInModal.isSeries || !currentMovieInModal.seasons) return;
    
    isEpisodeNavigation = true;
    
    currentMovieInModal.currentSeason = seasonIndex;
    
    const currentSeason = currentMovieInModal.seasons[seasonIndex];
    document.getElementById('episode-title').textContent = `${currentMovieInModal.title} - Season ${currentSeason.seasonNumber}`;
    document.getElementById('episode-count').textContent = `${currentSeason.episodes.length} Episodes`;
    
    const episodeScroller = document.getElementById('episode-scroller');
    episodeScroller.innerHTML = '';
    
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
            isEpisodeNavigation = true;
            
            document.querySelectorAll('.episode-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            episodeBtn.classList.add('active');
            
            let episodeUrl = episode.url;
            if (episodeUrl.includes('youtube.com/embed/')) {
                const separator = episodeUrl.includes('?') ? '&' : '?';
                episodeUrl = episodeUrl + separator + 'autoplay=1&mute=0';
            }
            
            document.getElementById('video-player').src = episodeUrl;
            
            setTimeout(() => {
                isEpisodeNavigation = false;
            }, 100);
        };
        
        episodeScroller.appendChild(episodeBtn);
    });
    
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
    
    if (currentSeason.episodes.length > 0) {
        let firstEpisodeUrl = currentSeason.episodes[0].url;
        if (firstEpisodeUrl.includes('youtube.com/embed/')) {
            const separator = firstEpisodeUrl.includes('?') ? '&' : '?';
            firstEpisodeUrl = firstEpisodeUrl + separator + 'autoplay=1&mute=0';
        }
        document.getElementById('video-player').src = firstEpisodeUrl;
    }
    
    episodeScroller.scrollLeft = 0;
    
    setTimeout(() => {
        isEpisodeNavigation = false;
    }, 100);
};

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

const toggleSaveStatus = () => {
    if (!currentMovieInModal) return;
    
    const movieTitle = currentMovieInModal.title;
    const saveBtn = document.getElementById('save-btn');
    
    if (savedMovies.includes(movieTitle)) {
        savedMovies = savedMovies.filter(title => title !== movieTitle);
        saveBtn.textContent = 'Add to list';
        saveBtn.style.backgroundColor = '#00b300';
        showNotification('Removed from My List', 'success');
    } else {
        savedMovies.push(movieTitle);
        saveBtn.textContent = 'Added';
        saveBtn.style.backgroundColor = '#ff0000';
        showNotification('Added to My List', 'success');
    }
    
    localStorage.setItem('savedMovies', JSON.stringify(savedMovies));
};

const addToHistory = (videoId) => {
    const history = JSON.parse(localStorage.getItem('videoHistory')) || [];
    const video = data.find(item => item.title === videoId);
    if (video) {
        const filteredHistory = history.filter(item => item.title !== videoId);
        filteredHistory.unshift(video);
        localStorage.setItem('videoHistory', JSON.stringify(filteredHistory));
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
        
        historyItem.onclick = () => {
            toggleHistoryModal();
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
    window.scrollTo(0, 0);
    
    inGridView = true;
    history.pushState({ gridView: true }, '');
    
    const categoryData = data.filter(item => item.category === category);
    currentGridData = categoryData;
    
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    gridContainer.scrollTop = 0;
    
    document.getElementById('discover-container').style.display = 'none';
    document.getElementById('categories-container').style.display = 'none';
    gridContainer.style.display = 'grid';
    
    const filterSection = createFilterSection();
    gridContainer.insertBefore(filterSection, gridContainer.firstChild);
    
    categoryData.forEach(item => {
        const frame = createFrame(item);
        gridContainer.appendChild(frame);
    });
};

const handleSearch = () => {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    currentSearchTerm = searchTerm;
    
    clearTimeout(searchTimeout);
    
    searchTimeout = setTimeout(() => {
        window.scrollTo(0, 0);
        
        inGridView = true;
        history.pushState({ gridView: true }, '');
        
        const filteredData = data.filter(item => {
            if (item.title && item.title.toLowerCase().includes(searchTerm)) {
                return true;
            }
            
            if (item.genre && item.genre.toLowerCase().includes(searchTerm)) {
                return true;
            }
            
            if (item.tags && Array.isArray(item.tags)) {
                for (const tag of item.tags) {
                    if (tag.toLowerCase().includes(searchTerm)) {
                        return true;
                    }
                }
            }
            
            if (item.description && item.description.toLowerCase().includes(searchTerm)) {
                return true;
            }
            
            if (item.category && item.category.toLowerCase().includes(searchTerm)) {
                return true;
            }
            
            if (item.year && item.year.toString().includes(searchTerm)) {
                return true;
            }
            
            if (item.type && item.type.toLowerCase().includes(searchTerm)) {
                return true;
            }
            
            return false;
        });
        
        currentGridData = filteredData;
        
        const gridContainer = document.getElementById('grid-container');
        gridContainer.innerHTML = '';
        gridContainer.scrollTop = 0;
        
        document.getElementById('discover-container').style.display = 'none';
        document.getElementById('categories-container').style.display = 'none';
        gridContainer.style.display = 'grid';
        
        const filterSection = createFilterSection();
        gridContainer.insertBefore(filterSection, gridContainer.firstChild);
        
        if (filteredData.length > 0) {
            filteredData.forEach(item => {
                const frame = createFrame(item);
                gridContainer.appendChild(frame);
            });
        } else {
            showNotification('No movies found matching your search.', 'warning');
        }
    }, 300);
};

const showSearchSuggestions = () => {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const suggestionsContainer = document.getElementById('search-suggestions');
    
    if (searchTerm.length < 2) {
        suggestionsContainer.innerHTML = '';
        suggestionsContainer.classList.remove('show');
        return;
    }
    
    const suggestions = new Set();
    
    data.forEach(item => {
        if (item.title && item.title.toLowerCase().includes(searchTerm)) {
            suggestions.add({
                text: item.title,
                type: 'Title',
                item: item
            });
        }
        
        if (item.genre && item.genre.toLowerCase().includes(searchTerm)) {
            suggestions.add({
                text: item.genre,
                type: 'Genre',
                item: item
            });
        }
        
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
        
        if (item.category && item.category.toLowerCase().includes(searchTerm)) {
            suggestions.add({
                text: item.category,
                type: 'Category',
                item: item
            });
        }
    });
    
    const suggestionsArray = Array.from(suggestions).slice(0, 5);
    
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

const closeModal = () => {
    const videoPlayer = document.getElementById('video-player');
    const currentSrc = videoPlayer.src;
    
    videoPlayer.src = 'about:blank';
    
    if (currentSrc && currentSrc.includes('youtube.com/embed/')) {
        const tempIframe = document.createElement('iframe');
        tempIframe.style.display = 'none';
        document.body.appendChild(tempIframe);
        tempIframe.src = 'about:blank';
        setTimeout(() => {
            document.body.removeChild(tempIframe);
        }, 100);
    }
    
    document.getElementById('video-nav').style.display = 'none';
    
    currentMovieInModal = null;
    inVideoModal = false;
    isEpisodeNavigation = false;
    
    const episodeFooter = document.getElementById('episode-footer');
    episodeFooter.style.display = 'none';
    
    const navBody = document.querySelector('.nav-body');
    const iframeContainer = navBody.querySelector('div[style*="position: relative"]');
    if (iframeContainer) {
        const oldIframe = iframeContainer.querySelector('iframe');
        if (oldIframe) {
            oldIframe.remove();
        }
    }
};

const closeNav = () => {
    if (inVideoModal) {
        closeModal();
        
        if (window.history.state && window.history.state.videoOpen) {
            setTimeout(() => {
                window.history.back();
            }, 10);
        }
    } else {
        closeModal();
    }
};

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

function initCarousel() {
    const carousel = document.getElementById("carousel");
    carousel.addEventListener("touchstart", handleTouchStart);
    carousel.addEventListener("touchmove", handleTouchMove);
    carousel.addEventListener("touchend", handleTouchEnd);
    carousel.addEventListener("mousedown", handleMouseDown);
    carousel.addEventListener("mousemove", handleMouseMove);
    carousel.addEventListener("mouseup", handleMouseUp);
    carousel.addEventListener("mouseleave", handleMouseUp);
    
    setInterval(nextSlide, 5000);
}

createCarousel();
createDiscoverSection();
createCategories();
updateHistoryList();
initCarousel();

document.addEventListener('DOMContentLoaded', () => {
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const selectedCategory = this.dataset.category;
            if (selectedCategory === 'All') {
                createDiscoverSection();
            } else {
                filterContentByCategory(selectedCategory);
            }
        });
    });
});

const filterContentByCategory = (category) => {
    const discoverScroll = document.getElementById('discover-scroll');
    discoverScroll.innerHTML = '';
    
    const filteredData = data.filter(item => {
        if (category === 'Hollywood') return item.category === 'Hollywood';
        if (category === 'Nollywood') return item.category === 'Nollywood';
        if (category === 'Bollywood') return item.category === 'Bollywood';
        if (category === 'Kannywood') return item.category === 'Kannywood';
        if (category === 'Action') return item.genre === 'Action';
        if (category === 'Drama') return item.genre === 'Drama';
        if (category === 'Comedy') return item.genre === 'Comedy';
        return true;
    });
    
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
    const atPageEnd = (currentScrollTop + windowHeight) >= documentHeight;
    if (atPageEnd && currentScrollTop > lastScrollTop) {
        footer.classList.add('hide');
    } else {
        footer.classList.remove('hide');
    }
    lastScrollTop = currentScrollTop;
});

setTimeout(() => {
    const bar = document.getElementById('notification-bar');
    bar.style.opacity = '1';
    bar.style.pointerEvents = 'auto';
}, 40000);

function closeNotification() {
    const bar = document.getElementById('notification-bar');
    bar.style.opacity = '0';
    bar.style.pointerEvents = 'none';
    setTimeout(() => {
        bar.remove();
    }, 500);
}

const applyFilters = () => {
    window.scrollTo(0, 0);
    
    inGridView = true;
    history.pushState({ gridView: true }, '');
    
    const selectedGenre = document.querySelector('.filter-option[data-genre].active')?.dataset.genre || 'All';
    const selectedSort = document.querySelector('.filter-option[data-sort].active')?.dataset.sort || 'Newest';
    
    let filteredData = data;
    
    if (selectedGenre !== 'All') {
        filteredData = filteredData.filter(item => item.genre === selectedGenre);
    }
    
    if (selectedSort === 'Newest') {
        filteredData.sort((a, b) => b.id - a.id);
    } else if (selectedSort === 'Popular') {
        filteredData.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (selectedSort === 'Rating') {
        filteredData.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (selectedSort === 'A-Z') {
        filteredData.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    
    document.getElementById('discover-container').style.display = 'none';
    document.getElementById('categories-container').style.display = 'none';
    gridContainer.style.display = 'grid';
    
    filteredData.forEach(item => {
        const frame = createFrame(item);
        gridContainer.appendChild(frame);
    });
    
    toggleFilterModal();
};

const shareMovie = () => {
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
        const dummy = document.createElement('input');
        document.body.appendChild(dummy);
        dummy.value = shareUrl;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        showNotification('Link copied to clipboard!', 'success');
    }
};

const downloadMovie = () => {
    window.open('http://arewa.com', '_blank');
};

const openEditProfileModal = () => {
    const editProfileModal = document.getElementById('edit-profile-modal');
    editProfileModal.classList.add('open');
    
    document.getElementById('user-name-input').value = userProfile.name;
    
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.avatar === userProfile.avatar) {
            option.classList.add('selected');
        }
    });
};

const closeEditProfileModal = () => {
    const editProfileModal = document.getElementById('edit-profile-modal');
    editProfileModal.classList.remove('open');
};

const saveProfile = () => {
    const selectedAvatar = document.querySelector('.avatar-option.selected');
    if (selectedAvatar) {
        userProfile.avatar = selectedAvatar.dataset.avatar;
    }
    
    const userName = document.getElementById('user-name-input').value;
    if (userName.trim() !== '') {
        userProfile.name = userName.trim();
    }
    
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    
    updateUserProfile();
    
    closeEditProfileModal();
    
    showNotification('Profile updated successfully!', 'success');
};

const updateUserProfile = () => {
    document.getElementById('user-name').textContent = userProfile.name;
    
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

const getAvatarUrl = (avatarId) => {
    const avatars = {
        '1': 'https://cdn-icons-png.flaticon.com/128/6997/6997666.png',
        '2': 'https://cdn-icons-png.flaticon.com/128/6997/6997662.png',
        '3': 'https://cdn-icons-png.flaticon.com/128/6997/6997661.png',
        '4': 'https://cdn-icons-png.flaticon.com/128/6997/6997664.png'
    };
    return avatars[avatarId] || avatars['1'];
};

const checkVideoIdInUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('videoId');
    
    if (videoId) {
        const video = data.find(item => item.id == videoId);
        if (video) {
            openVideoNav(video.videoUrl, video.title, video, true);
            
            const url = new URL(window.location.href);
            url.searchParams.delete('videoId');
            history.replaceState({ videoOpen: true }, '', url);
        }
    }
};

const showNetworkWarning = () => {
    const networkWarning = document.getElementById('network-warning');
    networkWarning.classList.remove('hidden');
    
    document.querySelector('header').style.display = 'none';
    document.getElementById('discover-container').style.display = 'none';
    document.getElementById('categories-container').style.display = 'none';
    document.getElementById('grid-container').style.display = 'none';
    document.querySelector('footer').style.display = 'none';
};

const hideNetworkWarning = () => {
    const networkWarning = document.getElementById('network-warning');
    networkWarning.classList.add('hidden');
    
    document.querySelector('header').style.display = 'flex';
    
    if (inGridView) {
        document.getElementById('grid-container').style.display = 'grid';
    } else {
        document.getElementById('discover-container').style.display = 'block';
        document.getElementById('categories-container').style.display = 'block';
    }
    
    document.querySelector('footer').style.display = 'flex';
};

const checkNetworkConnection = () => {
    if (navigator.onLine) {
        hideNetworkWarning();
        showNotification('Network connection restored', 'success');
    } else {
        showNetworkWarning();
    }
};

window.addEventListener('load', () => {
    document.querySelectorAll('.filter-option').forEach(option => {
        option.addEventListener('click', function() {
            const siblings = this.parentElement.querySelectorAll('.filter-option');
            siblings.forEach(sib => sib.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.avatar-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
        });
    });
    
    updateUserProfile();
    
    checkVideoIdInUrl();
    
    checkNetworkConnection();
    
    window.addEventListener('online', () => {
        hideNetworkWarning();
        showNotification('Network connection restored', 'success');
    });
    
    window.addEventListener('offline', () => {
        showNetworkWarning();
    });
    
    window.addEventListener('popstate', (event) => {
        if (isEpisodeNavigation) {
            history.pushState({ videoOpen: true }, '');
            return;
        }
        
        if (inVideoModal) {
            closeModal();
            return;
        } else if (inGridView) {
            inGridView = false;
            document.getElementById('discover-container').style.display = 'block';
            document.getElementById('categories-container').style.display = 'block';
            document.getElementById('grid-container').style.display = 'none';
        } else if (inFilterModal) {
            document.getElementById('filter-modal').classList.remove('open');
            inFilterModal = false;
        } else if (inHistoryModal) {
            document.getElementById('history-modal').classList.remove('open');
            inHistoryModal = false;
        } else if (inSidebarModal) {
            document.getElementById('sidebar-modal').classList.remove('open');
            inSidebarModal = false;
        } else {
            showDiscoverSection();
        }
    });
});

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

rotateAds();
setInterval(rotateAds, 15000);
