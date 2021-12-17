# sciscore-tools

## Description

- This module is a nodejs wrapper of [this tool] (https://github.com/PeterEckmann1/sciscore-tools).
- The Python scripts/libraries are encapsulated in a web server (API).
- The container must be "connected" to the DataSeer (DS) file system (FS). *It will "share" the same FS.*
- You should not open the port used by the container (internal, non-public process).
- It will write the results files (report.json and [DS ID file].csv) directly to the DS FS. You must add these files in the DS worklow

## Install

### Docker

Some useful command lines for creating images and deploying containers

```bash
# build the new image (delete the old ones afterwards)
docker build -t sciscore-tools:latest .
# delete old container
docker rm -f sciscore
# run a new container
docker run -it -p 3200:3200 -v /home/nicolas/Projects/dataseer-web/data:/app/data --name sciscore sciscore-tools:latest
```

## Available routes

### (GET) /processFile/

#### Description

This route process the given file (using sciscore-tools).

#### Parameters

<table>
  <thead>
    <tr>
      <th>Type</th>
      <th>Parameters</th>
      <th>Requirement</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>String</td>
      <td>filePath</td>
      <td>required</td>
      <td>Path of the given file (.pdf or .xml)</td>
    </tr>
  </tbody>
</table>

#### How to request

```bash
# Will return the process logs (JSON formated)
curl -X POST "http://localhost:3200/processFile" -F "filePath=/my/file/path/file.pdf"
```

## Result

```json
{
  "err": false,
  "res": { // process logs
    "stderr": [],
    "stdout": []
  }
}
```

---