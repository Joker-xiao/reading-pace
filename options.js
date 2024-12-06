// 默认阅读速度
const DEFAULT_READING_SPEED = 200;

// 保存设置
function saveOptions() {
    const readingSpeed = document.getElementById('readingSpeed').value;
    chrome.storage.sync.set({
        readingSpeed: parseInt(readingSpeed) || DEFAULT_READING_SPEED
    }, function() {
        // 显示保存成功提示
        const status = document.getElementById('status');
        status.style.display = 'block';
        setTimeout(function() {
            status.style.display = 'none';
        }, 2000);
    });
}

// 加载已保存的设置
function loadOptions() {
    chrome.storage.sync.get({
        readingSpeed: DEFAULT_READING_SPEED
    }, function(items) {
        document.getElementById('readingSpeed').value = items.readingSpeed;
    });
}

document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById('save').addEventListener('click', saveOptions);
