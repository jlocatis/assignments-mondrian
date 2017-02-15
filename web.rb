require 'sinatra'
require 'pry'
require 'csv'
require './functions.rb'

# Gets index page, sets it as home.
get('/') do
	erb :index
end

# Gets save painting information and stores it to a file. Mulitple saves are stored in one file.
get('/savepainting') do
	savePainting(params)
end

# Loads the saves file. Does not completely work, at the moment it just displays a list of times
# when save data were stored.
get('/loadsaves') do
	files_to_load = loadSaves()
	@files_to_load = files_to_load.to_s
	return @files_to_load
end