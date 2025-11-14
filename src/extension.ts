import * as vscode from 'vscode';

/**
 * Активирует расширение при запуске VS Code
 * @param context - контекст расширения, предоставляемый VS Code
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('Python Snippet Generator активирован!');

    // Регистрируем команду для вставки сниппетов
    let insertSnippetCommand = vscode.commands.registerCommand(
        'python-snippet-generator.insertSnippet', 
        async () => {
            await showSnippetPicker();
        }
    );

    // Добавляем команду в подписки для правильного управления памятью
    context.subscriptions.push(insertSnippetCommand);
}

/**
 * Показывает диалоговое окно для выбора типа сниппета
 * @returns Promise, который разрешается когда пользователь сделает выбор или отменит
 */
async function showSnippetPicker(): Promise<void> {
    // Опции для QuickPick - типы сниппетов с описаниями
    const snippetOptions = [
        { label: 'if', description: 'Условный оператор if' },
        { label: 'if-else', description: 'Условный оператор if-else' },
        { label: 'if-elif-else', description: 'Условный оператор if-elif-else' },
        { label: 'for', description: 'Цикл for' },
        { label: 'while', description: 'Цикл while' },
        { label: 'function', description: 'Определение функции' },
        { label: 'class', description: 'Определение класса' },
        { label: 'try-except', description: 'Блок try-except' },
        { label: 'with', description: 'Контекстный менеджер with' },
        { label: 'main', description: 'Блок if __name__ == "__main__"' }
    ];

    // Показываем QuickPick для выбора типа сниппета
    const selectedSnippet = await vscode.window.showQuickPick(snippetOptions, {
        placeHolder: 'Выберите тип сниппета для вставки'
    });

    // Если пользователь отменил выбор (нажал ESC или закрыл окно)
    if (!selectedSnippet) {
        return;
    }

    // Переходим к вставке выбранного сниппета
    await insertSelectedSnippet(selectedSnippet.label);
}

/**
 * Вставляет выбранный сниппет в активный редактор
 * @param snippetType - тип сниппета для вставки
 * @returns Promise, который разрешается когда сниппет вставлен или произошла ошибка
 */
