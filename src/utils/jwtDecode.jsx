export default function jwtDecode(token) {
        if (!token) return null;
        try{
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
            );
            const decodedToken = JSON.parse(jsonPayload);
            
            // Parsear la propiedad funcionalidades si existe y es un string
            if (decodedToken.funcionalidades && typeof decodedToken.funcionalidades === 'string') {
                try {
                    decodedToken.funcionalidades = JSON.parse(decodedToken.funcionalidades);
                } catch (parseError) {
                    console.warn('Error al parsear funcionalidades:', parseError);
                    // Si no se puede parsear, mantener como string
                }
            }
            
            return decodedToken;
        }catch{
            return null;
        }
  }
  