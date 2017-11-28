const axios = require('axios')
const colors = require('colors')
var fs = require('fs');
const download = require('image-downloader')

let tiboData = {}

module.exports = (token, blacklist) => {
     console.log(colors.magenta('Tibo 1.0'))
     console.log(colors.magenta('Desenvolvido por Hélio Kröger'))
     console.log(colors.magenta('https://heliojuniorkroger.com'))
     console.log(colors.magenta('Contribuições'))
     console.log(colors.magenta('Neto Jocelino | github.com/netojocelino'))
     console.log(colors.magenta('Tiago Santos  | github.com/quixote15'))

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
                            getProfileData(person);
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


const getProfileData = (person) =>{
    var i = 0;
    var dir = `users/${person.name}+${person._id}/`;

    //create directory if doesn't exist
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    for ( let data in person['photos'])
    {      
        // Download to a directory and save with the original filename
        const options = {
          url: person['photos'][i++].url,
          dest: dir                  // Save to /path/to/dest/image.jpg
        }
        
        download.image(options)
          .then(({ filename, image }) => {
           // console.log('File saved to', filename)
          }).catch((err) => {
           console.log(colors.red(`Foto de ${person.name} não foi salva.`))
            throw err
          })
   }

   fs.appendFile(`${dir}/bio.txt`, person.bio, (err) => { //append the person bio to the 
    if (err) throw err;
    });

}

