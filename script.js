const sectionsItens = document.querySelectorAll('.section_itens');
btnsSection = document.querySelectorAll('.btns');
console.log(sectionsItens)
console.log(btnsSection)

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
const listaReceitas = document.querySelector('.lista-receitas')
const alertItem = document.querySelector('.alert')
let LISTA_RECEITAS = 'LISTA_RECEITAS';
let LISTA_DESPESAS = 'LISTA_DESPESAS';

function saveValue(list, e) {
    e.preventDefault()
    const inputMoney = e.currentTarget.querySelector('.input-valor').value;
    const inputDescription = e.currentTarget.querySelector('.descricao').value;
    const date = new Date();
    const id = date.getTime()
    const itemData = {
        value: inputMoney,
        description: inputDescription,
        id: id
    };
    saveToLocalStorage(itemData, list)
    createItem(itemData)
}

function saveToLocalStorage(item, list) {
    let lista = getList(list)
    lista.push(item)
    localStorage.setItem(list, JSON.stringify(lista))
}

function getList(list) {
    return localStorage.getItem(list) ? JSON.parse(localStorage.getItem(list)) : [];
}

function createItem(item) {
    const newLi = document.createElement('li')
    const liContent = `
<label for="historico-income"></label>
<input type="text" name='historico-income' id="historico-income" placeholder="${item.description}" />
<div class="valor">
    <span>R$</span>
    <input type="text" name='historico-income-valor' id="historico-income-valor" placeholder="${item.value}" title='${item.value}'/>
</div>

<div class="tooltip_container">
    <button><img src="./pencil.svg" alt=""></button>
    <span class="tooltip">
        Editar item
    </span>
</div>

<div class="tooltip_container">
    <button><img src="./trash.svg" alt=""></button>
    <span class="tooltip">
        Remover item
    </span>
</div>`
    newLi.innerHTML = liContent
    listaReceitas.appendChild(newLi);
    alert('good')
}

function alert(type) {
    alertItem.classList.add(type);
    alertItem.style.display = 'block'
    const timer = setTimeout(() => {
        alertItem.style.display = 'none'
    }, 2000);
}

formReceitas.addEventListener('submit', (e) => {
    saveValue(LISTA_RECEITAS, e)
})
formDespesas.addEventListener('submit', (e) => {
    saveValue(LISTA_DESPESAS, e)
})
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