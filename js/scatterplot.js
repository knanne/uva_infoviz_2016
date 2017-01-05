!(function (d3) {

    var option = $("#regress").val();
    var option_text = $("#regress option:selected").text();

        var margin = {top: 50, right: 50, bottom: 50, left: 50},
            width = 600 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        var x = d3.scale.linear().range([0, width]);
            
        var y = d3.scale.linear().range([height, 0]);

        var xAxis = d3.svg.axis().scale(x).orient("bottom");
        var yAxis = d3.svg.axis().scale(y).orient("left");

        var energy_labels = ["A", "B", "C", "D", "E", "F", "G"];

        var color = d3.scale.ordinal()
          .range(["#1B5E20","#43A047","#8BC34A","#FFC107","#FF9800","#E53935","#B71C1C"])
          .domain(energy_labels);

  function draw_scatter(option, option_text) {

    $("d3scatterplot").empty();

    //console.log("SCATTER SELECTION: " + option_text + " ("+option+")");

        var svg = d3.select("d3scatterplot").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) { return "Neighborhood Group: <strong>"+d.neighborhood_group+"</strong>"+"<br>"
                              +"Energy Label: <strong>"+d.energy_label+"</strong>"+"<br>"
                              +"<i>"+option+": "+d[option]+"</i><br>"
                              +"<i>actual: "+d.actual+"</i>"; });

        svg.call(tip);

        d3.tsv("data/data_final.tsv", function(error, data) {

          if (error) return console.log("there was an error loading the data: " + error);
          //console.log("SCATTERPLOT: " + data.length + " data records");
          //console.log(data);

          data.forEach(function(d) {
            d.actual = Math.round(+d.avg_energy_consumption_m2*100)/100;
            d.predicted = Math.round(+d.predicted*100)/100;
            d.avg_building_year = Math.round(+d.avg_building_year*100)/100;
            d.avg_square_meters = Math.round(+d.avg_square_meters*100)/100;
            d.avg_home_occupancy = Math.round(+d.avg_home_occupancy*100)/100;
            d.avg_home_size_rooms = Math.round(+d.avg_home_size_rooms*100)/100;
            d.average_property_value = Math.round(+d.average_property_value*100)/100;
            d.avg_length_residence_years = Math.round(+d.avg_length_residence_years*100)/100;
            d.avg_disp_income_ink = Math.round(+d.avg_disp_income_ink*100)/100;
          });

          //console.log("SCATTERPLOT SUCCESS");
          //console.log(data);

          x.domain([0, d3.max(data, function(d) { return d.actual; })]);
          y.domain([0, d3.max(data, function(d) { return d[option]; })]);
          //alternative axis method
          //x.domain(d3.extent(data, function(d) { return d[option]; })).nice();
          //y.domain(d3.extent(data, function(d) { return d.actual; })).nice();
              
          svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Actual Energy Consumption (m2)");

          svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(option_text);

          svg.selectAll(".dot")
              .data(data)
              .enter().append("circle")
              .attr("class", "dot")
              .attr("r", 3)
              .attr("cx", function(d) { return x(d.actual); })
              .attr("cy", function(d) { return y(d[option]); })
              .style("fill", function(d) { return color(d.energy_label); })
              .on('mouseover', tip.show)
              .on('mouseout', tip.hide);

          var legend = svg.selectAll(".legend")
              .data(energy_labels)
              .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

          legend.append("rect")
              .attr("x", 20)
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", function(d,i) { return color(i);});

          legend.append("text")
              .attr("x", 40)
              .attr("y", 9)
               .attr("dy", ".35em")
               .style("text-anchor", "start")
               .text(function(d) { return d;})
            
        });

    };

    draw_scatter(option, option_text);

    d3.select("#regress")
      .on("change", function() {
        
        var option = $("#regress").val();
        var option_text = $("#regress option:selected").text();

        draw_scatter(option, option_text);
      });

})(d3);