// 主题切换功能
class ThemeManager {
    constructor() {
        this.init();
    }

    init() {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        const isDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);

        this.setTheme(isDark ? 'dark' : 'light', true); // Pass true for initial load
        this.bindEvents();
    }

    setTheme(theme, isInitialLoad = false) {
        const html = document.documentElement;
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = document.getElementById('theme-icon');

        if (!themeIcon) {
            console.warn("Theme icon element not found.");
            return;
        }

        const sunIcon = themeIcon.querySelector('.sun-icon');
        const moonIcon = themeIcon.querySelector('.moon-icon');

        if (!sunIcon || !moonIcon) {
            console.warn("Sun or Moon icon SVG path not found within theme icon.");
            return;
        }

        const isDarkTheme = theme === 'dark';

        if (isDarkTheme) {
            html.classList.add('dark');
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
            if(themeToggle) themeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            html.classList.remove('dark');
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
            if(themeToggle) themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }

        localStorage.setItem('theme', theme);

        if (!isInitialLoad) {
            if (typeof updateChart1Theme === 'function') updateChart1Theme(isDarkTheme);
            if (typeof updateChart2Theme === 'function') updateChart2Theme(isDarkTheme);
            if (typeof updateChart3Theme === 'function') updateChart3Theme(isDarkTheme);
            if (typeof updateChart4Theme === 'function') updateChart4Theme(isDarkTheme);
            if (typeof updateChart5Theme === 'function') updateChart5Theme(isDarkTheme);
            if (typeof updateChart6Theme === 'function') updateChart6Theme(isDarkTheme);
        }
    }

    toggle() {
        const isDark = document.documentElement.classList.contains('dark');
        this.setTheme(isDark ? 'light' : 'dark');
    }

    bindEvents() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggle());
        } else {
            console.warn("Theme toggle button not found.");
        }
    }
}

// 滚动导航栏管理 (Includes logic for title animation)
class NavbarManager {
    constructor() {
       
        this.navbar = document.getElementById('navbar');
        this.mainTitle = document.getElementById('main-title'); // The large title that animates
        this.navbarPlaceholderTitle = document.getElementById('navbar-title'); // The placeholder title in navbar
        this.lastScrollY = 0;
        this.isNavbarVisible = false;

        if (!this.navbar || !this.mainTitle || !this.navbarPlaceholderTitle) {
            console.warn("Navbar related elements (navbar, main-title, navbar-title) not all found.");
            return;
        }
        
        this.mainTitleInitialStyles = {}; // To store initial dynamic styles
        this.navbarTitleTargetStyles = {}; // To store target dynamic styles based on placeholder

        this.init();
    }

    init() {
        // Hide the placeholder navbar title, as main-title will take its role
        if(this.navbarPlaceholderTitle) this.navbarPlaceholderTitle.style.opacity = '0';

        // Calculate positions after layout is stable
        // Using a small timeout to ensure styles are applied for getComputedStyle
        requestAnimationFrame(() => {
            this.calculateTitlePositionsAndStyles();
            this.handleScroll(); // Initial check after positions are calculated
        });
        
        window.addEventListener('resize', () => {
            this.calculateTitlePositionsAndStyles();
            this.handleScroll();
        });
        this.bindEvents();
    }

    calculateTitlePositionsAndStyles() {
        if (!this.mainTitle || !this.navbarPlaceholderTitle) return;

        // Reset mainTitle to its initial state to get accurate initial measurements
        this.mainTitle.style.position = 'static'; // Or 'relative' based on its container
        this.mainTitle.style.transform = '';
        this.mainTitle.style.fontSize = ''; // Let CSS define it
        // Force reflow if necessary
        // void this.mainTitle.offsetWidth;


        const mainTitleRect = this.mainTitle.getBoundingClientRect();
        const navbarPlaceholderRect = this.navbarPlaceholderTitle.getBoundingClientRect();

        this.mainTitleInitialStyles = {
            top: mainTitleRect.top + window.scrollY, // document relative
            left: mainTitleRect.left + window.scrollX, // document relative
            fontSize: parseFloat(getComputedStyle(this.mainTitle).fontSize),
            // Store original transform if any, e.g. for centering, though Tailwind handles it.
            // For simplicity, we assume initial transform is for centering and will be overridden.
        };

        this.navbarTitleTargetStyles = {
            top: navbarPlaceholderRect.top + window.scrollY, // document relative
            left: navbarPlaceholderRect.left + window.scrollX, // document relative
            fontSize: parseFloat(getComputedStyle(this.navbarPlaceholderTitle).fontSize),
        };
    }


