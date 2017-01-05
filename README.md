# uva_infoviz_2016
Project for Information Visualization Course, at University van Amsterdam  

Navigate to [knanne.github.io/uva_infoviz_2016](https://knanne.github.io/uva_infoviz_2016) to view the finished product  

##Description
Research has shown that there are discrepancies between the expected theoretical and actual energy consompution of households in the Netherlands. This project is a demonstration of analysis methods that can be used to explore these discrepencies. All buildings in the Netherlands are given an energy label that is used to identify efficiency. The discrepencies observed are also effected by assigned energy label.  

Specifically, data from the municipality of Amsterdam is used to find certain indicators that may be influencing this discrepancy in energy consumption. A simple linear regression was employed to predict an energy consumption value using the data available. This prediction is calculated on the average values for each neighborhood grouping (buurtcombinatie) in Amsterdam.  

###D3 Triple Bar Chart
The Bar Chart emphasizes the discrepency between actual and theoretical values for energy consumption for each energy label. The predicted value calculated is shown averaged across each neighborhood group for that energy label.  

###D3 Dynamic Scatterplot
The Scatterplot visualizes the dependency of each variable on actual energy consumption. Each dot represents the average of buildings within an energy label, for each neighborhood group in Amsterdam. Select a different variable to visualize it on the graph.  

###D3 Dynamic Google Map Choropleth
The Map shows neighborhood groups (buurtcombinatie) colored by the average building value, selected from the dropdown.  