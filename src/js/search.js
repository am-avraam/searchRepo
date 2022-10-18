// export
import 'regenerator-runtime/runtime'

class Search {
  constructor(search, options) {
    this.el = document.querySelector(search)
    this.autocomplit = document.querySelector('.autocomplit')
    this.app = document.querySelector('.app')
    this.options = options
    this.autoOptions = document.querySelectorAll('.autocomplit__option')
    this.queryRes = []

    this.setup()
  }

  createElement(tag, cls, text) {
    let el = document.createElement(tag)
    el.classList.add(cls)
    if (text) {
      el.innerHTML = text
    }

    return el
  }

  createCard(name, owner, stars) {
    let card = this.createElement('div', 'saved__option')

    let first = this.createElement('div', 'saved__name', `Name: ${name}`)
    let second = this.createElement('div', 'saved__owner', `Owner: ${owner}`)
    let third = this.createElement('div', 'saved__stars', `Stars: ${stars}`)
    let content = this.createElement('div', 'saved__content')
    content.append(first, second, third)

    let closeBtn = this.createElement('div', 'saved__remove')
    card.append(content, closeBtn)
    closeBtn.addEventListener('click', function () {
      if (document.getElementsByClassName('saved__option').length - 1 == 0) {
        document.getElementsByClassName('saved')[0].remove()
      } else {
        card.remove()
      }
    })
    return card
  }

  setup() {
    this.searchRepo = this.searchRepo.bind(this)
    this.el.addEventListener('input', this.debounce(this.searchRepo, 600))
    this.autocomplit.addEventListener('click', this.addToList.bind(this))
  }

  drop() {
    this.el.value = ''
    // this.autocomplit.remove()
    while (this.autocomplit.firstChild) {
      this.autocomplit.removeChild(this.autocomplit.lastChild)
    }
  }

  addToList(event) {
    let target = event.target // где был клик?

    let correspObj = this.queryRes.find(
      (el) => el['full_name'] == target.innerHTML
    )

    let card = this.createCard(
      correspObj.name,
      correspObj.owner.login,
      correspObj['stargazers_count']
    )

    let cardList = this.app.querySelector('.saved')
    if (this.app.querySelector('.saved')) {
      cardList.append(card)
      this.drop()
    } else {
      const createdList = this.createElement('div', 'saved')
      this.app.append(createdList)
      cardList = this.app.querySelector('.saved')
      cardList.append(card)
      this.drop()
    }
  }

  debounce(fn, debounceTime) {
    let timer
    return function (...args) {
      clearTimeout(timer)
      timer = setTimeout(() => fn.apply(this, args), debounceTime)
    }
  }

  async searchRepo() {
    if (this.el.value == '') {
      this.drop()
    }
    return await fetch(
      `https://api.github.com/search/repositories?q=${this.el.value}`
    ).then((response) => {
      if (response.ok) {
        response.json().then((res) => {
          this.queryRes = [...res.items]

          let options = document.querySelectorAll('.autocomplit__option')

          if (options.length > 0) {
            options.forEach((elem) => elem.remove())
          }

          for (let i = 0; i < 5; i++) {
            let sug = document.createElement('li')
            sug.classList.add('autocomplit__option')
            sug.append(res.items[i]['full_name'])
            this.autocomplit.append(sug)
          }
        })
      }
      // else {
      // }
    })
  }
}

const search = new Search('#search')
