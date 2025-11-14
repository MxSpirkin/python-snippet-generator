import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Python Snippet Generator активирован!');

    let insertSnippetCommand = vscode.commands.registerCommand(
        'python-snippet-generator.insertSnippet', 
        async () => {
            await showSnippetPicker();
        }
    );

    context.subscriptions.push(insertSnippetCommand);
}

async function showSnippetPicker(): Promise<void> {
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

    const selectedSnippet = await vscode.window.showQuickPick(snippetOptions, {
        placeHolder: 'Выберите тип сниппета для вставки'
    });

    if (!selectedSnippet) {
        return;
    }

    await insertSelectedSnippet(selectedSnippet.label);
}

async function insertSelectedSnippet(snippetType: string): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    
    if (!editor) {
        vscode.window.showErrorMessage('Нет активного редактора!');
        return;
    }

    let snippetText = '';
    let cursorPosition: number | null = null;

    try {
        switch (snippetType) {
            case 'if':
                // Базовый условный оператор if с условием condition
                snippetText = 'if condition:\n    pass';
                cursorPosition = snippetText.indexOf('condition') + 9;
                break;

            case 'if-else':
                // Условный оператор if-else с двумя ветками выполнения
                snippetText = 'if condition:\n    pass\nelse:\n    pass';
                cursorPosition = snippetText.indexOf('condition') + 9;
                break;

            case 'if-elif-else':
                // Расширенный условный оператор с несколькими условиями
                snippetText = 'if condition1:\n    pass\nelif condition2:\n    pass\nelse:\n    pass';
                cursorPosition = snippetText.indexOf('condition1') + 10;
                break;

            case 'for':
                // Цикл for с переменной и итерируемым объектом
                const forVariable = await vscode.window.showInputBox({
                    prompt: 'Введите имя переменной цикла',
                    placeHolder: 'i'
                }) || 'i';
                const forIterable = await vscode.window.showInputBox({
                    prompt: 'Введите итерируемый объект',
                    placeHolder: 'range(10)'
                }) || 'range(10)';
                snippetText = `for ${forVariable} in ${forIterable}:\n    pass`;
                cursorPosition = snippetText.indexOf('pass') + 4;
                break;

            case 'while':
                // Цикл while с условием продолжения
                const whileCondition = await vscode.window.showInputBox({
                    prompt: 'Введите условие цикла',
                    placeHolder: 'True'
                }) || 'True';
                snippetText = `while ${whileCondition}:\n    pass`;
                cursorPosition = snippetText.indexOf('pass') + 4;
                break;

            case 'function':
                // Определение функции с именем, параметрами и docstring
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
                // Определение класса с наследованием и конструктором
                const className = await vscode.window.showInputBox({
                    prompt: 'Введите имя класса',
                    placeHolder: 'MyClass'
                }) || 'MyClass';
                const parentClass = await vscode.window.showInputBox({
                    prompt: 'Введите родительский класс',
                    placeHolder: 'ParentClass'
                }) || '';
                const inheritance = parentClass ? `(${parentClass})` : '';
                snippetText = `class ${className}${inheritance}:\n    \"\"\"\n    Описание класса\n    \"\"\"\n    \n    def __init__(self):\n        pass`;
                cursorPosition = snippetText.indexOf('pass') + 4;
                break;

            case 'try-except':
                // Блок обработки исключений с перехватом ошибок
                snippetText = 'try:\n    pass\nexcept Exception as e:\n    print(f"Произошла ошибка: {e}")';
                cursorPosition = snippetText.indexOf('pass') + 4;
                break;

            case 'with':
                // Контекстный менеджер для работы с ресурсами
                const contextManager = await vscode.window.showInputBox({
                    prompt: 'Введите контекстный менеджер',
                    placeHolder: 'open("file.txt")'
                }) || 'open("file.txt")';
                const withVariable = await vscode.window.showInputBox({
                    prompt: 'Введите имя переменной',
                    placeHolder: 'file'
                }) || 'file';
                snippetText = `with ${contextManager} as ${withVariable}:\n    pass`;
                cursorPosition = snippetText.indexOf('pass') + 4;
                break;

            case 'main':
                // Главный блок выполнения для модуля Python
                snippetText = 'if __name__ == "__main__":\n    pass';
                cursorPosition = snippetText.indexOf('pass') + 4;
                break;

            default:
                vscode.window.showErrorMessage(`Неизвестный тип сниппета: ${snippetType}`);
                return;
        }

        await editor.edit(editBuilder => {
            const position = editor.selection.active;
            editBuilder.insert(position, snippetText);
        });

        if (cursorPosition !== null) {
            const newPosition = editor.selection.active.translate(0, -cursorPosition);
            editor.selection = new vscode.Selection(newPosition, newPosition);
        }

        vscode.window.showInformationMessage(`Сниппет "${snippetType}" успешно вставлен!`);

    } catch (error) {
        vscode.window.showErrorMessage(`Ошибка при вставке сниппета: ${error}`);
    }
}

export function deactivate() {}