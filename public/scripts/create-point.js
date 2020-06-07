function populateUFs() {
    const ufselect = document.querySelector("select[name=uf]") 

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then( res => res.json())
    .then( states => {

        for(const state of states) {
            ufselect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
        }
    })


}

populateUFs()

function getCities(event) {
    const citySelect = document.querySelector("select[name=city]")
    const stateInput = document.querySelector("input[name=state]")
    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text
    const ufValue = event.target.value
    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`
    citySelect.innerHTML = ""
    citySelect.disabled = true
    
    
    fetch(url)
    .then( res => res.json())
    .then( cities => {
        for(const city of cities) {
            citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
        }
        citySelect.disabled = false
    })

}

document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)

const itemsToCollect = document.querySelectorAll(".items-grid li")
for(const item of itemsToCollect) {
    item.addEventListener("click", handleSelectedItem)
}

const collectedItems =  document.querySelector("input[name=items]")


let selectedItems = []
function handleSelectedItem(event) {

    //adicionar ou remover classe com javascript//
    const itemLi = event.target
    itemLi.classList.toggle("selected")
    const itemId = itemLi.dataset.id
    console.log('ITEM ID:', itemId)

    //verificar de existem items selecionados, se sim pegar os items//

    const alreadySelected = selectedItems.findIndex( item => {

        const itemFound = item == itemId
        return itemFound
    })

    //se não estiver selecionado add na seleção
    console.log(alreadySelected)
    if (alreadySelected >= 0) {
        const filteredItems = selectedItems.filter(item => {
            const itemsDifferent = item != itemId //false
            return itemsDifferent
        })

        selectedItems = filteredItems
    }
    else {
        selectedItems.push(itemId)
    }
    console.log('selecteditems', selectedItems)
    
    //se sim entçao tirar da seleção
    collectedItems.value = selectedItems
    
}

