
const btnsSection = document.querySelectorAll('.btns');
const carteira = document.querySelector('.carteira')

function changeSection(index) {
    const sectionsItens = document.querySelectorAll('.section_itens');
    sectionsItens.forEach(item => item.classList.remove('ativo'))
    sectionsItens[index].classList.add('ativo');
}

btnsSection.forEach((item, index) => {
    item.addEventListener('click', () => {
        changeSection(index)
    })
})

function addClass() {
    if (window.innerWidth <= 990) {
        carteira.classList.add('section_itens')
    } else {
        carteira.classList.remove('section_itens');
        changeSection(0)
    }
}
addClass()
window.addEventListener('resize', addClass)

const formDespesas = document.querySelector('.add_valor_despesas')
const formReceitas = document.querySelector('.add_valor_receitas')
const historicoReceitas = document.querySelector('.lista-receitas')
const historicoDespesas = document.querySelector('.lista-despesas')
const inputsNumber = document.querySelectorAll('.input-valor')
const alertItem = document.querySelector('.alert')
const total = document.querySelector('.total span')
const total_revenue = document.querySelector('.total_recebido span')
const total_expense = document.querySelector('.total_gasto span')
const btnsRemoverTudo = document.querySelectorAll('.remover-tudo')
const LISTA_DESPESAS = 'LISTA_DESPESAS'
const LISTA_RECEITAS = 'LISTA_RECEITAS'
let timer;
const BUDGET = {
    total: 0,
    revenue: 0,
    expense: 0
}

function saveValue(list, e) {
    e.preventDefault();
    const inputMoney = e.currentTarget.querySelector('.input-valor').value;
    const inputDescription = e.currentTarget.querySelector('.descricao').value || 'Novo item';
    if (inputMoney) {
        const LIST_ID = list.dataset.list;
        const date = new Date();
        const ITEM_ID = date.getTime();
        const itemData = {
            value: inputMoney,
            description: inputDescription,
            id: ITEM_ID
        };
        saveToLocalStorage(itemData, LIST_ID);
        createItem(itemData, list, LIST_ID);
        alert('good', 'Item adicionado!');
    } else {
        alert('attention', 'Insira um valor.');
    }
}

function saveToLocalStorage(item, listName) {
    let lista = getList(listName);
    lista.push(item);
    localStorage.setItem(listName, JSON.stringify(lista));
}

function editFromLocalStorage(input, listName, id) {

    let lista = getList(listName);
    const item_editing = lista.filter(item => item.id === id);
    const type = input.dataset.category;
    item_editing[0][type] = input.value;
    localStorage.setItem(listName, JSON.stringify(lista));
}

function getList(listName) {
    return localStorage.getItem(listName) ? JSON.parse(localStorage.getItem(listName)) : [];
}

function editValues(input, listName, id) {
    let previousValue = input.getAttribute('data-value');
    let value = input.value;
    if (input.dataset.category === 'value') {
        value = +input.value
        if (listName === LISTA_RECEITAS) {
            calculateTotal(listName, -previousValue);
            calculateTotal(listName, input.value);
        } else {
            calculateTotal(listName, previousValue);
            calculateTotal(listName, -input.value);
        }
    }
    function updateAttributes(...attrs) {
        attrs.map(attr => input.setAttribute(attr, value))
    }

    input.setAttribute('title', toCurrency(value))
    updateAttributes('data-value', 'value');
    editFromLocalStorage(input, listName, id);
    alert('attention', 'Item editado!');
}

function removeItem(li, listName) {
    const ul = li.parentElement;
    ul.removeChild(li);
    if (ul.children.length == 1) {
        const paragraph = ul.querySelector('p')
        paragraph.style.display = 'block'
    };
    const id = li.dataset.id;
    const inputDescription = li.querySelector(`#description-${id}`).value;
    const inputValue = li.querySelector(`#value-${id}`).value;
    removeFromLocalStorage(id, listName);
    alert('bad', `Item "${inputDescription}" removido`);
    listName === LISTA_RECEITAS ? calculateTotal(listName, -inputValue) : calculateTotal(listName, inputValue);
}

function removeFromLocalStorage(id, listName) {
    let lista = getList(listName);
    lista = lista.filter(item => {
        return item.id !== +id
    });
    localStorage.setItem(listName, JSON.stringify(lista));
    if (lista.length == 0) {
        localStorage.removeItem(listName);
    }
}

