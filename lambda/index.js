// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
const persistence = require('./persistence');
const interceptors = require('./interceptors');
const logic = require('./logic.js');
const constants = require('./constants');
const moment = require('moment');
const axios = require('axios');
var retrievedTime;

// const languageStrings = require('./localisation');
// var persistenceAdapter = getPersistenceAdapter();


// TEMPLATE handler
// const  IntentHandler = { 
//     canHandle(handlerInput){
//         return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
//             && Alexa.getIntentName(handlerInput.requestEnvelope) === ' Intent';
//     },
//     handle(handlerInput){
//     }
// }

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const {attributesManager, serviceClientFactory, requestEnvelope} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        const homeStopName = sessionAttributes['homeStopName'];
        const workStopName = sessionAttributes['workStopName'];
        const busHomeWorkId = sessionAttributes['busHomeWorkId'];
        
        
        var speakOutput;
        
        if (homeStopName && workStopName && busHomeWorkId){
            speakOutput = requestAttributes.t('REGISTER_BASIC_MSG', busHomeWorkId, homeStopName, workStopName);

        } else if (!(homeStopName && workStopName && busHomeWorkId)){
            speakOutput = requestAttributes.t('WELCOME_MSG');
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const RegisterBasicRouteIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RegisterBasicRouteIntent';
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = handlerInput.requestEnvelope.request;
        
        const homeStopId = intent.slots.home.resolutions.resolutionsPerAuthority[0].values[0].value.id;
        const homeStopName = intent.slots.home.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        const workStopId = intent.slots.work.resolutions.resolutionsPerAuthority[0].values[0].value.id;
        const workStopName = intent.slots.work.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        const busHomeWorkId = intent.slots.busHomeWork.resolutions.resolutionsPerAuthority[0].values[0].value.id;
        const busHomeWorkName = intent.slots.busHomeWork.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        
        sessionAttributes['homeStopId'] = homeStopId;
        sessionAttributes['homeStopName'] = homeStopName;
        sessionAttributes['workStopId'] = workStopId;
        sessionAttributes['workStopName'] = workStopName;
        sessionAttributes['busHomeWorkId'] = busHomeWorkId;
        sessionAttributes['busHomeWorkName'] = busHomeWorkName;
        
        
        // TESTING IF THERE IS NO CONFIRMATION
        if(intent.confirmationStatus !== 'CONFIRMED'){
            return handlerInput.responseBuilder
                .speak(requestAttributes.t('REJECTED_MSG'))
                .reprompt(requestAttributes.t('HELP_GENERAL_MSG'))
                .getResponse();
        }
        
        return handlerInput.responseBuilder
            .speak(requestAttributes.t('REGISTER_BASIC_MSG',busHomeWorkName, homeStopName, workStopName ))
            .reprompt(requestAttributes.t('HELP_GENERAL_MSG'))
            .getResponse();
    }
};


const RegisterAdditionalRouteIntentHandler = {
    canHandle(handlerInput){
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RegisterAdditionalRouteIntent';
    },
    handle(handlerInput){
        
    }
    
};


