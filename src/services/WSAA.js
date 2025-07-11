import { POST } from './Fetch';

// URLs de los ambientes de WSAA
const WSAA_URLS = {
  testing: 'https://wsaahomo.afip.gov.ar/ws/services/LoginCms',
  production: 'https://wsaa.afip.gov.ar/ws/services/LoginCms'
};

// IDs de servicios disponibles
const SERVICE_IDS = {
  wsfe: 'wsfe', // Web Service de Facturación Electrónica
  ws_sr_constancia_inscripcion: 'ws_sr_constancia_inscripcion', // Consulta de Padrón
  ws_sr_padron_a5: 'ws_sr_padron_a5' // Consulta de Padrón A5
};

class WSAA {
  constructor(environment = 'testing') {
    this.environment = environment;
    this.baseUrl = WSAA_URLS[environment];
    this.tickets = new Map(); // Cache de tickets de acceso
  }

  /**
   * Crea el XML del Ticket de Requerimiento de Acceso (TRA)
   * @param {string} serviceId - ID del servicio a acceder
   * @returns {string} XML del TRA
   */
  createTRA(serviceId) {
    const now = new Date();
    const uniqueId = now.getTime().toString();
    const generationTime = new Date(now.getTime() - 10 * 60 * 1000).toISOString(); // 10 minutos atrás
    const expirationTime = new Date(now.getTime() + 10 * 60 * 1000).toISOString(); // 10 minutos adelante

    return `<?xml version="1.0" encoding="UTF-8"?>
<loginTicketRequest version="1.0">
  <header>
    <uniqueId>${uniqueId}</uniqueId>
    <generationTime>${generationTime}</generationTime>
    <expirationTime>${expirationTime}</expirationTime>
  </header>
  <service>${serviceId}</service>
</loginTicketRequest>`;
  }

  /**
   * Firma el TRA usando el certificado digital
   * @param {string} traXml - XML del TRA
   * @param {string} certificate - Certificado en formato PEM
   * @param {string} privateKey - Clave privada en formato PEM
   * @param {string} passphrase - Contraseña del certificado
   * @returns {Promise<string>} CMS firmado en Base64
   */
  async signTRA(traXml, certificate, privateKey, passphrase = '') {
    try {
      // En un entorno real, esto se haría con una librería de criptografía
      // Por ahora, simulamos la firma para demostración
      console.log('Firmando TRA con certificado digital...');
      
      // Simulación de firma CMS
      const mockSignature = btoa(traXml + '_SIGNED_' + Date.now());
      return mockSignature;
    } catch (error) {
      console.error('Error al firmar TRA:', error);
      throw new Error('Error al firmar el mensaje con el certificado digital');
    }
  }

  /**
   * Obtiene un Ticket de Acceso del WSAA
   * @param {string} serviceId - ID del servicio
   * @param {string} certificate - Certificado digital
   * @param {string} privateKey - Clave privada
   * @param {string} passphrase - Contraseña del certificado
   * @returns {Promise<Object>} Ticket de acceso con token y sign
   */
  async getAccessTicket(serviceId, certificate, privateKey, passphrase = '') {
    try {
      // Verificar si ya tenemos un ticket válido en cache
      const cachedTicket = this.tickets.get(serviceId);
      if (cachedTicket && new Date() < cachedTicket.expirationTime) {
        console.log('Usando ticket de acceso en cache');
        return cachedTicket;
      }

      // Crear el TRA
      const traXml = this.createTRA(serviceId);
      
      // Firmar el TRA
      const signedCms = await this.signTRA(traXml, certificate, privateKey, passphrase);
      
      // Crear el request SOAP para el WSAA
      const soapRequest = this.createSoapRequest(signedCms);
      
      // Enviar request al WSAA
      const response = await this.callWSAA(soapRequest);
      
      // Parsear la respuesta
      const ticket = this.parseTicketResponse(response);
      
      // Guardar en cache
      this.tickets.set(serviceId, ticket);
      
      return ticket;
    } catch (error) {
      console.error('Error al obtener ticket de acceso:', error);
      throw error;
    }
  }

