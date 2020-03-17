var eventsModule = (function(dModule, uModule, cModule, wModule){
    var addEventListeners = function(){
        uModule.getDOMElements().textInput.addEventListener('keydown', function(event){
            if(dModule.testEnded()){
                return;
            }
            var key = event.keyCode;
            if(key == 13){
                uModule.getDOMElements().textInput.value += dModule.getLineReturn() + ' ';
                var inputEvent = new Event('input');
                uModule.getDOMElements().textInput.dispatchEvent(inputEvent);
            }
        });
        uModule.getDOMElements().textInput.addEventListener('input', function(event){
            if(dModule.testEnded()){
                return;
            }
            if(!dModule.testStarted()){
                dModule.startTest();
                var time = setInterval(function(){
                    var results = {};
                    [results.wpm, results.wpmChange] = dModule.calculateWpm();
                    [results.cpm, results.cpmChange] = dModule.calculateCpm();
                    [results.accuracy, results.accuracyChange] = dModule.calculateAccuracy();
                    uModule.updateResults(results);
                    if(dModule.timeLeft()){
                        var timeLeft = dModule.reduceTime();
                        uModule.updateTimeLeft(timeLeft);
                    } else {
                        clearInterval(time);
                        dModule.endTest();
                        uModule.fillModal(results.wpm);
                        uModule.showModal();
                    }
                }, 1000);
            }
            var typedWord = uModule.getTypedWord();
            dModule.updateCurrentWord(typedWord);
            var currentWord = dModule.getCurrentWord();
            uModule.formatWord(currentWord);
            if(uModule.spacePressed(event) || uModule.enterPressed(dModule.getLineReturn())){
                uModule.emptyInput();
                uModule.deactivateCurrentWord();
                dModule.moveToNewWord();
                var index = dModule.getCurrentWordIndex();
                uModule.setActiveWord(index);
                var currentWord = dModule.getCurrentWord();
                uModule.formatWord(currentWord);
                uModule.scroll();
            }
        });
        //click on download button event listener
        uModule.getDOMElements().downloadButton.addEventListener('click', function (event) {
            if (uModule.isNameEmpty()) {
                uModule.flagNameInput();
            } else {
                var certificateDate = dModule.getCerticateData();
                certificateModule.generateCertificate(certificateDate);
            }
        });
    };
    window.addEventListener('resize', uModule.scroll);
    return {
        //init function, initializes the test before start
        init: function(duration, textNumber){
            var words = wModule.getWords(textNumber);
            dModule.fillListOfTestWords(textNumber, words);
            var lineReturn = dModule.getLineReturn();
            var testWords = dModule.getListofTestWords();
            uModule.fillContent(testWords, lineReturn);
            dModule.setTestTime(duration);
            dModule.initializeTimeLeft();
            var timeLeft = dModule.getTimeLeft();
            uModule.updateTimeLeft(timeLeft);
            dModule.moveToNewWord();
            var index = dModule.getCurrentWordIndex();
            uModule.setActiveWord(index);
            var currentWord = dModule.getCurrentWord();
            uModule.formatWord(currentWord);
            uModule.inputFocus();
            addEventListeners();
        }
    };
})(dataModule, UIModule, certificateModule, wordsModule);