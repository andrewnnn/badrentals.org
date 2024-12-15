import json
import pprint

data = json.load(open('test.data', 'rb'))

pprint.pprint([ x["columns"] for x in data["data"]["tableSchemas"]][1], depth=3)
# id of state fld9vyhKGyBkaPsIJ
# data -> tableSchemas -> columns[0] -> {name: state id: fld9vyhKGyBkaPsIJ }

# pprint.pprint(data["data"]["tableDatas"][0]["rows"], depth=3)

choices = {
  "sel1IeWuKWTmDneOU":{"id":"sel1IeWuKWTmDneOU","name":"ACT","color":"blueMedium"},
  "selEkcOHAXxf4N7vM":{"id":"selEkcOHAXxf4N7vM","name":"NSW","color":"cyanMedium"},
  "sellynN3VrXI7NVwS":{"id":"sellynN3VrXI7NVwS","name":"NT","color":"greenMedium"},
  "selptoUhVKSgIKBgo":{"id":"selptoUhVKSgIKBgo","name":"QLD","color":"yellowMedium"},
  "sel62rrKwcBNDek9i":{"id":"sel62rrKwcBNDek9i","name":"SA","color":"redMedium"},
  "sel6gqDjp3qWWhVKn":{"id":"sel6gqDjp3qWWhVKn","name":"TAS","color":"pinkMedium"},
  "sel4qoEQDbz1v9jWp":{"id":"sel4qoEQDbz1v9jWp","name":"VIC","color":"purpleMedium"},
  "selW5vZEnLavGIun8":{"id":"selW5vZEnLavGIun8","name":"WA","color":"grayMedium"}
}

{
  "fldKuPB47BSDAXcxo":"55 Lothian Street",
  "fldfCIxaji9auiwxv":2,
  "fldBQ1DlmGwmJXKRH":"The roof was leaking, reached a point where water was coming from the third floor all the way to the ground. \n\nLandlord special renovation left a huge open hole between the stair case and door. Meant that cold air and bugs had direct entry from underneath the house to inside. \n\nBalcony was bordering on collapsing, and in spite having it ‘fixed’ nothing changed. ",
  "fldz8ZqlFhpXr8XQL":"2024-11-24T13:08:40.000Z",
  "fld6PzJrM0BkfHRbU":"Carlton ",
  "fldkJ039SmzLxTDsj":"selluXJfEaklYgIBd", 
  "fldVRvrZn7OgbtSmn":"North Melbourne",
  "fldpWuDivt92t0lL9":"selllBUNYe3Jv4PdL", fldpWuDivt92t0lL9 -> state
  "fldanIBzJiXajPYrc":"selLeUOm6oOnm51ms", -> country
  "fldJbPfhgPucqvp6Y":"Nelson Alexander"}