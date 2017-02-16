require 'sinatra'
require 'pry'
require 'csv'
require 'json'
require './functions.rb'

# Gets index page, sets it as home.
get('/') do
	erb :index
end

# Gets save painting information and stores it to a file. Mulitple saves are stored in one file.
get('/savepainting') do
	savePainting(params)
end

# Loads the saves file and returns it.
get('/loadsaves') do
	save = loadSaves()
	return save
end