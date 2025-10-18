/* eslint-disable no-console */

import { flash, t, log } from "@brugmann/vuemann/src/services/services-helper.js"
import { EventWs } from "@brugmann/vuemann/src/services/websocket/src/models/event-ws.js"
import { websocketFunctions } from "@brugmann/vuemann/src/services/websocket/src/websocket-functions.js"

const messages = []
let processing = false
const getMessages = () => { return messages }

const wsOnMessage = async (route_name, message) => {
    messages.push({ route_name, message})
    
    if (processing === true) { return }
    
    processing = true
    await wsQueue.processMessages()
}

const processMessages = async () => {
    while (messages.length > 0) {
        const message = messages.shift()
        try {
            await wsQueue.processMessage(message.route_name, message.message)
        } catch (error) {
            console.error('Erreur lors du traitement du message WebSocket:', error)
            log.send('error queue ws', { messageWs: message, error })
        }
    }

    processing = false
}

const processMessage = async (route_name, message) => {
    const parsedContent = websocketFunctions.getJsonFromData(message.data)
    if (!parsedContent) { return flash.errorT('ws_data_bad', {data: message.data, route_name}) }
    if (!parsedContent.event) { return flash.errorT('ws_data_no_event', {route_name}) }
    if (EventWs.prevent(route_name, parsedContent.event, parsedContent.data)){ return false }
    
    if (["ping", "connected"].includes(parsedContent.event)){ return console.log(t('ws_global_event', { event : parsedContent.event, route_name })) }
    if (!EventWs.routeExist(route_name)){ return flash.errorT('ws_event_no', { route_name }) }
    if (!EventWs.exist(route_name, parsedContent.event)){ return flash.errorT('ws_event_unknow', {route_name, event: parsedContent.event}) }

    await EventWs.get(route_name, parsedContent.event)(parsedContent)
    return true
}

export const wsQueue = {
    processMessages,
    processMessage,
    wsOnMessage,
    getMessages
}
