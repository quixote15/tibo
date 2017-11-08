const axios = require('axios')
const colors = require('colors')

let tiboData = {}

module.exports = (token, blacklist) => {
     console.log(colors.magenta('Tibo 1.0'))
     console.log(colors.magenta('Desenvolvido por Hélio Kröger'))
     console.log(colors.magenta('https://heliojuniorkroger.com'))
     tiboData.headers = {
          headers: {
               'x-auth-token': token
          }
     }
     tiboData.blacklist = blacklist
     start()
}

const start = () => {
     axios.get('https://api.gotinder.com/recs/core?locale=pt-BR', tiboData.headers)
          .then(res => {
               res.data.results.map((person, i) => {
                    person.bio.split(' ').map(word => {
                         tiboData.blacklist.map(blacklistWord => {
                              if (word.toLowerCase() === blacklistWord) {
                                   axios.options(`https://api.gotinder.com/pass/{person._id}?locale=pt-BR`, tiboData.headers)
                                        .then(() => {
                                             console.log(colors.red(`Recusou ${person.name}, ${new Date().getFullYear() - new Date(person.birth_date).getFullYear()} (motivo: "${blacklistWord}" na bio)`))
                                        })
                                        .catch(err => {
                                             throw err
                                        })
                                   return false
                              }
                         })
                    })
                    axios.options(`https://api.gotinder.com/like/{person._id}?locale=pt-BR`, tiboData.headers)
                         .then(() => {
                              console.log(colors.green(`Curtiu ${person.name}, ${new Date().getFullYear() - new Date(person.birth_date).getFullYear()}`))
                         })
                         .catch(err => {
                              throw err
                         })
                    if (i === (res.data.results.length - 1)) start()
               })
          })
          .catch(err => {
               throw err
          })
}
