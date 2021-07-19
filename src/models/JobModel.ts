import { Schema, model, ObjectId } from 'mongoose'

export interface IJob {
  _id: string
  jobName: string
  algorithmId: ObjectId
  dataName: string
  userId: ObjectId
  filePath: string
  result: { [x: string]: string | number }

  // get back on this to verify how to make it work better
  save(): any
}

const jobSchema = new Schema<IJob>({
  jobName: {
    type: String
  },
  algorithmId: {
    type: Schema.Types.ObjectId,
    ref: 'Algorithm'
  },
  dataName: {
    type: String
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  filePath: {
    type: String
  },

  result: {
    type: [Schema.Types.Mixed]
  }
})

export const JobModel = model<IJob>('Job', jobSchema)