function createItem(item, list, listName) {

    const newLi = document.createElement('li');
    const liContent = `
<label for="description-${item.id}">Descriçao do item</label>
<input type="text" name='historico-income' id="description-${item.id}" data-value="${item.description}" title="${item.description}" data-category='description' autocomplete='off' value="${item.description}"/>
<div class="valor">
    <label for="value-${item.id}">Descriçao do item</label>
    <span>R$</span>
    <input type="text" inputmode="numeric" name='historico-income-valor' id="value-${item.id}" data-value="${item.value}" title='${toCurrency(+item.value)}' data-category='value' autocomplete='off' value="${fixValue(+item.value)}" />
</div>

<div class="tooltip_container">
    <button class='btn-remover'><img src="./trash.svg" alt=""></button>
    <span class="tooltip">
        Remover item
    </span>
</div>`;
    newLi.innerHTML = liContent;
    newLi.dataset.id = item.id;
    const paragraph = list.querySelector('p');
    paragraph.style.display = 'none';
    list.appendChild(newLi);
    const btnRemove = newLi.querySelector('.btn-remover');
    const inputs = newLi.querySelectorAll('input');
    const inputValor = newLi.querySelector('.valor input');
    btnRemove.addEventListener('click', () => removeItem(newLi, listName));
    inputs.forEach(input => {
        input.addEventListener('change', (e) => editValues(e.currentTarget, listName, item.id));
    })
    inputValor.addEventListener('keydown', checkIfNumber);
    listName === LISTA_RECEITAS ? calculateTotal(listName, item.value) : calculateTotal(listName, -item.value)
}

function calculateTotal(listName, itemValue) {
    let value = Number(itemValue);
    if (listName === LISTA_RECEITAS) {
        BUDGET.total = BUDGET.total + value
        BUDGET.revenue = BUDGET.revenue + value
    } else if (listName === LISTA_DESPESAS) {
        BUDGET.total = BUDGET.total + value
        BUDGET.expense = BUDGET.expense + value
    }

    updateTotalValue(total, BUDGET.total);
    updateTotalValue(total_expense, Math.abs(BUDGET.expense));
    updateTotalValue(total_revenue, BUDGET.revenue);
}

function updateTotalValue(element, value) {
    element.innerText = fixValue(value);
    element.parentElement.setAttribute('title', toCurrency(+element.innerText))
}

function fixValue(value) {
    return value.toFixed(2)
}

function toCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function alert(type, text) {
    clearTimeout(timer)
    alertItem.dataset.type = type;
    alertItem.innerText = text;
    alertItem.style.display = 'block';
    timer = setTimeout(() => {
        alertItem.style.display = 'none';
    }, 2000);
}

function loadStorageData(list) {
    let lista = getList(list.dataset.list);
    lista.forEach(item => {
        createItem(item, list, list.dataset.list)
    })
}

function removeAll(e) {
    const listaHistorico = e.currentTarget.parentElement.parentElement;
    const itemLista = listaHistorico.querySelectorAll('li');
    const listName = listaHistorico.querySelector('ul').dataset.list;
    itemLista.forEach(li => removeItem(li, listName));
    if (!itemLista.length) {
        alert('attention', 'Esta lista não possui itens.');
    } else {
        alert('bad', 'A lista foi esvaziada.');
    }
}
function checkIfNumber(e) {

    const regex = /\d|\./;
    const currentInputValue = e.currentTarget.value + e.key;
    const keysNotAllowed = [8, 37, 38, 39, 40];

    function isKeyForbidden() {
        return (!regex.test(e.key) && keysNotAllowed.every(key => e.keyCode !== key))
    }

    function dotAlreadyExists() {
        return currentInputValue.split('.').length - 1 > 1
    }

    if (isKeyForbidden() || dotAlreadyExists()) { e.preventDefault() }
}

formReceitas.addEventListener('submit', (e) => {
    saveValue(historicoReceitas, e)
})
formDespesas.addEventListener('submit', (e) => {
    saveValue(historicoDespesas, e)
})

inputsNumber.forEach(input => {
    input.addEventListener('keydown', checkIfNumber)
})

btnsRemoverTudo.forEach(btn => btn.addEventListener('click', removeAll))

window.addEventListener('DOMContentLoaded', () => {
    loadStorageData(historicoReceitas)
    loadStorageData(historicoDespesas)
})