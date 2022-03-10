import { MongoClient, Collection } from 'mongodb'

export const MongoHelper = {
  client: MongoClient,
  uri: '' as string,

  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri, {
    })
  },

  async disconnect (): Promise<void> {
    await this.client.close()
    this.client = null
  },

  async getCollection (name: string): Promise<Collection> {
    return this.client.db().collection(name)
  }
}
