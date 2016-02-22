# INFO VIZ DATA DESCRIPTION #

Measures:
(Y impact)
	- energy_performance_index
	- energy_label
	- energy_m2
	- energy_mj
(X indicators)
	- electricity_kwh
	- gas_m3
	- heat_gj
	- co2_kg

Datasets:
- energylabel_amsterdam
	description: for each (postcode, house_number) in amsterdam municipality, energy consumption/related metrics and energy label
	source: 
	year: 2012
	limitations: 
- liander_amsterdam
	description: for each (street, postcode) in amsterdam area, info over liander meter
	source: liander company
	year: 2009 - 2016
	limitations: only liander customers(?), only liander specific data(?)