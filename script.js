// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM Content Loaded');
  // logo点击事件
  const logo = document.querySelector('.logo');
  console.log('Logo element:', logo);
  logo.addEventListener('click', function() {
    console.log('Logo clicked');
    switchToTab('intro');
  });

  // 选项卡切换功能
  initTabs();
  
  // 响应格式切换
  initResponseTabs();
  
  // 代码示例切换
  initCodeTabs();
  
  // 邮件发送功能
  initEmailForm();
  
  // 复制按钮功能
  initCopyButtons();
  
  // 窗口大小改变时更新内容高度
  window.addEventListener('resize', function() {
    // 确保标签页内容正确显示
    ensureActiveTabContent();
  });
});

// 页面所有资源加载完成后执行
window.addEventListener('load', function() {
  // 再次确保标签页内容正确显示
  ensureActiveTabContent();
});

// 初始化选项卡功能
function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchToTab(tab.getAttribute('data-tab'));
    });
  });
  
  // 确保初始标签页内容正确显示
  ensureActiveTabContent();
}

// 确保活动标签页内容正确显示
function ensureActiveTabContent() {
  const activeTab = document.querySelector('.tab.active');
  const activeContent = document.querySelector('.tab-content.active');
  
  if (activeTab && !activeContent) {
    // 如果有活动标签但没有活动内容，激活对应内容
    const tabId = activeTab.getAttribute('data-tab');
    const targetContent = document.getElementById(tabId);
    
    if (targetContent) {
      targetContent.classList.add('active');
      requestAnimationFrame(() => {
        targetContent.style.opacity = '1';
        targetContent.style.transform = 'translateY(0) scale(1)';
      });
    }
  } else if (!activeTab && document.querySelector('.tab')) {
    // 如果没有活动标签但有标签存在，激活第一个标签
    const firstTab = document.querySelector('.tab');
    switchToTab(firstTab.getAttribute('data-tab'));
  }
}

// 切换到指定选项卡
// 将函数暴露到全局作用域，使按钮的onclick事件能够调用
window.switchToTab = function(tabId) {
  // 获取当前活动的标签页和内容
  const currentActiveTab = document.querySelector('.tab.active');
  const currentActiveContent = document.querySelector('.tab-content.active');
  
  // 获取目标标签页和内容
  const targetTab = document.querySelector(`[data-tab="${tabId}"]`);
  const targetContent = document.getElementById(tabId);
  
  if (!targetTab || !targetContent) return;
  
  // 如果点击的是当前活动标签页，不执行任何操作
  if (currentActiveTab === targetTab) return;
  
  // 移除所有活动状态
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  
  // 添加当前活动状态到标签页
  targetTab.classList.add('active');
  
  // 移除所有标签内容的活动状态，并重置样式
  document.querySelectorAll('.tab-content').forEach(c => {
    // 确保在移除active类之前重置样式，避免样式残留
    c.style.opacity = ' ';
    c.classList.remove('active');
  });
  
  // 为内容切换添加平滑过渡
  if (currentActiveContent) {
    // 先将当前内容淡出
    currentActiveContent.style.opacity = '0';
    currentActiveContent.style.transform = 'translateY(10px) scale(0.98)';
    
    // 添加目标内容的活动状态
    targetContent.classList.add('active');
    
    // 重置目标内容的初始样式，准备淡入
    targetContent.style.opacity = '0';
    targetContent.style.transform = 'translateY(10px) scale(0.98)';
    
    // 使用requestAnimationFrame替代setTimeout，提高动画流畅度
    requestAnimationFrame(() => {
      // 确保新内容可见，添加淡入效果
      targetContent.style.opacity = '1';
      targetContent.style.transform = 'translateY(0) scale(1)';
    });
  } else {
    // 如果没有当前活动内容，直接显示目标内容
    targetContent.classList.add('active');
    // 确保目标内容可见，设置样式
    requestAnimationFrame(() => {
      targetContent.style.opacity = '1';
      targetContent.style.transform = 'translateY(0) scale(1)';
    });
  }
  
  // 滚动到页面顶部
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// 初始化响应格式切换
function initResponseTabs() {
  const responseTabs = document.querySelectorAll('.response-tab');
  
  responseTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // 移除所有活动状态
      document.querySelectorAll('.response-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.response-content').forEach(c => c.classList.remove('active'));
      
      // 添加当前活动状态
      tab.classList.add('active');
      const responseType = tab.getAttribute('data-response');
      document.getElementById(`${responseType}-response`).classList.add('active');
    });
  });
}

