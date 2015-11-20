require([
  "esri/arcgis/utils",
  "esri/layers/FeatureLayer",
  "esri/tasks/query",
  "dojo/domReady!"
], function(
  arcgisUtils,
  FeatureLayer,
  Query
) {

  arcgisUtils.createMap("562b80fbbdd745d4a59ff1a86092d5fb", "map").then(function(response) {

    // The map we are using
    var map = response.map;

    // Get the layer of the places
    var placesLayerID = map.graphicsLayerIds[0];
    var placesLayer = map.getLayer(placesLayerID);

    // Select all items
    var query = new Query();
    query.where = "1=1"; // Return everything

    // Iterate over all the places we have to build the left panel content
    placesLayer.queryFeatures(query, function(featureSet) {

      // This is the DOM element containing the list of the places
      var list = document.getElementById("places-list");
      list.innerHTML = '';

      // For each feature of the layer, we need to add a list element
      featureSet.features.forEach(function(feature) {

        // The name of the feature, e.g. Lisbon
        var name = feature.attributes.PLACENAME;

        // Create an HTML list element
        var listElement = document.createElement("li");
        listElement.innerHTML = name;
        listElement.setAttribute("data-name", name);

        // Add the click event, when the user clicks, the popup should appear
        listElement.addEventListener("click", function(event) {

          var clickedPlace = event.target.getAttribute("data-name");

          // Query to select the feature on the Feature Layer
          var queryClicked = new Query();
          queryClicked.where = "PLACENAME='" + clickedPlace + "'";

          // Select the feature the user clicked on the Layer
          placesLayer.selectFeatures(queryClicked, FeatureLayer.SELECTION_NEW, function(f) {

            // Set the popup window on the selected feature
            map.infoWindow.setFeatures(f);
            map.infoWindow.show(f[0].geometry);
            map.centerAt(f[0].geometry);
          });

        });

        // Append the list element to the list in the left panel
        list.appendChild(listElement);

      });

    });

  });

});