    handleScroll() {
        if (!this.mainTitle || !this.navbarPlaceholderTitle || !this.mainTitleInitialStyles.fontSize) return; // Ensure styles are calculated

        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const heroSectionHeight = document.querySelector('.hero-section')?.offsetHeight || windowHeight;

        // Navbar visibility threshold
        const showNavbarThreshold = heroSectionHeight * 0.7; // Show navbar after scrolling 70% of hero section

        const shouldShowNavbar = scrollY > showNavbarThreshold;

        if (shouldShowNavbar && !this.isNavbarVisible) {
            this.showNavbar();
        } else if (!shouldShowNavbar && this.isNavbarVisible) {
            this.hideNavbar();
        }
        
        const transitionStart = heroSectionHeight * 0.1; // Start transition a bit after scrolling into hero
        const transitionEnd = showNavbarThreshold; 
        
        let transitionProgress = 0;
        if (scrollY > transitionStart) {
            transitionProgress = Math.min(1, (scrollY - transitionStart) / (transitionEnd - transitionStart));
        }
        
        const isCompletelyBeforeTransition = scrollY <= transitionStart;
        const isDuringTransition = scrollY > transitionStart && scrollY < transitionEnd;
        const isCompletelyAfterTransition = scrollY >= transitionEnd;

        // Handle hero effect (scale/fade main title before it starts moving)
        if (isCompletelyBeforeTransition) {
            this.mainTitle.style.position = 'static'; // Or 'relative'
            this.mainTitle.style.top = '';
            this.mainTitle.style.left = '';
            this.mainTitle.style.fontSize = ''; // Revert to CSS
            this.mainTitle.style.textAlign = ''; // Revert to CSS (center)
            this.mainTitle.style.zIndex = '';
            this.mainTitle.style.opacity = '1'; // Full opacity
            this.mainTitle.style.transform = 'scale(1)'; // Default scale
            // Add a subtle scale down based on initial scroll within hero
            const heroScrollFraction = scrollY / (heroSectionHeight * 0.5); // Adjust sensitivity
            const heroScale = Math.max(0.9, 1 - heroScrollFraction * 0.1); // Scale down from 1 to 0.9
            this.mainTitle.style.transform = `scale(${heroScale})`;
            this.mainTitle.style.opacity = `${Math.max(0.6, 1 - heroScrollFraction * 0.4)}`; // Fade slightly

        } else if (isDuringTransition) {
            const currentTop = this.mainTitleInitialStyles.top + (this.navbarTitleTargetStyles.top - this.mainTitleInitialStyles.top) * transitionProgress;
            const currentLeft = this.mainTitleInitialStyles.left + (this.navbarTitleTargetStyles.left - this.mainTitleInitialStyles.left) * transitionProgress;
            const currentFontSize = this.mainTitleInitialStyles.fontSize - (this.mainTitleInitialStyles.fontSize - this.navbarTitleTargetStyles.fontSize) * transitionProgress;

            this.mainTitle.style.position = 'fixed';
            // The fixed position values should be relative to viewport, not document.
            // So target top/left should be from navbarPlaceholderRect directly.
            const fixedTargetTop = this.navbarPlaceholderTitle.getBoundingClientRect().top;
            const fixedTargetLeft = this.navbarPlaceholderTitle.getBoundingClientRect().left;
            // Initial fixed position also needs to be relative to viewport for smooth transition
            // When transition starts, mainTitle is not fixed. Its viewport rect is mainTitleRect.
            const initialFixedTop = document.querySelector('.hero-section h1#main-title').getBoundingClientRect().top;
            const initialFixedLeft = document.querySelector('.hero-section h1#main-title').getBoundingClientRect().left;


            const interpolatedFixedTop = initialFixedTop + (fixedTargetTop - initialFixedTop) * transitionProgress;
            const interpolatedFixedLeft = initialFixedLeft + (fixedTargetLeft - initialFixedLeft) * transitionProgress;

            this.mainTitle.style.top = `${interpolatedFixedTop}px`;
            this.mainTitle.style.left = `${interpolatedFixedLeft}px`;
            this.mainTitle.style.fontSize = `${currentFontSize}px`;
            this.mainTitle.style.textAlign = 'left';
            this.mainTitle.style.opacity = '1'; // Keep it visible
            this.mainTitle.style.zIndex = '51'; 
            this.mainTitle.style.transform = 'none'; // Override hero scale

        } else if (isCompletelyAfterTransition) {
            // main-title is now effectively the navbar title
            const finalRect = this.navbarPlaceholderTitle.getBoundingClientRect();
            this.mainTitle.style.position = 'fixed';
            this.mainTitle.style.top = `${finalRect.top}px`;
            this.mainTitle.style.left = `${finalRect.left}px`;
            this.mainTitle.style.fontSize = `${this.navbarTitleTargetStyles.fontSize}px`;
            this.mainTitle.style.textAlign = 'left';
            this.mainTitle.style.opacity = '1';
            this.mainTitle.style.zIndex = '51';
            this.mainTitle.style.transform = 'none';
        }
        
        this.lastScrollY = scrollY;
    }

