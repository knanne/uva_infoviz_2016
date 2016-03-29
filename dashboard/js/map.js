!(function (d3) {

    var option = $("#color_map").val();
    var option_text = $("#color_map option:selected").text();

        var color = d3.scale.linear()
            .range(["#4CAF50", "#FFC107", "#FF3D00"]);

    function draw_map(option, option_text) {

        $("#map_legend").empty();
        $("map").empty();

        console.log("MAP SELECTION: " + option_text + " ("+option+")");

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

            //make array of option property
            var optionArray = new Array;
            for(var o in build_data.features) {
                optionArray.push(+build_data.features[o].properties[option]);
            }

            //scale color to option
            var colormin = Math.min.apply(null, optionArray)
                colormax = Math.max.apply(null, optionArray);
            
            color.domain([colormin, colormin+((colormax-colormin)/2), colormax]);

            console.log(color.domain())

            var legend = d3.select("#map_legend").append("svg")
                .attr("width", 60 + (100*color.domain().length))
                .attr("height", 50);

            legend = legend.selectAll(".legend")
              .data(color.domain())
              .enter()
              .append("g")
              .attr("class", "legend");
              //.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            legend.append("rect")
              .attr("x", function(d,i) { return 50 + (100*i); })
              .attr("width", 20)
              .attr("height", 20)
              .style("fill", function(d) { return color(d); });

            legend.append("text")
              .attr("x", function(d,i) { return 75 + (100*i); })
              .attr("y", 15)
              .text(function(d,i) {return Math.round(color.domain()[i]); });

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
                        .style("fill", function(d) { return color(+d.properties[option]);})
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

    };

    draw_map(option, option_text);

    d3.select("#color_map")
      .on("change", function() {
        
        var option = $("#color_map").val();
        var option_text = $("#color_map option:selected").text();

        draw_map(option, option_text);
      });



})(d3);