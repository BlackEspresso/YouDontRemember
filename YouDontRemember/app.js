var startLevel = 3;
window.onload = function () { return startGame(startLevel); };
function startGame(level) {
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
    showWordList(list, words, function (el) { return el.addClass('word'); });
    var timer = new Timer();
    timer.duration = 10 + level - startLevel;
    timer.updateFunc = function (timer) {
        $('#timer').text(timer.count);
        if (timer.isDone)
            changeScreen(screens, screens[1]);
    };
    timer.start();
    var allWords = wg.genWords(level * 3);
    for (var x = 0; x < words.length; x++) {
        var i = Math.floor(Math.random() * allWords.length);
        allWords.splice(i, 0, words[x]);
    }
    var pickWordList = $('#pickWordlist');
    pickWordList.children().remove();
    showWordList(pickWordList, allWords, function (el) {
        el.addClass('clickable-word');
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
    btnCheckWords.one('click', function () {
        var list = $('#pickWordlist');
        var allCorrect = true;
        checkedClicked = true;
        btnCheckWords.hide();
        list.find('.selected').each(function (i, e) {
            var el = $(e);
            var word = el.text();
            var correct = words.indexOf(word) > -1;
            if (correct) {
                el.addClass('correct-word');
            }
            else {
                el.addClass('wrong-word');
                allCorrect = false;
            }
        });
        $('#titlePickWords').hide();
        if (allCorrect) {
            $('#titleYouWon').show();
            $('#btnNextLevel').show();
            $('#btnNextLevel').one('click', function () {
                startGame(level + 1);
            });
        }
        else {
            $('#titleYouLoose').show();
            $('#btnTryAgain').show();
            $('#btnTryAgain').one('click', function () {
                startGame(3);
            });
        }
    });
    function onWordClick(e) {
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
        }
        else {
            $('#btnCheckWords').hide();
        }
        $('#pickCount').text(picked);
        $('#maxPickable').text(maxCount);
    }
    function changeScreen(screens, name) {
        for (var x = 0; x < screens.length; x++) {
            $('#' + screens[x]).hide();
        }
        $('#' + name).show();
    }
    function showWordList(listEl, words, func) {
        for (var x = 0; x < words.length; x++) {
            var el = $('<div>').text(words[x]);
            if (func != null)
                func(el);
            listEl.append(el);
        }
    }
}
var Timer = (function () {
    function Timer() {
        this.duration = 10;
        this.intervalNumber = -1;
        this.count = 0;
        this.isDone = false;
        this.updateFunc = null;
    }
    Timer.prototype.start = function () {
        this.count = 0;
        this.isDone = false;
        clearInterval(this.intervalNumber);
        this.update(this);
        this.intervalNumber = window.setInterval(this.update, 1000, this);
    };
    Timer.prototype.update = function (timer) {
        if (timer.count < timer.duration - 1) {
            timer.count += 1;
        }
        else {
            clearInterval(timer.intervalNumber);
            timer.isDone = true;
        }
        if (timer.updateFunc != null)
            timer.updateFunc(timer);
    };
    return Timer;
})();
var WordGenerator = (function () {
    function WordGenerator() {
        this.syllable = [];
        this.wordsLength = 3;
    }
    WordGenerator.prototype.genWords = function (count) {
        var words = [];
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
    };
    return WordGenerator;
})();
function firstUpperCase(str) {
    if (str.length == 0)
        return '';
    var firstChar = str[0];
    var tail = str.substr(1, str.length);
    return firstChar.toLocaleUpperCase() + tail;
}
//# sourceMappingURL=app.js.map