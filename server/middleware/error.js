const ServiceNotFound = (msg) =>{
    return res.status(404).json({
        code: 404,
        Type: 'SERVICE_NOT_FOUND',
        Retryable: true,
        msg: msg || 'You call a not registered service action'
    })
}

const ServiceNotAvailable = (msg) =>{
    return res.status(404).json({
        code: 404,
        Type: 'SERVICE_NOT_AVAILABLE',
        Retryable: true,
        msg: msg || 'You call a currently unavailable service action. E.g. node disconnected which contains this service or circuit breaker is opened'
    })
}

const RequestTimeOut = (msg) =>{
    return res.status(504).json({
        code: 504,
        Type: 'REQUEST_TIMEOUT',
        Retryable: true,
        msg: msg || 'Your request is timed out'
    })
}

const RequestSkipped = (msg) =>{
    return res.status(514).json({
        code: 514,
        Type: 'REQUEST_SKIPPED',
        Retryable: false,
        msg: msg || 'Your nested call is skipped because the execution is timed out due to distributed timeout'
    })
}

const RequestRejected = (msg) =>{
    return res.status(503).json({
        code: 503,
        Type: 'REQUEST_REJECTED',
        Retryable: true,
        msg: msg || 'The called node is disconnected during requesting'
    })
}

const QueueIsFull = (msg) =>{
    return res.status(429).json({
        code: 429,
        Type: 'QUEUE_FULL',
        Retryable: true,
        msg: msg || 'There are too many active requests'
    })
}

const Validation = (msg) =>{
    return res.status(422).json({
        code: 422,
        Type: 'VALIDATION_ERROR',
        Retryable: true,
        msg: msg || 'The calling parameters are not valid'
    })
}

const MaxCallLevel = (msg) =>{
    return res.status(500).json({
        code: 500,
        Type: 'MAX_CALL_LEVEL',
        Retryable: false,
        msg: msg || 'Your nested calls reached the maxCallLevel value (to avoid infinite calling loops)'
    })
}

const ServiceSchema = (msg) =>{
    return res.status(500).json({
        code: 500,
        Type: 'SERVICE_SCHEMA_ERROR',
        Retryable: false,
        msg: msg || 'Your service schema is not valid'
    })
}

const BrokerOptions = (msg) =>{
    return res.status(500).json({
        code: 500,
        Type: 'BROKER_OPTIONS_ERROR',
        Retryable: false,
        msg: msg || 'Your broker options are not valid'
    })
}

const GracefulStopTimeOut = (msg) =>{
    return res.status(500).json({
        code: 500,
        Type: 'GRACEFUL_STOP_TIMEOUT',
        Retryable: false,
        msg: msg || 'Shutdown is timed out'
    })
}

const ProtocolVersionMismatch = (msg) =>{
    return res.status(500).json({
        code: 500,
        Type: 'PROTOCOL_VERSION_MISMATCH',
        Retryable: false,
        msg: msg || 'An old nodeID connected with older protocol version'
    })
}

const InvalidPacketData = (msg) =>{
    return res.status(500).json({
        code: 500,
        Type: 'INVALID_PACKET_DATA',
        Retryable: false,
        msg: msg || 'Transporter receives unknow data'
    })
}

module.exports = {
    ServiceNotFound,
    ServiceNotAvailable,
    RequestTimeOut,
    RequestSkipped,
    RequestRejected,
    QueueIsFull,
    Validation,
    MaxCallLevel,
    ServiceSchema,
    BrokerOptions,
    GracefulStopTimeOut,
    ProtocolVersionMismatch,
    InvalidPacketData
}