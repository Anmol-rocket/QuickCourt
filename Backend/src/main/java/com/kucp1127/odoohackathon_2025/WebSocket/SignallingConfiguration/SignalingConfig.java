package com.kucp1127.odoohackathon_2025.WebSocket.SignallingConfiguration;


import com.corundumstudio.socketio.SocketIOServer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SignalingConfig {

  @Bean
  public com.corundumstudio.socketio.Configuration socketConfig(
          @Value("${socket.port}") int port
  ) {
    // fully qualify the Socket-IO Configuration here
    com.corundumstudio.socketio.Configuration config =
            new com.corundumstudio.socketio.Configuration();
    config.setPort(port);
    return config;
  }

  @Bean
  public SocketIOServer socketIOServer(
          com.corundumstudio.socketio.Configuration socketConfig
  ) {
    SocketIOServer server = new SocketIOServer(socketConfig);
    server.start();
    return server;
  }
}
