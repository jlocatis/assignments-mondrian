require 'csv'
require 'pry'
require 'json'

# Opens the CSV file containing stored saves and appends the new save onto the end of the file.
def savePainting(params)
	CSV.open("./public/saves.csv", "a+") {|csv| params.to_a.each {|elem| csv << elem}}
end

# Loads the saves file and returns it.
def loadSaves()
	saves_array = CSV.read("./public/saves.csv")
	saves_array = saves_array.to_json
	return saves_array
end