import fs from 'fs'
import { utilService } from './util.service.js'

export const toyService = {
    query,
    getById,
    remove,
    save
}

const PAGE_SIZE = 2
const toys = utilService.readJsonFile('data/toy.json')

function query(filterBy) {
    let filteredToys = toys

    const regex = new RegExp(filterBy.name, 'i')
    filteredToys = filteredToys.filter(toy => regex.test(toy.name))

    if(filterBy.price) {
        filteredToys = filteredToys.filter(toy => toy.price <= +filterBy.price)
    }

    // if (filterBy.labels) {
    //     filteredToys = filteredToys.filter(toy => filterBy.labels.every(label => toy.labels.map(label => label.title).includes(label)))
    // }
    
     if (filterBy.status) {
        filteredToys = filteredToys.filter(toy => filterBy.status === 'stock' ? toy.inStock : !toy.inStock)
    }
    
        // if(filterBy.pageIdx !== undefined) {
    //     const startPageIdx = filterBy.pageIdx * PAGE_SIZE
    //     filteredToys = filteredToys.slice(startPageIdx, startPageIdx + PAGE_SIZE)
    // }
    return Promise.resolve(filteredToys)
}

function getById(toyId) {
    const toy = toys.find(toy => toy._id === toyId)
    return Promise.resolve(toy)
}

function remove(toyId) {
    const toyIdx = toys.findIndex(toy => toy._id === toyId)
    toys.splice(toyIdx, 1)
    _saveToysToFile()
    return Promise.resolve(toys)
}

function save(toy) {
    if (toy._id) {
        const idx = toys.findIndex(currToy => currToy._id === toy._id)
        if(idx === -1) throw new Error('Coudnt find toy')
        toys[idx] = toy
    } else {
        toy._id = utilService.makeId()
        toys.unshift(toy)
    }

    return _saveToysToFile().then(() => toy)

}

function _saveToysToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(toys, null, 2)
        fs.writeFile('data/toy.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}