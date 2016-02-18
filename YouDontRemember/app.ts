window.onload = startGame;

function startGame() {
    var wg = new WordGenerator();
    wg.syllable = ['EN', 'ER', 'CH', 'DE', 'EI', 'IE', 'IN', 'TE',
        'GE', 'UN', 'ND', 'IC', 'ES', 'BE', 'HE', 'ST', 'NE', 'AN',
        'RE', 'SE', 'DI', 'SC', 'AU', 'NG', 'SI', 'LE', 'DA', 'IT',
        'HT', 'EL', 'LI'];

    var screens = ['screenNewWords', 'screenPickWords'];

    changeScreen(screens, screens[0]);

    var words = wg.genWords(5);
    showWordList('wordlist', words);

    var timer = new Timer();
    timer.updateFunc = (timer) => {
        $('#timer').text(timer.count);
        if(timer.isDone)
            changeScreen(screens, screens[1]);
    }
    timer.start();

    var allWords = wg.genWords(15);
    for (var x = 0; x < words.length; x++) {
        var i = Math.floor(Math.random() * allWords.length);
        allWords.splice(i, 0, words[x]);
    }
    showWordList('pickWordlist', allWords);
}

function changeScreen(screens: string[], name: string) {
    for (var x = 0; x < screens.length; x++) {
        $('#' + screens[x]).hide();
    }
    $('#' + name).show();
}

function showWordList(id, words) {
    var start = $('#'+id);
    for (var x = 0; x < words.length; x++) {
        var el = $('<div>').text(words[x]);
        start.append(el);
    }
}

class Timer {
    duration: number = 10;
    intervalNumber = -1;
    count = 0;
    isDone = false;
    updateFunc: (timer: Timer)=>void = null;

    start() {
        this.count = 0;
        this.isDone = false;
        clearInterval(this.intervalNumber);
        this.update(this);
        this.intervalNumber = window.setInterval(this.update, 1000, this);
    }
    update(timer) {
        if (timer.count < timer.duration-1) {
            timer.count += 1;
        } else {
            clearInterval(timer.intervalNumber);
            timer.isDone = true;
        }
        if (timer.updateFunc != null)
            timer.updateFunc(timer);
    }
}

class WordGenerator {
    syllable: string[] = [];
    wordsLength = 3;
    genWords(count: number) {
        var words: string[] = []
        for (var x = 0; x < count; x++) {
            var word = '';
            for (var c = 0; c < this.wordsLength; c++) {
                var i = Math.floor((Math.random() * this.syllable.length));
                word += this.syllable[i].toLocaleLowerCase();
            }
            word = firstUpperCase(word);
            words.push(word);
        }
        return words;
    }
}

function firstUpperCase(str: string): string {
    if (str.length == 0)
        return '';

    var firstChar = str[0];
    var tail = str.substr(1, str.length);
    return firstChar.toLocaleUpperCase() + tail;
}