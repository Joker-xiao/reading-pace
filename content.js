// 默认阅读速度（每分钟字数）
const DEFAULT_READING_SPEED = 200;

// 阅读类网站的特征域名
const READING_DOMAINS = [
    'medium.com',
    'zhihu.com',
    'jianshu.com',
    'csdn.net',
    'juejin.cn',
    'segmentfault.com',
    'infoq.cn',
    'ruanyifeng.com',
    'cnblogs.com',
    'weixin.qq.com',
    'wikipedia.org',
    'github.io',
    'gitbook.io',
    'readhub.cn',
    'toutiao.com'
];

// 文章容器的可能类名或ID
const ARTICLE_SELECTORS = [
    'article',
    '[role="article"]',
    '.post-content',
    '.article-content',
    '.post-body',
    '.article-body',
    '.entry-content',
    '.markdown-body',
    '.main-content',
    '#article-content',
    '.rich_media_content',
    '.content-wrapper'
];

function isReadingWebsite() {
    // 检查域名是否匹配已知的阅读网站
    const domain = window.location.hostname;
    if (READING_DOMAINS.some(d => domain.includes(d))) {
        return true;
    }
    return false;
}

function findArticleElement() {
    // 尝试找到文章容器
    for (const selector of ARTICLE_SELECTORS) {
        const element = document.querySelector(selector);
        if (element) {
            return element;
        }
    }
    return null;
}

function getTextDensity(element) {
    const text = element.innerText;
    const html = element.innerHTML;
    // 计算文本密度（文本长度与HTML长度的比率）
    return text.length / html.length;
}

function analyzeReadability() {
    // 1. 首先检查是否是已知的阅读网站
    if (isReadingWebsite()) {
        return true;
    }

    // 2. 尝试找到文章容器
    const articleElement = findArticleElement();
    if (articleElement) {
        // 3. 分析文本密度
        const density = getTextDensity(articleElement);
        if (density > 0.3) { // 文本密度阈值
            return true;
        }
    }

    // 4. 分析页面整体特征
    const bodyText = document.body.innerText;
    const wordCount = bodyText.replace(/[\s\n]/g, '').length;
    
    // 检查内容长度（至少500字）
    if (wordCount < 500) {
        return false;
    }

    // 检查段落数量
    const paragraphs = document.getElementsByTagName('p');
    if (paragraphs.length < 3) {
        return false;
    }

    // 计算整体文本密度
    const bodyDensity = getTextDensity(document.body);
    
    // 返回最终判断结果
    return bodyDensity > 0.2; // 较低的整体文本密度阈值
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function calculateReadingProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
    );
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    const viewportHeight = windowHeight;
    const remainingHeight = documentHeight - viewportHeight;
    const progress = Math.min(100, Math.round((scrollTop / remainingHeight) * 100));
    
    return Math.max(0, progress);
}

function createProgressBar() {
    const progressContainer = document.createElement('div');
    progressContainer.style.cssText = `
        width: 100%;
        height: 4px;
        background-color: #555;
        border-radius: 2px;
        margin: 8px 0;
        position: relative;
    `;

    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        height: 100%;
        background-color: #4CAF50;
        border-radius: 2px;
        transition: width 0.3s ease;
        width: 0%;
    `;

    progressContainer.appendChild(progressBar);
    return { progressContainer, progressBar };
}

function makeDraggable(element) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    const dragHandle = document.createElement('div');
    dragHandle.style.cssText = `
        cursor: move;
        padding: 5px;
        margin: -15px -15px 10px -15px;
        border-radius: 8px 8px 0 0;
        background-color: #444;
        user-select: none;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    
    dragHandle.innerHTML = `
        <div style="
            width: 30px;
            height: 4px;
            background-color: #666;
            border-radius: 2px;
        "></div>
    `;

    element.insertBefore(dragHandle, element.firstChild);

    function handleDragStart(e) {
        if (e.target === dragHandle || e.target.parentNode === dragHandle) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            isDragging = true;
            
            document.addEventListener('mousemove', handleDragMove);
            document.addEventListener('mouseup', handleDragEnd);
        }
    }

    function handleDragMove(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            const rect = element.getBoundingClientRect();
            const maxX = window.innerWidth - rect.width;
            const maxY = window.innerHeight - rect.height;

            xOffset = Math.min(Math.max(0, xOffset), maxX);
            yOffset = Math.min(Math.max(0, yOffset), maxY);

            element.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        }
    }

    function handleDragEnd() {
        isDragging = false;
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
    }

    dragHandle.addEventListener('mousedown', handleDragStart);
}

