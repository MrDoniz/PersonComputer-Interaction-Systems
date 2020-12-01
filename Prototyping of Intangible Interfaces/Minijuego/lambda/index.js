const Alexa = require('ask-sdk-core');
let speechOutput;
speechOutput = '';

let questionsList, currentIndex, count, hits, pending, currentStatus, exit;
function initData() {
    questionsList = {
        '0' : {
            'id' : '0',
            'question' : '¿Que animal hace ...?',
            'answer' : 'leon',
            'sound' : "https://s3-eu-west-1.amazonaws.com//sounds-bucket-animal/lion.mp3"
        },
    
        '1' : {
            'id' : '1',
            'question' : '¿Que animal hace ...?',
            'answer' : 'perro',        
            'sound' : "https://s3-eu-west-1.amazonaws.com/sounds-bucket-animal/dog.mp3"
        },
    
        '2' : {
            'id' : '2',
            'question' : '¿Que animal hace ...?',
            'answer' : 'gato',
            'sound' : "https://s3-eu-west-1.amazonaws.com//sounds-bucket-animal/cat.mp3"
        }
    };
    currentIndex = null;
    pending = null;
    count = 0;
    hits = 0;
    currentStatus = null;
    exit = false;
}

function getRandomItem(obj) {
    if (Object.keys(obj).length === 0) {
        return null;
    }
    currentIndex =  obj[Object.keys(obj)[Math.floor(Math.random()*Object.keys(obj).length)]];
    return currentIndex;
}

function getQuestion(random = true) {
    let speechText = '';
    if (random) {
        speechText = getRandomItem(questionsList);
        if (currentIndex === null && pending === null) {
            const textoPorChat = 'Ya respondiste todas las preguntas! ... Has conseguido acertar ' + hits + ' de ' + count + ' preguntas. ... Hasta luego!';
            exit = true;
            return textoPorChat;
        }
        else if (currentIndex === null) {
            return 'Ya no te quedan más preguntas nuevas, pero sí te queda una pendiente, vamos con ella. ... ' + speechText.question + '? ';
        }
        delete questionsList[currentIndex.id];
        count++;
    }
    else {
        speechText = currentIndex;
    }
    const textoPorChat = speechText.question + '<audio src="'+speechText.sound+'" />';
    return textoPorChat
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        speechOutput = 'Se ha parado.';
        //const request = handlerInput.requestEnvelope.request;
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
  handle(handlerInput) {
        initData();
        const questionText = getQuestion();
        currentStatus = 'Question';
        const textoPorChat = 'Hola! Vamos a jugar a Adivinar que animal es... Tendrás que responder \
        diciendo el nombre del animal que hace ese sonido. ... \
        Vamos a empezar! ... \
        ' + questionText;
    return handlerInput.responseBuilder
      .speak(textoPorChat)
      .reprompt(textoPorChat)
      .getResponse();
  },
};

const AnswerIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AnswerIntent';
  },
   async handle(handlerInput) {
    var InputNombreAnimal = handlerInput.requestEnvelope.request.intent.slots.animal.value;
        let textoPorChat = '';
        if (currentStatus === 'Continue') {
            textoPorChat += 'Responde sí o no';
        }
        else {
            if (InputNombreAnimal === currentIndex.answer){
                textoPorChat += 'Respuesta correcta, el ' + currentIndex.answer + ' hace ' + '<audio src="'+currentIndex.sound+'" />';
                hits++;
            } 
            else {
                textoPorChat += 'Respuesta incorrecta, es el ' + currentIndex.answer + ' porque hace ' + '<audio src="'+currentIndex.sound+'" />';
            }
        }
        currentIndex = null;
        textoPorChat += ' ... Continuamos? ';
        currentStatus = 'Continue';
        
        if (exit) {
            return handlerInput.responseBuilder
                .speak(textoPorChat)
                .getResponse();
        } 
        else {
            return handlerInput.responseBuilder
                .speak(textoPorChat)
                .reprompt(textoPorChat)
                .getResponse();
        }
  },
};
const YesIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.YesIntent';
    },
    handle(handlerInput) {
        const textoPorChat = getQuestion();
        currentStatus = 'Question';

        if (exit) {
            return handlerInput.responseBuilder
                .speak(textoPorChat)
                .withShouldEndSession(true)
                .getResponse();
        } 
        else {
            return handlerInput.responseBuilder
                .speak(textoPorChat)
                .reprompt(textoPorChat)
                .getResponse();
        }
    }
};

const RepeatIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.RepeatIntent';
    },
    handle(handlerInput) {
        let textoPorChat = '';
        if (currentStatus === 'Question') {
            textoPorChat += 'Repetimos! ... ' + getQuestion(false);
        }
        else if (currentStatus === 'Continue') {
            textoPorChat += 'Continuamos? ';
        }

        return handlerInput.responseBuilder
            .speak(textoPorChat)
            .reprompt(textoPorChat)
            .getResponse();
    }
};

const PendingIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PendingIntent';
    },
    handle(handlerInput) {
        let textoPorChat = '';
        if (pending === null) {
            if (currentIndex !== null && currentStatus === 'Question') {
                textoPorChat += 'Hemos dejado esta pregunta sin responder, la guardamos para después ... '; 
                pending = currentIndex;
            }
            textoPorChat += 'No tienes preguntas pendientes! ... Quieres continuar con una nueva pregunta?';
            currentStatus = 'Continue';
        }
        else {
            if (currentIndex !== null && currentStatus === 'Question') {
                let tmpIndex = currentIndex;
                currentIndex = pending;
                pending = currentIndex;
                textoPorChat += 'Hemos dejado esta pregunta sin responder, la guardamos para después ... '; 
            }
            else {
                currentIndex = pending;
                pending = null;
            }
            
            textoPorChat += 'Vamos con la pregunta que teníamos pendiente! ... ' + getQuestion(false);
            currentStatus = 'Question';
        }


        return handlerInput.responseBuilder
            .speak(textoPorChat)
            .reprompt(textoPorChat)
            .getResponse();
    }
};

const NextIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NextIntent';
    },
    handle(handlerInput) {
        let textoPorChat = '';
        if (pending !== null) {
            textoPorChat = 'Alcanzaste el máximo de preguntas pendientes de responder, vamos a por ella de nuevo. ... ';
            const tmpIndex = currentIndex;
            currentIndex = pending;
            pending = tmpIndex;
            textoPorChat += getQuestion(false);
        }
        else {
            textoPorChat = 'Guardamos esta pregunta para después, vamos con la siguiente! ... ';
            pending = currentIndex;
            textoPorChat += getQuestion();
        }
        currentStatus = 'Question';
        return handlerInput.responseBuilder
            .speak(textoPorChat)
            .reprompt(textoPorChat)
            .getResponse();
    }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
        const speakOutput = 'Yo voy a reproducir el sonido de un animal y tú tendrás que decir que animal es';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent'
        || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NoIntent');
  },
    handle(handlerInput) {
      const speakOutput = 'Has conseguido acertar ' + hits + ' de ' + count + ' preguntas. ... Hasta luego!';
      return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
    }
};


const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
	  const speakOutput = 'Pruebe con: Alexa, el sonido de un leon';
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    AnswerIntentHandler,
    NextIntentHandler,
    PendingIntentHandler,
    RepeatIntentHandler,
    YesIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();