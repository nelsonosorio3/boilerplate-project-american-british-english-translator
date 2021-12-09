const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {
  highlightUs(phrase){
    let keys = [];
    let indexes = [];
    let highlightedPhrase = ""
    keys.push(...Object.keys(americanOnly), ...Object.keys(americanToBritishSpelling), ...Object.keys(americanToBritishTitles))
    for (let key of keys){
      if (phrase.toLowerCase().includes(key.toLowerCase()) && !indexes.includes(phrase.toLowerCase().indexOf(key.toLowerCase()))) {
        indexes.push(phrase.toLowerCase().indexOf(key.toLowerCase()));
        indexes.push(key)
      }
    }
    for (let i = 0; i<phrase.length; i++){
      if(indexes.includes(i)){
        let replacement = americanOnly[indexes[1]] || americanToBritishSpelling[indexes[1]] || americanToBritishTitles[indexes[1]]
        highlightedPhrase = highlightedPhrase.slice(0, i) + '<span class="highlight">' + replacement + "</span>"
        i = i + indexes[1].length -1;
        indexes.splice(0,2);
      }
      else{
        highlightedPhrase += phrase[i];
      }
    }
    if(/\d+:\d+/.test(highlightedPhrase)){
      highlightedPhrase = highlightedPhrase.replace(/\d+:\d+/, matched=>{
        return '<span class="highlight">' + matched.replace(":", ".") + "</span>"
      });
    };
    return highlightedPhrase;
  }

  highlightBrit(phrase){
    let keys = [];
    let indexes = [];
    let highlightedPhrase = ""

    let britishToAmericanTitles = {
      'Mr': 'Mr.',
      'Mrs': 'Mrs.',
      'Ms': 'Ms.',
      'Mx': 'Mx.',
      'Dr': 'Dr.',
      'Prof': 'Prof.'
    };
  
    let britishToAmericanSpelling = {};
    for (const key in Object.keys(americanToBritishSpelling)){
          britishToAmericanSpelling[americanToBritishSpelling[key]] = key;
        };
    keys.push(...Object.keys(britishOnly), ...Object.keys(britishToAmericanSpelling), ...Object.keys(britishToAmericanTitles))
    for (let key of keys){
      // console.log(key)
      if (phrase.toLowerCase().includes(key.toLowerCase()) && !indexes.includes(phrase.toLowerCase().indexOf(key.toLowerCase()))) {
        indexes.push(phrase.toLowerCase().indexOf(key.toLowerCase()));
        indexes.push(key)
      };
    };
    
    let count = 0;
    for (let i = 0; i<phrase.length; i++){
      if(indexes.includes(i)){
        let replacement = britishOnly[indexes[1]] || britishToAmericanSpelling[indexes[1]] || britishToAmericanTitles[indexes[1]]
        highlightedPhrase +=  '<span class="highlight">' + replacement + "</span>"
        i = i + indexes[1].length -1;
        indexes.splice(0,2);
        count++;
      }
      else{
        highlightedPhrase += phrase[i];
      }
    }
    if(/\d+\.\d+/.test(highlightedPhrase)){
      highlightedPhrase = highlightedPhrase.replace(/\d+\.\d+/, matched=>{
        return '<span class="highlight">' + matched.replace(".", ":") + "</span>"
      });
    }
    return highlightedPhrase
  }
}

module.exports = Translator;