async function insertSelectedSnippet(snippetType: string): Promise<void> {
    // Получаем активный текстовый редактор
    const editor = vscode.window.activeTextEditor;
    
    // Проверяем, что редактор существует
    if (!editor) {
        vscode.window.showErrorMessage('Нет активного редактора!');
        return;
    }

    let snippetText = '';    // Текст сниппета для вставки
    let cursorPosition: number | null = null; // Позиция курсора после вставки

    try {
        // Генерируем текст сниппета в зависимости от выбранного типа
        switch (snippetType) {
            case 'if':
                // Базовый условный оператор if
                snippetText = 'if condition:\n    pass';
                cursorPosition = snippetText.indexOf('condition') + 9; // Устанавливаем курсор после 'condition'
                break;

            case 'if-else':
                // Условный оператор if-else
                snippetText = 'if condition:\n    pass\nelse:\n    pass';
                cursorPosition = snippetText.indexOf('condition') + 9;
                break;

            case 'if-elif-else':
                // Условный оператор if-elif-else
                snippetText = 'if condition1:\n    pass\nelif condition2:\n    pass\nelse:\n    pass';
                cursorPosition = snippetText.indexOf('condition1') + 10;
                break;

            case 'for':
                // Цикл for с запросом параметров у пользователя
                const forVariable = await vscode.window.showInputBox({
                    prompt: 'Введите имя переменной цикла',
                    placeHolder: 'i'
                }) || 'i';
                const forIterable = await vscode.window.showInputBox({
                    prompt: 'Введите итерируемый объект',
                    placeHolder: 'range(10)'
                }) || 'range(10)';
                snippetText = `for ${forVariable} in ${forIterable}:\n    pass`;
                cursorPosition = snippetText.indexOf('pass') + 4; // Курсор после 'pass'
                break;

            case 'while':
                // Цикл while с запросом условия
                const whileCondition = await vscode.window.showInputBox({
                    prompt: 'Введите условие цикла',
                    placeHolder: 'True'
                }) || 'True';
                snippetText = `while ${whileCondition}:\n    pass`;
                cursorPosition = snippetText.indexOf('pass') + 4;
                break;

            case 'function':
                // Определение функции с запросом имени и параметров
                const functionName = await vscode.window.showInputBox({
                    prompt: 'Введите имя функции',
                    placeHolder: 'my_function'
                }) || 'my_function';
                const parameters = await vscode.window.showInputBox({
                    prompt: 'Введите параметры функции',
                    placeHolder: 'param1, param2'
                }) || '';
                snippetText = `def ${functionName}(${parameters}):\n    \"\"\"\n    Описание функции\n    \"\"\"\n    pass`;
                cursorPosition = snippetText.indexOf('pass') + 4;
                break;

            case 'class':
                // Определение класса с запросом имени и наследования
                const className = await vscode.window.showInputBox({
                    prompt: 'Введите имя класса',
                    placeHolder: 'MyClass'
                }) || 'MyClass';
                const parentClass = await vscode.window.showInputBox({
                    prompt: 'Введите родительский класс',
                    placeHolder: 'ParentClass'
                }) || '';
                // Формируем строку наследования, если указан родительский класс
                const inheritance = parentClass ? `(${parentClass})` : '';
                // Генерируем шаблон класса с docstring и конструктором
                snippetText = `class ${className}${inheritance}:\n    \"\"\"\n    Описание класса\n    \"\"\"\n    \n    def __init__(self):\n        pass`;
                // Устанавливаем позицию курсора после 'pass' в конструкторе
                cursorPosition = snippetText.indexOf('pass') + 4;
                break;

            case 'try-except':
                // Блок обработки исключений с перехватом всех исключений
                snippetText = 'try:\n    pass\nexcept Exception as e:\n    print(f"Произошла ошибка: {e}")';
                // Курсор устанавливается после 'pass' в блоке try
                cursorPosition = snippetText.indexOf('pass') + 4;
                break;

            case 'with':
                // Контекстный менеджер для работы с ресурсами (файлы, соединения и т.д.)
                const contextManager = await vscode.window.showInputBox({
                    prompt: 'Введите контекстный менеджер',
                    placeHolder: 'open("file.txt")'
                }) || 'open("file.txt")';
                const withVariable = await vscode.window.showInputBox({
                    prompt: 'Введите имя переменной',
                    placeHolder: 'file'
                }) || 'file';
                // Генерируем конструкцию with с указанным контекстным менеджером
                snippetText = `with ${contextManager} as ${withVariable}:\n    pass`;
                // Курсор устанавливается после 'pass' внутри блока with
                cursorPosition = snippetText.indexOf('pass') + 4;
                break;

            case 'main':
                // Стандартный блок для определения точки входа в Python-модуль
                snippetText = 'if __name__ == "__main__":\n    pass';
                // Курсор устанавливается после 'pass' внутри блока main
                cursorPosition = snippetText.indexOf('pass') + 4;
                break;

            default:
                // Обработка неизвестного типа сниппета
                vscode.window.showErrorMessage(`Неизвестный тип сниппета: ${snippetType}`);
                return;
        }

        // Вставляем сгенерированный текст сниппета в активный редактор
        await editor.edit(editBuilder => {
            const position = editor.selection.active;
            editBuilder.insert(position, snippetText);
        });

        // Если указана позиция курсора, перемещаем курсор в нужное место
        if (cursorPosition !== null) {
            // Вычисляем новую позицию курсора относительно конца вставленного текста
            const newPosition = editor.selection.active.translate(0, -cursorPosition);
            editor.selection = new vscode.Selection(newPosition, newPosition);
        }

        // Показываем уведомление об успешной вставке сниппета
        vscode.window.showInformationMessage(`Сниппет "${snippetType}" успешно вставлен!`);

    } catch (error) {
        // Обрабатываем ошибки, которые могут возникнуть при вставке сниппета
        vscode.window.showErrorMessage(`Ошибка при вставке сниппета: ${error}`);
    }
}

/**
 * Деактивирует расширение при закрытии VS Code
 * В текущей реализации не выполняет дополнительных действий
 */
export function deactivate() {}