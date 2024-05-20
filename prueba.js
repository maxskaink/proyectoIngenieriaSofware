<ref *1> {
  oid: <Buffer f1 47 af c9 17 79 4c 94 9d 98 62 91 c1 fe a0 a1>,
  fqn: 'GESTIONTOTAL.PAQUETE_GESTIONCONTABLE.PRODUCTO_SUCURSAL_TABLA',
  schema: 'GESTIONTOTAL',
  name: 'PRODUCTO_SUCURSAL_TABLA',        
  packageName: 'PAQUETE_GESTIONCONTABLE', 
  partial: false,
  isXmlType: false,
  version: 1,
  isCollection: true,
  maxNumElements: 0,
  collectionType: 1,
  collectionFlags: 16,
  elementType: [DbType DB_TYPE_OBJECT],   
  elementTypeClass: [Function: DbObject] {
    toString: [Function (anonymous)],     
    _connection: Connection {
      _events: [Object: null prototype] {},
      _eventsCount: 0,
      _maxListeners: undefined,
      _dbObjectClasses: [Map],
      _closing: false,
      _impl: [ThinConnectionImpl],        
      [Symbol(shapeMode)]: false,
      [Symbol(kCapture)]: false
    },
    _objType: {
      oid: <Buffer ef 63 da 44 32 28 4d 18 a5 5e e6 e2 3b 5e 81 8e>,
      fqn: 'GESTIONTOTAL.PAQUETE_GESTIONCONTABLE.PRODUCTO_SUCURSAL_DETALLE',        
      schema: 'GESTIONTOTAL',
      name: 'PRODUCTO_SUCURSAL_DETALLE',  
      packageName: 'PAQUETE_GESTIONCONTABLE',
      partial: false,
      isXmlType: false,
      version: 1,
      isCollection: false,
      attributes: [Array],
      _connection: [ThinConnectionImpl]   
    }
  },
  attributes: [
    {
      name: null,
      type: [DbType DB_TYPE_OBJECT],      
      typeClass: [Function],
      typeName: 'GESTIONTOTAL.PAQUETE_GESTIONCONTABLE.PRODUCTO_SUCURSAL_DETALLE'    
    }
  ],
  elementTypeName: 'GESTIONTOTAL.PAQUETE_GESTIONCONTABLE.PRODUCTO_SUCURSAL_DETALLE',
  _connection: ThinConnectionImpl {       
    _inProgress: false,
    _dbObjectTypes: Map(3) {
      'GESTIONTOTAL.PAQUETE_GESTIONCONTABLE.PRODUCTO_SUCURSAL_TABLA' => [Circular *1],
      'GESTIONTOTAL.PAQUETE_GESTIONCONTABLE.PRODUCTO_SUCURSAL_DETALLE' => [Object], 
      <Buffer ef 63 da 44 32 28 4d 18 a5 5e e6 e2 3b 5e 81 8e> => [Object]
    },
    _requestQueue: [],
    sessionID: 0,
    serialNum: 0,
    autoCommit: false,
    serverVersion: 2103000000,
    statementCache: Map(1) {
      'BEGIN \n' +
        '        :ret := paquete_gestionContable.productos_inventario_sucursal(:idSucursal); \n' +
        '        END;' => [Statement]     
    },
    currentSchema: '',
    invokeSessionCallback: true,
    statementCacheSize: 30,
    _numCursorsToClose: 0,
    _currentSchemaModified: false,        
    _cursorsToClose: Set(0) {},
    _tempLobsToClose: [],
    _tempLobsTotalSize: 0,
    _drcpEstablishSession: false,
    _cclass: null,
    _clientIdentifier: '',
    _clientIdentifierModified: false,     
    _action: '',
    _actionModified: false,
    _dbOp: '',
    _dbOpModified: false,
    _clientInfo: '',
    _clientInfoModified: false,
    _module: '',
    _moduleModified: false,
    _drcpEnabled: false,
    serviceName: 'xe',
    remoteAddress: '::1:1521',
    comboKey: <Buffer 92 cb 47 f6 50 e2 23 e6 d0 02 39 88 d6 da 84 bb e8 a1 12 89 69 1b f0 22 0a 87 9d 96 ac 67 43 ed>,       
    nscon: NetworkSession {
      connected: true,
      isBreak: false,
      isReset: false,
      breakPosted: false,
      sAtts: [SessionAtts],
      cData: null,
      cDataNVPair: [NVPair],
      ntAdapter: [NTTCP],
      sndDatapkt: [DataPacket],
      rcvDatapkt: [DataPacket],
      dbUUID: null,
      markerPkt: [MarkerPacket],
      controlPkt: [ControlPacket]
    },
    sid: null,
    purity: 0,
    connectionClass: '',
    _protocol: Protocol {
      _breakInProgress: false,
      txnInProgress: 0,
      connInProgress: false,
      nsi: [NetworkSession],
      sequenceId: 12,
      caps: [Capabilities],
      writeBuf: [WritePacket],
      readBuf: [ReadPacket],
      callTimeout: 0
    },
    dbDomain: '',
    dbName: 'XE',
    maxOpenCursors: 300,
    instanceName: 'xe',
    warning: undefined,
    serverVersionString: '21.3.0.0.0',    
    _partialDbObjectTypes: []
  }
}