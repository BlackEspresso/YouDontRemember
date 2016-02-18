var startLevel = 3;

window.onload = () => startGame(startLevel);

function startGame(level: number) {
    var checkedClicked = false;
    var wg = new WordGenerator();
    wg.syllable = ['EN', 'ER', 'CH', 'DE', 'EI', 'IE', 'IN', 'TE',
        'GE', 'UN', 'ND', 'IC', 'ES', 'BE', 'HE', 'ST', 'NE', 'AN',
        'RE', 'SE', 'DI', 'SC', 'AU', 'NG', 'SI', 'LE', 'DA', 'IT',
        'HT', 'EL', 'LI'];

    var screens = ['screenNewWords', 'screenPickWords'];
    $('#levelNumber').text(level - startLevel + 1);

    changeScreen(screens, screens[0]);

    var words = wg.genWords(level);
    console.log(words);
    var list = $('#wordlist');
    list.children().remove();
    showWordList(list, words, (el) => el.addClass('word'));

    var timer = new Timer();
    timer.duration = 10 + level - startLevel;
    timer.updateFunc = (timer) => {
        $('#timer').text(timer.count);
        if(timer.isDone)
            changeScreen(screens, screens[1]);
    }
    timer.start();

    var allWords = wg.genWords(level*3);
    for (var x = 0; x < words.length; x++) {
        var i = Math.floor(Math.random() * allWords.length);
        allWords.splice(i, 0, words[x]);
    }

    var pickWordList = $('#pickWordlist');
    pickWordList.children().remove();
    showWordList(pickWordList, allWords, (el) => {
        el.addClass('clickable-word')
        el.click(onWordClick);
    });
    onWordClick(null);
    checkedClicked = false;

    var btnCheckWords = $('#btnCheckWords');

    $('#titlePickWords').show();
    $('#titleYouWon').hide();
    $('#titleYouLoose').hide();
    $('#btnNextLevel').hide();
    $('#btnTryAgain').hide();
    $('#btnNextLevel').hide();

    btnCheckWords.one('click',() => {
        var list = $('#pickWordlist');
        var allCorrect = true;
        checkedClicked = true;
        btnCheckWords.hide();

        list.find('.selected').each((i, e) => {
            var el = $(e);
            var word = el.text();
            var correct = words.indexOf(word) > -1;

            if (correct) {
                el.addClass('correct-word')
            } else {
                el.addClass('wrong-word');
                allCorrect = false;
            }
           
        });

        $('#titlePickWords').hide();
        if (allCorrect) {
            $('#titleYouWon').show();
            $('#btnNextLevel').show();
            $('#btnNextLevel').one('click', () => {
                startGame(level + 1);
            });
        }
        else {
            $('#titleYouLoose').show();
            $('#btnTryAgain').show();
            $('#btnTryAgain').one('click', () => {
                startGame(3);
            });
        }

    });
   


    function onWordClick(e: JQueryEventObject) {
        if (checkedClicked)
            return;
        var target = e != null ? $(e.target) : $('<div>');
        var parent = $('#screenPickWords');
        var picked = parent.find('.selected').length;
        var maxCount = level;
        if (picked < maxCount || target.hasClass('selected')) {
            target.toggleClass('selected');
            picked = parent.find('.selected').length;
        }
        if (picked == maxCount) {
            $('#btnCheckWords').show();
        } else {
            $('#btnCheckWords').hide();
        }
        $('#pickCount').text(picked);
        $('#maxPickable').text(maxCount);
    }

    function changeScreen(screens: string[], name: string) {
        for (var x = 0; x < screens.length; x++) {
            $('#' + screens[x]).hide();
        }
        $('#' + name).show();
    }

    function showWordList(listEl, words, func: (el: JQuery) => void) {
        for (var x = 0; x < words.length; x++) {
            var el = $('<div>').text(words[x]);
            if (func != null)
                func(el);
            listEl.append(el);
        }
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