    showNavbar() {
        this.isNavbarVisible = true;
        this.navbar.classList.remove('opacity-0', '-translate-y-full');
        this.navbar.classList.add('opacity-100', 'translate-y-0');
    }

    hideNavbar() {
        this.isNavbarVisible = false;
        this.navbar.classList.remove('opacity-100', 'translate-y-0');
        this.navbar.classList.add('opacity-0', '-translate-y-full');
    }

    bindEvents() {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
        // Resize already handled in init for recalculating positions
    }
}


class ResponsiveManager {
    constructor() {
        this.chartResizeCallbacks = []; 
        this.init();
    }

    init() {
        this.handleResize(); 

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
                this.chartResizeCallbacks.forEach(cb => {
                    if (typeof cb === 'function') cb();
                });
            }, 150); 
        });
    }

    handleResize() {
        // console.log('Window resized, current width:', window.innerWidth);
    }

    addChartResizeCallback(callback) {
        if (typeof callback === 'function') {
            this.chartResizeCallbacks.push(callback);
        }
    }
}

// 应用初始化
class App {
    constructor() {
        this.responsiveManager = new ResponsiveManager();
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        this.themeManager = new ThemeManager();
        new NavbarManager(); // Handles title animation
        
        const isInitiallyDark = document.documentElement.classList.contains('dark');

        if (typeof initChart1 === 'function') {
            initChart1(isInitiallyDark);
            if (typeof resizeChart1 === 'function') this.responsiveManager.addChartResizeCallback(resizeChart1);
        }
        if (typeof initChart2 === 'function') {
            initChart2(isInitiallyDark);
            if (typeof resizeChart2 === 'function') this.responsiveManager.addChartResizeCallback(resizeChart2);
        }
        if (typeof initChart3 === 'function') {
            initChart3(isInitiallyDark);
            if (typeof resizeChart3 === 'function') this.responsiveManager.addChartResizeCallback(resizeChart3);
        }
        if (typeof initChart4 === 'function') {
            initChart4(isInitiallyDark);
            if (typeof resizeChart4 === 'function') this.responsiveManager.addChartResizeCallback(resizeChart4);
        }
        if (typeof initChart5 === 'function') {
            initChart5(isInitiallyDark);
            if (typeof resizeChart5 === 'function') this.responsiveManager.addChartResizeCallback(resizeChart5);
        }
        if (typeof initChart6 === 'function') {
            initChart6(isInitiallyDark);
            if (typeof resizeChart6 === 'function') this.responsiveManager.addChartResizeCallback(resizeChart6);
        }

        console.log('埃博拉疫情数据可视化平台已初始化');
    }
}

new App();
// 添加向下滚动事件处理
function handleScrollDown() {
  window.scrollBy({
    top: window.innerHeight,
    behavior: 'smooth'
  });
}
if (scrollDownButton) {
  scrollDownButton.addEventListener('click', () => {
    window.scrollTo({
      top: window.scrollY + window.innerHeight,
      behavior: 'smooth'
    });
  });
}


document.addEventListener('DOMContentLoaded', () => {
    // 初始化所有图表
    if(typeof initChart1 === 'function') initChart1();
    if(typeof initChart2 === 'function') initChart2();
    if(typeof initChart3 === 'function') initChart3();
    if(typeof initChart4 === 'function') initChart4();
    if(typeof initChart5 === 'function') initChart5();
    if(typeof initChart6 === 'function') initChart6();
});
