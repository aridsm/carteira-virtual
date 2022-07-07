const sectionsItens = document.querySelectorAll('.section_itens');
btnsSection = document.querySelectorAll('.btns');

function changeSection(index) {
    sectionsItens.forEach(item => item.classList.remove('ativo'))
    sectionsItens[index].classList.add('ativo');
}

btnsSection.forEach((item, index) => {
    item.addEventListener('click', () => {
        changeSection(index)
    })
})

const formDespesas = document.querySelector('.add_valor_despesas')
const formReceitas = document.querySelector('.add_valor_receitas')
const historicoReceitas = document.querySelector('.lista-receitas')
const historicoDespesas = document.querySelector('.lista-despesas')
const alertItem = document.querySelector('.alert')
const total = document.querySelector('.total span')
const total_revenue = document.querySelector('.total_recebido span')
const total_expense = document.querySelector('.total_gasto span')
const btnsRemoverTudo = document.querySelectorAll('.remover-tudo')
let TOTAL_VALUE = 0;
let TOTAL_REVENUE_VALUE = 0;
let TOTAL_EXPENSE_VALUE = 0;

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

function editFromLocalStorage(li, listName, id) {
    let lista = getList(listName);

    lista.filter(item => item.id === id)
    const item_editing = lista.filter(item => item.id === id)
    const type = li.dataset.category
    item_editing[0][type] = li.value

    localStorage.setItem(listName, JSON.stringify(lista));

}

function getList(listName) {
    return localStorage.getItem(listName) ? JSON.parse(localStorage.getItem(listName)) : [];
}

function editValues(input, listName, id) {
    const previousValue = input.getAttribute('placeholder');

    if (input.dataset.category === 'value') {
        removeFromTotal(listName, previousValue);
        sumTotal(listName, input.value);
    }

    editFromLocalStorage(input, listName, id);
    input.setAttribute('placeholder', input.value);
    input.setAttribute('title', input.value);
    alert('attention', 'Item editado!');
}

function removeItem(li, listName) {
    const ul = li.parentElement;
    ul.removeChild(li);
    if (ul.children.length == 1) {
        const paragraph = ul.querySelector('p')
        paragraph.style.display = 'block'
    };
    removeFromLocalStorage(li.dataset.id, listName);
    const inputDescription = li.querySelector(`#description-${li.dataset.id}`).value;
    const inputValue = li.querySelector(`#value-${li.dataset.id}`).value;
    removeFromTotal(listName, inputValue);

    alert('bad', `Item "${inputDescription}" removido`);
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
<input type="text" name='historico-income' id="description-${item.id}" placeholder="${item.description}" title="${item.description}" data-category='description' autocomplete='off' value="${item.description}"/>
<div class="valor">
    <label for="value-${item.id}">Descriçao do item</label>
    <span>R$</span>
    <input type="text" name='historico-income-valor' id="value-${item.id}" placeholder="${item.value}" title='${item.value}' data-category='value' autocomplete='off' value="${item.value}" />
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
    btnRemove.addEventListener('click', () => removeItem(newLi, listName));
    inputs.forEach(input => {
        input.addEventListener('change', (e) => editValues(e.currentTarget, listName, item.id));
    })
    sumTotal(listName, item.value);
}

function sumTotal(listName, value) {

    if (listName === 'LISTA_RECEITAS') {
        TOTAL_VALUE += +value;
        TOTAL_REVENUE_VALUE += +value;
    } else if (listName === 'LISTA_DESPESAS') {
        TOTAL_VALUE -= value;
        TOTAL_EXPENSE_VALUE += +value
    }

    total_revenue.innerText = TOTAL_REVENUE_VALUE;
    total_expense.innerText = TOTAL_EXPENSE_VALUE;
    total.innerText = TOTAL_VALUE;
}

