package com.eventmanagement.config;

import de.bwaldvogel.mongo.MongoServer;
import de.bwaldvogel.mongo.backend.memory.MemoryBackend;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.net.InetSocketAddress;

@Configuration
@Profile("dev")
public class DevMongoConfig implements DisposableBean {
	private MongoServer mongoServer;

	@Value("${spring.data.mongodb.port:27017}")
	private int mongoPort;

	@Bean
	public MongoServer inMemoryMongoServer() {
		mongoServer = new MongoServer(new MemoryBackend());
		mongoServer.bind(new InetSocketAddress("localhost", mongoPort));
		return mongoServer;
	}

	@Bean
	public MongoClient mongoClient() {
		// Ensure the in-memory server is started before creating the client
		if (mongoServer == null) {
			inMemoryMongoServer();
		}
		return MongoClients.create("mongodb://localhost:" + mongoPort);
	}

	@Override
	public void destroy() throws Exception {
		if (mongoServer != null) {
			mongoServer.shutdown();
		}
	}
}

