import sciscore
import sys

filePath = sys.argv[1] # Path of the file
fileId = sys.argv[2] # Id of the file
outDir = sys.argv[3] # output repository

api = sciscore.SciScore(outDir)
api.generate_report_from_file(filePath, fileId)
api.make_csv(fileId + '.sciscore.csv')