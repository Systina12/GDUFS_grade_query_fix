// ==UserScript==
// @name         修复广外平时成绩查询
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  替换所有使用 showModalDialog 的链接为dialog元素
// @author       Systina12
// @supportURL   https://github.com/Systina12/GDUFS_grade_query_fix/issues
// @match        https://jxgl.gdufs.edu.cn/*
// @grant        none
// @updateURL    https://github.com/Systina12/GDUFS_grade_query_fix/raw/main/gdufs_grade_query_fix.user.js
// @downloadURL  https://github.com/Systina12/GDUFS_grade_query_fix/raw/main/gdufs_grade_query_fix.user.js
// ==/UserScript==

(function() {
    'use strict';

    function createDialog(url) {
        const dialog = document.createElement('dialog');
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        dialog.appendChild(iframe);
        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.onclick = function() {
            console.log('关闭对话框');
            dialog.close();
            document.body.removeChild(dialog);
        };
        dialog.appendChild(closeButton);
        document.body.appendChild(dialog);
        dialog.showModal();
    }

    const links = document.querySelectorAll('a[href]');

    links.forEach(link => {
        const href = link.getAttribute('href');
        // 如果链接是 javascript: 开头且包含 JsMod，替换为新的对话框
        if (href && href.startsWith('javascript:JsMod')) {
            link.addEventListener('click', function(event) {
                event.preventDefault();

                // 从 href 中提取必要的信息来创建对话框
                const urlParams = href.match(/JsMod\(([^)]+)\)/);
                if (urlParams && urlParams[1]) {
                    const params = urlParams[1].split(',');
                    const targetUrl = params[0].replace(/['"]/g, ''); // 去除引号
                    createDialog(targetUrl);
                }
            });
        }
    });
})();
