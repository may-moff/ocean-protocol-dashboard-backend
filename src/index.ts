const connection = require('./db-config');
const express = require('express');
import { Request, Response, Application } from 'express';
import { parse } from 'path/posix';
const app: Application = express();
const port = process.env.PORT || 8000;
const cors = require('cors');
const routes = require('./routes');

app.use(cors());
app.use(express.json());
connection();
app.get('/', (req: Request, res: Response) => {
  res.send('Main route working');
});

app.use('/api', routes);

// const data = {
//   result: { aaa: 'test' }, parseKeys: [{ key: 'test', dataType: 'string', visualize: true }]
// }

// controller.create(data)

/* app.use(cron bla, (file) => {
  cosnt output = parse(file)
  if(algoController.find({name: 'adjkfad'})) { return result} 
  else {
  algoController.create(id)
return id}
  jobcontroller.create(algoId: id, results: output.results)
  rulescontroller.create(algoId: id, parseKeys: output.parseKeys)
}) */

/*
const create = (data) => {
  const newUser = new JobModel({ data.results});
}
*/

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
