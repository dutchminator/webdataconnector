// Nameless function inside an immediately executed local scope
(function() {
    // tableau object is defined in global Tableauwdc source
    var myConnector = tableau.makeConnector();

    // Define the schema for the to-be-received data.
    // How do we map the received data to one or more tables?
    myConnector.getSchema = function(schemaCallback) {
        tableau.log("Hello, World, this is getSchema() speaking.")
            // cols contains an array of JS objects, each object defines a single column in our table.
            // See http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.columninfo for info on column parameters.
        var cols = [{
            id: "mag",
            alias: "magnitude",
            dataType: tableau.dataTypeEnum.float,
            description: "Sebas. 'mag' column"
        }, {
            id: "title",
            alias: "title",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "url",
            alias: "url",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "lat",
            alias: "latitude",
            columnRole: "dimension",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "lon",
            alias: "longitude",
            columnRole: "dimension",
            dataType: tableau.dataTypeEnum.float
        }];

        // tableInfo object defines the schema for a single table.
        // columns parameter is set to the 'cols' variable from above.
        var tableInfo = {
            id: "earthquakeFeed",
            alias: "Earthquakes with magnitude greater than 4.5 in the last seven days",
            columns: cols
        };

        // Send an array of table definition objects.
        schemaCallback([tableInfo]);
    };


    myConnector.getData = function(table, doneCallback) {
        tableau.log("Hello, World, this is getData() speaking.")

        $.getJSON("http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson", function(resp) {
            var feat = resp.features,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "id": feat[i].id,
                    "mag": feat[i].properties.mag,
                    "title": feat[i].properties.title,
                    "lon": feat[i].geometry.coordinates[0],
                    "lat": feat[i].geometry.coordinates[1]
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    // Validate the connector object before initialization
    tableau.registerConnector(myConnector);

    // Initialization code without requiring user input or interface.
    // Submit the connection after connector object has initialized
    myConnector.init = function(initCallback) {
        initCallback();
        tableau.connectionName = "Sebas tutorial auto-submit";
        tableau.submit();
    };

    // Event listener voor de klik op de submitButton in frontend
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Sebas tutorial manual submit";
            tableau.submit();
        });
    });
})();
