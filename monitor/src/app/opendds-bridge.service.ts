import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { map, catchError } from 'rxjs/operators'
import * as io from 'socket.io-client'
import {Socket} from './interfaces'

const URL = 'http://localhost:8080'

const connectionsToCreate = [
  'topics'
]

@Injectable()
export class OpenDdsBridgeService {
  private socket
  private connections

  data

  constructor() {
    this.data = {}
    this.connections = {}
    connectionsToCreate.forEach((item) => {
      this.data[item] = []
      this.connections[item] = this.getConnection(this.getSocket(item))
    })
  }

  getSocket (keyword) {
    return new Observable(observer => {
      this.socket = io(URL)
      this.socket.on(keyword, (data) => observer.next(data.data))
      return () => this.socket.disconnect()
    })
  }

  getConnection (socket) {
    return {
      socket,
      connection: socket.subscribe(topic => {
        this.data.topics.push(topic)
      })
    }
  }
}
