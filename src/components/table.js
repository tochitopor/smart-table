import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // вывести дополнительные шаблоны до и после таблицы
    before.reverse().forEach(subName => {                  // перебираем нужный массив идентификаторов
        root[subName] = cloneTemplate(subName);            // клонируем и получаем объект, сохраняем в таблице
        root.container.prepend(root[subName].container);    // добавляем к таблице после (append) или до (prepend)
    }); 

    after.forEach(subName => {                            // перебираем нужный массив идентификаторов
        root[subName] = cloneTemplate(subName);            // клонируем и получаем объект, сохраняем в таблице
        root.container.append(root[subName].container);    // добавляем к таблице после (append) или до (prepend)
    }); 

    // обработать события и вызвать onAction()
    root.container.addEventListener('change', onAction); //???

    root.container.addEventListener('reset', () => {
        setTimeout(onAction);
    });

    root.container.addEventListener('submit', (event) => {
        event.preventDefault();
        onAction(e.submitter);
    });

    const render = (data) => {
        // преобразовать данные в массив строк на основе шаблона rowTemplate
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);
            Object.keys(item).forEach(key => {
                if (key in row.elements) {
                    row.elements[key].textContent = item[key];
                }
            });
            return row.container;
        });
        root.elements.rows.replaceChildren(...nextRows);
    }

    return {...root, render};
}