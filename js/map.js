!(function (d3) {

  $("map").empty();

        var color = d3.scale.linear()
            .domain([200, 1000, 1300])
            .range(["#4CAF50", "#FFC107", "#FF3D00"]);

        // Create the Google Map…
        var map = new google.maps.Map(d3.select("#map").node(), {
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: new google.maps.LatLng(52.35, 4.9), //hardcode amsterdam center
            styles:[{"stylers": [{"lightness": 25}]}]
        });
         
        // Load the  data. When the data comes back, create an overlay.
        queue()
            .defer(d3.json, "data/data_map_final.geojson")
            .await(ready);

        function ready(error, build) {
            
            //build_data = topojson.feature(build, build.objects.bouwjaar);
            build_data = build;

            overlay = new google.maps.OverlayView();

            overlay.onAdd = function() {
                
                layer = d3.select(overlay.getPanes().overlayLayer).append("div").attr("class", "layer");
                    
                svg = layer.append("svg");

                g = svg.append("g").attr("class", "polygon");

                overlay.draw = redraw;
                
            };

            function redraw() {
               
                //Get current google map projection
                projection = overlay.getProjection();

                //Translate Google to D3
                path = d3.geo.path().projection(googleMapProjection);

                g.selectAll("path")
                    .data(build_data.features)
                    .attr("d", path)
                    .enter()
                        .append("svg:path")
                        .attr("d", path)
                        .style("fill", function(d) { return color(+d.properties.predicted);})
                        .style("stroke", "#000000");
                
            };

            // Turn the overlay projection into a d3 projection
            var googleMapProjection = function (coordinates) {
                var googleCoordinates = new google.maps.LatLng(coordinates[1], coordinates[0]);
                var pixelCoordinates = projection.fromLatLngToDivPixel(googleCoordinates);
                return [pixelCoordinates.x + 4000, pixelCoordinates.y + 4000];
        };

        overlay.setMap(map);

    };

})(d3);