// 初始化代码示例切换
function initCodeTabs() {
  const codeTabs = document.querySelectorAll('.code-tab');
  
  codeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // 移除所有活动状态
      document.querySelectorAll('.code-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.code-content').forEach(c => c.classList.remove('active'));
      
      // 添加当前活动状态
      tab.classList.add('active');
      const codeType = tab.getAttribute('data-code');
      document.getElementById(`${codeType}-example`).classList.add('active');
    });
  });
}

// 初始化邮件发送功能
function initEmailForm() {
  const emailForm = document.getElementById('emailForm');
  const sendBtn = document.getElementById('sendBtn');
  const resultDiv = document.getElementById('result');
  
  if (emailForm) {
    emailForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // 显示加载状态
      sendBtn.disabled = true;
      sendBtn.innerHTML = '<span class="loading"></span> 发送中...';
      resultDiv.style.display = 'none';
      
      // 获取表单数据
      const to = document.getElementById('to').value;
      const subject = document.getElementById('subject').value;
      const contentType = document.querySelector('input[name="content-type"]:checked').value;
      const content = document.getElementById('content').value;
      const fromName = document.getElementById('from_name').value;
      
      // 构建请求数据
      const requestData = {
        to,
        subject,
        from_name: fromName || undefined
      };
      
      // 根据内容类型设置text或html字段
      if (contentType === 'text') {
        requestData.text = content;
      } else {
        requestData.html = content;
      }
      
      try {
        // 发送请求
        const response = await fetch('/api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });
        
        const data = await response.json();
        
        // 显示结果
        if (data.success) {
          resultDiv.className = 'result-container success';
          resultDiv.innerHTML = `<p>邮件发送成功！</p><p>消息ID: ${data.messageId}</p>`;
        } else {
          resultDiv.className = 'result-container error';
          resultDiv.innerHTML = `<p>邮件发送失败：${data.error}</p>`;
          if (data.details) {
            resultDiv.innerHTML += `<p>详细信息：${data.details}</p>`;
          }
        }
      } catch (error) {
        resultDiv.className = 'result-container error';
        resultDiv.innerHTML = `<p>请求出错：${error.message}</p>`;
      } finally {
        // 恢复按钮状态
        sendBtn.disabled = false;
        sendBtn.innerHTML = '<span class="btn-text">发送邮件</span><span class="btn-icon">→</span>';
        resultDiv.style.display = 'block';
      }
    });
  }
}

// 初始化复制按钮功能
function initCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // 获取要复制的文本
      let textToCopy;
      
      if (btn.hasAttribute('data-clipboard-text')) {
        // 直接从属性获取文本
        textToCopy = btn.getAttribute('data-clipboard-text');
      } else if (btn.hasAttribute('data-clipboard-target')) {
        // 从目标元素获取文本
        const targetSelector = btn.getAttribute('data-clipboard-target');
        const targetElement = document.querySelector(targetSelector);
        if (targetElement) {
          textToCopy = targetElement.textContent;
        }
      } else {
        // 从最近的代码块获取文本
        const codeBlock = btn.closest('.code-container').querySelector('code');
        if (codeBlock) {
          textToCopy = codeBlock.textContent;
        }
      }
      
      if (textToCopy) {
        // 复制到剪贴板
        navigator.clipboard.writeText(textToCopy).then(() => {
          // 更新按钮文本
          const originalText = btn.textContent;
          btn.textContent = '已复制!';
          
          // 2秒后恢复原始文本
          setTimeout(() => {
            btn.textContent = originalText;
          }, 2000);
        }).catch(err => {
          console.error('复制失败:', err);
        });
      }
    });
  });
}
