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
        HighLevelConsumer = kafka.HighLevelConsumer,
        client = new kafka.Client(config.get('client.connectionString'), config.get('client.clientId'));

    var consumers = [];

    function start() {
        // for 3 Brokers, each with 3 partitions, create 9 consumers. One for each partition
        var consumerOptions = config.get('consumer');
        for (var i = 1; i <= 9; i++) {
            consumerOptions['id'] = 'Consumer' + i;
            var highLevelConsumer = new HighLevelConsumer(client, [{'topic': config.get('topic.name')}], consumerOptions);
            consumers.push(highLevelConsumer);
        }

        var consumersCbs = [];

        for (var i in consumers) {
            var consumer = consumers[i];

            if (consumer) {
                consumersCbs[i] = (function (consumer) {
                    return function () {
                        consumer.on('message', function (message) {
                            console.log(consumer['id'] + ' received message -> ' + JSON.stringify(message));
                        });

                        consumer.on('error', function (err) {
                            console.error('Error while ' + consumer['id'] + ' consuming message -> ', err);
                            consumer.close(true, function () {
                                process.exit();
                            })
                        });
                    };
                }(consumer));
            }
        }

        for (var cnt = 0; cnt < consumersCbs.length; cnt++) {
            consumersCbs[cnt]();
        }
    }

    return {
        start: start
    }
})();

module.exports = com.rb.kafka.Consumer