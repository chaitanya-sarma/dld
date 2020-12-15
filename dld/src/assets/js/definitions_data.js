const definitions_data = [
  {
    "Abbreviation": "GCA",
    "ItemDescription": "Gross Cropped Area is the total cropped area",
    "Units": "000 ha"
  },
  {
    "Abbreviation": "NCA",
    "ItemDescription": "Net Cropped Area is the net sown area",
    "Units": "000 ha"
  },
  {
    "Abbreviation": "GDP",
    "ItemDescription": "Gross Domestic Product",
    "Units": "Million Rupees"
  },
  {
    "Abbreviation": "Primary Sector GDP",
    "ItemDescription": "GDP from Agriculture & Allied Sector",
    "Units": "Million Rupees"
  },
  {
    "Abbreviation": "Secondary Sector",
    "ItemDescription": "GDP from industry and manufacturing sector",
    "Units": "Million Rupees"
  },
  {
    "Abbreviation": "Tertiary Sector",
    "ItemDescription": "GDP from services sector",
    "Units": "Million Rupees"
  },
  {
    "Abbreviation": "PPMRKT",
    "ItemDescription": "Number of principal markets (Regulated markets with market Committee office)",
    "Units": "No’s"
  },
  {
    "Abbreviation": "PSMRKT",
    "ItemDescription": "Number of sub markets (with out a market Committee office)",
    "Units": "No’s"
  },
  {
    "Abbreviation": "FEM_SAW",
    "ItemDescription": "State Female Wage rate",
    "Units": "Rupees"
  },
  {
    "Abbreviation": "MALE_SAW",
    "ItemDescription": "State Male Wage rate",
    "Units": "Rupees"
  },
  {
    "Abbreviation": "Soil Type",
    "ItemDescription": "Dominant soil types in the district (could be more than one type)",
    "Units": ""
  },
  {
    "Abbreviation": "LGP",
    "ItemDescription": "Length of Growing Period",
    "Units": "Days"
  },
  {
    "Abbreviation": "Ppt",
    "ItemDescription": "Condensation of atmospheric water vapour that falls under gravity(rainfall)",
    "Units": "Celsius"
  },
  {
    "Abbreviation": "Tmin",
    "ItemDescription": "The lowest temperature attained at a specific location during a specified period",
    "Units": "Centigrade"
  },
  {
    "Abbreviation": "Tmax",
    "ItemDescription": "The highest temperature reported for a given location during a specified period",
    "Units": "Centigrade"
  },
  {
    "Abbreviation": "Q",
    "ItemDescription": "When rain or snow falls onto the earth, it starts moving along the slopes. A portion of it seeps into the soil and to replenish Earth's groundwater. Most of it flows downhill as runoff when rainfall intensity is more than the seepage or infiltration",
    "Units": "mm"
  },
  {
    "Abbreviation": "Pet",
    "ItemDescription": "Potential Evapotranspiration is the amount of water evaporated (both as transpiration and evaporation from the soil) from an area of continuous, uniform vegetation that covers the whole ground and that is well supplied with water",
    "Units": "mm"
  },
  {
    "Abbreviation": "Aet",
    "ItemDescription": "Actual Evapotranspiration is the actual amount of water lost to evapotranspiration from the soil– plant continuum by an actively growing plant or crop. Water loss through evapotranspiration depends upon plant and soil characteristics, and upon the amount of available water in the soil",
    "Units": "mm"
  },
  {
    "Abbreviation": "Def",
    "ItemDescription": "Climate Water deficit the cumulative difference between the potential evapotranspiration and precipitation during a specified period in which the precipitation is the smaller of the two",
    "Units": "mm"
  },
  {
    "Abbreviation": "Ws",
    "ItemDescription": "Wind Speed is the rate at which air is moving horizontally past a given point",
    "Units": "ms-1"
  },
  {
    "Abbreviation": "Formation of new states",
    "ItemDescription": "Since 1966 four new states were created (Uttarakhand, jharkhand, Chattisgarh and Telangana). Districts belonging to these states are shown under the new state name since the year of their formation",
    "Units": ""
  },
  {
    "Abbreviation": "Apportioned database",
    "ItemDescription": "The data base is divided into two sets. apportioned and unapportioned. Apportioned data set Includes all districts in 20 states formed on or before 1966 . Data of all the districts formed after 1966 is given back to respective parent districts from which they were formed and removed from the file. Apportioned data files not available for some files like season wise APY, APY under horticulture crops, environment data, nutrition data, credit data, warehouse and cold storage data and data on night lights. For more details on this and number of districts in the 1966 database please refer to the detailed data documentation file for apportioned data",
    "Units": ""
  },
  {
    "Abbreviation": "Unapportioned database",
    "ItemDescription": "Includes all districts in 20 states as on 2015-16. Unapportioned data available from 1990 onwards. For some files the data are from 2000/ 2005 (like horticulture data,credit etc). for some it is at one point in time like for nutrition and health data, warehouse, cold storages etc). For more details on this and for a list of districts in this database please refer to the detailed data documentation file for unapportioned data",
    "Units": ""
  },
  {
    "Abbreviation": "Kharif",
    "ItemDescription": "Rainy season",
    "Units": ""
  },
  {
    "Abbreviation": "Rabi",
    "ItemDescription": "Post-rainy season",
    "Units": ""
  },
  {
    "Abbreviation": "Summer",
    "ItemDescription": "Pre Monsoon",
    "Units": ""
  },
  {
    "Abbreviation": "AEZ",
    "ItemDescription": "AgroEcological Zone",
    "Units": "codes"
  },
  {
    "Abbreviation": "NATP",
    "ItemDescription": "National Agricultural Technology Project",
    "Units": ""
  },
  {
    "Abbreviation": "AEZ_NATP_PS",
    "ItemDescription": "Agro Ecological Zone_NATP_Production System",
    "Units": "codes"
  },
  {
    "Abbreviation": "INDC_STC",
    "ItemDescription": "India Census State Code (2011 Census)",
    "Units": ""
  },
  {
    "Abbreviation": "INDCDISTC",
    "ItemDescription": "India Census District Code (2011 Census)",
    "Units": "codes"
  },
  {
    "Abbreviation": "SAT",
    "ItemDescription": "Semi-Arid Tropics",
    "Units": "codes"
  },
  {
    "Abbreviation": "Non SAT",
    "ItemDescription": "Exclusive of Semi-Arid Tropics",
    "Units": "codes"
  },
  {
    "Abbreviation": "-1",
    "ItemDescription": "For missing data, data not reported, or data not applicable, in such cases -1 is shown in the cell. For more details on the use of \"-1\"please refer to the detailed data documentation files",
    "Units": ""
  },{
    "Abbreviation": "Data source",
    "ItemDescription": "All data are from Government sources (central and state) available from on-line sources, published publications, and through personally meeting the concerned officials. For the environment variables the data were generated from pixel level data Terra Climate. The data sources for the variables in different files are given in the detailed data documentation files",
    "Units": ""
  }
]