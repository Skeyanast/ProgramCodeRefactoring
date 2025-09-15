using System.Net;
using System.Text;

namespace RPKApp0;

public class RequestHandler
{
    private readonly Logger _logger;

    public RequestHandler(Logger logger)
    {
        _logger = logger;
    }

    public void HandleRequest(HttpListenerContext context)
    {
        HttpListenerRequest req = context.Request;
        HttpListenerResponse res = context.Response;

        _logger.Log($"Request received: {req.Url}");

        string responseString = "Hello World";
        byte[] buffer = Encoding.UTF8.GetBytes(responseString);
        res.ContentLength64 = buffer.Length;

        using Stream output = res.OutputStream;
        output.Write(buffer, 0, buffer.Length);
    }
}