const ConsultTimeIntentHandler = {
    canHandle(handlerInput){
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConsultTimeIntent';
    },
    async handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = handlerInput.requestEnvelope.request;
        
        const homeStopName = sessionAttributes['homeStopName'];
        const homeStopId = sessionAttributes['homeStopId'];
        const workStopName = sessionAttributes['workStopName'];
        const workStopId = sessionAttributes['workStopId'];
        const busHomeWorkName = sessionAttributes['busHomeWorkName'];
        const busHomeWorkId = sessionAttributes['busHomeWorkId'];

        var speakOutput;
        var url;
        if(intent.confirmationStatus !== 'CONFIRMED'){
            url = `https://api.tmb.cat/v1/ibus/lines/${busHomeWorkId}/stops/${workStopId}?app_id=${constants.APP_ID}&app_key=${constants.APP_KEY}`;
        } else if (intent.confirmationStatus === 'CONFIRMED'){
            // url = `https://api.tmb.cat/v1/ibus/lines/${busHomeWorkId}/stops/${homeStopId}?app_id=4c132798&app_key=a828910cef5a0376607986191db19d14`;
            url = `https://api.tmb.cat/v1/ibus/lines/${busHomeWorkId}/stops/${homeStopId}?app_id=${constants.APP_ID}&app_key=${constants.APP_KEY}`;

        }
        console.log(url);
       await logic.getRemoteData(url)
          .then((response) => {
            // const content = JSON.stringify(response);
            const content = JSON.parse(response);
            retrievedTime = `${content.data.ibus[0]['t-in-min']}`;
            var minutes = `${content.data.ibus[0]['t-in-min']}`;
            var seconds = `${content.data.ibus[0]['t-in-s']}`;
            var seconds_modulo = seconds % 60;
            speakOutput = requestAttributes.t('TIME_LEFT_MSG',busHomeWorkId, minutes,seconds_modulo)
            // retrievedTime = logic.getDataFromApi(content);
            // speakOutput = `Los datos de viaje son ${content.data.ibus[0]['t-in-min']} minutos `;
             //  const { status, data } = content;
            // data = JSON.stringify(data);
            console.log("DATA" + content + "STATUS" + speakOutput );
            // const main = content.ibus[0];
            // const main = content.ibus;
            // const timeLeft = main["t-in-min"];
            // speakOutput = `Los datos de viaje son ${content.ibus[0]} `;
            // console.log(timeLeft);
            
          })
          .catch((err) => {
            speakOutput = err.message;
          });
    
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .reprompt(requestAttributes.t('OFFER_TO_SET_ALARM_MSG'))
          .getResponse();
        } 
    
};

const TimerIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TimerIntent';
    },
    async handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = handlerInput.requestEnvelope.request;
        const timerSetByUser = intent.slots.minute.value;//retrieve value chosen time from interface
        console.log ("CHOSEN TIME IS " + timerSetByUser);
        var speakOutput;
    

    const { permissions } = handlerInput.requestEnvelope.context.System.user;
    if (!(permissions && permissions.consentToken)) {
      const speechOutput = requestAttributes.t('MISSING_PERMISSION_REMINDERS_MSG');
      return handlerInput.responseBuilder
               .speak(speechOutput)
               .withAskForPermissionsConsentCard(constants.TIMERS_PERMISSION)
               .getResponse();
    }

    const duration = Alexa.getSlotValue(handlerInput.requestEnvelope, timerSetByUser);
    console.log ("CHOSEN DURATION IS " + duration);

    const timer = logic.createTimer(timerSetByUser, "TEMPORIZADOR MENSAJE DE PRUEBA");
    console.log("CONST TIMER IS EQUAL TO " + JSON.stringify(timer));

    try {
        const timerServiceClient = handlerInput.serviceClientFactory.getTimerManagementServiceClient();
        const timersList = await timerServiceClient.getTimers();
        console.log('TIMERLIST ' + JSON.stringify(timersList));
      
        // delete previous timer if present
        if(sessionAttributes['timerId']){
            await timerServiceClient.deleteTimer(sessionAttributes['timerId']);
            delete sessionAttributes['timerId'];
        }
      
        const timerResponse = await timerServiceClient.createTimer(timer);
        console.log('Resultado de la creación del temporizador: ' + JSON.stringify(timerResponse));
        
        const timerId = timerResponse.alertToken;
        const timerStatus = timerResponse.status;
        
        if (timerStatus === 'ON') {
            const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
            sessionAttributes['timerId'] = timerId;
            return handlerInput.responseBuilder
                .speak(requestAttributes.t('TIMER_CREATED_MSG'))
                .reprompt(requestAttributes.t('HELP_GENERAL_MSG'))
                .getResponse();
        } else {
            throw { statusCode: 308, message: 'Timer has NOT been set up.' };
        }
        } catch (error) {
        console.log('Error de creación del temporizador:' + JSON.stringify(error));
        
        return handlerInput.responseBuilder
          .speak(requestAttributes.t('TIMER_ERROR_MSG'))
          .reprompt(requestAttributes.t('HELP_GENERAL_MSG'))
          .getResponse();
    }
  }
};