  /**
   * Crea el request SOAP para el WSAA
   * @param {string} signedCms - CMS firmado en Base64
   * @returns {string} Request SOAP
   */
  createSoapRequest(signedCms) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wsaa="http://wsaa.view.sua.dvadac.desein.afip.gov">
  <soapenv:Header/>
  <soapenv:Body>
    <wsaa:loginCms>
      <wsaa:in0>${signedCms}</wsaa:in0>
    </wsaa:loginCms>
  </soapenv:Body>
</soapenv:Envelope>`;
  }

  /**
   * Llama al WSAA
   * @param {string} soapRequest - Request SOAP
   * @returns {Promise<string>} Respuesta del WSAA
   */
  async callWSAA(soapRequest) {
    try {
      // En un entorno real, esto sería una llamada SOAP real
      // Por ahora, simulamos la respuesta para demostración
      console.log('Enviando request al WSAA...');
      
      // Simulación de respuesta exitosa
      const mockResponse = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<loginTicketResponse version="1.0">
  <header>
    <source>CN=wsaahomo, O=AFIP, C=AR, SERIALNUMBER=CUIT 33693450239</source>
    <destination>SERIALNUMBER=CUIT 20190178154, CN=test</destination>
    <uniqueId>${Date.now()}</uniqueId>
    <generationTime>${new Date().toISOString()}</generationTime>
    <expirationTime>${new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString()}</expirationTime>
  </header>
  <credentials>
    <token>PD94bWwgdmVyc2lvbiI9IjEuMCIgZW5jb2Rpbmc9IlVURi04IiBzdGFuZGFsb25lPSJ5ZXMiPz4KPHNzb3ZlcnNpb249IjIuMCI+CjxpZCBzcmM9IkNOPXdzYWFob21vLCBPPUFGSVAsIEM9QVIsIFNFUklBTlVNQkVSPUNVSVQgMzM2OTM0NTAyMzkiIGRzdD0iQ049d3NmZSwgTz1BRklQLCBDPUFSIiB1bmlxdWVfaWQ9IjE1NDA4Njk3MjMiIGdlbl90aW1lPSIxNTczODMwMTQwIiBleHBfdGltZT0iMTU3Mzg3MzQwMCIvPgo8b3BlcmF0aW9uIHR5cGU9ImxvZ2luIiB2YWx1ZT0iZ3JhbnRlZCI+Cjxsb2dpbiBlbnRpdHk9IjMzNjkzNDUwMjM5IiBzZXJ2aWNlPSJ3c2ZlIiB1aWQ9IlNFUklBTlVNQkVSPUNVSVQgMjAxOTAxNzgxNTQsIENOPWdsYXJyaWVyYTIwMTgxMDI5IiBhdXRobWV0aG9kPSJjbXMiIHJlZ21ldGhvZD0iMjIiPgo8cmVsYXRpb25zPgo8cmVsYXRpb24ga2V5PSIyMDE5MDE3ODE1NCIgcmVsdHlwZT0iNCIvPgo8cmVsYXRpb24ga2V5PSIzMDMzMzMzMzMxMyIgcmVsdHlwZT0iNCIvPgo8L3JlbGF0aW9ucz4KPC9sb2dpbj4KPC9vcGVyYXRpb24+Cjwvc3NvPgo=</token>
    <sign>Urp5dbarIb8m5ySEzSeon1W7ys=</sign>
  </credentials>
</loginTicketResponse>`;
      
      return mockResponse;
    } catch (error) {
      console.error('Error al llamar WSAA:', error);
      throw new Error('Error de comunicación con WSAA');
    }
  }

  /**
   * Parsea la respuesta del WSAA
   * @param {string} response - Respuesta XML del WSAA
   * @returns {Object} Ticket de acceso parseado
   */
  parseTicketResponse(response) {
    try {
      // En un entorno real, esto se haría con un parser XML
      // Por ahora, extraemos los datos básicos
      const tokenMatch = response.match(/<token>([^<]+)<\/token>/);
      const signMatch = response.match(/<sign>([^<]+)<\/sign>/);
      const expirationMatch = response.match(/<expirationTime>([^<]+)<\/expirationTime>/);
      
      if (!tokenMatch || !signMatch || !expirationMatch) {
        throw new Error('Respuesta del WSAA inválida');
      }
      
      return {
        token: tokenMatch[1],
        sign: signMatch[1],
        expirationTime: new Date(expirationMatch[1]),
        service: 'wsfe'
      };
    } catch (error) {
      console.error('Error al parsear respuesta del WSAA:', error);
      throw new Error('Error al procesar respuesta del WSAA');
    }
  }

  /**
   * Verifica si un ticket de acceso es válido
   * @param {Object} ticket - Ticket de acceso
   * @returns {boolean} True si es válido
   */
  isTicketValid(ticket) {
    if (!ticket || !ticket.expirationTime) {
      return false;
    }
    
    // Agregar margen de seguridad de 5 minutos
    const now = new Date();
    const margin = 5 * 60 * 1000; // 5 minutos en milisegundos
    
    return new Date(ticket.expirationTime.getTime() - margin) > now;
  }

  /**
   * Limpia tickets expirados del cache
   */
  cleanExpiredTickets() {
    const now = new Date();
    for (const [serviceId, ticket] of this.tickets.entries()) {
      if (!this.isTicketValid(ticket)) {
        this.tickets.delete(serviceId);
      }
    }
  }
}

// Instancia singleton
const wsaaInstance = new WSAA();

export default wsaaInstance;
export { SERVICE_IDS }; 