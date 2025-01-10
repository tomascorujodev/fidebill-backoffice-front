namespace api.Models;
public class AgregarClienteModel
{
    public AgregarClienteModel()
    {
        FechaDeNacimiento = DateTime.Now;
        FechaDeAlta = DateTime.Now;
    }   
    public required string Nombre { get; set; }
    public required string Apellido { get; set; }
    public required string Documento { get; set; }
    public DateTime FechaDeNacimiento { get; set; }
    public required string Genero { get; set; }
    public required string Email { get; set; }
    public required string Telefono { get; set; }
    public bool Estado { get; set; }
    public required string Direccion { get; set; }
    public DateTime FechaDeAlta { get; set; }
    public required string Nota { get; set; }
    public int TipoCliente { get; set; }
    
    private string AgregarCliente(string nombre, string apellido)
    {
        return string.Format("EXEC NOMBREDELPROCEDIMIENTO @Nombre = {0}, @Apellido = {1}, @Documento, @FechaDeNacimiento, @Genero, @Email, @Telefono, @Estado, @Direccion, @FechaDeAlta, @Nota, @TipoCliente", nombre, apellido);
    }
}