import { Schema, model, ObjectId } from 'mongoose'

export interface IJob {
  _id: string
  jobName: string
  algorithmId: ObjectId
  dataName: string
  userId: ObjectId
  filePath: string
  result: { [x: string]: string | number }
  date: Date

  // get back on this to verify how to make it work better
  save(): any
}

const jobSchema = new Schema<IJob>({
  jobName: {
    type: String,
    required: true
  },

  algorithmId: {
    type: Schema.Types.ObjectId,
    ref: 'Algorithm',
    required: true
  },
  dataName: {
    type: String,
    required: true
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  filePath: {
    type: String
  },

  result: {
    type: Schema.Types.Mixed
  },

  date: { type: Date, default: Date.now },
  required: true
})

export const JobModel = model<IJob>('Job', jobSchema)
