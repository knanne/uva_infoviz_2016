!(function (d3) {

  $("d3barchart").empty();    

      var margin = {top: 50, right: 50, bottom: 50, left: 50},
      width = 600 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

      var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
      var energy_labels = ["A", "B", "C", "D", "E", "F", "G"];

      var y = d3.scale.linear().range([height, 0]);
      var y_cols = ["actual", "theoretical", "predicted"];

      var legendcolor = ["#636000", "#636000", "#636000"];

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .ticks(10)
          .orient("left");

      var color = d3.scale.ordinal()
          .range(["#1B5E20","#43A047","#8BC34A","#FFC107","#FF9800","#E53935","#B71C1C"])
          .domain(energy_labels);

      var svg = d3.select("d3barchart").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) { return "Energy Label: <strong>"+d.key+"</strong>"+"<br>"
                            +"<i>actual: "+d.actual+"</i><br>"
                            +"<i>theoretical: "+d.theoretical+"</i><br>"
                            +"<i>predicted: "+d.predicted+"</i>"; });

      svg.call(tip);

      d3.tsv("data/data_final.tsv", function(error, data) {

        if (error) return console.log("there was an error loading the data: " + error);
        
        //console.log("BARCHART: " + data.length + " data records");
        //console.log(data);

        //group data
        var data = d3.nest()
          .key(function(d) { return d.energy_label;})
          .sortKeys(d3.ascending)
          .rollup(function(d) { return {"avg_energy_consumption_m2": d3.mean(d, function(d) {return +d.avg_energy_consumption_m2;}), 
                                        "predicted": d3.mean(d, function(d) {return +d.predicted;}),
                                        "theoretical": d3.mean(d, function(d) {return +d.theoretical;}) 
                                      }})
          .entries(data);

        data.forEach(function(d) {
          d.actual = Math.round(+d.values.avg_energy_consumption_m2*100)/100;
          d.predicted = Math.round(+d.values.predicted*100)/100;
          d.theoretical = Math.round(+d.values.theoretical*100)/100;
        });

        //console.log("BARCHART SUCCESS");
        //console.log(data);

        x.domain(energy_labels);
        y.domain([0, 4000]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(0,0)")
          .call(yAxis);

        bars = svg.selectAll(".bar").data(data).enter();

        bars.append("rect")
            .attr("class", "bar1")
            .attr("x", function(d) { return x(d.key); })
            .attr("width", (x.rangeBand() / 3) - 4)
            .attr("y", function(d) { return y(d.actual); })
            .attr("height", function(d) { return height - y(d.actual); })
            .style("fill", function(d) { return color(d.key); })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        bars.append("rect")
            .attr("class", "bar2")
            .attr("x", function(d) { return x(d.key) + (x.rangeBand() / 3); })
            .attr("width", (x.rangeBand() / 3) - 4)
            .attr("y", function(d) { return y(d.theoretical); })
            .attr("height", function(d) { return height - y(d.theoretical); })
            .style("fill", function(d) { return color(d.key); })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        bars.append("rect")
            .attr("class", "bar3")
            .attr("x", function(d) { return x(d.key) + 2 * (x.rangeBand() / 3); })
            .attr("width", (x.rangeBand() / 3) - 4)
            .attr("y", function(d) { return y(d.predicted); })
            .attr("height", function(d) { return height - y(d.predicted); })
            .style("fill", function(d) { return color(d.key); })
            .style("stroke", "#000000")
            .style("stroke-width", "1.5")
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        var legend = svg.selectAll(".legend")
            .data(y_cols)
          .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", 20)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", "black")
            .style("opacity", function(d,i) { if(i===0){return 0.3} else if(i===1){return 0.6} else return .9;});

        legend.append("text")
            .attr("x", 40)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .text(function(d) { return d; });
      });

})(d3);