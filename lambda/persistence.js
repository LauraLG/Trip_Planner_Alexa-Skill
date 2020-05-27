module.exports = {
    getPersistenceAdapter(){
        // This function is an indirect way to detect if this is part of an Alexa-Hosted skill
        function isAlexaHosted(){
            return process.env.S3_PERSISTENCE_BUCKET ? true : false;
        }
        const tableName = 'trip_planner_table';
        
        if(isAlexaHosted()){
            const {S3PersistenceAdapter} = require('ask-sdk-s3-persistence-adapter');
            return new S3PersistenceAdapter({
                bucketName: process.env.S3_PERSISTENCE_BUCKET
            });
        } else {
            const {DynamoDbPersistenceAdapter} = require('ask-sdk-dynamodb-persistence-adapter');
            
            return new DynamoDbPersistenceAdapter({
                tableName: tableName,
                createTable: true
            });
        }
    }
}