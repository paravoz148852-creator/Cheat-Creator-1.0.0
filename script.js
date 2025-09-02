document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const paramType = document.getElementById('paramType');
    const optionsGroup = document.getElementById('optionsGroup');
    const addParamBtn = document.getElementById('addParamBtn');
    const parametersList = document.getElementById('parametersList');
    const menuPreview = document.getElementById('menuPreview');
    const exportBtn = document.getElementById('exportBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const saveTemplateBtn = document.getElementById('saveTemplateBtn');
    const exportCode = document.getElementById('exportCode');
    const menuToggle = document.getElementById('menuToggle');
    const modMenu = document.getElementById('modMenu');
    const menuContent = document.getElementById('menuContent');
    const gameFileInput = document.getElementById('gameFile');
    
    // Массив параметров
    let parameters = [];
    let importedGameHTML = '';
    
    // Показать/скрыть поле опций в зависимости от типа параметра
    paramType.addEventListener('change', function() {
        if (paramType.value === 'selector') {
            optionsGroup.style.display = 'block';
        } else {
            optionsGroup.style.display = 'none';
        }
    });
    
    // Добавление нового параметра
    addParamBtn.addEventListener('click', function() {
        const name = document.getElementById('paramName').value;
        const type = paramType.value;
        const code = document.getElementById('paramCode').value;
        const disableCode = document.getElementById('paramDisableCode').value;
        const options = document.getElementById('paramOptions').value;
        
        if (!name || !code) {
            alert('Заполните обязательные поля: название и код');
            return;
        }
        
        const param = {
            id: Date.now(),
            name,
            type,
            code,
            disableCode,
            options: options ? options.split(',').map(opt => opt.trim()) : []
        };
        
        parameters.push(param);
        updateParametersList();
        updateMenuPreview();
        updateModMenu();
        
        // Очистка формы
        document.getElementById('paramName').value = '';
        document.getElementById('paramCode').value = '';
        document.getElementById('paramDisableCode').value = '';
        document.getElementById('paramOptions').value = '';
    });
    
    // Обновление списка параметров
    function updateParametersList() {
        if (parameters.length === 0) {
            parametersList.innerHTML = '<p>Параметры не добавлены</p>';
            return;
        }
        
        parametersList.innerHTML = '';
        parameters.forEach(param => {
            const paramElement = document.createElement('div');
            paramElement.className = 'parameter';
            paramElement.innerHTML = `
                <div class="parameter-header">
                    <span class="parameter-name">${param.name}</span>
                    <div class="parameter-actions">
                        <button class="btn-danger" onclick="deleteParameter(${param.id})">Удалить</button>
                    </div>
                </div>
                <div><strong>Тип:</strong> ${getTypeName(param.type)}</div>
                <div><strong>Код включения:</strong> ${param.code}</div>
                ${param.disableCode ? `<div><strong>Код выключения:</strong> ${param.disableCode}</div>` : ''}
            `;
            parametersList.appendChild(paramElement);
        });
    }
    
    // Получение читаемого имени типа
    function getTypeName(type) {
        const types = {
            'toggle': 'Переключатель',
            'slider': 'Слайдер',
            'button': 'Кнопка',
            'selector': 'Выбор варианта'
        };
        return types[type] || type;
    }
    
    // Удаление параметра
    window.deleteParameter = function(id) {
        parameters = parameters.filter(param => param.id !== id);
        updateParametersList();
        updateMenuPreview();
        updateModMenu();
    };
    
    // Обновление предпросмотра меню
    function updateMenuPreview() {
        if (parameters.length === 0) {
            menuPreview.innerHTML = '<p>Меню будет отображаться здесь</p>';
            return;
        }
        
        menuPreview.innerHTML = '<h3>Предпросмотр мод-меню</h3>';
        parameters.forEach(param => {
            let controlHtml = '';
            
            switch (param.type) {
                case 'toggle':
                    controlHtml = `
                        <label class="switch">
                            <input type="checkbox" onchange="toggleParam(${param.id}, this.checked)">
                            <span class="slider"></span>
                        </label>
                    `;
                    break;
                case 'slider':
                    controlHtml = `
                        <input type="range" min="1" max="100" value="50" oninput="slideParam(${param.id}, this.value)">
                    `;
                    break;
                case 'button':
                    controlHtml = `
                        <button class="btn-primary" onclick="executeParam(${param.id})">Активировать</button>
                    `;
                    break;
                case 'selector':
                    controlHtml = `
                        <select onchange="selectParam(${param.id}, this.value)">
                            ${param.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                        </select>
                    `;
                    break;
            }
            
            const paramElement = document.createElement('div');
            paramElement.className = 'menu-item';
            paramElement.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span>${param.name}</span>
                    ${controlHtml}
                </div>
            `;
            menuPreview.appendChild(paramElement);
        });
    }
    
    // Обновление реального мод-меню
    function updateModMenu() {
        if (parameters.length === 0) {
            menuContent.innerHTML = '<p>Параметры не добавлены</p>';
            return;
        }
        
        menuContent.innerHTML = '';
        parameters.forEach(param => {
            let controlHtml = '';
            
            switch (param.type) {
                case 'toggle':
                    controlHtml = `
                        <label class="switch">
                            <input type="checkbox" onchange="toggleParam(${param.id}, this.checked)">
                            <span class="slider"></span>
                        </label>
                    `;
                    break;
                case 'slider':
                    controlHtml = `
                        <input type="range" min="1" max="100" value="50" oninput="slideParam(${param.id}, this.value)">
                    `;
                    break;
                case 'button':
                    controlHtml = `
                        <button class="btn-primary" onclick="executeParam(${param.id})">Активировать</button>
                    `;
                    break;
                case 'selector':
                    controlHtml = `
                        <select onchange="selectParam(${param.id}, this.value)">
                            ${param.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                        </select>
                    `;
                    break;
            }
            
            const paramElement = document.createElement('div');
            paramElement.className = 'menu-item';
            paramElement.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span>${param.name}</span>
                    ${controlHtml}
                </div>
            `;
            menuContent.appendChild(paramElement);
        });
    }
    
    // Функции для работы с параметрами (заглушки)
    window.toggleParam = function(id, isEnabled) {
        const param = parameters.find(p => p.id === id);
        if (param) {
            if (isEnabled) {
                // В реальном приложении здесь бы выполнялся код параметра
                console.log(`Включен параметр: ${param.name}`);
                console.log(`Выполняется код: ${param.code}`);
            } else if (param.disableCode) {
                // В реальном приложении здесь бы выполнялся код отключения
                console.log(`Выключен параметр: ${param.name}`);
                console.log(`Выполняется код: ${param.disableCode}`);
            }
        }
    };
    
    window.slideParam = function(id, value) {
        const param = parameters.find(p => p.id === id);
        if (param) {
            // В реальном приложении здесь бы выполнялся код с учетом значения
            console.log(`Изменен параметр: ${param.name}, значение: ${value}`);
        }
    };
    
    window.executeParam = function(id) {
        const param = parameters.find(p => p.id === id);
        if (param) {
            // В реальном приложении здесь бы выполнялся код параметра
            console.log(`Активирован параметр: ${param.name}`);
            console.log(`Выполняется код: ${param.code}`);
        }
    };
    
    window.selectParam = function(id, value) {
        const param = parameters.find(p => p.id === id);
        if (param) {
            // В реальном приложении здесь бы выполнялся код с учетом выбранного значения
            console.log(`Выбран параметр: ${param.name}, значение: ${value}`);
        }
    };
    
    // Импорт HTML игры
    gameFileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                importedGameHTML = e.target.result;
                showImportStatus('Игра успешно загружена!', 'success');
            } catch (error) {
                showImportStatus('Ошибка при загрузке игры', 'error');
                console.error(error);
            }
        };
        reader.onerror = function() {
            showImportStatus('Ошибка при чтении файла', 'error');
        };
        reader.readAsText(file);
    });
    
    function showImportStatus(message, type) {
        // Удаляем предыдущий статус, если есть
        const existingStatus = document.getElementById('importStatus');
        if (existingStatus) {
            existingStatus.remove();
        }
        
        const statusElement = document.createElement('div');
        statusElement.id = 'importStatus';
        statusElement.className = type;
        statusElement.textContent = message;
        
        gameFileInput.parentNode.appendChild(statusElement);
        
        // Автоматически скрываем статус через 3 секунды
        setTimeout(() => {
            statusElement.remove();
        }, 3000);
    }
    
    // Экспорт кода мод-меню
    exportBtn.addEventListener('click', function() {
        const code = generateModMenuCode();
        exportCode.textContent = code;
        exportCode.style.display = 'block';
    });
    
    // Генерация кода мод-меню
    function generateModMenuCode() {
        return `// Мод-меню сгенерировано с помощью движка мод-меню
const modMenuParams = ${JSON.stringify(parameters, null, 2)};

// Функция инициализации мод-меню
function initModMenu() {
    // Создание интерфейса мод-меню
    const menuHtml = \`
        <div id="mod-menu-container" style="position: fixed; top: 0; right: 0; background: #2d3436; color: white; padding: 20px; z-index: 10000; width: 300px; height: 100vh; overflow-y: auto; font-family: Arial, sans-serif;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #a29bfe;">Мод Меню</h2>
                <button id="close-mod-menu" style="background: #d63031; color: white; border: none; border-radius: 5px; padding: 5px 10px; cursor: pointer;">X</button>
            </div>
            <div id="mod-menu-content">
                \${generateMenuItems()}
            </div>
        </div>
        <div id="mod-menu-toggle" style="position: fixed; top: 20px; right: 20px; width: 50px; height: 50px; background: #6c5ce7; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; z-index: 999; box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); color: white; font-size: 24px;">≡</div>
    \`;
    
    document.body.insertAdjacentHTML('beforeend', menuHtml);
    
    // Обработчики событий для переключения меню
    document.getElementById('mod-menu-toggle').addEventListener('click', function() {
        document.getElementById('mod-menu-container').style.right = '0';
    });
    
    document.getElementById('close-mod-menu').addEventListener('click', function() {
        document.getElementById('mod-menu-container').style.right = '-300px';
    });
}

function generateMenuItems() {
    let html = '';
    modMenuParams.forEach(param => {
        html += \`
            <div style="margin-bottom: 20px; padding: 10px; background: rgba(255, 255, 255, 0.05); border-radius: 5px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: bold;">\${param.name}</span>
                    \${generateControl(param)}
                </div>
            </div>
        \`;
    });
    return html;
}

function generateControl(param) {
    switch(param.type) {
        case 'toggle':
            return \`
                <label style="position: relative; display: inline-block; width: 50px; height: 24px;">
                    <input type="checkbox" onchange="handleModMenuToggle(\${param.id}, this.checked)">
                    <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 24px;"></span>
                    <span style="position: absolute; content: \\\"\\\"; height: 16px; width: 16px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%;"></span>
                </label>
            \`;
        case 'slider':
            return \`<input type="range" min="1" max="100" value="50" oninput="handleModMenuSlider(\${param.id}, this.value)" style="width: 120px;">\`;
        case 'button':
            return \`<button onclick="handleModMenuButton(\${param.id})" style="background: #6c5ce7; color: white; border: none; border-radius: 5px; padding: 5px 10px; cursor: pointer;">Активировать</button>\`;
        case 'selector':
            return \`
                <select onchange="handleModMenuSelect(\${param.id}, this.value)" style="background: rgba(255, 255, 255, 0.1); color: white; border: none; border-radius: 5px; padding: 5px;">
                    \${param.options.map(opt => \`<option value="\${opt}">\${opt}</option>\`).join('')}
                </select>
            \`;
    }
}

// Обработчики мод-меню
function handleModMenuToggle(id, isEnabled) {
    const param = modMenuParams.find(p => p.id === id);
    if (param) {
        if (isEnabled) {
            try {
                eval(param.code);
                console.log('Мод активирован:', param.name);
            } catch (e) {
                console.error('Ошибка при выполнении кода мода:', e);
            }
        } else if (param.disableCode) {
            try {
                eval(param.disableCode);
                console.log('Мод деактивирован:', param.name);
            } catch (e) {
                console.error('Ошибка при выполнении кода отключения мода:', e);
            }
        }
    }
}

function handleModMenuSlider(id, value) {
    const param = modMenuParams.find(p => p.id === id);
    if (param) {
        try {
            // Заменяем специальное значение {value} в коде на текущее значение слайдера
            const modifiedCode = param.code.replace(/\\{value\\}/g, value);
            eval(modifiedCode);
            console.log('Значение мода изменено:', param.name, value);
        } catch (e) {
            console.error('Ошибка при выполнении кода мода:', e);
        }
    }
}

function handleModMenuButton(id) {
    const param = modMenuParams.find(p => p.id === id);
    if (param) {
        try {
            eval(param.code);
            console.log('Мод активирован:', param.name);
        } catch (e) {
            console.error('Ошибка при выполнении кода мода:', e);
        }
    }
}

function handleModMenuSelect(id, value) {
    const param = modMenuParams.find(p => p.id === id);
    if (param) {
        try {
            // Заменяем специальное значение {value} в коде на выбранное значение
            const modifiedCode = param.code.replace(/\\{value\\}/g, value);
            eval(modifiedCode);
            console.log('Выбран вариант мода:', param.name, value);
        } catch (e) {
            console.error('Ошибка при выполнении кода мода:', e);
        }
    }
}

// Инициализация мод-меню при загрузке страницы
window.addEventListener('load', initModMenu);
`;
    }
    
    // Скачивание игры с интегрированным мод-меню
    downloadBtn.addEventListener('click', function() {
        if (!importedGameHTML) {
            alert('Сначала загрузите HTML файл игры');
            return;
        }
        
        const modMenuCode = generateModMenuCode();
        
        // Вставляем код мод-меню в загруженный HTML
        const modifiedHTML = importedGameHTML.replace(
            /<\/body>/i, 
            `<script>\n${modMenuCode}\n</script>\n</body>`
        );
        
        // Создаем и скачиваем файл
        const blob = new Blob([modifiedHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'game_with_mod_menu.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    // Сохранение шаблона мод-меню
    saveTemplateBtn.addEventListener('click', function() {
        const template = {
            parameters: parameters,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mod_menu_template.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    // Переключение мод-меню
    menuToggle.addEventListener('click', function() {
        modMenu.classList.toggle('open');
    });
});