// const TimerIntentHandler = {
//     canHandle(handlerInput) {
//         return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
//             && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TimerIntent';
//     },
//     async handle(handlerInput) {
//         const {attributesManager} = handlerInput;
//         const requestAttributes = attributesManager.getRequestAttributes();
//         const sessionAttributes = attributesManager.getSessionAttributes();
//         const {intent} = handlerInput.requestEnvelope.request;
//         const timerSetByUser = intent.slots.minute.value;//retrieve value chosen time from interface
//         console.log ("CHOSEN TIME IS " + timerSetByUser);
//         var speakOutput;
    
        
//         // Creating timer via the AmazonTimers API
//         try {
//             const {permissions} = handlerInput.requestEnvelope.context.System.user; //check for permission token
//                 if(!permissions)
//                     throw { statusCode: 401, message: 'No permissions available' };
//                 // const timerServiceClient = handlerInput.serviceClientFactory.getTimerManagementServiceClient();
//                 const timerServiceClient = handlerInput.serviceClientFactory.getTimerManagementServiceClient();
                
//                 const timersList = await timerServiceClient.getTimers();
//                 console.log(JSON.stringify(timersList));
//                 const totalCount = timersList.totalCount;
                
//                 // delete previous timer if present
//                 if(sessionAttributes['timerId']){
//                     await timerServiceClient.deleteTimer(sessionAttributes['timerId']);
//                     delete sessionAttributes['timerId'];
//                 }
            
//                 // create timer structure
//                 const timer = logic.createTimer(timerSetByUser, "TEMPORIZADOR MENSAJE DE PRUEBA");
//                 console.log("CONST TIMER IS EQUAL TO " + JSON.stringify(timer));
//                 const timerResponse = await timerServiceClient.createTimer(timer); // the response will include an "alertToken" which you can use to refer to this timer
//                 console.log('TIMER RESPONSE CHECK  ' + JSON.stringify(timerResponse));
//                 // save timer id in session attributes
//                 sessionAttributes['timerId'] = timerResponse.alertToken;

//                 speakOutput = requestAttributes.t('TIMER_CREATED_MSG') + requestAttributes.t('HELP_MSG');

//             }catch (error) {
//                 console.log(JSON.stringify(error));
//                 switch (error.statusCode) {
//                     case 401: // the user has to enable the permissions for timers, let's attach a permissions card to the response
//                         handlerInput.responseBuilder.withAskForPermissionsConsentCard(constants.TIMERS_PERMISSION);
//                         speakOutput = requestAttributes.t('MISSING_PERMISSION_MSG') + requestAttributes.t('HELP_GENERAL_MSG');
//                         break;
//                     case 403: // devices such as the simulator do not support reminder management
//                         speakOutput = requestAttributes.t('UNSUPPORTED_DEVICE_MSG') + requestAttributes.t('HELP_GENERAL_MSG');
//                         break;
//                     default:
//                         speakOutput = requestAttributes.t('TIMER_ERROR_MSG') + requestAttributes.t('HELP_GENERAL_MSG');
//                 }
//             }        
        
//         return handlerInput.responseBuilder
//             .speak(speakOutput)
//             .reprompt(requestAttributes.t('HELP_GENERAL_MSG'))
//             .getResponse();
            
//     }
// };



const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('HELP_GENERAL_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('GOODBYE_MSG');
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = requestAttributes.t('REFLECTOR_MSG', intentName);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const speechText = requestAttributes.t('ERROR_MSG');
        
        console.log(`~~~~ Error handled: ${error.stack}`);
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};


// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        RegisterBasicRouteIntentHandler,
        RegisterAdditionalRouteIntentHandler,
        ConsultTimeIntentHandler,
        TimerIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler// make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler
    )
    .addRequestInterceptors(
        interceptors.LocalizationRequestInterceptor, 
        interceptors.LogginRequestInterceptor,
        interceptors.LoadAttributesRequestInterceptor
    )
    .addResponseInterceptors(
        interceptors.LogginResponseInterceptor,
        interceptors.SaveAttributesResponseInterceptor
    )
    .withPersistenceAdapter(persistence.getPersistenceAdapter())
    .withApiClient(new Alexa.DefaultApiClient())
    .lambda();
