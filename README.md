# Python Snippet Generator

**Автор:** Спиркин Максим
**ИСУ:** 501987
**Группа:** М3105

## Описание

Плагин для VS Code, который ускоряет разработку на Python путем автоматической генерации шаблонных конструкций кода. Плагин позволяет быстро вставлять готовые сниппеты для часто используемых конструкций Python.

## Возможности

- **Условные операторы**: if, if-else, if-elif-else
- **Циклы**: for, while с возможностью настройки параметров
- **Функции**: автоматическое создание с docstring
- **Классы**: создание классов с конструктором __init__
- **Обработка исключений**: try-except блоки
- **Контекстные менеджеры**: with statement
- **Главный блок**: if __name__ == "__main__"

## Установка

### Для использования
1. Скачайте .vsix файл из релизов
2. В VS Code: Ctrl+Shift+P → "Extensions: Install from VSIX"
3. Выберите скачанный файл

### Для разработки
```bash
git clone https://github.com/MxSpirkin/python-snippet-generator.git
cd python-snippet-generator
npm install
npm run compile