function createDisplayElement() {
    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #333;
        color: white;
        padding: 15px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 9999;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        line-height: 1.5;
        min-width: 200px;
        transition: opacity 0.3s ease;
        transform: translate(0, 0);
    `;

    container.addEventListener('mouseenter', () => {
        container.style.opacity = '1';
    });
    container.addEventListener('mouseleave', () => {
        if (!container.contains(document.activeElement)) {
            container.style.opacity = '0.3';
        }
    });

    return container;
}

function createSpeedInput(currentSpeed, onChange) {
    const speedContainer = document.createElement('div');
    speedContainer.style.cssText = `
        display: flex;
        align-items: center;
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px solid #555;
    `;

    const input = document.createElement('input');
    input.type = 'number';
    input.min = '1';
    input.max = '1000';
    input.value = currentSpeed;
    input.style.cssText = `
        width: 60px;
        padding: 4px;
        margin: 0 8px;
        border: 1px solid #555;
        border-radius: 4px;
        background: #444;
        color: white;
    `;

    const label = document.createElement('span');
    label.textContent = '阅读速度：';

    const unit = document.createElement('span');
    unit.textContent = '字/分钟';

    input.addEventListener('change', () => {
        const newSpeed = parseInt(input.value) || DEFAULT_READING_SPEED;
        input.value = newSpeed;
        onChange(newSpeed);
    });

    speedContainer.appendChild(label);
    speedContainer.appendChild(input);
    speedContainer.appendChild(unit);
    return speedContainer;
}

function createConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9998;
    `;

    // 创建50个五彩纸屑
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        const color = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'][Math.floor(Math.random() * 5)];
        
        confetti.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background-color: ${color};
            top: -10px;
            left: ${Math.random() * 100}vw;
            transform: rotate(${Math.random() * 360}deg);
            opacity: 1;
            animation: fall ${3 + Math.random() * 2}s linear forwards;
        `;

        confettiContainer.appendChild(confetti);
    }

    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            0% {
                transform: translateY(-10px) rotate(0deg);
                opacity: 1;
            }
            75% {
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    return confettiContainer;
}

function showCongratulations() {
    const congratsContainer = document.createElement('div');
    congratsContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(51, 51, 51, 0.95);
        color: white;
        padding: 20px 30px;
        border-radius: 12px;
        font-size: 18px;
        text-align: center;
        z-index: 9999;
        animation: congratsPop 0.5s ease-out;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    `;

    // 随机选择一条祝贺消息
    const messages = [
        '🎉 太棒了！你已经读完了全文！',
        '🌟 恭喜完成阅读！知识就是力量！',
        '🎯 目标达成！你真是太厉害了！',
        '🚀 完美！继续保持这份学习热情！',
        '💪 读完啦！这篇文章已被你征服！'
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    congratsContainer.innerHTML = `
        <div style="margin-bottom: 15px; font-size: 24px;">🎊</div>
        <div>${randomMessage}</div>
    `;

    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes congratsPop {
            0% {
                transform: translate(-50%, -50%) scale(0.5);
                opacity: 0;
            }
            70% {
                transform: translate(-50%, -50%) scale(1.1);
            }
            100% {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    // 3秒后自动消失
    setTimeout(() => {
        congratsContainer.style.animation = 'congratsFade 0.5s ease-out forwards';
        setTimeout(() => {
            congratsContainer.remove();
        }, 500);
    }, 3000);

    return congratsContainer;
}

function updateDisplay(container, wordCount, readingSpeed, progressBar) {
    const minutes = Math.ceil(wordCount / readingSpeed);
    const progress = calculateReadingProgress();
    const remainingWords = Math.round(wordCount * (100 - progress) / 100);
    const remainingMinutes = Math.ceil(remainingWords / readingSpeed);

    container.querySelector('.stats').innerHTML = `
        <div>总字数: ${formatNumber(wordCount)} 字</div>
        <div>预计总时间: ${minutes} 分钟</div>
        <div>当前进度: ${progress}%</div>
        <div>剩余时间: 约 ${remainingMinutes} 分钟</div>
    `;

    progressBar.style.width = `${progress}%`;

    // 检查是否刚刚完成阅读
    if (progress === 100 && progressBar.dataset.lastProgress !== '100') {
        const confetti = createConfetti();
        const congrats = showCongratulations();
        document.body.appendChild(confetti);
        document.body.appendChild(congrats);

        // 5秒后移除五彩纸屑
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
    
    // 记录上一次的进度
    progressBar.dataset.lastProgress = progress.toString();
}

function calculateReadingTime() {
    // 首先判断是否是阅读类文章
    if (!analyzeReadability()) {
        return; // 如果不是阅读类文章，不显示阅读时间
    }

    const content = document.body.innerText;
    const wordCount = content.replace(/[\s\n]/g, '').length;
    
    // 如果内容太少，也不显示
    if (wordCount < 500) {
        return;
    }
    
    const container = createDisplayElement();
    const statsDiv = document.createElement('div');
    statsDiv.className = 'stats';
    container.appendChild(statsDiv);
    
    const { progressContainer, progressBar } = createProgressBar();
    container.appendChild(progressContainer);
    
    document.body.appendChild(container);
    
    makeDraggable(container);
    
    chrome.storage.sync.get({
        readingSpeed: DEFAULT_READING_SPEED
    }, function(items) {
        updateDisplay(container, wordCount, items.readingSpeed, progressBar);
        
        const speedInput = createSpeedInput(items.readingSpeed, (newSpeed) => {
            chrome.storage.sync.set({ readingSpeed: newSpeed }, () => {
                updateDisplay(container, wordCount, newSpeed, progressBar);
            });
        });
        
        container.appendChild(speedInput);
    });

    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            chrome.storage.sync.get({
                readingSpeed: DEFAULT_READING_SPEED
            }, function(items) {
                updateDisplay(container, wordCount, items.readingSpeed, progressBar);
            });
        }, 100);
    });

    setTimeout(() => {
        if (!container.contains(document.activeElement)) {
            container.style.opacity = '0.3';
        }
    }, 3000);
}

window.addEventListener('load', calculateReadingTime);
