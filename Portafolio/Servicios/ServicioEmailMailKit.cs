using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Portafolio.Models;

namespace Portafolio.Servicios
{
    public interface IServicioEmail
    {
        Task Enviar(ContactoViewModel contacto);
    }

    public class ServicioEmailMailKit : IServicioEmail
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<ServicioEmailMailKit> _logger;

        public ServicioEmailMailKit(IConfiguration configuration, ILogger<ServicioEmailMailKit> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task Enviar(ContactoViewModel contacto)
        {
            try
            {
                // Obtener configuración desde appsettings o User Secrets
                var smtpServer = _configuration.GetValue<string>("EmailSettings:SmtpServer");
                var smtpPort = _configuration.GetValue<int>("EmailSettings:SmtpPort");
                var senderEmail = _configuration.GetValue<string>("EmailSettings:SenderEmail");
                var senderName = _configuration.GetValue<string>("EmailSettings:SenderName");
                var password = _configuration.GetValue<string>("EmailSettings:Password");

                // Crear el mensaje
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(senderName, senderEmail));
                message.To.Add(new MailboxAddress(senderName, senderEmail)); // Te envías a ti mismo
                message.Subject = $"Nuevo contacto desde el portafolio: {contacto.Nombre}";

                // Cuerpo del mensaje en HTML
                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = $@"
                        <html>
                        <body style='font-family: Arial, sans-serif;'>
                            <div style='background-color: #f4f4f4; padding: 20px;'>
                                <div style='background-color: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto;'>
                                    <h2 style='color: #0d6efd; border-bottom: 3px solid #0d6efd; padding-bottom: 10px;'>
                                        📧 Nuevo Mensaje de Contacto
                                    </h2>
                                    
                                    <div style='margin: 20px 0;'>
                                        <p style='margin: 10px 0;'><strong>👤 Nombre:</strong> {contacto.Nombre}</p>
                                        <p style='margin: 10px 0;'><strong>📧 Email:</strong> {contacto.Email}</p>
                                    </div>
                                    
                                    <div style='background-color: #f8f9fa; padding: 20px; border-left: 4px solid #0d6efd; margin: 20px 0;'>
                                        <p style='margin: 0;'><strong>💬 Mensaje:</strong></p>
                                        <p style='margin: 10px 0; line-height: 1.6;'>{contacto.Mensaje}</p>
                                    </div>
                                    
                                    <hr style='border: 1px solid #e9ecef; margin: 20px 0;' />
                                    
                                    <p style='color: #6c757d; font-size: 12px; text-align: center; margin: 20px 0;'>
                                        Este mensaje fue enviado desde tu portafolio web.
                                    </p>
                                    
                                    <div style='text-align: center; margin-top: 20px;'>
                                        <a href='mailto:{contacto.Email}' 
                                           style='background-color: #0d6efd; color: white; padding: 12px 30px; 
                                                  text-decoration: none; border-radius: 5px; display: inline-block;'>
                                            Responder Email
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </body>
                        </html>",

                    // Versión texto plano (fallback)
                    TextBody = $@"
                    Nuevo mensaje de contacto desde tu portafolio

                    Nombre: {contacto.Nombre}
                    Email: {contacto.Email}

                    Mensaje:
                    {contacto.Mensaje}

                    ---
                    Para responder, envía un email a: {contacto.Email}
                    "
                };

                message.Body = bodyBuilder.ToMessageBody();

                // Enviar el email usando SMTP
                using (var client = new SmtpClient())
                {
                    // Conectar al servidor SMTP de Gmail
                    await client.ConnectAsync(smtpServer, smtpPort, SecureSocketOptions.StartTls);

                    // Autenticar
                    await client.AuthenticateAsync(senderEmail, password);

                    // Enviar el mensaje
                    await client.SendAsync(message);

                    // Desconectar
                    await client.DisconnectAsync(true);
                }

                _logger.LogInformation($"Email enviado correctamente desde {contacto.Email}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al enviar email: {ex.Message}");
                throw; // Re-lanzar la excepción para que el controlador la maneje
            }
        }
    }
}