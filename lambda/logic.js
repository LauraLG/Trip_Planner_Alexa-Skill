const axios = require('axios');
const constants = require('./constants');

module.exports = {
    //Departure from Home
    fetchTimeHomeDeparture(api_url){
        // const endpoint = 'https://api.tmb.cat/v1/ibus/lines/';
        // // const busNumber = "";
        // // const stopNumber = ""; 
        // // const api_url = endpoint + busNumber +"/"+ "stops/" + stopNumber+"/"+"?app_id=4c132798&app_key=a828910cef5a0376607986191db19d14";

        // const api_url = endpoint + {busHomeWorkId} +"/"+ "stops/" + {homeStopId} +"/"+"?app_id=" + app_id +"&app_key=" + app_key;
        console.log("Consulting external JSON" +  api_url);
        

        return new Promise((resolve, reject) => {
            const client = api_url.startsWith('https') ? require('https') : require('http');
            const request = client.get(api_url, (response) => {
              if (response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error('Failed with status code: ' + response.statusCode));
              }
              const body = [];
              response.on('data', (chunk) => body.push(chunk));
              response.on('end', () => resolve(body.join('')));
            });
            request.on('error', (err) => reject(err))
          })
    },
    
    
    getRemoteData(url) {
      return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? require('https') : require('http');
        const request = client.get(url, (response) => {
          if (response.statusCode < 200 || response.statusCode > 299) {
            reject(new Error('Failed with status code: ' + response.statusCode));
          }
          const body = [];
          response.on('data', (chunk) => body.push(chunk));
          response.on('end', () => resolve(body.join('')));
        });
        request.on('error', (err) => reject(err))
      })
    },
    
    // Departure from Work
    fetchTimeWorkDeparture(busHomeWorkId, workStopId){
        //sumar 1 para la contra direccion
        const endpoint = 'https://api.tmb.cat/v1/ibus/lines/';
        const busNumber = busHomeWorkId + 1;
        const api_url = endpoint + busNumber +"/"+ "stops/" + {workStopId} +"/"+"?app_id=" + constants.APP_ID +"&app_key=" + constants.APP_KEY;
        console.log("Consulting external JSON" +  api_url);
        
        async function getJsonReponse(){
            const response = await axios(api_url);
            const tmb = await response.json();
            const { status, data } = tmb;   
            const main = data.ibus[0];
            const timeLeft = main["t-in-min"];
            console.log("quedan " + timeLeft + " segundos/minutos");
        }
        
    },
    
    getDataFromApi(content){
        
    },
    
    createTimer(periodBeforeArrival, message){
        console.log("TIMER SSCELETON HAS BEEN GENERATED");

        return {
          duration: periodBeforeArrival,
          label: 'trip_planner',
          creationBehavior: {
            displayExperience: {
              visibility: 'VISIBLE'
            }
          },
          triggeringBehavior: {
            operation: {
              type : 'ANNOUNCE',
              textToAnnounce: [{
                locale: 'es-ES',
                text: message
              }]
            },
            notificationConfig: {
              playAudible: true
            }
          }
        };
    }


    
}