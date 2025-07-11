import wsaa, { SERVICE_IDS } from './WSAA';

// URLs de los ambientes de WSFE
const WSFE_URLS = {
  testing: 'https://wswhomo.afip.gov.ar/wsfev1/service.asmx',
  production: 'https://servicios1.afip.gov.ar/wsfev1/service.asmx'
};

// Tipos de comprobantes
const TIPO_COMPROBANTE = {
  FACTURA_A: 1,
  NOTA_DEBITO_A: 2,
  NOTA_CREDITO_A: 3,
  RECIBO_A: 4,
  NOTA_DE_VENTA_AL_CONTADO_A: 5,
  FACTURA_B: 6,
  NOTA_DEBITO_B: 7,
  NOTA_CREDITO_B: 8,
  RECIBO_B: 9,
  NOTA_DE_VENTA_AL_CONTADO_B: 10,
  FACTURA_C: 11,
  NOTA_DEBITO_C: 12,
  NOTA_CREDITO_C: 13,
  RECIBO_C: 14,
  NOTA_DE_VENTA_AL_CONTADO_C: 15,
  FACTURA_E: 19,
  NOTA_DEBITO_E: 20,
  NOTA_CREDITO_E: 21,
  RECIBO_E: 22,
  NOTA_DE_VENTA_AL_CONTADO_E: 23,
  FACTURA_M: 51,
  NOTA_DEBITO_M: 52,
  NOTA_CREDITO_M: 53,
  RECIBO_M: 54,
  NOTA_DE_VENTA_AL_CONTADO_M: 55
};

// Tipos de documento
const TIPO_DOCUMENTO = {
  DNI: 96,
  CUIT: 80,
  CUIL: 86,
  CDI: 87,
  LE: 89,
  LC: 90,
  CI_EXTRANJERA: 91,
  EN_TRAMITE: 92,
  ACTA_NACIMIENTO: 93,
  PASAPORTE: 94,
  CI_BS_AS_RNP: 95,
  DNI: 96,
  PASAPORTE_DEL_MERCOSUR: 97,
  CUIT_CDI: 99
};

// Conceptos
const CONCEPTO = {
  PRODUCTOS: 1,
  SERVICIOS: 2,
  PRODUCTOS_Y_SERVICIOS: 3
};

class FacturacionElectronica {
  constructor(environment = 'testing') {
    this.environment = environment;
    this.baseUrl = WSFE_URLS[environment];
    this.cuit = null;
    this.ticket = null;
  }

  /**
   * Inicializa el servicio con el CUIT y certificado
   * @param {string} cuit - CUIT del contribuyente
   * @param {string} certificate - Certificado digital
   * @param {string} privateKey - Clave privada
   * @param {string} passphrase - Contraseña del certificado
   */
  async initialize(cuit, certificate, privateKey, passphrase = '') {
    try {
      this.cuit = cuit;
      
      // Obtener ticket de acceso del WSAA
      this.ticket = await wsaa.getAccessTicket(
        SERVICE_IDS.wsfe,
        certificate,
        privateKey,
        passphrase
      );
      
      console.log('Servicio de facturación electrónica inicializado');
    } catch (error) {
      console.error('Error al inicializar facturación electrónica:', error);
      throw error;
    }
  }

  /**
   * Crea una factura electrónica
   * @param {Object} facturaData - Datos de la factura
   * @returns {Promise<Object>} Respuesta con CAE y número de comprobante
   */
  async crearFactura(facturaData) {
    try {
      if (!this.ticket || !wsaa.isTicketValid(this.ticket)) {
        throw new Error('Ticket de acceso inválido o expirado');
      }

      // Validar datos de la factura
      this.validarDatosFactura(facturaData);

      // Crear request para FECAESolicitar
      const request = this.crearRequestFECAESolicitar(facturaData);
      
      // Enviar request al WSFE
      const response = await this.callWSFE('FECAESolicitar', request);
      
      // Procesar respuesta
      return this.procesarRespuestaFactura(response);
    } catch (error) {
      console.error('Error al crear factura:', error);
      throw error;
    }
  }

