'use strict';

var com = com || {}

if (typeof com.rb === "undefined") {
    com.rb = {}
}

if (typeof com.rb.kafka === "undefined") {
    com.rb.kafka = {}
}

com.rb.kafka.Consumer = (function () {
    var config = require('config'),
        kafka = require('kafka-node'),
        KeyedPartitioner = kafka.KeyedPartitioner,
        HighLevelProducer = kafka.HighLevelProducer,
        KeyedMessage = kafka.KeyedMessage,
        client = new kafka.Client(config.get('client.connectionString'), config.get('client.clientId')),
        highLevelProducer = new HighLevelProducer(client, config.get('producer')),
        keyedPartitioner = new KeyedPartitioner();

    highLevelProducer.on('ready', function () {
        console.log('KAFKA HighLevelProducer FINALLY READY TO ROCK AND ROLL !!! ')
    });

    highLevelProducer.on('error', function (err) {
        console.error('error -> ' + err)
        process.exit()
    })

    var payloads = [];
    var count = 0;

    function send(beeMessage) {
        var ProduceRequest = produceRequest(beeMessage)
        payloads.push(ProduceRequest)

        // if producer is not ready yet wait for 5 seconds
        if (!highLevelProducer['ready']) {
            setTimeout(function () {
                console.log('Waiting for KAFKA HighLevelProducer to get ready...')
            }, 5000);
        } else {
            highLevelProducer.send(payloads, function (err, data) {
                if (err) {
                    console.error('error pushing messages to broker - ' + err)
                    process.exit()
                }
                else {
                    console.log(++count + ' messages sent to broker. ' + JSON.stringify(data));
                    payloads.splice(0, payloads.length) // empty payload
                }
            });
        }
    }

    function produceRequest(beeMessage) {
        var topic = {'topic': config.get('topic.name'), 'attributes': config.get('topic.attributes')}

        // fetch IMEI from beeMessage.payload
        var beeMessagePayload = beeMessage.payload
        var IMEI;
        if (beeMessagePayload) {
            var tokens = beeMessagePayload.split(',')
            if (tokens && tokens.length >= 2) {
                IMEI = tokens[2];
            }
        }

        // find and set the partition
        var partition = keyedPartitioner.getPartition([0, 1, 2], IMEI)
        topic['partition'] = partition

        // set the message key to IMEI
        topic['key'] = IMEI

        // create the KeyedMessage
        var keyedMessage = new KeyedMessage(IMEI, beeMessage)
        topic['messages'] = [keyedMessage]

        return topic
    }

    return {
        send: send
    }
})();

module.exports = com.rb.kafka.Consumer