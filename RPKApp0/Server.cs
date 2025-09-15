using System.Net;

namespace RPKApp0;

public class Server
{
    private readonly IConfig _config;
    private readonly Logger _logger;
    private readonly RequestHandler _requestHandler;
    private readonly HttpListener _listener;
    private Timer _timer;
    private bool _isRunning;

    private const string HOST = "host";
    private const string PORT = "port";

    public Server(IConfig config, Logger logger)
    {
        _config = config;
        _logger = logger;
        _requestHandler = new RequestHandler(logger);
        _listener = new HttpListener();
    }

    public void Start()
    {
        InitializeListener();
        StartHealthCheckTimer();
        RunServerLoop();
    }

    public void Stop()
    {
        _isRunning = false;
        _timer?.Dispose();
        _listener?.Stop();
        _listener?.Close();
    }

    private void InitializeListener()
    {
        string prefix = $"http://{_config[HOST]}:{_config[PORT]}/";
        _listener.Prefixes.Add(prefix);

        try
        {
            _listener.Start();
        }
        catch (Exception ex)
        {
            _logger.Log($"Failed to start server: {ex.Message}");
            throw;
        }

        _logger.Log($"Server started at {_config[HOST]}:{_config[PORT]}");
    }

    private void StartHealthCheckTimer()
    {
        _timer = new Timer(state =>
        {
            _logger.Log("Server heartbeat");
        }, null, 60000, 60000);
    }

    private void RunServerLoop()
    {
        _isRunning = true;

        while (_isRunning)
        {
            try
            {
                HttpListenerContext context = _listener.GetContext();
                _requestHandler.HandleRequest(context);
            }
            catch (Exception ex) when (_isRunning)
            {
                _logger.Log($"Error handling request: {ex.Message}");
            }
        }
    }
}

