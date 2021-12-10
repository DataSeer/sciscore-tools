import sciscore
import sys

filePath = sys.argv[0] # Path of the file
fileId = sys.argv[1] # Id of the file
out = sys.argv[2] # output repository

api = sciscore.SciScore(out)
api.generate_report_from_file(filePath, fileId)