  /**
   * Valida los datos de la factura
   * @param {Object} facturaData - Datos de la factura
   */
  validarDatosFactura(facturaData) {
    const required = ['tipoComprobante', 'concepto', 'docTipo', 'docNro', 'cbteDesde', 'cbteHasta', 'impTotal', 'impTotConc', 'impNeto', 'impOpEx', 'impIVA', 'impTrib', 'fechaServicio', 'fechaVtoPago', 'monId', 'monCotiz', 'items'];
    
    for (const field of required) {
      if (!facturaData[field]) {
        throw new Error(`Campo requerido faltante: ${field}`);
      }
    }

    if (!facturaData.items || facturaData.items.length === 0) {
      throw new Error('La factura debe tener al menos un item');
    }
  }

  /**
   * Crea el request para FECAESolicitar
   * @param {Object} facturaData - Datos de la factura
   * @returns {Object} Request estructurado
   */
  crearRequestFECAESolicitar(facturaData) {
    const request = {
      Auth: {
        Token: this.ticket.token,
        Sign: this.ticket.sign,
        Cuit: this.cuit
      },
      FeCAEReq: {
        FeCabReq: {
          CantReg: 1,
          PtoVta: facturaData.puntoVenta || 1,
          CbteTipo: facturaData.tipoComprobante
        },
        FeDetReq: {
          FECAEDetRequest: {
            Concepto: facturaData.concepto,
            DocTipo: facturaData.docTipo,
            DocNro: facturaData.docNro,
            CbteDesde: facturaData.cbteDesde,
            CbteHasta: facturaData.cbteHasta,
            CbteFch: facturaData.fechaComprobante,
            ImpTotal: facturaData.impTotal,
            ImpTotConc: facturaData.impTotConc,
            ImpNeto: facturaData.impNeto,
            ImpOpEx: facturaData.impOpEx,
            ImpIVA: facturaData.impIVA,
            ImpTrib: facturaData.impTrib,
            FchServDesde: facturaData.fechaServicio,
            FchServHasta: facturaData.fechaServicio,
            FchVtoPago: facturaData.fechaVtoPago,
            MonId: facturaData.monId,
            MonCotiz: facturaData.monCotiz,
            Iva: this.crearArrayIVA(facturaData.iva),
            Tributos: this.crearArrayTributos(facturaData.tributos),
            CbtesAsoc: facturaData.comprobantesAsociados || [],
            Opcionales: facturaData.opcionales || []
          }
        }
      }
    };

    return request;
  }

  /**
   * Crea el array de IVA
   * @param {Array} ivaData - Datos de IVA
   * @returns {Array} Array de IVA
   */
  crearArrayIVA(ivaData) {
    if (!ivaData || ivaData.length === 0) {
      return [];
    }

    return ivaData.map(item => ({
      Id: item.id,
      BaseImp: item.baseImp,
      Importe: item.importe
    }));
  }

  /**
   * Crea el array de tributos
   * @param {Array} tributosData - Datos de tributos
   * @returns {Array} Array de tributos
   */
  crearArrayTributos(tributosData) {
    if (!tributosData || tributosData.length === 0) {
      return [];
    }

    return tributosData.map(item => ({
      Id: item.id,
      Desc: item.descripcion,
      BaseImp: item.baseImp,
      Alic: item.alicuota,
      Importe: item.importe
    }));
  }

  /**
   * Llama al WSFE
   * @param {string} method - Método a llamar
   * @param {Object} request - Request a enviar
   * @returns {Promise<Object>} Respuesta del WSFE
   */
  async callWSFE(method, request) {
    try {
      // En un entorno real, esto sería una llamada SOAP real
      // Por ahora, simulamos la respuesta para demostración
      console.log(`Llamando al WSFE: ${method}`);
      
      // Simulación de respuesta exitosa
      const mockResponse = {
        FECAESolicitarResult: {
          FeCabResp: {
            Cuit: this.cuit,
            PtoVta: request.FeCAEReq.FeCabReq.PtoVta,
            CbteTipo: request.FeCAEReq.FeCabReq.CbteTipo,
            FchProceso: new Date().toISOString().split('T')[0],
            CantReg: 1,
            Resultado: 'A'
          },
          FeDetResp: {
            FECAEDetResponse: {
              Concepto: request.FeCAEReq.FeDetReq.FECAEDetRequest.Concepto,
              DocTipo: request.FeCAEReq.FeDetReq.FECAEDetRequest.DocTipo,
              DocNro: request.FeCAEReq.FeDetReq.FECAEDetRequest.DocNro,
              CbteDesde: request.FeCAEReq.FeDetReq.FECAEDetRequest.CbteDesde,
              CbteHasta: request.FeCAEReq.FeDetReq.FECAEDetRequest.CbteHasta,
              CbteFch: request.FeCAEReq.FeDetReq.FECAEDetRequest.CbteFch,
              Resultado: 'A',
              CAE: '12345678901234',
              CAEFchVto: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              Observaciones: []
            }
          }
        }
      };
      
      return mockResponse;
    } catch (error) {
      console.error('Error al llamar WSFE:', error);
      throw new Error('Error de comunicación con WSFE');
    }
  }

