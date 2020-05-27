// const ALARM_SOUND = `<audio src="soundbank://soundlibrary/scifi/amzn_sfx_scifi_sonar_ping_3x_01"/>`;


//GENERALIZE MESSAGE VARIABLES SPLITTING THEM BY LANGUAGES
// Language strings object containing all of our strings.
// The keys for each string will then be referenced in our code as requestAttributes.t('WELCOME_MSG')
module.exports = {
    es:{
        translation:{
            //BASICS
            WELCOME_MSG: '¡Bienvenido! ¿Quieres registrar tu ruta habitual? o ¿consultar los datos registrados?',
            REGISTER_BASIC_MSG: 'Los datos registrados de tu ruta habitual son los siguientes: habitualmente estás cogiendo el autobús %s para ida y vuelta entre %s y %s',
            MISSING_MSG: 'Parece que aun no has registrado ningún dato. Prueba decir, registra ruta habitual',
            OVERWRITE_MSG: 'Si quieres cambiar los datos registrados, solo di, registra ruta habitual',
            HELP_GENERAL_MSG: 'Con este skill, puedes registrar tus sitios, consultar el tiempo que falta para que pase el bus por tu parada o programar una alarma que te avise de la llegada del transporte. Si quieres salir de skill, di, stop. ¿Qué prefieres hacer?',
            GOODBYE_MSG: '¡Hasta luego!',
            REFLECTOR_MSG: 'Acabas de activar %s',
            FALLBACK_MSG: 'Lo siento, no sé nada sobre esto. Por favor inténtalo otra vez',
            ERROR_MSG: 'Lo siento, ha habido un problema. Por favor inténtalo otra vez',
            NO_TIMEZONE_MSG: 'No he podido determinar tu zona horaria. Verifíca la configuración de tu dispositivo e inténtalo otra vez.',
            CONJUNCTION_MSG: ' y ',
            REJECTED_MSG: 'Vale, entonces, cancelamos este registro. Si quieres registrar los datos de una vez, di, registra mi ruta. ',
            //RELATED TO TIME MANAGEMENT AND ALARMS
            PROGRESSIVE_MSG: '',
            TIME_LEFT_MSG: 'Hasta que llege el autobús %s , quedan %s minutos y %s segundos.',
            OFFER_TO_SET_ALARM_MSG:'Si quieres, puedo establecer un temporizador. Para esto dime, con que anteriodad quieres que te aviso.',
            AFTER_PERMISSON_OFFER_TO_SET_TIMER_MSG:'Perfecto, ahora dime con que anteriodad quieres que te aviso.',
            TIMER_CREATED_MSG: 'El temporizador se ha creado con éxito. ',
            TIMER_ERROR_MSG: 'Ha habido un error al crear el temporizador. ',
            UNSUPPORTED_DEVICE_MSG: 'Este dispositivo no soporta la operación que estás intentando realizar. ',
            ALARM_SOUND:`<audio src="soundbank://soundlibrary/scifi/amzn_sfx_scifi_sonar_ping_3x_01"/>`,
            SECONDS_LEFT_MSG: 'Quedan %s segundos para la llegada de autobús %s a la parada %s',
            MINUTES_LEFT_MSG: 'Quedan %s minutos para la llegada de autobús %s a la parada %s',
            NEED_TO_LEAVE_HOME_MSG: 'Te recomiendo salir de casa dentro de un 1 minuto',
            
            
            //PERMISSIONS
            MISSING_PERMISSION_REMINDERS_MSG: 'Parece que no has autorizado el envío de recordatorios. Te he enviado una notificación a la app Alexa para que lo habilites. ',
            MISSING_PERMISSION_TIMERS_MSG: 'Parece que no has autorizado el envío de temporizador. Te he enviado una notificación a la app Alexa para que lo habilites. ',

            
        }
    },
    
    en: {
        translation: {
            
        }
    }

}