function removeFromTotal(listName, itemValue) {

    if (listName === 'LISTA_RECEITAS') {
        TOTAL_VALUE -= +itemValue;
        TOTAL_REVENUE_VALUE -= +itemValue
    } else if (listName === 'LISTA_DESPESAS') {
        TOTAL_VALUE += +itemValue;
        TOTAL_EXPENSE_VALUE -= +itemValue;
    }

    total_revenue.innerText = TOTAL_REVENUE_VALUE;
    total_expense.innerText = TOTAL_EXPENSE_VALUE;
    total.innerText = TOTAL_VALUE;
}

function alert(type, text) {
    alertItem.dataset.type = type;
    alertItem.innerText = text;
    alertItem.style.display = 'block';
    const timer = setTimeout(() => {
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
    alert('bad', 'Todos os itens foram removidos.')
}

formReceitas.addEventListener('submit', (e) => {
    saveValue(historicoReceitas, e)
})
formDespesas.addEventListener('submit', (e) => {
    saveValue(historicoDespesas, e)
})

btnsRemoverTudo.forEach(btn => btn.addEventListener('click', removeAll))

window.addEventListener('DOMContentLoaded', () => {
    loadStorageData(historicoReceitas)
    loadStorageData(historicoDespesas)
})

/*
function setUpItens(funcao, ul) {
    let itens = funcao
    if (itens.length > 0) {
        itens.forEach((i) => {
            createLi(i.id, ul, i.valor, i.descricao)
        })
    }
}
 */

/*
function addLocalStorage(id, valor, descricao, nomeLista, funcao) {
    const item = { id, valor, descricao }
    let lista = funcao
    lista.push(item)
    localStorage.setItem(nomeLista, JSON.stringify(lista))
}*/

/*
const btnsAdd = document.querySelectorAll('.add')
const btnsDeleteAll = document.querySelectorAll('.limpar')
const valorTotal = document.querySelector('#valor-total')
const totalRecebido = document.querySelector('#total-recebido')
const totalGasto = document.querySelector('#total-gasto')
const incomeHistory = document.querySelector('#income-history')
const outcomeHistory = document.querySelector('#outcome-history')
const inputNumeros = document.querySelectorAll('.input-valor')

function adicionarValor(e) {
    const parentDiv = e.target.parentElement
    
    const inputValor = parentDiv.querySelector('.input-valor')
    const inputDescricao = parentDiv.querySelector('.descricao')

    const inputValue = +inputValor.value
    const descricaoValue = inputDescricao.value

    if (inputValue !== 0) {
            if (parentDiv.classList.contains('income-container')) {

            const id = new Date().getTime()
            if (inputValue !== 0) {
            createLi(id, incomeHistory, inputValue, descricaoValue)  
            }     
            trocaValor(valorTotal, inputValue)
            trocaValor(totalRecebido, inputValue)

            addLocalStorage(id, inputValue, descricaoValue, 'listaIncome', getStorageIncome())
            addLocalStorageDados()

            } else {

            const id = new Date().getTime()
            if (inputValue !== 0) {
            createLi(id, outcomeHistory, inputValue, descricaoValue)  
            } 
            trocaValor(totalGasto, inputValue)
            trocaValor(valorTotal, -inputValue)

            addLocalStorage(id, inputValue, descricaoValue, 'listaOutcome', getStorageOutcome())
            addLocalStorageDados()

            }
    }
}

function createLi(id, d, p, s) {
    if (s.trim() == '') s = 'Novo item'
    const v = p.toFixed(2).replace('.',',')
    const newLi = document.createElement('li')
    newLi.classList.add('item-history')
    newLi.id = id
    newLi.innerHTML = `<p>${s.trim()}</p>
                        <span class="valor">
                            R$
                            <span class="qt">${v}</span>
                        </span>
                        <button class="remover-item">Deletar item</button>`
    d.appendChild(newLi)
    const deleteBtn = newLi.querySelector('.remover-item')
    deleteBtn.addEventListener('click', (e) => {
        deleteItem(e, p)
    })
}

function deleteItem(e, v) {
    const ide = e.target.parentElement.id

    if((e.target.parentElement.parentElement).id === 'income-history') {
        trocaValor(valorTotal, -v)
        trocaValor(totalRecebido, -v)
       
        deleteItemFromStorage(ide, getStorageIncome(), 'listaIncome')
        addLocalStorageDados()

    } else {
        trocaValor(valorTotal, +v)
        trocaValor(totalGasto, -v)

        deleteItemFromStorage(ide, getStorageOutcome(), 'listaOutcome')
        addLocalStorageDados()

    }

    e.target.parentElement.remove()
}

function trocaValor(v, i) {  
    v.innerText = v.innerText.replace(',','.')
    let t = +v.innerText + i
    v.innerText = Number(t).toFixed(2)
    v.innerText = v.innerText.replace('.',',')
}

function deletarTudo(e) {
    const parentDiv = e.target.parentElement.parentElement
    const allLi = parentDiv.querySelectorAll('li')
    allLi.forEach((li) => {
        const valorLi = li.querySelector('.qt').innerText.replace(',','.')

        if (parentDiv.classList.contains('income-container')) {

            trocaValor(valorTotal, -valorLi)
            trocaValor(totalRecebido, -valorLi)
            localStorage.removeItem('listaIncome')
            addLocalStorageDados()
           

        } else {

            trocaValor(valorTotal, +valorLi)
            trocaValor(totalGasto, -valorLi)
            localStorage.removeItem('listaOutcome')
            addLocalStorageDados()

        }
        li.remove()
    })

}

function addLocalStorage(id, valor, descricao, nomeLista, funcao) {
    const item = { id, valor, descricao }
    let lista = funcao
    lista.push(item)
    localStorage.setItem(nomeLista, JSON.stringify(lista))
}

function addLocalStorageDados() {
    const item = { total: valorTotal.innerText, recebido: totalRecebido.innerText, gasto: totalGasto.innerText }
    localStorage.setItem('Dados', JSON.stringify(item))
}

function deleteItemFromStorage(id, funcao, nomeLista) {

    let items = funcao
    
    items = items.filter(function(item){
        return item.id !== +id
    })

    localStorage.setItem(nomeLista, JSON.stringify(items))
    if (items.length == 0) {
        localStorage.removeItem(nomeLista)
    }
}

function setUpItens(funcao, ul) {
    let itens = funcao
    if (itens.length > 0) {
        itens.forEach((i) => {
            createLi(i.id, ul, i.valor, i.descricao)
        })
    }
}

function setUpDados() {
    let itens = getStorageDados()
    if (itens.length !== 0) {
        valorTotal.innerText = itens.total
        totalRecebido.innerText = itens.recebido
        totalGasto.innerText = itens.gasto
    }
}

function getStorageIncome(){
    return localStorage.getItem('listaIncome')?JSON.parse(localStorage.getItem('listaIncome')):[];
}
function getStorageOutcome(){
    return localStorage.getItem('listaOutcome')?JSON.parse(localStorage.getItem('listaOutcome')):[];
}
function getStorageDados(){
    return localStorage.getItem('Dados')?JSON.parse(localStorage.getItem('Dados')):[];
}

function preventKey(e) {
    if (e.keyCode == 107 || e.keyCode == 109 || e.keyCode == 69) {
        e.preventDefault()
    }
}

btnsAdd.forEach((btn) => {
    btn.addEventListener('click', adicionarValor)
})

btnsDeleteAll.forEach((btn) => {
    btn.addEventListener('click', deletarTudo)
})

window.addEventListener('DOMContentLoaded', () => {
    setUpItens(getStorageIncome(), incomeHistory)
    setUpItens(getStorageOutcome(), outcomeHistory)
    setUpDados()
})

inputNumeros.forEach((i) => {
    i.addEventListener('keydown', preventKey)
})
*/