  /**
   * Procesa la respuesta de la factura
   * @param {Object} response - Respuesta del WSFE
   * @returns {Object} Datos procesados de la factura
   */
  procesarRespuestaFactura(response) {
    try {
      const result = response.FECAESolicitarResult;
      const cabecera = result.FeCabResp;
      const detalle = result.FeDetResp.FECAEDetResponse;

      if (cabecera.Resultado !== 'A' || detalle.Resultado !== 'A') {
        throw new Error('La factura fue rechazada por AFIP');
      }

      return {
        cae: detalle.CAE,
        fechaVencimientoCAE: detalle.CAEFchVto,
        numeroComprobante: detalle.CbteDesde,
        puntoVenta: cabecera.PtoVta,
        tipoComprobante: cabecera.CbteTipo,
        fechaComprobante: detalle.CbteFch,
        resultado: detalle.Resultado,
        observaciones: detalle.Observaciones || []
      };
    } catch (error) {
      console.error('Error al procesar respuesta de factura:', error);
      throw error;
    }
  }

  /**
   * Consulta el último número de comprobante
   * @param {number} puntoVenta - Punto de venta
   * @param {number} tipoComprobante - Tipo de comprobante
   * @returns {Promise<number>} Último número de comprobante
   */
  async consultarUltimoComprobante(puntoVenta, tipoComprobante) {
    try {
      if (!this.ticket || !wsaa.isTicketValid(this.ticket)) {
        throw new Error('Ticket de acceso inválido o expirado');
      }

      const request = {
        Auth: {
          Token: this.ticket.token,
          Sign: this.ticket.sign,
          Cuit: this.cuit
        },
        PtoVta: puntoVenta,
        CbteTipo: tipoComprobante
      };

      const response = await this.callWSFE('FECompUltimoAutorizado', request);
      
      // Simulación de respuesta
      return response.FECompUltimoAutorizadoResult.CbteNro + 1;
    } catch (error) {
      console.error('Error al consultar último comprobante:', error);
      throw error;
    }
  }

  /**
   * Consulta datos de un contribuyente
   * @param {number} tipoDocumento - Tipo de documento
   * @param {string} numeroDocumento - Número de documento
   * @returns {Promise<Object>} Datos del contribuyente
   */
  async consultarContribuyente(tipoDocumento, numeroDocumento) {
    try {
      // En un entorno real, esto llamaría al WS de Padrón
      // Por ahora, simulamos la respuesta
      console.log(`Consultando contribuyente: ${tipoDocumento} - ${numeroDocumento}`);
      
      return {
        tipoDocumento,
        numeroDocumento,
        razonSocial: 'EMPRESA EJEMPLO S.A.',
        domicilioFiscal: {
          direccion: 'AV. EJEMPLO 123',
          localidad: 'CIUDAD AUTÓNOMA BUENOS AIRES',
          codigoPostal: '1001',
          descripcionProvincia: 'CIUDAD AUTÓNOMA BUENOS AIRES'
        },
        condicionIVA: 'IVA Responsable Inscripto',
        estado: 'ACTIVO'
      };
    } catch (error) {
      console.error('Error al consultar contribuyente:', error);
      throw error;
    }
  }

  /**
   * Genera el CAE (Código de Autorización Electrónico)
   * @param {Object} facturaData - Datos de la factura
   * @returns {Promise<string>} CAE generado
   */
  async generarCAE(facturaData) {
    try {
      const resultado = await this.crearFactura(facturaData);
      return resultado.cae;
    } catch (error) {
      console.error('Error al generar CAE:', error);
      throw error;
    }
  }
}

// Instancia singleton
const facturacionElectronicaInstance = new FacturacionElectronica();

export default facturacionElectronicaInstance;
export { TIPO_COMPROBANTE, TIPO_DOCUMENTO, CONCEPTO }; 